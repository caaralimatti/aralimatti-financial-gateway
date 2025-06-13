
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';

export const taskService = {
  async fetchTasks(): Promise<Task[]> {
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

    return transformedTasks;
  },

  async createTask(taskData: Partial<Task>, profileId: string): Promise<any> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: taskData.title,
        description: taskData.description,
        category_id: taskData.category_id,
        priority: taskData.priority,
        status: taskData.status || 'to_do',
        assigned_to_profile_id: taskData.assigned_to_profile_id,
        created_by_profile_id: profileId,
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

    return data;
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<any> {
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

    return data;
  },

  async deleteTask(taskId: string): Promise<void> {
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
  }
};
