import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from 'react';

interface TaskFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  category?: string;
  search?: string;
  clientId?: string;
}

export const useOptimizedTasks = (filters: TaskFilters = {}) => {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          deadline_date,
          created_at,
          assigned_to_profile_id,
          created_by_profile_id,
          client_id,
          category_id,
          is_billable,
          clients(name),
          profiles!assigned_to_profile_id(full_name),
          task_categories(name)
        `)
        .order('created_at', { ascending: false });

      // Apply filters at database level
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      if (filters.assignedTo && filters.assignedTo !== 'all') {
        query = query.eq('assigned_to_profile_id', filters.assignedTo);
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
      }

      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Limit to first 100 results for performance
      query = query.limit(100);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const memoizedTasks = useMemo(() => tasks || [], [tasks]);

  return {
    tasks: memoizedTasks,
    isLoading,
    error,
  };
};