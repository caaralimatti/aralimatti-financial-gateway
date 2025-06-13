
export interface ClientCalendarTask {
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

export interface ClientCalendarData {
  [date: string]: ClientCalendarTask[];
}
