
import { supabase } from '@/integrations/supabase/client';

export interface CalendarTask {
  id: string;
  title: string;
  description: string | null;
  priority: 'high' | 'medium' | 'low';
  status: string;
  deadline_date: string;
  start_date?: string;
  client_name?: string;
  assigned_to_name?: string;
  category_name?: string;
}

export interface CalendarCompliance {
  id: string;
  compliance_type: string;
  form_activity?: string;
  description?: string;
  relevant_fy_ay?: string;
  deadline_date: string;
  priority: 'high' | 'medium' | 'low'; // Added priority field
}

export interface CalendarData {
  [date: string]: (CalendarTask | CalendarCompliance)[];
}

export const calendarService = {
  async fetchTasksForDateRange(startDate: string, endDate: string): Promise<CalendarData> {
    console.log('📅 Fetching calendar data for range:', { startDate, endDate });
    
    try {
      // Fetch tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          priority,
          status,
          deadline_date,
          start_date,
          client:clients(name),
          assigned_to:profiles!assigned_to_profile_id(full_name),
          task_categories(name)
        `)
        .or(`deadline_date.gte.${startDate},start_date.gte.${startDate}`)
        .or(`deadline_date.lte.${endDate},start_date.lte.${endDate}`)
        .order('deadline_date', { ascending: true });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        throw tasksError;
      }

      // Fetch compliance deadlines
      const { data: compliance, error: complianceError } = await supabase
        .from('compliance_deadlines')
        .select('*')
        .gte('deadline_date', startDate)
        .lte('deadline_date', endDate)
        .order('deadline_date', { ascending: true });

      if (complianceError) {
        console.error('Error fetching compliance deadlines:', complianceError);
        throw complianceError;
      }

      // Group events by date
      const eventsByDate: CalendarData = {};
      
      // Add tasks to the calendar
      tasks?.forEach((task: any) => {
        if (task.deadline_date) {
          const dateKey = task.deadline_date;
          
          if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = [];
          }
          
          eventsByDate[dateKey].push({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority as 'high' | 'medium' | 'low',
            status: task.status,
            deadline_date: task.deadline_date,
            start_date: task.start_date,
            client_name: task.client?.name,
            assigned_to_name: task.assigned_to?.full_name,
            category_name: task.task_categories?.name
          });
        }
        
        // Also add to start_date if different from deadline_date
        if (task.start_date && task.start_date !== task.deadline_date) {
          const startDateKey = task.start_date;
          
          if (!eventsByDate[startDateKey]) {
            eventsByDate[startDateKey] = [];
          }
          
          // Add as a different event type for start date
          eventsByDate[startDateKey].push({
            id: `${task.id}-start`,
            title: `${task.title} (Start)`,
            description: task.description,
            priority: task.priority as 'high' | 'medium' | 'low',
            status: task.status,
            deadline_date: task.deadline_date,
            start_date: task.start_date,
            client_name: task.client?.name,
            assigned_to_name: task.assigned_to?.full_name,
            category_name: task.task_categories?.name
          });
        }
      });

      // Add compliance deadlines to the calendar
      compliance?.forEach((deadline: any) => {
        const dateKey = deadline.deadline_date;
        
        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }
        
        eventsByDate[dateKey].push({
          id: deadline.id,
          compliance_type: deadline.compliance_type,
          form_activity: deadline.form_activity,
          description: deadline.description,
          relevant_fy_ay: deadline.relevant_fy_ay,
          deadline_date: deadline.deadline_date,
          priority: 'medium' // Default priority for compliance deadlines
        } as CalendarCompliance);
      });

      console.log('📅 Calendar data processed:', eventsByDate);
      return eventsByDate;
    } catch (error) {
      console.error('Error in calendarService.fetchTasksForDateRange:', error);
      throw error;
    }
  }
};
