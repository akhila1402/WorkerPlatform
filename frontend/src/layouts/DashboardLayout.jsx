import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Briefcase,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  User,
  Search,
  Users,
  CheckSquare,
  LogOut,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  Shield
} from 'lucide-react';

export default function DashboardLayout() {
  const { role, email, logout, isUser, isWorker, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Build navigation items based on user roles
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { label: 'Overview', path: '/admin', icon: LayoutDashboard },
        { label: 'Worker Approvals', path: '/admin/approvals', icon: CheckSquare },
        { label: 'Manage Accounts', path: '/admin/users', icon: Users },
      ];
    }
    if (isWorker) {
      return [
        { label: 'Overview', path: '/worker', icon: LayoutDashboard },
        { label: 'My Profile', path: '/worker/profile', icon: User },
        { label: 'Find Jobs', path: '/worker/available-jobs', icon: Search },
      ];
    }
    // Default to USER (Customer)
    return [
      { label: 'Dashboard', path: '/user', icon: LayoutDashboard },
      { label: 'Post Problem', path: '/user/create-problem', icon: PlusCircle },
      { label: 'My Problems', path: '/user/my-problems', icon: ClipboardList },
    ];
  };

  const navItems = getNavItems();

  const getRoleLabel = () => {
    if (role === 'ADMIN') return 'Administrator';
    if (role === 'WORKER') return 'Worker Partner';
    return 'Customer';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 transition-colors duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2 text-indigo-400 font-extrabold text-lg tracking-tight">
          <Briefcase className="h-5 w-5 stroke-[2.5]" />
          {!collapsed && (
            <span>Worker<span className="text-white font-medium">Market</span></span>
          )}
        </Link>
        {isAdmin && !collapsed && (
          <span className="flex items-center gap-0.5 text-[10px] uppercase font-bold tracking-wider text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
            <Shield className="h-2.5 w-2.5" />
            Admin
          </span>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Profile Summary Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm">
            {email ? email.substring(0, 2).toUpperCase() : 'US'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{email}</p>
              <p className="text-[10px] text-slate-400 font-medium">{getRoleLabel()}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 mt-4 px-3 py-2 border border-slate-800 hover:border-rose-900/50 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-semibold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className={`hidden md:block transition-all duration-300 shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="fixed top-0 bottom-0 left-0 z-20 h-full transition-all duration-300" style={{ width: collapsed ? '80px' : '256px' }}>
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full animate-slide-in">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Panel Content Area */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">
        {/* Main Dashboard Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-850 sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className={`h-5 w-5 transform transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
            </button>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300 gradient-text">
              Portal Workspace
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">{email}</span>
              <button
                onClick={handleLogout}
                className="md:hidden p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Scroll Container */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
