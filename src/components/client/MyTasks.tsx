
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, AlertTriangle, MessageSquare, Paperclip } from 'lucide-react';
import { useTasks, Task } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';

const MyTasks = () => {
  const { tasks, loading } = useTasks();
  const { profile } = useAuth();
  const [filter, setFilter] = useState<string>('all');

  const myTasks = tasks.filter(task => task.assigned_to_profile_id === profile?.id);

  const filteredTasks = myTasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() && deadline !== null;
  };

  const getTaskProgress = (task: Task) => {
    if (task.sub_tasks.length === 0) return 0;
    const completed = task.sub_tasks.filter(st => st.is_completed).length;
    return (completed / task.sub_tasks.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your assigned tasks
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Tasks', count: myTasks.length },
          { key: 'to_do', label: 'To Do', count: myTasks.filter(t => t.status === 'to_do').length },
          { key: 'in_progress', label: 'In Progress', count: myTasks.filter(t => t.status === 'in_progress').length },
          { key: 'pending_approval', label: 'Pending Approval', count: myTasks.filter(t => t.status === 'pending_approval').length },
          { key: 'completed', label: 'Completed', count: myTasks.filter(t => t.status === 'completed').length },
        ].map((filterOption) => (
          <Button
            key={filterOption.key}
            variant={filter === filterOption.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterOption.key)}
            className="flex items-center gap-2"
          >
            {filterOption.label}
            <Badge variant="secondary" className="text-xs">
              {filterOption.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 text-lg mb-2">No tasks found</div>
            <div className="text-gray-500 text-sm">
              {filter === 'all' 
                ? "You don't have any tasks assigned yet." 
                : `No tasks with status "${filter.replace('_', ' ')}" found.`
              }
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={`border transition-all duration-200 hover:shadow-lg ${isOverdue(task.deadline_date) ? 'border-red-300 bg-red-50' : 'border-gray-200 dark:border-gray-700'}`}>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
