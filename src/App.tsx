
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import AdminDashboard from '@/pages/AdminDashboard';
import StaffDashboard from '@/pages/StaffDashboard';
import ClientDashboard from '@/pages/ClientDashboard';
import Unauthorized from '@/pages/Unauthorized';
import ProtectedRoute from '@/components/ProtectedRoute';
import ResetPassword from '@/pages/ResetPassword';
import MaintenancePage from '@/pages/MaintenancePage';
import WelcomeToast from '@/components/WelcomeToast';
import ClientUserProfile from "@/pages/ClientUserProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <WelcomeToast />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Staff routes */}
            <Route
              path="/staff-dashboard"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            {/* Client routes */}
            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientUserProfile />
                </ProtectedRoute>
              }
            />

            {/* Default route */}
            <Route path="*" element={<Index />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
