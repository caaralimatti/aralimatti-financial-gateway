
import React from 'react';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search } from 'lucide-react';

interface StaffDashboardHeaderProps {
  profile: any;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  handleLogout: () => void;
}

const StaffDashboardHeader: React.FC<StaffDashboardHeaderProps> = ({
  profile,
  darkMode,
  setDarkMode,
  handleLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients, documents, tasks..."
              className="w-80 bg-gray-50 dark:bg-gray-700 border-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaffDashboardHeader;
