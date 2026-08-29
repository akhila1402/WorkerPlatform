import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public & Auth Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import CompleteProfilePage from '../pages/auth/CompleteProfilePage';

// USER Dashboard Pages
import UserDashboard from '../pages/user/UserDashboard';
import CreateProblemPage from '../pages/user/CreateProblemPage';
import MyProblemsPage from '../pages/user/MyProblemsPage';
import ProblemDetailsPage from '../pages/user/ProblemDetailsPage';

// WORKER Dashboard Pages
import WorkerDashboard from '../pages/worker/WorkerDashboard';
import WorkerProfilePage from '../pages/worker/WorkerProfilePage';
import AvailableJobsPage from '../pages/worker/AvailableJobsPage';

// ADMIN Dashboard Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import WorkerApprovalsPage from '../pages/admin/WorkerApprovalsPage';
import AdminUserManagePage from '../pages/admin/AdminUserManagePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Complete Profile Workspace */}
      <Route element={<ProtectedRoute allowedRoles={['USER', 'WORKER', 'ADMIN']} checkProfileComplete={false} />}>
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
      </Route>

      {/* USER Protected Workspace */}
      <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/create-problem" element={<CreateProblemPage />} />
          <Route path="/user/my-problems" element={<MyProblemsPage />} />
          <Route path="/user/problem/:id" element={<ProblemDetailsPage />} />
        </Route>
      </Route>

      {/* WORKER Protected Workspace */}
      <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/worker" element={<WorkerDashboard />} />
          <Route path="/worker/profile" element={<WorkerProfilePage />} />
          <Route path="/worker/available-jobs" element={<AvailableJobsPage />} />
        </Route>
      </Route>

      {/* ADMIN Protected Workspace */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<WorkerApprovalsPage />} />
          <Route path="/admin/users" element={<AdminUserManagePage />} />
        </Route>
      </Route>

      {/* Redirect Fallbacks */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
