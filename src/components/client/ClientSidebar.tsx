import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, FileText, Receipt, Calendar, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const ClientSidebar = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const { toast } = useToast();

  const menuItems = [
    {
      href: '/client-dashboard',
      icon: Home,
      label: 'Dashboard',
      description: 'Overview and quick access'
    },
    {
      href: '/client-dashboard/tasks',
      icon: CheckSquare,
      label: 'My Tasks',
      description: 'View and manage assigned tasks'
    },
    {
      href: '/client-dashboard/documents',
      icon: FileText,
      label: 'Documents',
      description: 'Access your files and documents'
    },
    {
      href: '/client-dashboard/invoices',
      icon: Receipt,
      label: 'My Invoices',
      description: 'View billing and payment history'
    },
    {
      href: '/client-dashboard/calendar',
      icon: Calendar,
      label: 'Task Calendar',
      description: 'View deadlines and schedules'
    },
    {
      href: '/client-dashboard/profile',
      icon: User,
      label: 'User Profile',
      description: 'Manage your account and password'
    }
  ];

  const handleEnableDSC = async () => {
    try {
      // Simulate enabling DSC (replace with actual logic)
      toast({
        title: "DSC Enabled",
        description: "Your Digital Signature Certificate (DSC) is now enabled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable DSC. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManageDSC = async () => {
    try {
      // Simulate managing DSC (replace with actual logic)
      toast({
        title: "Manage DSC",
        description: "Redirecting to DSC management page...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redirect to DSC management. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800">Client Portal</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome, {profile?.full_name}!</p>
      </div>
      
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                <div>
                  <div>{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Link>
            );
          })}

          {profile?.enable_dsc_tab && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-800 mb-2">
                Digital Signature Certificate (DSC)
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={handleEnableDSC}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Enable DSC
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-gray-600 hover:bg-gray-100"
                onClick={handleManageDSC}
              >
                Manage DSC
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default ClientSidebar;
