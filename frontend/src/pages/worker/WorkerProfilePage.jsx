import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import workerService from '../../services/workerService';
import userService from '../../services/userService';
import { User, MapPin, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function WorkerProfilePage() {
  const { userId, email: authEmail } = useAuth();

  // Read-only account credentials (loaded from User account or Worker profile)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [rating, setRating] = useState(5.0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [approved, setApproved] = useState(false);

  // Editable fields (WorkerProfileUpdateRequest DTO fields)
  const [profession, setProfession] = useState('Electrician');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProfile = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError('');
        setSuccess('');
      }

      // Fetch worker profile details directly to avoid unauthorized /user/get calls
      try {
        const profile = await workerService.getWorker(userId);
        if (profile) {
          setWorkerDetails(profile);
          setProfileExists(true);
        } else {
          setProfileExists(false);
          setName('');
          setEmail(authEmail);
          setDob('');
          setMobileNumber('');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setProfileExists(false);
          setName('');
          setEmail(authEmail);
          setDob('');
          setMobileNumber('');
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch your profile information.');
    } finally {
      setLoading(false);
    }
  };

  const setWorkerDetails = (profile) => {
    setName(profile.name);
    setEmail(profile.email);
    setMobileNumber(profile.mobileNumber || '');
    setDob(profile.dob || '');
    setRating(profile.rating || 5.0);
    setProblemsSolved(profile.noOfProblemsSolved || 0);
    setApproved(profile.approved || false);
    setProfession(profile.profession || 'Electrician');
    setLatitude(profile.latitude || 37.7749);
    setLongitude(profile.longitude || -122.4194);
  };

  useEffect(() => {
    if (userId) {
      fetchProfile(true);
    }
  }, [userId]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(Number(position.coords.latitude.toFixed(6)));
          setLongitude(Number(position.coords.longitude.toFixed(6)));
        },
        () => {
          setError('Failed to fetch your location coordinates automatically.');
        }
      );
    } else {
      setError('Geolocation not supported by browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (profileExists) {
        // DTO Profile Update (profession, latitude, longitude only)
        const dto = {
          profession,
          latitude: Number(latitude),
          longitude: Number(longitude),
        };
        await workerService.updateWorker(userId, dto);
        const msg = 'Professional details updated successfully!';
        setSuccess(msg);
        alert(msg);
      } else {
        // Initial setup profile creation
        const workerPayload = {
          id: userId,
          name,
          email,
          password: '',
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
        setProfileExists(true);
        const msg = 'Worker profile completed successfully! Pending admin approval.';
        setSuccess(msg);
        alert(msg);
      }
      fetchProfile(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save changes. Verify coordinate values.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
          {profileExists ? 'Professional Credentials' : 'Complete Onboarding Profile'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {profileExists
            ? 'Manage your professional trade specialties and location coordinate settings'
            : 'Initialize your expertise details to appear on local searches and job lists'}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: DTO Form */}
        <div className="lg:col-span-2 glass rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!profileExists && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Full Name / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
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
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
                  />
                </div>
              </>
            )}
            {/* Profession Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Profession / Trade Specialty
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

            {/* Geo coordinates */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Latitude Coordinates
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Longitude Coordinates
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={detectLocation}
                className="w-full flex items-center justify-center gap-1.5 h-10 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
              >
                <MapPin className="h-4 w-4 text-indigo-500" />
                <span>Sync with Browser Location Coordinates</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl font-bold text-sm shadow shadow-indigo-600/15"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>{profileExists ? 'Update Professional Details' : 'Complete Setup'}</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Account specs (Read-only values) */}
        <div className="glass rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm h-fit space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500/15 rounded-xl flex items-center justify-center font-bold text-indigo-500 border border-indigo-500/20 shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">{name || 'Service Partner'}</h3>
              <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-extrabold uppercase tracking-wider">Account Credentials</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs border-t border-slate-200/50 dark:border-slate-800/40 pt-4">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Email:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Mobile:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">DOB:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{dob}</span>
            </div>
            {profileExists && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Specialty Rating:</span>
                  <span className="font-semibold text-slate-850 dark:text-white flex items-center gap-0.5">
                    <span className="font-bold text-amber-500">{rating.toFixed(1)}</span> / 5.0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Jobs Resolved:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{problemsSolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Approval Status:</span>
                  {approved ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Approved</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-450 text-[10px] font-extrabold border border-amber-500/20">
                      <ShieldAlert className="h-3 w-3 animate-pulse" />
                      <span>Awaiting verification</span>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
