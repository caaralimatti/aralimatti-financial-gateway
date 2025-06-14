
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { isOverdue } from '@/utils/taskUtils';
import TaskCardHeader from './TaskCardHeader';
import TaskCardBadges from './TaskCardBadges';
import TaskCardProgress from './TaskCardProgress';
import TaskCardDetails from './TaskCardDetails';
import TaskCardExpanded from './TaskCardExpanded';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string, selected: boolean) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isSelected, onSelect, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const taskIsOverdue = isOverdue(task.deadline_date);
  const isCompleted = task.status === 'completed';

  const handleDelete = () => {
    if (isCompleted) {
      setShowConfirm(true);
    } else {
      onDelete(task.id);
    }
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    onDelete(task.id);
  };

  return (
    <Card className={`border transition-all duration-200 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 dark:border-gray-700'} ${taskIsOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <TaskCardHeader task={task} isSelected={isSelected} onSelect={onSelect} />
        <TaskCardBadges task={task} />
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <TaskCardProgress task={task} />
        <TaskCardDetails task={task} />

        {/* Expandable Description */}
        {isExpanded && <TaskCardExpanded task={task} />}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-xs h-6 mt-2"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>

        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => alert('View Details')}>View Details</Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>

        {/* Confirmation Modal for completed task deletion */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="font-bold text-lg mb-2">Delete Completed Task?</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">Are you sure you want to delete this completed task? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
