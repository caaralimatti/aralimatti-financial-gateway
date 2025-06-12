
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, AlertTriangle, MessageSquare, Paperclip } from 'lucide-react';
import { Task } from '@/types/task';
import { getStatusColor, getPriorityColor, formatDate, isOverdue, getTaskProgress } from '@/utils/taskUtils';

interface MyTaskCardProps {
  task: Task;
}

const MyTaskCard: React.FC<MyTaskCardProps> = ({ task }) => {
  return (
    <Card className={`border transition-all duration-200 hover:shadow-lg ${isOverdue(task.deadline_date) ? 'border-red-300 bg-red-50' : 'border-gray-200 dark:border-gray-700'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {task.task_categories?.name || 'General'}
              </Badge>
              {isOverdue(task.deadline_date) && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <CardTitle className="text-sm leading-tight">
              {task.title}
            </CardTitle>
            {task.client && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Client: {task.client.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <Badge className={`text-xs ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Progress */}
        {task.sub_tasks.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{task.sub_tasks.filter(st => st.is_completed).length}/{task.sub_tasks.length}</span>
            </div>
            <Progress value={getTaskProgress(task)} className="h-1" />
          </div>
        )}

        {/* Deadline */}
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          <span className={`${isOverdue(task.deadline_date) ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
            Due: {formatDate(task.deadline_date)}
          </span>
        </div>

        {/* Effort */}
        {task.estimated_effort_hours && (
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{task.estimated_effort_hours}h estimated</span>
          </div>
        )}

        {/* Created By */}
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <User className="h-3 w-3" />
          <span>Assigned by: {task.created_by?.full_name || task.created_by?.email}</span>
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

        <Button size="sm" className="w-full mt-3">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MyTaskCard;
