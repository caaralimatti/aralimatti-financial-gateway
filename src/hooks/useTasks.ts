
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
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

      // Transform the data to match our Task interface
      const transformedTasks: Task[] = (tasksData || []).map((task: any) => ({
        ...task,
        priority: task.priority as 'high' | 'medium' | 'low',
        status: task.status as 'to_do' | 'in_progress' | 'pending_approval' | 'completed' | 'on_hold' | 'cancelled'
      }));

      setTasks(transformedTasks);
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
          title: taskData.title,
          description: taskData.description,
          category_id: taskData.category_id,
          priority: taskData.priority,
          status: taskData.status || 'to_do',
          assigned_to_profile_id: taskData.assigned_to_profile_id,
          created_by_profile_id: profile?.id,
          start_date: taskData.start_date,
          deadline_date: taskData.deadline_date,
          estimated_effort_hours: taskData.estimated_effort_hours,
          client_id: taskData.client_id,
          is_billable: taskData.is_billable || false
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
      const updateData: any = {};
      
      // Only include fields that exist in the database table
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.category_id !== undefined) updateData.category_id = updates.category_id;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.assigned_to_profile_id !== undefined) updateData.assigned_to_profile_id = updates.assigned_to_profile_id;
      if (updates.start_date !== undefined) updateData.start_date = updates.start_date;
      if (updates.deadline_date !== undefined) updateData.deadline_date = updates.deadline_date;
      if (updates.estimated_effort_hours !== undefined) updateData.estimated_effort_hours = updates.estimated_effort_hours;
      if (updates.client_id !== undefined) updateData.client_id = updates.client_id;
      if (updates.is_billable !== undefined) updateData.is_billable = updates.is_billable;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
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
      console.log('🔥 Deleting task:', taskId);
      
      // First delete related sub-tasks
      const { error: subTaskError } = await supabase
        .from('sub_tasks')
        .delete()
        .eq('task_id', taskId);

      if (subTaskError) {
        console.error('Error deleting sub-tasks:', subTaskError);
        throw subTaskError;
      }

      // Delete task comments
      const { error: commentsError } = await supabase
        .from('task_comments')
        .delete()
        .eq('task_id', taskId);

      if (commentsError) {
        console.error('Error deleting task comments:', commentsError);
        throw commentsError;
      }

      // Delete task attachments
      const { error: attachmentsError } = await supabase
        .from('task_attachments')
        .delete()
        .eq('task_id', taskId);

      if (attachmentsError) {
        console.error('Error deleting task attachments:', attachmentsError);
        throw attachmentsError;
      }

      // Finally delete the main task
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      console.log('🔥 Task deleted successfully');
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
