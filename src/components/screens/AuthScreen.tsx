import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { registerUser, loginUser } from '../../utils/auth';
import { BrandLogo } from '../common/BrandLogo';
import { AlertCircle, Lock, Mail, User, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  initialMode?: 'login' | 'signup';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ initialMode = 'login' }) => {
  const { setCurrentUser, setActiveTab, viewportMode } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await registerUser(signupName, signupEmail, signupPassword);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        // After successful signup, redirect the user to the existing LendLoop home screen
        setActiveTab('home');
      } else {
        setErrorMessage(res.error || 'Failed to sign up. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during signup.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await loginUser(loginEmail, loginPassword);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        // After successful login, redirect the user to the existing LendLoop home screen
        setActiveTab('home');
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during login.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#DFD5C8] shadow-lg p-6 sm:p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size="md" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#28231F] mt-3">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786D65] mt-1">
            {mode === 'login'
              ? 'Log in to continue lending and borrowing items.'
              : 'Join LendLoop to borrow and share with your community.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#F7F3EC] rounded-xl border border-[#DFD5C8] mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#9E6E4F] shadow-sm'
                : 'text-[#786D65] hover:text-[#28231F]'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#9E6E4F] shadow-sm'
                : 'text-[#786D65] hover:text-[#28231F]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* SIGN UP FORM: Name, Email, Password, Sign Up button */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1.5">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-[#DFD5C8] text-sm text-[#28231F] bg-white placeholder-[#786D65]/50 focus:outline-none focus:ring-2 focus:ring-[#9E6E4F] focus:border-transparent transition-all"
                />
                <User className="w-4 h-4 text-[#786D65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="name@campus.edu or name@example.com"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-[#DFD5C8] text-sm text-[#28231F] bg-white placeholder-[#786D65]/50 focus:outline-none focus:ring-2 focus:ring-[#9E6E4F] focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-[#786D65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl border border-[#DFD5C8] text-sm text-[#28231F] bg-white placeholder-[#786D65]/50 focus:outline-none focus:ring-2 focus:ring-[#9E6E4F] focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-[#786D65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786D65] hover:text-[#28231F] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#9E6E4F] hover:bg-[#855739] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-[#786D65]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-[#9E6E4F] font-bold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        )}

        {/* LOGIN FORM: Email, Password, Login button */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-[#DFD5C8] text-sm text-[#28231F] bg-white placeholder-[#786D65]/50 focus:outline-none focus:ring-2 focus:ring-[#9E6E4F] focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-[#786D65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl border border-[#DFD5C8] text-sm text-[#28231F] bg-white placeholder-[#786D65]/50 focus:outline-none focus:ring-2 focus:ring-[#9E6E4F] focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-[#786D65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786D65] hover:text-[#28231F] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#9E6E4F] hover:bg-[#855739] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-[#786D65]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="text-[#9E6E4F] font-bold hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Quick Demo Credentials Panel for testing */}
            <div className="mt-4 pt-4 border-t border-[#DFD5C8]">
              <span className="text-[11px] font-semibold text-[#786D65] block mb-2">
                Quick Test Accounts (Click to auto-fill):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('aarav.sharma@campus.edu', 'Password123')}
                  className="p-2 rounded-xl bg-[#F7F3EC] hover:bg-[#EFE7DC] border border-[#9E6E4F]/20 text-left transition-colors cursor-pointer"
                >
                  <p className="text-[11px] font-bold text-[#28231F] truncate">Aarav (Borrower)</p>
                  <p className="text-[10px] text-[#786D65] truncate">aarav.sharma@campus.edu</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('priya.patel@city.in', 'Password123')}
                  className="p-2 rounded-xl bg-[#F7F3EC] hover:bg-[#EFE7DC] border border-[#9E6E4F]/20 text-left transition-colors cursor-pointer"
                >
                  <p className="text-[11px] font-bold text-[#28231F] truncate">Priya (Lender)</p>
                  <p className="text-[10px] text-[#786D65] truncate">priya.patel@city.in</p>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
