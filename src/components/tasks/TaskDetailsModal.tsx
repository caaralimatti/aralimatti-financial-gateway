
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  Building2, 
  FileText, 
  MessageSquare, 
  Paperclip,
  Clock,
  DollarSign
} from 'lucide-react';
import { Task } from '@/types/task';
import { formatDate, getStatusColor, getPriorityColor } from '@/utils/taskUtils';

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, open, onOpenChange }) => {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1">ID: {task.id}</p>
              </div>
              
              {task.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-gray-700 mt-1">{task.description}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.toUpperCase()} PRIORITY
                </Badge>
                {task.is_billable && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Billable
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-gray-600">
                      {task.assigned_to?.full_name || task.assigned_to?.email || 'Unassigned'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Created By</p>
                    <p className="text-sm text-gray-600">
                      {task.created_by?.full_name || task.created_by?.email || 'Unknown'}
                    </p>
                  </div>
                </div>

                {task.client && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Client</p>
                      <p className="text-sm text-gray-600">{task.client.name}</p>
                    </div>
                  </div>
                )}

                {task.task_categories && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-gray-600">{task.task_categories.name}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {task.start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-gray-600">{formatDate(task.start_date)}</p>
                    </div>
                  </div>
                )}

                {task.deadline_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className="text-sm text-gray-600">{formatDate(task.deadline_date)}</p>
                    </div>
                  </div>
                )}

                {task.estimated_effort_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Estimated Effort</p>
                      <p className="text-sm text-gray-600">{task.estimated_effort_hours} hours</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(task.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatDate(task.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sub-tasks */}
          {task.sub_tasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sub-tasks ({task.sub_tasks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {task.sub_tasks.map((subTask) => (
                    <div key={subTask.id} className="flex items-center gap-2 p-2 border rounded">
                      <input
                        type="checkbox"
                        checked={subTask.is_completed}
                        disabled
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${subTask.is_completed ? 'line-through text-gray-500' : ''}`}>
                          {subTask.title}
                        </p>
                        {subTask.description && (
                          <p className="text-xs text-gray-600 mt-1">{subTask.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          {task.task_comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({task.task_comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.task_comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">
                          {comment.commented_by?.full_name || comment.commented_by?.email || 'Unknown'}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.comment_text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {task.task_attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Attachments ({task.task_attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {task.task_attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{attachment.file_name}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {attachment.file_type && <span>Type: {attachment.file_type}</span>}
                          {attachment.file_size && (
                            <span>Size: {(attachment.file_size / 1024).toFixed(1)} KB</span>
                          )}
                        </div>
                      </div>
                      <a
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
