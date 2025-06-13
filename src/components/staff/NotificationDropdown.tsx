
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NotificationDropdown: React.FC = () => {
  const { profile } = useAuth();

  const formatLastLogin = (lastLogin: string | undefined | null) => {
    if (!lastLogin) {
      return <span className="text-gray-400">Never</span>;
    }
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return <span className="text-green-600">Just now</span>;
    } else if (diffInHours < 24) {
      return <span className="text-green-600">{diffInHours}h ago</span>;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return <span className="text-yellow-600">{days}d ago</span>;
    } else {
      return <span className="text-gray-600">{date.toLocaleDateString()}</span>;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Last Login:</span>
            {formatLastLogin(profile?.last_login_at)}
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-800 mb-1">📢 Announcements</div>
            <div className="space-y-1 text-blue-700">
              <p>• New GST filing deadline extended to 25th of this month</p>
              <p>• Staff meeting scheduled for Friday 3 PM - Conference Room A</p>
              <p>• Updated audit checklist available in Documents section</p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            No new notifications
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
