
import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import MyTasksHeader from './tasks/MyTasksHeader';
import MyTasksFilters from './tasks/MyTasksFilters';
import MyTasksGrid from './tasks/MyTasksGrid';

const MyTasks = () => {
  const { tasks, loading } = useTasks();
  const { profile } = useAuth();
  const [filter, setFilter] = useState<string>('all');

  const myTasks = tasks.filter(task => task.assigned_to_profile_id === profile?.id);

  const filteredTasks = myTasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <MyTasksHeader />
      </div>

      <MyTasksFilters 
        filter={filter} 
        onFilterChange={setFilter} 
        tasks={myTasks} 
      />

      <MyTasksGrid tasks={filteredTasks} filter={filter} />
    </div>
  );
};

export default MyTasks;
