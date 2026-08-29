import React, { useEffect, useState } from 'react';
import workerService from '../../services/workerService';
import { Check, Trash2, AlertCircle, ShieldAlert, CheckCircle, MapPin, Star } from 'lucide-react';

export default function WorkerApprovalsPage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' or 'APPROVED'

  const loadWorkers = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      setError('');
      const data = await workerService.getAllWorkers();
      setWorkers(data || []);
    } catch (err) {
      console.error(err);
      setError('Unable to retrieve worker accounts list.');
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers(true);
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this worker and list their profile in search catalogs?')) return;
    try {
      setSuccess('');
      await workerService.approveWorker(id);
      setSuccess('Worker profile has been approved and listed publicly.');
      loadWorkers(false);
    } catch (err) {
      console.error(err);
      setError('Could not approve worker account.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this worker profile? This action is permanent.')) return;
    try {
      setSuccess('');
      await workerService.deleteWorker(id);
      setSuccess('Worker profile has been removed.');
      loadWorkers(false);
    } catch (err) {
      console.error(err);
      setError('Could not delete worker profile.');
    }
  };

  const filteredWorkers = workers.filter((w) => {
    if (activeTab === 'PENDING') return !w.approved;
    return w.approved;
  });

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
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Verify Worker Partners</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review credentials, specialties, coordinates, and approve worker profiles</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => {
            setActiveTab('PENDING');
            setSuccess('');
            setError('');
          }}
          className={`pb-3 text-sm font-bold border-b-2 px-1 transition-all ${
            activeTab === 'PENDING'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Pending Verification ({workers.filter((w) => !w.approved).length})
        </button>
        <button
          onClick={() => {
            setActiveTab('APPROVED');
            setSuccess('');
            setError('');
          }}
          className={`pb-3 text-sm font-bold border-b-2 px-1 transition-all ${
            activeTab === 'APPROVED'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Approved Partners ({workers.filter((w) => w.approved).length})
        </button>
      </div>

      {/* Table grid */}
      <div className="glass rounded-2xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden shadow-sm">
        {filteredWorkers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <ShieldAlert className="h-10 w-10 text-slate-350 dark:text-slate-650 mb-3" />
            <p className="text-sm font-semibold text-slate-650 dark:text-slate-400">
              No workers in this category
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-900/40 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50">
                  <th className="py-3 px-6">Worker name / details</th>
                  <th className="py-3 px-6">Trade Specialty</th>
                  <th className="py-3 px-6">Service Coordinates</th>
                  <th className="py-3 px-6">Platform Rating</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/40 text-sm">
                {filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-bold text-slate-850 dark:text-white">{worker.name}</div>
                        <div className="text-[10px] text-slate-450 mt-0.5">{worker.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-550 dark:text-slate-400">{worker.profession}</td>
                    <td className="py-4 px-6 text-slate-550 dark:text-slate-400">
                      <span className="flex items-center gap-0.5 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Lat: {worker.latitude}, Lon: {worker.longitude}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-0.5 text-slate-650 dark:text-slate-350">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{worker.rating?.toFixed(1) || '5.0'} ({worker.noOfProblemsSolved || 0} jobs)</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5">
                      {activeTab === 'PENDING' && (
                        <button
                          onClick={() => handleApprove(worker.id)}
                          className="inline-flex items-center justify-center p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-lg border border-emerald-500/20 transition-all cursor-pointer"
                          title="Approve Profile"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(worker.id)}
                        className="inline-flex items-center justify-center p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
