#!/usr/bin/env node
/*
 * Build step for the Delt Capital static site.
 *
 * Why this exists: the page used to load React + ReactDOM + @babel/standalone
 * from unpkg at runtime and compile ~25 JSX files in the visitor's browser on
 * every page load. That made first paint slow (multi-second on mobile) and tied
 * the whole site's availability to unpkg — a CDN that explicitly is not meant
 * for production. For a paid-ad landing page that's unacceptable.
 *
 * This script precompiles every JSX source in app/*.jsx to plain JS in
 * app/compiled/ (React.createElement calls — no in-browser Babel needed) and
 * vendors React's *production* build into app/vendor/. index.html then loads
 * those plain, same-origin scripts. The output is committed so the Vercel
 * deploy stays zero-config (no build command required on their side); re-run
 * `npm run build` after editing any app/*.jsx source.
 */
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const ROOT = __dirname;
const APP = path.join(ROOT, 'app');
const OUT = path.join(APP, 'compiled');
const VENDOR = path.join(APP, 'vendor');

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VENDOR, { recursive: true });

// Compile every JSX source in app/ to app/compiled/<name>.js.
const jsxFiles = fs.readdirSync(APP).filter((f) => f.endsWith('.jsx'));
let compiled = 0;
for (const file of jsxFiles) {
  const src = fs.readFileSync(path.join(APP, file), 'utf8');
  const out = babel.transformSync(src, {
    filename: file,
    presets: [['@babel/preset-react', { runtime: 'classic' }]],
    compact: false,
    comments: false,
    sourceMaps: false,
  });
  const target = path.join(OUT, file.replace(/\.jsx$/, '.js'));
  fs.writeFileSync(target, out.code);
  compiled += 1;
}

// Bootstrap: mount <Variation1/> without JSX (plain createElement).
fs.writeFileSync(
  path.join(OUT, '_boot.js'),
  'ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Variation1));\n'
);

// Vendor React's PRODUCTION UMD builds (self-hosted, same-origin, no unpkg).
const vendorPairs = [
  ['react', 'umd/react.production.min.js', 'react.production.min.js'],
  ['react-dom', 'umd/react-dom.production.min.js', 'react-dom.production.min.js'],
];
for (const [pkg, sub, to] of vendorPairs) {
  // Resolve the package root via its package.json (always exported), then
  // reach into umd/ directly — React 18's "exports" map hides the UMD path
  // from require.resolve(), so we can't resolve the file itself.
  const pkgRoot = path.dirname(require.resolve(pkg + '/package.json'));
  fs.copyFileSync(path.join(pkgRoot, sub), path.join(VENDOR, to));
}

console.log(`Compiled ${compiled} JSX files -> app/compiled/, vendored React production -> app/vendor/`);
