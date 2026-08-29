import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Briefcase, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

export default function PublicLayout() {
  const { isAuthenticated, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'WORKER') return '/worker';
    return '/user';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl tracking-tight">
              <Briefcase className="h-6 w-6 stroke-[2.5]" />
              <span>Worker<span className="text-slate-900 dark:text-white font-medium">Market</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Categories</a>
              <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
              <a href="#benefits" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Benefits</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-1.5 px-4 h-10 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors text-slate-500"
                    title="Log Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 h-10 flex items-center text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 h-10 flex items-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg shadow-md shadow-indigo-600/10"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-600 dark:text-slate-300 font-medium hover:text-indigo-600"
            >
              Categories
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-600 dark:text-slate-300 font-medium hover:text-indigo-600"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-600 dark:text-slate-300 font-medium hover:text-indigo-600"
            >
              Benefits
            </a>
            <hr className="border-slate-200 dark:border-slate-800 my-2" />
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-slate-100 dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-semibold text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 flex items-center justify-center text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-200 rounded-lg bg-slate-100 dark:bg-slate-900"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 flex items-center justify-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Structured Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">
            <Briefcase className="h-5 w-5" />
            <span>WorkerMarket</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} WorkerMarket Platform. Dedicated to quality home service. Built on Spring Boot, MongoDB & React.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <Link to="/login" className="hover:text-slate-600 dark:hover:text-slate-300">Login</Link>
            <Link to="/signup" className="hover:text-slate-600 dark:hover:text-slate-300">Signup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
