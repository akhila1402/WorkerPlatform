import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Briefcase, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AuthLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400/10 dark:bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 transition-colors"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo Banner */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl tracking-tight mb-2">
            <Briefcase className="h-7 w-7 stroke-[2.5]" />
            <span>Worker<span className="text-slate-900 dark:text-white font-medium">Market</span></span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Connecting service professionals with immediate opportunities
          </p>
        </div>

        {/* Content Box */}
        <div className="glass rounded-2xl shadow-xl dark:shadow-slate-950/50 border border-slate-200/50 dark:border-slate-800/40 p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
