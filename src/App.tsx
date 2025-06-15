
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import TasksPage from "./pages/TasksPage";
import DocumentsPage from "./pages/DocumentsPage";
import ClientDocumentsPage from "./pages/ClientDocumentsPage";
import ClientTasksPage from "./pages/ClientTasksPage";
import ClientInvoicesPage from "./pages/ClientInvoicesPage";
import ClientUserProfile from "./pages/ClientUserProfile";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import MaintenancePage from "./pages/MaintenancePage";
import GSTRegistration from "./pages/GSTRegistration";
import GSTLogin from "./pages/GSTLogin";
import GSTReports from "./pages/GSTReports";
import NotificationsPage from "./pages/NotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            
            {/* Protected Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-dashboard"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin', 'staff']}>
                  <TasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin', 'staff']}>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-documents"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-tasks"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-invoices"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientInvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientUserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            
            {/* GST Portal Routes */}
            <Route path="/gst-registration" element={<GSTRegistration />} />
            <Route path="/gst-login" element={<GSTLogin />} />
            <Route path="/gst-reports" element={<GSTReports />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
