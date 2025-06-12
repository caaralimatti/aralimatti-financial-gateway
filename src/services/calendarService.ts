
import { supabase } from '@/integrations/supabase/client';

export interface CalendarTask {
  id: string;
  title: string;
  description: string | null;
  priority: 'high' | 'medium' | 'low';
  status: string;
  deadline_date: string;
  client_name?: string;
  assigned_to_name?: string;
  category_name?: string;
}

export interface CalendarData {
  [date: string]: CalendarTask[];
}

export const calendarService = {
  async fetchTasksForDateRange(startDate: string, endDate: string): Promise<CalendarData> {
    console.log('📅 Fetching calendar tasks for range:', { startDate, endDate });
    
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          priority,
          status,
          deadline_date,
          client:clients(name),
          assigned_to:profiles!assigned_to_profile_id(full_name),
          task_categories(name)
        `)
        .gte('deadline_date', startDate)
        .lte('deadline_date', endDate)
        .order('deadline_date', { ascending: true });

      if (error) {
        console.error('Error fetching calendar tasks:', error);
        throw error;
      }

      // Group tasks by deadline date
      const tasksByDate: CalendarData = {};
      
      tasks?.forEach((task: any) => {
        if (task.deadline_date) {
          const dateKey = task.deadline_date;
          
          if (!tasksByDate[dateKey]) {
            tasksByDate[dateKey] = [];
          }
          
          tasksByDate[dateKey].push({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority as 'high' | 'medium' | 'low',
            status: task.status,
            deadline_date: task.deadline_date,
            client_name: task.client?.name,
            assigned_to_name: task.assigned_to?.full_name,
            category_name: task.task_categories?.name
          });
        }
      });

      console.log('📅 Calendar data processed:', tasksByDate);
      return tasksByDate;
    } catch (error) {
      console.error('Error in calendarService.fetchTasksForDateRange:', error);
      throw error;
    }
  }
};
