import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import problemService from '../../services/problemService';
import {
  ClipboardList,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function UserDashboard() {
  const { userId } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchUserProblems = async () => {
      try {
        const data = await problemService.getProblemsByUserId(userId);
        setProblems(data || []);

        // Compute stats
        const total = data.length;
        const pending = data.filter((p) => p.status === 'PENDING').length;
        const assigned = data.filter((p) => p.status === 'ASSIGNED').length;
        const completed = data.filter((p) => p.status === 'COMPLETED').length;

        setStats({ total, pending, assigned, completed });
      } catch (err) {
        console.error(err);
        setError('Unable to fetch your problem reports. Please try reloading.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProblems();
    }
  }, [userId]);

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
    if (priority === 'Medium') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
  };

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 uppercase">Completed</span>;
    if (status === 'ASSIGNED') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-500 uppercase">Assigned</span>;
    if (status === 'PENDING') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 uppercase">Pending Bids</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-500 uppercase">{status}</span>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Workspace Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your service and repair contracts</p>
        </div>
        <Link
          to="/user/create-problem"
          className="flex items-center justify-center gap-1.5 px-4 h-10 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl shadow-lg shadow-indigo-600/15"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post New Problem</span>
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <ClipboardList className="h-5 w-5 text-indigo-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{stats.total}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Posts</span>
        </div>

        {/* Pending */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <Clock className="h-5 w-5 text-amber-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{stats.pending}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Quotes</span>
        </div>

        {/* Assigned */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <TrendingUp className="h-5 w-5 text-blue-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{stats.assigned}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
        </div>

        {/* Completed */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{stats.completed}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved Jobs</span>
        </div>
      </div>

      {/* Recent Problems Table/Cards */}
      <div className="glass rounded-2xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 dark:text-white">Active Job Requests</h3>
          <Link to="/user/my-problems" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 hover:underline">
            <span>Manage All ({problems.length})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {problems.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <ClipboardList className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-450">No problems posted yet</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">Submit your first maintenance query or utility problem to get started.</p>
            <Link
              to="/user/create-problem"
              className="mt-4 px-4 h-9 flex items-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow"
            >
              Post a Job Request
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-900/40 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50">
                  <th className="py-3 px-6">Problem details</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Priority</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/40 text-sm">
                {problems.slice(0, 5).map((problem) => (
                  <tr key={problem.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <Link to={`/user/problem/${problem.id}`} className="font-bold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block transition-colors">
                          {problem.title}
                        </Link>
                        {problem.latitude && problem.longitude && (
                          <span className="flex items-center gap-0.5 text-[10px] text-slate-400 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            <span>Lat: {problem.latitude}, Lon: {problem.longitude}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400">{problem.category}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(problem.priority)}`}>
                        {problem.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(problem.status)}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/user/problem/${problem.id}`}
                        className="inline-flex items-center justify-center h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
