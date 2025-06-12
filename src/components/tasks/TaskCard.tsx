
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string, selected: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card className={`border transition-all duration-200 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 dark:border-gray-700'} ${taskIsOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(task.id, !!checked)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getCategoryIcon(task.task_categories?.name)}</span>
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {task.id}
                </Badge>
                {taskIsOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {task.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {task.client?.name || 'No client'}
              </p>
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

        {/* Status and Priority Badges */}
        <div className="flex gap-2 mt-2">
          <Badge className={`text-xs ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </Badge>
          {task.is_billable && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              <DollarSign className="h-3 w-3 mr-1" />
              Billable
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Progress */}
        {task.sub_tasks.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Subtasks Progress</span>
              <span>{task.sub_tasks.filter(st => st.is_completed).length}/{task.sub_tasks.length}</span>
            </div>
            <Progress value={subTaskProgress} className="h-1" />
          </div>
        )}

        {/* Time Tracking */}
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{loggedHours}h / {estimatedHours}h</span>
          </div>
          {task.is_billable && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>${(loggedHours * 50).toFixed(0)}</span>
            </div>
          )}
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          <span className={`${taskIsOverdue ? 'text-red-600 font-medium' : isNearDeadline ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
            Due: {formatDate(task.deadline_date)}
          </span>
        </div>

        {/* Assignment */}
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <User className="h-3 w-3" />
          <span>Assigned to: {task.assigned_to?.full_name || task.assigned_to?.email || 'Unassigned'}</span>
        </div>

        {/* Comments and Attachments */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{task.task_comments.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            <span>{task.task_attachments.length}</span>
          </div>
        </div>

        {/* Expandable Description */}
        {isExpanded && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {task.description || 'No description available'}
            </p>
            
            {task.sub_tasks.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subtasks:
                </p>
                <div className="space-y-1">
                  {task.sub_tasks.map(subTask => (
                    <div key={subTask.id} className="flex items-center gap-2 text-xs">
                      <Checkbox checked={subTask.is_completed} disabled />
                      <span className={subTask.is_completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}>
                        {subTask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-xs h-6 mt-2"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
