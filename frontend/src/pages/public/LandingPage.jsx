import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Cpu,
  MapPin
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Electrician', icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
  { name: 'Plumber', icon: Wrench, color: 'text-blue-500 bg-blue-500/10' },
  { name: 'Carpenter', icon: Compass, color: 'text-orange-500 bg-orange-500/10' },
  { name: 'Mechanic', icon: Cpu, color: 'text-purple-500 bg-purple-500/10' },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden transition-colors duration-300">
      {/* Mesh Background Accent */}
      <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 dark:bg-indigo-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 dark:bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Sparkles className="h-3.5 w-3.5 fill-indigo-500/20" />
            <span>Empowered by Gemini AI Recommendations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Find trusted nearby professionals for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-200">
              any household problem.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect directly with verified local plumbers, electricians, and carpenters. Get job proposals and let AI analyze applications to match you with the best worker.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 h-12 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center px-8 h-12 rounded-xl text-base font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 bg-white dark:bg-slate-905 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section id="categories" className="py-16 bg-white dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-850 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Service Categories
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Select what expertise you require and find approved, certified workers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="glass flex flex-col items-center p-6 sm:p-8 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-lg transition-all text-center cursor-pointer group"
                >
                  <div className={`p-4 rounded-xl ${cat.color} mb-4 transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 sm:h-7 w-6 sm:w-7" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">
                    {cat.name}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">Verified Local Experts</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              From post to completion — simplified with state-of-the-art AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-lg mb-6 border border-indigo-500/20">
                1
              </div>
              <h3 className="text-lg font-bold mb-3">1. Describe & Enhance Description</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                Write a quick description of your household problem. Let Gemini AI enhance the copy professionally with no extra hassle.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-lg mb-6 border border-indigo-500/20">
                2
              </div>
              <h3 className="text-lg font-bold mb-3">2. Workers Apply</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                Approved local workers check your job request and send applications containing bids, time estimates, and personal pitches.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-lg mb-6 border border-indigo-500/20">
                3
              </div>
              <h3 className="text-lg font-bold mb-3">3. AI Analysis & Hire</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                Gemini AI analyzes worker bids, reviews, and cost estimates, presenting a tailored match recommendation. Accept and review upon completion!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Benefits Section */}
      <section id="benefits" className="py-16 bg-slate-900 text-slate-100 dark:bg-slate-950 border-t border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-6">
                Tailored advantages for everyone
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">For Customers (Users)</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Enjoy peace of mind. All workers undergo admin vetting. Let AI optimize your job postings and evaluate worker applications in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">For Service Partners (Workers)</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Expand your local client reach. Apply to open contracts within a 5km radius. Build up your rating and reviews to attract higher-paying clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass bg-white/5 border-white/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Featured Testimonial</span>
              </div>
              <blockquote className="text-lg text-slate-200 leading-relaxed mb-6 font-medium">
                "The AI application analyzer is a game-changer! I had 4 applications for a plumbing issue, and the recommendations accurately selected the plumber who had the best local reviews and reasonable rates. Will absolutely use again."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/30">
                  JD
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Jane Doe</h4>
                  <p className="text-xs text-slate-400 font-medium">Homeowner in Downtown</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
