import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import problemService from '../../services/problemService';
import { ClipboardList, PlusCircle, AlertCircle, Eye, Search, Filter, MapPin } from 'lucide-react';

export default function MyProblemsPage() {
  const { userId } = useAuth();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemService.getProblemsByUserId(userId);
        setProblems(data || []);
        setFilteredProblems(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load your posted problems. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProblems();
    }
  }, [userId]);

  // Apply filters on search query, status, or priority changes
  useEffect(() => {
    let result = problems;

    if (searchQuery.trim()) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (priorityFilter !== 'ALL') {
      result = result.filter((p) => p.priority === priorityFilter);
    }

    setFilteredProblems(result);
  }, [searchQuery, statusFilter, priorityFilter, problems]);

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
    if (priority === 'Medium') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
  };

  const getStatusColor = (status) => {
    if (status === 'COMPLETED') return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/10';
    if (status === 'ASSIGNED') return 'bg-blue-500/15 text-blue-500 border border-blue-500/10';
    if (status === 'PENDING') return 'bg-amber-500/15 text-amber-500 border border-amber-500/10';
    return 'bg-slate-500/15 text-slate-500 border border-slate-500/10';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48 animate-pulse" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">My Posted Problems</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">View contracts, check pending bids, and analyze application states</p>
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

      {/* Filter Toolbar */}
      <div className="glass p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-xl text-xs outline-none focus:border-indigo-500"
            placeholder="Search title, keywords..."
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Bids</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        {/* Summary stats */}
        <div className="flex items-center justify-end text-xs font-semibold text-slate-400 px-2">
          <span>Found {filteredProblems.length} results</span>
        </div>
      </div>

      {/* Problems list */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredProblems.length === 0 ? (
          <div className="md:col-span-2 glass rounded-2xl p-12 text-center flex flex-col items-center border border-slate-200/50 dark:border-slate-800/40">
            <ClipboardList className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No jobs match your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search terms or posting a new contract request.</p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(problem.status)}`}>
                    {problem.status === 'PENDING' ? 'Awaiting Quotes' : problem.status}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(problem.priority)}`}>
                    {problem.priority}
                  </span>
                </div>

                <Link
                  to={`/user/problem/${problem.id}`}
                  className="font-extrabold text-base text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block mb-2"
                >
                  {problem.title}
                </Link>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {problem.description}
                </p>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-4 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Lat: {problem.latitude}, Lon: {problem.longitude}</span>
                </div>

                <Link
                  to={`/user/problem/${problem.id}`}
                  className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>View Details</span>
                  <Eye className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
