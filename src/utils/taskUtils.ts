
import { Task } from '@/types/task';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'to_do': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'pending_approval': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'on_hold': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No deadline';
  return new Date(dateString).toLocaleDateString();
};

export const isOverdue = (deadline: string | null) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date() && deadline !== null;
};

export const getTaskProgress = (task: Task) => {
  if (task.sub_tasks.length === 0) return 0;
  const completed = task.sub_tasks.filter(st => st.is_completed).length;
  return (completed / task.sub_tasks.length) * 100;
};
