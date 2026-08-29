import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import workerService from '../../services/workerService';
import problemService from '../../services/problemService';
import applicationService from '../../services/applicationService';
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Send,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function AvailableJobsPage() {
  const { userId } = useAuth();

  const [worker, setWorker] = useState(null);
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form Application Modal States
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [cost, setCost] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  // Bids sent to avoid double applying
  const [appliedProblemIds, setAppliedProblemIds] = useState(new Set());

  // Filter parameters
  const [maxDistance, setMaxDistance] = useState(5.0); // 5km radius by default
  const [matchProfession, setMatchProfession] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Haversine formula to calculate client side distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch worker profile
      const prof = await workerService.getWorker(userId);
      setWorker(prof);

      // Fetch available jobs
      const jobs = await problemService.getAvailableProblems();

      // Fetch worker applications to see what jobs they already applied to
      const myApps = await applicationService.getApplicationsByWorker(userId);
      const appliedIds = new Set((myApps || []).map((app) => app.problemId));
      setAppliedProblemIds(appliedIds);

      // Map distances onto problem objects
      if (prof && jobs) {
        const jobsWithDistance = jobs.map((job) => {
          const dist = calculateDistance(prof.latitude, prof.longitude, job.latitude, job.longitude);
          return { ...job, distance: dist };
        });
        setProblems(jobsWithDistance);
      } else {
        setProblems(jobs || []);
      }
    } catch (err) {
      console.error(err);
      setError('Could not fetch available job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  // Apply filters
  useEffect(() => {
    let result = problems;

    // Filter by Worker Profession
    if (matchProfession && worker?.profession) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === worker.profession.toLowerCase()
      );
    }

    // Filter by Distance Radius
    if (maxDistance !== 'ALL' && worker) {
      result = result.filter((p) => p.distance !== null && p.distance <= Number(maxDistance));
    }

    // Filter by Priority
    if (priorityFilter !== 'ALL') {
      result = result.filter((p) => p.priority === priorityFilter);
    }

    setFilteredProblems(result);
  }, [problems, worker, matchProfession, maxDistance, priorityFilter]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!worker?.approved) {
      alert('You cannot apply for contracts while pending admin approval.');
      return;
    }

    setSubmitting(true);
    setSuccess('');
    try {
      const applicationPayload = {
        problemId: selectedProblem.id,
        workerId: userId,
        cost: Number(cost),
        message,
        estimatedTime,
        status: 'PENDING',
      };

      await applicationService.createApplication(applicationPayload);
      setSuccess('Your proposal bid was submitted successfully!');
      
      // Update applied list
      setAppliedProblemIds((prev) => new Set([...prev, selectedProblem.id]));

      setTimeout(() => {
        setSelectedProblem(null);
        setSuccess('');
        setCost('');
        setEstimatedTime('');
        setMessage('');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Could not submit application proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
    if (priority === 'Medium') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Discover Service Contracts</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Apply to nearby job requests within your service range</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="glass p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        {/* Match profession toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="matchProf"
            checked={matchProfession}
            onChange={(e) => setMatchProfession(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <label htmlFor="matchProf" className="text-xs font-bold text-slate-600 dark:text-slate-350 cursor-pointer select-none uppercase tracking-wider">
            Match My Trade ({worker?.profession})
          </label>
        </div>

        {/* Max Distance radius dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none"
          >
            <option value="5.0">Within 5 km radius</option>
            <option value="10.0">Within 10 km radius</option>
            <option value="25.0">Within 25 km radius</option>
            <option value="ALL">Any Distance</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Counter */}
        <div className="text-xs font-semibold text-slate-400 sm:text-right px-2">
          <span>Found {filteredProblems.length} matching jobs</span>
        </div>
      </div>

      {/* Available Jobs list */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredProblems.length === 0 ? (
          <div className="md:col-span-2 glass rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-800/40">
            <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No open leads found</p>
            <p className="text-xs text-slate-455 mt-1">Try expanding your search radius filter or updating coordinates in profile settings.</p>
          </div>
        ) : (
          filteredProblems.map((job) => {
            const hasApplied = appliedProblemIds.has(job.id);
            return (
              <div
                key={job.id}
                className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      {job.category}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(job.priority)}`}>
                      {job.priority} Priority
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2 leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>{job.distance !== null ? `${job.distance} km away` : 'Distance unknown'}</span>
                  </div>

                  {hasApplied ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-450 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Proposal Sent</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedProblem(job)}
                      disabled={worker && !worker.approved}
                      className="px-3.5 h-8 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-650/40 disabled:cursor-not-allowed rounded-lg shadow shadow-indigo-600/10 cursor-pointer transition-colors"
                      title={worker && !worker.approved ? 'Requires Admin Approval' : 'Bid on Job'}
                    >
                      Apply & Quote
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bid Application Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedProblem(null)} />
          <div className="glass w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-xl p-6 z-10 animate-fade-in">
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white">Submit Proposal Quote</h3>
              <button onClick={() => setSelectedProblem(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-slate-550 dark:text-slate-400 mb-4 font-semibold leading-relaxed">
              Job: "{selectedProblem.title}"
            </p>

            {success ? (
              <div className="p-4 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                {success}
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {/* Cost Quote */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Total Cost Quote ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-xl text-xs outline-none focus:border-indigo-500"
                      placeholder="150"
                    />
                  </div>
                </div>

                {/* Estimated Completion Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Estimated Time to Complete
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-xl text-xs outline-none focus:border-indigo-500"
                      placeholder="e.g. 3 hours, 1 day"
                    />
                  </div>
                </div>

                {/* Pitch Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Your Pitch / Application Message
                  </label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-xl text-xs outline-none resize-none focus:border-indigo-500"
                    placeholder="Describe your credentials, why you are qualified, and your approach to resolving this repair..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl font-bold text-xs shadow transition-colors"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Proposal Quote</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
