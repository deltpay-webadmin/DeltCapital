import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onClose: () => void;
  onSignIn?: (email: string) => void;
  onLegalLink?: (page: 'terms' | 'privacy') => void;
}

export function LoginPage({ onClose, onSignIn, onLegalLink }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn?.(email || 'user@delt.com');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#ededf6] dark:bg-[#0A1F35] overflow-y-auto">
      {/* Back button */}
      <div className="max-w-xl mx-auto px-4 pt-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#4945ff] hover:text-[#3b38d9] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center px-4 pt-8 pb-16">
        {/* Lock icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#4945ff] flex items-center justify-center mb-6 shadow-lg shadow-[#4945ff]/25">
          <Lock className="w-7 h-7 text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#041E42] dark:text-white mb-2">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10">Sign in to your Delt account</p>

        {/* Card */}
        <div className="w-full max-w-md bg-[#F7F8FC] rounded-2xl shadow-xl shadow-black/5 p-8 border border-[#4945ff0F]">
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#041E42] dark:text-white mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#4945ff0F] bg-[#F7F8FC] text-[#041E42] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4945ff]/30 focus:border-[#4945ff] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#041E42] dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#4945ff0F] bg-[#F7F8FC] text-[#041E42] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4945ff]/30 focus:border-[#4945ff] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#4945ff] focus:ring-[#4945ff] cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#4945ff] hover:text-[#3b38d9] font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#4945ff] hover:bg-[#3b38d9] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#4945ff]/25"
            >
              Sign in
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            <span className="text-sm text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2D3A45] hover:bg-gray-50 dark:hover:bg-[#374956] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-semibold text-[#041E42] dark:text-white">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2D3A45] hover:bg-gray-50 dark:hover:bg-[#374956] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              <span className="text-sm font-semibold text-[#041E42] dark:text-white">Facebook</span>
            </button>
          </div>
        </div>

        {/* Bottom text */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <button className="text-[#4945ff] hover:text-[#3b38d9] font-semibold transition-colors">
            Sign up for free
          </button>
        </p>
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          By signing in, you agree to our{' '}
          <button
            onClick={() => onLegalLink?.('terms')}
            className="text-[#4945ff] hover:underline"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            onClick={() => onLegalLink?.('privacy')}
            className="text-[#4945ff] hover:underline"
          >
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}