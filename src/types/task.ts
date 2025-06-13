
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
