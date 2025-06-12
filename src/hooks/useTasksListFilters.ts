
import { useMemo } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  client: string;
  status: string;
  priority: string;
  category: string;
}

interface Filters {
  status: string;
  priority: string;
  category: string;
  assignedTo: string;
  dateRange: string;
}

export const useTasksListFilters = (tasks: Task[], filters: Filters, searchQuery: string) => {
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || task.category === filters.category;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, filters, searchQuery]);

  return { filteredTasks };
};
