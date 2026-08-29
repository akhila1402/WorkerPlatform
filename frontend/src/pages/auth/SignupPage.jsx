import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import workerService from '../../services/workerService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, ShieldAlert, Sparkles, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [role, setRole] = useState('USER'); // 'USER' or 'WORKER'
  const [step, setStep] = useState(1); // 1 = Role selection, 2 = Form inputs, 3 = Pending Approval (for worker)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleRef = React.useRef(role);
  React.useEffect(() => {
    roleRef.current = role;
  }, [role]);

  const handleGoogleLogin = async (response) => {
    setError('');
    setLoading(true);
    try {
      const data = await authService.loginWithGoogle(response.credential, roleRef.current);
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

  React.useEffect(() => {
    if (step !== 2) return;

    window.handleGoogleAuthCallback = handleGoogleLogin;

    const renderBtn = () => {
      const btnContainer = document.getElementById('googleSignUpDiv');
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
      const btnContainer = document.getElementById('googleSignUpDiv');
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
  }, [step, isDark]);

  // Common User Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  // Worker-specific Fields
  const [profession, setProfession] = useState('Electrician');
  const [latitude, setLatitude] = useState(37.7749); // default SF
  const [longitude, setLongitude] = useState(-122.4194);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(Number(position.coords.latitude.toFixed(6)));
          setLongitude(Number(position.coords.longitude.toFixed(6)));
        },
        (err) => {
          console.error(err);
          setError('Could not retrieve geolocation automatically. Please enter coordinates manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sign up user account
      const userPayload = {
        username,
        email,
        password,
        mobileNumber,
        role,
        dob,
        address,
      };

      await authService.signup(userPayload);

      // If they are a normal USER, they can go directly to Login
      if (role === 'USER') {
        setLoading(false);
        navigate('/login?signupSuccess=true');
        return;
      }

      // 2. Programmatic login to perform authenticated worker profile creation
      const loginData = await authService.login(email, password);
      // loginData contains: { token, id, email, role }
      let userRole = loginData.role;
      if (userRole && userRole.startsWith('ROLE_')) {
        userRole = userRole.substring(5);
      }
      login({ ...loginData, role: userRole });

      // 3. Post Worker Profile Creation
      const workerPayload = {
        id: loginData.id,
        name: username,
        email,
        password: '', // blank or dummy password since account is registered
        role: 'WORKER',
        rating: 5.0,
        mobileNumber,
        dob,
        noOfProblemsSolved: 0,
        profession,
        latitude: Number(latitude),
        longitude: Number(longitude),
        approved: false,
      };

      await workerService.createWorker(workerPayload);
      setStep(3); // Progress to Pending Approval Page
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Signup failed. Please inspect input formats and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Choose Your Account Type</h2>
          <p className="text-xs text-slate-400 mt-1">Select how you want to interact with the platform</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* USER option */}
          <button
            onClick={() => {
              setRole('USER');
              setStep(2);
            }}
            className="flex flex-col items-center p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-center cursor-pointer group"
          >
            <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl mb-3 group-hover:scale-105 transition-transform">
              <User className="h-6 w-6" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-white">Customer</span>
            <span className="text-[10px] text-slate-400 mt-1">I want to hire local professionals</span>
          </button>

          {/* WORKER option */}
          <button
            onClick={() => {
              setRole('WORKER');
              setStep(2);
            }}
            className="flex flex-col items-center p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-center cursor-pointer group"
          >
            <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-white">Worker / Partner</span>
            <span className="text-[10px] text-slate-400 mt-1">I want to provide local services</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20">
            <CheckCircle className="h-10 w-10 animate-bounce" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Account Created!</h2>
          <p className="text-xs text-slate-400 mt-1">Worker Account Awaiting Verification</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 space-y-3">
          <p className="font-semibold text-slate-800 dark:text-white">
            Your worker profile has been registered and is pending admin approval.
          </p>
          <p className="text-xs">
            To maintain service quality, the administration reviews each profile before public searches can access them. You can manage your profile, but you will not show up in nearby worker lists or receive job postings until you are verified.
          </p>
        </div>

        <button
          onClick={() => navigate('/worker')}
          className="w-full flex items-center justify-center h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/15 cursor-pointer"
        >
          Go to Dashboard Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
          {role === 'WORKER' ? 'Worker Registration' : 'Customer Signup'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">Complete your registration to get started</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Signup at Top */}
      <div id="googleSignUpDiv" className="w-full flex justify-center pt-2"></div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or register with email</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      </div>

      <form onSubmit={handleSignup} className="space-y-4 max-h-[420px] overflow-y-auto px-1">
        {/* Username */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Full Name / Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm outline-none transition-all"
            placeholder="name@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Mobile Number
          </label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            autoComplete="off"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm outline-none transition-all"
            placeholder="9876543210"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            autoComplete="off"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm outline-none transition-all"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Street Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required={role === 'USER'}
            autoComplete="off"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm outline-none transition-all"
            placeholder="123 Main St, City"
          />
        </div>

        {/* Worker Professional fields */}
        {role === 'WORKER' && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Professional Details
            </h3>

            {/* Profession Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Profession
              </label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 text-sm outline-none transition-all"
              >
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Mechanic">Mechanic</option>
              </select>
            </div>

            {/* Location (Latitude & Longitude) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Location Picker Mock CTA */}
            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full flex items-center justify-center gap-1.5 h-10 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            >
              <MapPin className="h-4 w-4 text-indigo-500" />
              <span>Detect My Coordinates</span>
            </button>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/15 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>
      </form>



      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-xs text-slate-500 hover:underline"
        >
          &larr; Back
        </button>
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
