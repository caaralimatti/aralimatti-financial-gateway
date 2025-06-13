
import React from 'react';
import { SidebarHeader } from '@/components/ui/sidebar';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebarHeader: React.FC = () => {
  const { profile } = useAuth();

  return (
    <SidebarHeader className="border-b border-sidebar-border">
      <div className="flex flex-col items-center py-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
          <User className="h-6 w-6 text-primary-foreground" />
        </div>
        <h2 className="font-semibold text-sidebar-foreground">Admin Portal</h2>
        <p className="text-xs text-sidebar-foreground/60">
          {profile?.full_name || profile?.email}
        </p>
      </div>
    </SidebarHeader>
  );
};

export default AdminSidebarHeader;
