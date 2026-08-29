import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import workerService from '../../services/workerService';
import applicationService from '../../services/applicationService';
import problemService from '../../services/problemService';
import reviewService from '../../services/reviewService';
import {
  ShieldAlert,
  Star,
  CheckCircle,
  Clock,
  Compass,
  Briefcase,
  AlertCircle,
  FileText,
  Search,
  Settings,
  MessageSquare,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function WorkerDashboard() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [applications, setApplications] = useState([]);
  const [profileExists, setProfileExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [activeContracts, setActiveContracts] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed' | 'bids' | 'reviews'

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch profile
      try {
        const profile = await workerService.getWorker(userId);
        if (profile) {
          setWorker(profile);
          setProfileExists(true);

          // Fetch applications sent by worker
          const apps = await applicationService.getApplicationsByWorker(userId);
          const userApps = apps || [];
          setApplications(userApps);

          // Fetch reviews received by worker
          let revs = [];
          try {
            revs = await reviewService.getReviewsByWorker(userId);
            setReviews(revs || []);
          } catch (rErr) {
            console.error('Error fetching worker reviews:', rErr);
          }

          // Fetch all unique problem details
          const uniqueProblemIds = Array.from(new Set([
            ...userApps.map(a => a.problemId),
            ...revs.map(r => r.problemId)
          ].filter(Boolean)));

          const problemsMap = {};
          await Promise.all(
            uniqueProblemIds.map(async (pid) => {
              try {
                const prob = await problemService.getProblem(pid);
                if (prob) {
                  problemsMap[pid] = prob;
                }
              } catch (pErr) {
                console.error(`Error fetching problem ${pid}:`, pErr);
              }
            })
          );

          // Enrich applications
          const enrichedApps = userApps.map(app => ({
            ...app,
            problem: problemsMap[app.problemId] || null
          }));

          // Active Contracts: accepted applications where problem is ASSIGNED (or not COMPLETED)
          const active = enrichedApps.filter(app => 
            app.status === 'ACCEPTED' && 
            app.problem && 
            app.problem.status !== 'COMPLETED'
          );
          setActiveContracts(active);

          // Completed Jobs (Previous Works): accepted applications where problem is COMPLETED
          const completed = enrichedApps.filter(app => 
            app.status === 'ACCEPTED' && 
            app.problem && 
            app.problem.status === 'COMPLETED'
          );
          setCompletedJobs(completed);

          // My Bids: applications where status is PENDING or REJECTED
          const bids = enrichedApps.filter(app => app.status !== 'ACCEPTED');
          setMyBids(bids);

          // Enrich reviews with problem info for displaying
          const enrichedRevs = revs.map(rev => ({
            ...rev,
            problem: problemsMap[rev.problemId] || null
          }));
          setReviews(enrichedRevs);

        } else {
          setProfileExists(false);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setProfileExists(false);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error(err);
      setError('Unable to retrieve worker profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWorkerData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48" />
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Profile setup reminder screen
  if (!profileExists) {
    return (
      <div className="glass p-8 text-center rounded-3xl border border-indigo-500/20 max-w-xl mx-auto my-12 space-y-6">
        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-indigo-500/20">
          <Settings className="h-7.5 w-7.5 animate-spin" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Initialize Service Partner Setup</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            You registered as a worker but haven't provided your professional details yet. Fill in your trade expertise and location coordinates to make bids.
          </p>
        </div>
        <Link
          to="/worker/profile"
          className="inline-flex items-center justify-center gap-1.5 px-6 h-11 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow shadow-indigo-600/15"
        >
          <span>Complete Setup Now</span>
        </Link>
      </div>
    );
  }

  const activeJobs = applications.filter((app) => app.status === 'ACCEPTED').length;
  const pendingBids = applications.filter((app) => app.status === 'PENDING').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Head */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Worker Partner Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Discover job requests, check status updates, and review bids</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold animate-shake">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification notice if not approved */}
      {worker && !worker.approved && (
        <div className="glass p-5 rounded-2xl border border-amber-500/25 bg-amber-500/[0.01] flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/10 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Profile Pending Verification</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
              Your profile is pending admin approval. You can manage your trade parameters and browse open jobs, but you cannot submit applications or appear in public user searches until your account is approved.
            </p>
          </div>
        </div>
      )}

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Rating */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <Star className="h-5 w-5 text-amber-500 mb-2 fill-amber-500" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">
            {worker?.rating ? worker.rating.toFixed(1) : '5.0'}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
        </div>

        {/* Jobs solved */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">
            {worker?.noOfProblemsSolved || 0}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jobs Solved</span>
        </div>

        {/* Active contracts */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <Compass className="h-5 w-5 text-blue-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{activeJobs}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Contracts</span>
        </div>

        {/* Applications submitted */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <FileText className="h-5 w-5 text-indigo-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{applications.length}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bids Submitted</span>
        </div>
      </div>

      {/* Quick Access CTAs */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Find work panel */}
        <div className="glass p-6 rounded-2xl border border-indigo-550/10 hover:border-indigo-500/30 flex flex-col justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-850 dark:text-white flex items-center gap-1.5">
              <Search className="h-5 w-5 text-indigo-500" />
              <span>Discover Jobs Near You</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Browse open repair requests matching your profession ({worker?.profession}). View priority levels, description snippets, and submit quotes.
            </p>
          </div>
          <Link
            to="/worker/available-jobs"
            className="flex items-center gap-1.5 px-4 h-9 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow shadow-indigo-600/10"
          >
            <span>Explore Open Leads</span>
          </Link>
        </div>

        {/* Complete Profile Completion */}
        <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-850 dark:text-white flex items-center gap-1.5">
              <Settings className="h-5 w-5 text-indigo-500 animate-pulse" />
              <span>Update Profile Parameters</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Change your trade specialty or coordinate locations (latitude/longitude) to refresh the available jobs matching your 5km service radius.
            </p>
          </div>
          <Link
            to="/worker/profile"
            className="flex items-center gap-1.5 px-4 h-9 text-xs font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-350"
          >
            <span>Edit Profile Details</span>
          </Link>
        </div>
      </div>

      {/* Tabs Section for History & Reviews */}
      <div className="glass rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm space-y-6">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 pb-3.5 px-1.5 text-xs font-bold transition-all relative whitespace-nowrap outline-none cursor-pointer ${
              activeTab === 'active'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Active Contracts</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-105 dark:bg-slate-800 text-[10px] text-slate-500 font-extrabold">
              {activeContracts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 pb-3.5 px-1.5 text-xs font-bold transition-all relative whitespace-nowrap outline-none cursor-pointer ${
              activeTab === 'completed'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Previous Works ({completedJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bids')}
            className={`flex items-center gap-2 pb-3.5 px-1.5 text-xs font-bold transition-all relative whitespace-nowrap outline-none cursor-pointer ${
              activeTab === 'bids'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>My Bids ({myBids.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 pb-3.5 px-1.5 text-xs font-bold transition-all relative whitespace-nowrap outline-none cursor-pointer ${
              activeTab === 'reviews'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-4">
          {/* Active Contracts Tab */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              {activeContracts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No active contracts. Go to "Find Jobs" to apply for repair requests.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {activeContracts.map((app) => (
                    <div key={app.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 relative overflow-hidden group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-850 dark:text-white group-hover:text-indigo-500 transition-colors">
                            {app.problem?.title || 'Repair Job Request'}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {app.problem?.description || 'No description provided.'}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider shrink-0 ${
                          app.problem?.priority === 'High'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                            : app.problem?.priority === 'Medium'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            : 'bg-slate-500/10 border-slate-500/20 text-slate-500'
                        }`}>
                          {app.problem?.priority || 'Medium'} Priority
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800/80 mt-4 pt-3.5">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-bold text-slate-700 dark:text-slate-200">${app.cost}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{app.estimatedTime}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completed Jobs Tab */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedJobs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No completed jobs found. Completed works will appear here.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {completedJobs.map((app) => (
                    <div key={app.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 relative overflow-hidden">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">
                            {app.problem?.title || 'Repair Job Request'}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {app.problem?.description || 'No description provided.'}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 text-[10px] font-extrabold tracking-wider shrink-0 uppercase">
                          Completed
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800/80 mt-4 pt-3.5">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-bold text-slate-700 dark:text-slate-200">${app.cost}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{app.estimatedTime}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Bids Tab */}
          {activeTab === 'bids' && (
            <div className="space-y-4">
              {myBids.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No bids submitted. Browse available jobs to apply.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {myBids.map((app) => (
                    <div key={app.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 relative overflow-hidden">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">
                            {app.problem?.title || 'Repair Job Request'}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {app.message || 'No description provided.'}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider shrink-0 uppercase border ${
                          app.status === 'PENDING'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800/80 mt-4 pt-3.5">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-bold text-slate-700 dark:text-slate-200">${app.cost}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{app.estimatedTime}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customer Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No customer reviews received yet. Reviews will show up here after completing jobs.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">
                            {rev.problem?.title || 'Repair Request'}
                          </h4>
                          <p className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wider">
                            Reviewed for job
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-black text-amber-600 dark:text-amber-450">
                            {rev.rating}.0
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-650 dark:text-slate-350 italic leading-relaxed">
                        "{rev.reviewText}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
