import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/authService';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpired(true);
    }
  }, [searchParams]);

  const handleGoogleLogin = async (response) => {
    setError('');
    setLoading(true);
    try {
      const data = await authService.loginWithGoogle(response.credential);
      let userRole = data.role;
      if (userRole && userRole.startsWith('ROLE_')) {
        userRole = userRole.substring(5);
      }

      login({ ...data, role: userRole });

      if (data.profileCompleted === false) {
        navigate('/complete-profile');
      } else {
        if (userRole === 'ADMIN') {
          navigate('/admin');
        } else if (userRole === 'WORKER') {
          navigate('/worker');
        } else {
          navigate('/user');
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || 'Google authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.handleGoogleAuthCallback = handleGoogleLogin;

    const renderBtn = () => {
      const btnContainer = document.getElementById('googleSignInDiv');
      if (typeof window.google !== 'undefined' && btnContainer) {
        if (!window.googleAuthInitialized) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: (res) => window.handleGoogleAuthCallback && window.handleGoogleAuthCallback(res),
          });
          window.googleAuthInitialized = true;
        }
        window.google.accounts.id.renderButton(
          btnContainer,
          {
            theme: isDark ? 'filled_black' : 'outline',
            size: 'large',
            width: 350,
            text: 'continue_with'
          }
        );
      }
    };

    let attempts = 0;
    const interval = setInterval(() => {
      const btnContainer = document.getElementById('googleSignInDiv');
      if (typeof window.google !== 'undefined' && btnContainer) {
        renderBtn();
        clearInterval(interval);
      } else {
        attempts++;
        if (attempts > 30) {
          clearInterval(interval);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      window.handleGoogleAuthCallback = null;
    };
  }, [isDark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSessionExpired(false);
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      // data contains: { token, id, email, role }

      let userRole = data.role;
      if (userRole && userRole.startsWith('ROLE_')) {
        userRole = userRole.substring(5);
      }

      login({ ...data, role: userRole });

      // Redirect based on role
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else if (userRole === 'WORKER') {
        navigate('/worker');
      } else {
        navigate('/user');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Welcome Back</h2>
        <p className="text-xs text-slate-400 mt-1">Access your worker marketplace dashboard</p>
      </div>

      {sessionExpired && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Your session has expired. Please log in again.</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Login at Top */}
      <div id="googleSignInDiv" className="w-full flex justify-center pt-2"></div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or login with email</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 text-sm outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 text-sm outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/15 cursor-pointer transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </>
          )}
        </button>
      </form>



      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
