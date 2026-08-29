import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import workerService from '../../services/workerService';
import problemService from '../../services/problemService';
import {
  Users,
  Wrench,
  CheckSquare,
  AlertCircle,
  ClipboardList,
  Compass,
  CheckCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [workers, setWorkers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch users count
      const count = await userService.countUsers();
      setUserCount(count);

      // Fetch workers
      const wList = await workerService.getAllWorkers();
      setWorkers(wList || []);

      // Fetch problems
      const pList = await problemService.getAllProblems();
      setProblems(pList || []);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch administrative stats. Please try reloading.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const pendingApprovalsCount = workers.filter((w) => !w.approved).length;
  const activeProblemsCount = problems.filter((p) => p.status === 'ASSIGNED').length;
  const completedProblemsCount = problems.filter((p) => p.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Head */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Admin Workspace Control Panel</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">System overview stats, pending worker approvals, and user accounts</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification prompt banner */}
      {pendingApprovalsCount > 0 && (
        <div className="glass p-5 rounded-2xl border border-amber-500/25 bg-amber-500/[0.01] flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/10 shrink-0">
              <ShieldAlert className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Pending Approvals Action Required</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                There are <strong className="text-amber-500">{pendingApprovalsCount}</strong> new worker accounts waiting for credential verification and system onboarding approval.
              </p>
            </div>
          </div>
          <Link
            to="/admin/approvals"
            className="flex items-center justify-center gap-1 px-4 h-9 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow shadow-amber-600/10 shrink-0"
          >
            <span>Review Now</span>
          </Link>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <Users className="h-5 w-5 text-indigo-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{userCount}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Accounts</span>
        </div>

        {/* Total Workers */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <Wrench className="h-5 w-5 text-purple-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{workers.length}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Workers</span>
        </div>

        {/* Pending approvals */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <CheckSquare className="h-5 w-5 text-amber-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white text-amber-500">{pendingApprovalsCount}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Approvals</span>
        </div>

        {/* Total Problems */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <ClipboardList className="h-5 w-5 text-indigo-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{problems.length}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Postings</span>
        </div>

        {/* Active problems */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <Compass className="h-5 w-5 text-blue-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{activeProblemsCount}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress Contracts</span>
        </div>

        {/* Completed Problems */}
        <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
          <span className="block text-2xl font-black text-slate-800 dark:text-white">{completedProblemsCount}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved Problems</span>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Approvals link card */}
        <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Verify Worker Partners</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open the system approval desk to verify licenses, professions, and register worker details to expose them on public search filters.
            </p>
          </div>
          <Link
            to="/admin/approvals"
            className="flex items-center gap-1.5 px-4 h-9 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow shadow-indigo-600/10"
          >
            <span>Go to Approvals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Users link card */}
        <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Manage System Profiles</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Examine accounts registered in the database, delete spam records, or perform routine platform auditing of customer profiles.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="flex items-center gap-1.5 px-4 h-9 text-xs font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-350"
          >
            <span>Manage Accounts</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
