import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import problemService from '../../services/problemService';
import applicationService from '../../services/applicationService';
import workerService from '../../services/workerService';
import aiService from '../../services/aiService';
import reviewService from '../../services/reviewService';
import {
  Sparkles,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  DollarSign,
  Star,
  Award,
  ThumbsUp,
  XCircle
} from 'lucide-react';

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const { userId } = useAuth();

  const [problem, setProblem] = useState(null);
  const [applications, setApplications] = useState([]);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // AI analysis states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiError, setAiError] = useState('');

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const probData = await problemService.getProblem(id);
      if (!probData) {
        setError('Problem details could not be found.');
        setLoading(false);
        return;
      }
      setProblem(probData);

      // Get applications
      const apps = await applicationService.getApplicationsByProblem(id);
      
      // Fetch details of workers for each application
      const appsWithWorkers = await Promise.all(
        (apps || []).map(async (app) => {
          try {
            const worker = await workerService.getWorker(app.workerId);
            return { ...app, worker };
          } catch {
            return { ...app, worker: null };
          }
        })
      );
      setApplications(appsWithWorkers);

      // If problem is ASSIGNED or COMPLETED and workerId is present, fetch worker profile
      if (probData.workerId) {
        try {
          const w = await workerService.getWorker(probData.workerId);
          setAssignedWorker(w);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch problem details. Please reload.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleAIAnalyze = async () => {
    if (applications.length === 0) return;
    setAiLoading(true);
    setAiError('');
    setAiRecommendation(null);
    try {
      const data = await aiService.analyseApplications(id);
      setAiRecommendation(data);
    } catch (err) {
      console.error(err);
      setAiError(err.response?.data?.message || 'Gemini service is busy. Please try analysis in a moment.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to accept this worker for your job? All other applications will be archived.')) return;
    try {
      await applicationService.acceptApplication(appId);
      // Reload details
      fetchDetails();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Could not accept application. Ensure the backend status logic is satisfied.');
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await problemService.updateStatus(id, 'COMPLETED');
      setShowReviewModal(true);
      fetchDetails();
    } catch (err) {
      console.error(err);
      setError('Could not mark the job as completed.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      const reviewPayload = {
        userId,
        workerId: problem.workerId,
        problemId: id,
        rating: Number(rating),
        reviewText,
      };

      await reviewService.createReview(reviewPayload);
      setReviewSubmitted(true);
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSubmitted(false);
        setReviewText('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setReviewError('Failed to save your review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-48 animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="glass p-8 text-center rounded-2xl border border-rose-500/10">
        <XCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
        <p className="font-bold text-slate-800 dark:text-white">Error loading problem details</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{error || 'Job not found'}</p>
        <Link to="/user" className="mt-4 inline-flex px-4 h-9 items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const getPriorityBadgeColor = (p) => {
    if (p === 'High') return 'bg-rose-500/15 text-rose-500 border border-rose-500/10';
    if (p === 'Medium') return 'bg-amber-500/15 text-amber-500 border border-amber-500/10';
    return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/10';
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Detail Head */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {problem.category}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getPriorityBadgeColor(problem.priority)}`}>
              {problem.priority} Priority
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-500 uppercase">
              {problem.status}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{problem.title}</h2>
        </div>

        {/* Action button: mark completed if assigned */}
        {problem.status === 'ASSIGNED' && (
          <button
            onClick={handleMarkCompleted}
            className="flex items-center justify-center gap-1 px-4 h-10 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/15"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark Job Completed</span>
          </button>
        )}
        {problem.status === 'COMPLETED' && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center justify-center gap-1 px-4 h-10 text-xs font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span>Review Service Partner</span>
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: Problem Detail and Candidate quotes list */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Info */}
          <div className="glass rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-800/40 pb-3">
              <Briefcase className="h-4.5 w-4.5 text-indigo-500" />
              <span>Description</span>
            </h3>
            <p className="text-sm text-slate-650 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {problem.description}
            </p>

            <div className="mt-6 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-200/50 dark:border-slate-800/40 pt-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                <span>Latitude: {problem.latitude}, Longitude: {problem.longitude}</span>
              </span>
            </div>
          </div>

          {/* Assigned Worker Info (if accepted) */}
          {problem.status !== 'PENDING' && assignedWorker && (
            <div className="glass rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.01] dark:border-emerald-500/10 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                <Award className="h-4.5 w-4.5" />
                <span>Assigned Professional Partner</span>
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-indigo-500">
                  {assignedWorker.name ? assignedWorker.name.substring(0, 2).toUpperCase() : 'W'}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-base">{assignedWorker.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>Profession: <strong className="text-slate-700 dark:text-white">{assignedWorker.profession}</strong></span>
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{assignedWorker.rating?.toFixed(1) || '0.0'} ({assignedWorker.noOfProblemsSolved || 0} jobs solved)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Section */}
          {problem.status === 'PENDING' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center justify-between">
                <span>Received Worker Proposals ({applications.length})</span>
              </h3>

              {applications.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-800/40">
                  <MessageSquare className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">No proposals received yet</p>
                  <p className="text-[10px] text-slate-400 mt-1">Open jobs will get bids from nearby professionals soon.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden group hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center font-bold text-sm border border-indigo-500/20 shrink-0">
                            {app.worker?.name ? app.worker.name.substring(0, 2).toUpperCase() : 'W'}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                              {app.worker?.name || `Worker Partner (${app.workerId.substring(0, 5)})`}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                <span>{app.worker?.rating?.toFixed(1) || '0.0'} ({app.worker?.noOfProblemsSolved || 0} jobs solved)</span>
                              </span>
                              <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
                              <span className="flex items-center gap-0.5">
                                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                <span>ETA: {app.estimatedTime}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bid Cost & Accept Button */}
                        <div className="flex items-center sm:items-end justify-between sm:flex-col gap-2 shrink-0">
                          <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-extrabold text-base">
                            <DollarSign className="h-4 w-4" />
                            <span>{app.cost?.toFixed(2)}</span>
                          </div>
                          {app.status === 'PENDING' && (
                            <button
                              onClick={() => handleAcceptApplication(app.id)}
                              className="px-3 h-8 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow shadow-indigo-600/10 cursor-pointer transition-colors"
                            >
                              Accept Proposal
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-650 dark:text-slate-350 italic border border-slate-200/50 dark:border-slate-850 leading-relaxed">
                        "{app.message}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: AI analysis recommender */}
        <div className="space-y-6">
          {problem.status === 'PENDING' && applications.length > 0 && (
            <div className="glass rounded-2xl border border-indigo-500/25 dark:border-indigo-500/15 p-5 relative overflow-hidden bg-indigo-500/[0.01]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="flex items-center gap-1.5 font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                <Sparkles className="h-4.5 w-4.5 fill-indigo-500/10 animate-pulse" />
                <span>AI Proposal Evaluation</span>
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-4">
                Don't get overwhelmed by multiple proposals. Let Gemini AI inspect prices, worker experience history, ratings, and customer reviews to highlight the most optimal bid.
              </p>

              <button
                onClick={handleAIAnalyze}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-1.5 h-10 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-xl shadow-md shadow-indigo-500/10 disabled:opacity-50"
              >
                {aiLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>Evaluate Applications</span>
                  </>
                )}
              </button>

              {aiError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-1">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              {aiRecommendation && (
                <div className="mt-5 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.02] space-y-3 animate-slide-in">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <Award className="h-4 w-4" />
                    <span>Gemini Suggestion</span>
                  </div>
                  <div className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-wrap font-mono select-all">
                    {aiRecommendation.reason}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)} />
          <div className="glass w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-xl p-6 z-10 animate-fade-in">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2">Review Service Partner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Your feedback helps keep the marketplace trusted. Please rate your experience.
            </p>

            {reviewError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {reviewError}
              </div>
            )}

            {reviewSubmitted ? (
              <div className="p-4 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                Review submitted successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Stars selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                    Rating Score
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-350 dark:text-slate-650'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description Review text */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Review text
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-xl text-sm outline-none resize-none focus:border-indigo-500"
                    placeholder="Describe their punctuality, communication, cleanliness, or work quality..."
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 h-10 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    Skip / Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
