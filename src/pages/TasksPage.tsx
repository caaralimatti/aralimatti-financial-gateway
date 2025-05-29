
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SidebarProvider, 
  SidebarInset
} from '@/components/ui/sidebar';
import GSTSidebar from '@/components/gst/GSTSidebar';
import GSTHeader from '@/components/gst/GSTHeader';
import TasksDashboard from '@/components/tasks/TasksDashboard';
import TasksList from '@/components/tasks/TasksList';
import TaskFilters from '@/components/tasks/TaskFilters';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TasksPage = () => {
  const { profile, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    dateRange: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          <GSTSidebar />
          
          <SidebarInset className="flex-1">
            <GSTHeader
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              profile={profile}
              onLogout={handleLogout}
            />

            <main className="p-6 space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Task Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage and track all your tasks efficiently
                  </p>
                </div>
                <Button 
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              {/* Dashboard Stats */}
              <TasksDashboard />

              {/* Filters and Search */}
              <TaskFilters
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {/* Tasks List */}
              <TasksList
                filters={selectedFilters}
                searchQuery={searchQuery}
                viewMode={viewMode}
              />

              {/* Add Task Modal */}
              <AddTaskModal
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
              />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TasksPage;
