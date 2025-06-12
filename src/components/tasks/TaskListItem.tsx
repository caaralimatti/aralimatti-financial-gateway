
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MoreVertical, 
  MessageSquare, 
  Paperclip,
  User,
  AlertTriangle
} from 'lucide-react';
import { Task } from '@/types/task';
import { getStatusColor, getPriorityColor, formatDate, isOverdue, getTaskProgress } from '@/utils/taskUtils';

interface TaskListItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string, selected: boolean) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, isSelected, onSelect }) => {
  const getCategoryIcon = (categoryName: string | undefined) => {
    if (!categoryName) return '📄';
    switch (categoryName.toLowerCase()) {
      case 'gst': return '📊';
      case 'roc': return '🏢';
      case 'itr': return '💰';
      case 'audit': return '🔍';
      case 'compliance': return '📋';
      default: return '📄';
    }
  };

  const subTaskProgress = getTaskProgress(task);
  const taskIsOverdue = isOverdue(task.deadline_date);
  const isNearDeadline = task.deadline_date && new Date(task.deadline_date) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) && task.status !== 'completed';

  // Calculate logged hours (mock data for now)
  const loggedHours = 4.5;
  const estimatedHours = task.estimated_effort_hours || 8;

  return (
    <Card className={`border transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 dark:border-gray-700'} ${taskIsOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Selection Checkbox */}
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(task.id, !!checked)}
          />

          {/* Task Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            {/* Task Title & Client */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{getCategoryIcon(task.task_categories?.name)}</span>
                <Badge variant="outline" className="text-xs">
                  {task.id}
                </Badge>
                {taskIsOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                {task.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {task.client?.name || 'No client'}
              </p>
            </div>

            {/* Status & Priority */}
            <div className="flex flex-col gap-1">
              <Badge className={`text-xs w-fit ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={`text-xs w-fit ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </Badge>
            </div>

            {/* Assigned To */}
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <User className="h-3 w-3" />
              <span>{task.assigned_to?.full_name || task.assigned_to?.email || 'Unassigned'}</span>
            </div>

            {/* Progress & Time */}
            <div className="space-y-1">
              {task.sub_tasks.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{task.sub_tasks.filter(st => st.is_completed).length}/{task.sub_tasks.length}</span>
                  </div>
                  <Progress value={subTaskProgress} className="h-1" />
                </div>
              )}
              
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{loggedHours}h / {estimatedHours}h</span>
                {task.is_billable && (
                  <>
                    <DollarSign className="h-3 w-3 ml-2" />
                    <span>${(loggedHours * 50).toFixed(0)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Deadline & Actions */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span className={`${taskIsOverdue ? 'text-red-600 font-medium' : isNearDeadline ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    {formatDate(task.deadline_date)}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{task.task_comments.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    <span>{task.task_attachments.length}</span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem>Assign To</DropdownMenuItem>
                  <DropdownMenuItem>Log Time</DropdownMenuItem>
                  <DropdownMenuItem>Add Comment</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskListItem;
