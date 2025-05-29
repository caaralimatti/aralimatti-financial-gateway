
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

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  assignedBy: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  deadline: string;
  isBillable: boolean;
  loggedHours: number;
  estimatedHours: number;
  client: string;
  subTasks: Array<{ id: number; title: string; completed: boolean }>;
  comments: number;
  attachments: number;
}

interface TaskListItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string, selected: boolean) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, isSelected, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'need-approval': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gst': return '📊';
      case 'roc': return '🏢';
      case 'itr': return '💰';
      case 'audit': return '🔍';
      case 'compliance': return '📋';
      default: return '📄';
    }
  };

  const completedSubTasks = task.subTasks.filter(st => st.completed).length;
  const subTaskProgress = task.subTasks.length > 0 ? (completedSubTasks / task.subTasks.length) * 100 : 0;
  
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
  const isNearDeadline = new Date(task.deadline) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) && task.status !== 'completed';

  return (
    <Card className={`border transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 dark:border-gray-700'} ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
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
                <span className="text-sm">{getCategoryIcon(task.category)}</span>
                <Badge variant="outline" className="text-xs">
                  {task.id}
                </Badge>
                {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                {task.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {task.client}
              </p>
            </div>

            {/* Status & Priority */}
            <div className="flex flex-col gap-1">
              <Badge className={`text-xs w-fit ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge className={`text-xs w-fit ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </Badge>
            </div>

            {/* Assigned To */}
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <User className="h-3 w-3" />
              <span>{task.assignedTo}</span>
            </div>

            {/* Progress & Time */}
            <div className="space-y-1">
              {task.subTasks.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{completedSubTasks}/{task.subTasks.length}</span>
                  </div>
                  <Progress value={subTaskProgress} className="h-1" />
                </div>
              )}
              
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{task.loggedHours}h / {task.estimatedHours}h</span>
                {task.isBillable && (
                  <>
                    <DollarSign className="h-3 w-3 ml-2" />
                    <span>${(task.loggedHours * 50).toFixed(0)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Deadline & Actions */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span className={`${isOverdue ? 'text-red-600 font-medium' : isNearDeadline ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{task.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    <span>{task.attachments}</span>
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
