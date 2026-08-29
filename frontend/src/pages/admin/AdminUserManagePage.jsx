import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import workerService from '../../services/workerService';
import { AlertCircle, Trash2, Shield, UserCheck, ShieldCheck, Mail, Phone, Users, Star, MapPin } from 'lucide-react';

export default function AdminUserManagePage() {
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('CUSTOMERS'); // 'CUSTOMERS' or 'WORKERS'

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const uList = await userService.getAllUsers();
      setUsers(uList || []);

      const wList = await workerService.getAllWorkers();
      setWorkers(wList || []);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch account listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer account? All associated records will be removed.')) return;
    try {
      setSuccess('');
      await userService.deleteUser(id);
      setSuccess('Account has been deleted successfully.');
      loadData();
    } catch (err) {
      console.error(err);
      setError('Could not delete customer account.');
    }
  };

  const handleDeleteWorkerProfile = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this worker profile? This action is permanent.')) return;
    try {
      setSuccess('');
      await workerService.deleteWorker(id);
      setSuccess('Worker profile has been deleted successfully.');
      loadData();
    } catch (err) {
      console.error(err);
      setError('Could not delete worker profile.');
    }
  };

  // List all users for auditing
  const customerList = users;
  
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Manage Platform Accounts</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Audit system accounts, delete records, and inspect credentials</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => {
            setActiveTab('CUSTOMERS');
            setSuccess('');
            setError('');
          }}
          className={`pb-3 text-sm font-bold border-b-2 px-1 transition-all ${
            activeTab === 'CUSTOMERS'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Registered Accounts (All) ({customerList.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('WORKERS');
            setSuccess('');
            setError('');
          }}
          className={`pb-3 text-sm font-bold border-b-2 px-1 transition-all ${
            activeTab === 'WORKERS'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Service Partner Profiles ({workers.length})
        </button>
      </div>

      {/* Tables Grid */}
      <div className="glass rounded-2xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden shadow-sm">
        {activeTab === 'CUSTOMERS' ? (
          customerList.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Users className="h-10 w-10 text-slate-350 dark:text-slate-655 mb-3" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">No customer accounts registered</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-900/40 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50">
                    <th className="py-3 px-6">Username / Name</th>
                    <th className="py-3 px-6">Email Address</th>
                    <th className="py-3 px-6">Mobile Number</th>
                    <th className="py-3 px-6">Access Role</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/40 text-sm">
                  {customerList.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{cust.username}</td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{cust.email}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {cust.mobileNumber ? (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{cust.mobileNumber}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Not Provided</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            cust.role === 'ADMIN'
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                          }`}
                        >
                          {cust.role === 'ADMIN' && <Shield className="h-2.5 w-2.5" />}
                          <span>{cust.role}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {cust.role !== 'ADMIN' ? (
                          <button
                            onClick={() => handleDeleteUser(cust.id)}
                            className="inline-flex items-center justify-center p-1.5 bg-rose-500/10 hover:bg-rose-505 text-rose-600 hover:text-white rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : workers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Users className="h-10 w-10 text-slate-350 dark:text-slate-655 mb-3" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">No service partners registered</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-900/40 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Mobile / DOB</th>
                  <th className="py-3 px-6">Trade Specialty</th>
                  <th className="py-3 px-6">Service Coordinates</th>
                  <th className="py-3 px-6">Rating</th>
                  <th className="py-3 px-6">Approval Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/40 text-sm">
                {workers.map((work) => (
                  <tr key={work.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{work.name}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{work.email}</td>
                    <td className="py-4 px-6">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{work.mobileNumber || 'N/A'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">DOB: {work.dob || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-550 dark:text-slate-400">{work.profession}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-0.5 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Lat: {work.latitude}, Lon: {work.longitude}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-400 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{Number(work.rating || 5).toFixed(1)}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {work.approved ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 text-[10px] font-extrabold border border-emerald-500/20">
                          <UserCheck className="h-3 w-3" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-450 text-[10px] font-extrabold border border-amber-500/20">
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteWorkerProfile(work.id)}
                        className="inline-flex items-center justify-center p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                        title="Delete Worker Profile"
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
