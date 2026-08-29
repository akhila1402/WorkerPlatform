import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import workerService from '../../services/workerService';
import { User, Phone, Calendar, MapPin, AlertCircle, Save, Briefcase } from 'lucide-react';

export default function CompleteProfilePage() {
  const { userId, email, role, updateProfileCompleted } = useAuth();
  const navigate = useNavigate();

  // General profile fields
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  // Worker-specific fields
  const [profession, setProfession] = useState('Electrician');
  const [latitude, setLatitude] = useState(37.7749); // default SF
  const [longitude, setLongitude] = useState(-122.4194);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUser(userId);
        if (data) {
          setUsername(data.username || '');
          setMobileNumber(data.mobileNumber || '');
          setDob(data.dob || '');
          setAddress(data.address || '');
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
        setError("Could not load profile details. Please try again.");
      } finally {
        setFetching(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Update user details in users collection
      const updatedUser = {
        id: userId,
        username,
        mobileNumber,
        dob,
        address
      };
      await userService.updateUser(updatedUser);

      // 2. If user is a WORKER, also create the profile in workers collection
      if (role === 'WORKER') {
        const workerPayload = {
          id: userId,
          name: username,
          email: email,
          password: '', // Dummy password for OAuth workers
          role: 'WORKER',
          rating: 5.0,
          mobileNumber,
          dob,
          noOfProblemsSolved: 0,
          profession,
          latitude: Number(latitude),
          longitude: Number(longitude),
          approved: false
        };
        await workerService.createWorker(workerPayload);
      }

      // 3. Mark profile as complete and navigate
      updateProfileCompleted(true);
      navigate(role === 'WORKER' ? '/worker' : '/user');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Failed to update profile. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80">
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Complete Your Profile</h2>
        <p className="text-xs text-slate-400 mt-1">
          Please provide additional details to get started as a {role === 'WORKER' ? 'Worker / Partner' : 'Customer'}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[500px] overflow-y-auto px-1">
        {/* Username */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
              placeholder="9876543210"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
              placeholder="123 Main St, City"
            />
          </div>
        </div>

        {/* Worker Professional details */}
        {role === 'WORKER' && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>Professional Details</span>
            </h3>

            {/* Profession Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Profession
              </label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 text-sm outline-none transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Location Picker */}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/15 cursor-pointer transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save & Continue</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
