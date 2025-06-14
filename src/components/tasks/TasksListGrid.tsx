
import React from 'react';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';

interface TasksListGridProps {
  tasks: Task[];
  selectedTasks: string[];
  onSelect: (taskId: string, selected: boolean) => void;
  onDelete: (taskId: string) => void;
}

const TasksListGrid: React.FC<TasksListGridProps> = ({ tasks, selectedTasks, onSelect, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          isSelected={selectedTasks.includes(task.id)}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TasksListGrid;
