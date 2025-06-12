
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
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const taskIsOverdue = isOverdue(task.deadline_date);

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
      </CardContent>
    </Card>
  );
};

export default TaskCard;
