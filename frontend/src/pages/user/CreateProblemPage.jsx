import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import problemService from '../../services/problemService';
import aiService from '../../services/aiService';
import { Sparkles, MapPin, AlertCircle, FileText, Check, ArrowRight } from 'lucide-react';

export default function CreateProblemPage() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electrician');
  const [priority, setPriority] = useState('Medium');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);

  // AI Description Enhancement states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiShowSuggestion, setAiShowSuggestion] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(Number(position.coords.latitude.toFixed(6)));
          setLongitude(Number(position.coords.longitude.toFixed(6)));
        },
        () => {
          setError('Unable to detect geolocation. Please input coordinates manually.');
        }
      );
    } else {
      setError('Geolocation not supported by browser.');
    }
  };

  // Calls Gemini API to enhance description
  const handleAIEnhance = async () => {
    if (!description.trim()) {
      setError('Please provide a basic description first to enhance.');
      return;
    }
    setError('');
    setAiLoading(true);
    setAiShowSuggestion(false);
    try {
      const data = await aiService.enhanceDescription(description);
      // Response contains: enhancedDescription
      setAiSuggestion(data.enhancedDescription);
      setAiShowSuggestion(true);
    } catch (err) {
      console.error(err);
      setError('Failed to enhance description with AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAISuggestion = () => {
    setDescription(aiSuggestion);
    setAiShowSuggestion(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const problemPayload = {
        userId,
        title,
        description,
        category,
        priority,
        status: 'PENDING',
        latitude: Number(latitude),
        longitude: Number(longitude),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await problemService.createProblem(problemPayload);
      navigate('/user');
    } catch (err) {
      console.error(err);
      setError('Could not create your job request. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Post a Household Job Request</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Describe the problem so nearby approved professionals can apply</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-2 glass rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Job Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all"
                placeholder="e.g. Broken kitchen sink pipe leaking water"
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 text-sm outline-none transition-all"
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Mechanic">Mechanic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Priority level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 text-sm outline-none transition-all"
                >
                  <option value="Low">Low (Next few days)</option>
                  <option value="Medium">Medium (Within 24 hours)</option>
                  <option value="High">High (Immediate Assistance)</option>
                </select>
              </div>
            </div>

            {/* Coordinates */}
            <div className="space-y-3">
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none"
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
                <span>Sync with My Location Coordinates</span>
              </button>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Detailed Description
                </label>
                <button
                  type="button"
                  onClick={handleAIEnhance}
                  disabled={aiLoading}
                  className="flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{aiLoading ? 'Enhancing...' : 'Enhance with AI'}</span>
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-500 text-sm outline-none transition-all resize-none"
                placeholder="Include specific signs of the leak, brand names, what rooms are affected, or materials needed..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/15"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Publish Request</span>
              )}
            </button>
          </form>
        </div>

        {/* AI helper sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-2xl border border-indigo-500/20 dark:border-indigo-500/10 p-5 relative overflow-hidden bg-indigo-500/[0.01]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="flex items-center gap-1.5 font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="h-4.5 w-4.5 fill-indigo-500/10" />
              <span>AI Writing Assistance</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
              Dull or ambiguous descriptions get ignored by workers. Let Gemini analyze your basic notes and draft a professional proposal detail sheet outlining clean requirements while preserving your original parameters.
            </p>
          </div>

          {/* AI Suggestion Preview Box */}
          {aiShowSuggestion && (
            <div className="glass border-emerald-500/25 bg-emerald-500/[0.02] dark:border-emerald-500/20 rounded-2xl p-5 space-y-4 animate-slide-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10">
                  AI Improved Version
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto text-xs text-slate-600 dark:text-slate-350 leading-relaxed p-3 bg-slate-100/50 dark:bg-slate-900/60 rounded-xl font-mono">
                {aiSuggestion}
              </div>
              <button
                type="button"
                onClick={acceptAISuggestion}
                className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow shadow-emerald-600/10"
              >
                <Check className="h-4 w-4" />
                <span>Accept & Apply to Form</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
