
import React from 'react';
import TaskCard from './TaskCard';

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

interface TasksListGridProps {
  tasks: Task[];
  selectedTasks: string[];
  onSelect: (taskId: string, selected: boolean) => void;
}

const TasksListGrid: React.FC<TasksListGridProps> = ({ tasks, selectedTasks, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          isSelected={selectedTasks.includes(task.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default TasksListGrid;
