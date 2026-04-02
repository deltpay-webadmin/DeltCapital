PROMPT 1 OF 3: Core Widget — Slider, Refinement, and Results Card

Build a React component for an MCA funding estimator widget titled "How Much Could You Qualify For?" with subhead: "Drag the slider. See your funding estimate instantly."

Layout: Two-column on desktop, stacked on mobile. Left column is inputs, right column is results.

Left column — Inputs:





Monthly Revenue slider. Range $10K-$250k+. Display formatted value above slider. No default position — merchant must engage to trigger results.





Below the slider, a "Refine your estimate ↓" text link. Clicking it smoothly expands a refinement section containing:





Time in Business: four pill-style selectors — "Less than 6 months" · "6–12 months" · "1–2 years" · "2+ years"



Monthly Credit Card Sales: slider, $0–$250K with formatted display



"I don't accept cards yet" checkbox toggle. When checked, the credit card sales slider is hidden/disabled.





Refinement section has a "Hide refinement ↑" toggle to collapse it.

Right column — Results:





Card with label "ESTIMATED FUNDING RANGE" and large bold range display: "$XXK – $XXXK"



Subtext: "Based on your monthly revenue"



Range calculates as: low = monthly revenue × 0.85, high = monthly revenue × 1.4. If Time in Business is selected, multiply both by: <6mo = 0.7, 6–12mo = 0.85, 1–2yr = 1.0, 2+yr = 1.15. If credit card sales are added, add 10% of monthly card sales to both ends.



Before the merchant moves the slider, the results card shows a ghost/empty state with a dashed border and text: "Move the slider to see your estimate"



Numbers should animate smoothly when values change.

Design: Dark navy (#o41e42) headers, white card backgrounds with subtle shadows, blue (#4945ff) accent on sliders and active pills. Clean sans-serif font. Rounded corners on all cards and pills.

Do not build the toggle, product pills, CTAs, or cross-sell states yet. End the component after the results card. Those come in the next prompts.