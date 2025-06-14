
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import WelcomeToast from "@/components/WelcomeToast";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DocumentsPage from "./pages/DocumentsPage";
import GSTLogin from "./pages/GSTLogin";
import GSTRegistration from "./pages/GSTRegistration";
import GSTReports from "./pages/GSTReports";
import TasksPage from "./pages/TasksPage";
import Unauthorized from "./pages/Unauthorized";
import ResetPassword from "./pages/ResetPassword";
import MaintenancePage from "./pages/MaintenancePage";
import NotFound from "./pages/NotFound";
import TaskSettings from "./components/client/TaskSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: false,
    },
  },
});

const App = () => {
  console.log('🔥 App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <WelcomeToast />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/client-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <DocumentsPage />
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
                path="/tasks" 
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <TasksPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gst-login" 
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin', 'super_admin']}>
                    <GSTLogin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gst-registration" 
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin', 'super_admin']}>
                    <GSTRegistration />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gst-reports" 
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin', 'super_admin']}>
                    <GSTReports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/task-settings" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <TaskSettings />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
