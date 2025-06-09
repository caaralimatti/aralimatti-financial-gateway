
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'to_do' | 'in_progress' | 'pending_approval' | 'completed' | 'on_hold' | 'cancelled';
  assigned_to_profile_id: string;
  created_by_profile_id: string;
  start_date: string | null;
  deadline_date: string | null;
  estimated_effort_hours: number | null;
  client_id: string | null;
  is_billable: boolean;
  created_at: string;
  updated_at: string;
  assigned_to: {
    full_name: string | null;
    email: string;
  } | null;
  created_by: {
    full_name: string | null;
    email: string;
  } | null;
  client: {
    name: string;
  } | null;
  task_categories: {
    name: string;
  } | null;
  sub_tasks: {
    id: string;
    title: string;
    description: string | null;
    is_completed: boolean;
  }[];
  task_comments: {
    id: string;
    comment_text: string;
    created_at: string;
    commented_by: {
      full_name: string | null;
      email: string;
    } | null;
  }[];
  task_attachments: {
    id: string;
    file_name: string;
    file_url: string;
    file_type: string | null;
    file_size: number | null;
  }[];
}

export interface TaskCategory {
  id: string;
  name: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to:profiles!assigned_to_profile_id(full_name, email),
          created_by:profiles!created_by_profile_id(full_name, email),
          client:clients(name),
          task_categories(name),
          sub_tasks(*),
          task_comments(
            *,
            commented_by:profiles!commented_by_profile_id(full_name, email)
          ),
          task_attachments(*)
        `)
        .order('created_at', { ascending: false });

      if (tasksError) {
        throw tasksError;
      }

      setTasks(tasksData || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('task_categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          created_by_profile_id: profile?.id
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchTasks();
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchTasks();
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      await fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  return {
    tasks,
    categories,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};
