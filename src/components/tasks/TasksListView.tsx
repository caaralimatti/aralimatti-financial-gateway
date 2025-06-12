
import React from 'react';
import TaskListItem from './TaskListItem';

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

interface TasksListViewProps {
  tasks: Task[];
  selectedTasks: string[];
  onSelect: (taskId: string, selected: boolean) => void;
}

const TasksListView: React.FC<TasksListViewProps> = ({ tasks, selectedTasks, onSelect }) => {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskListItem
          key={task.id}
          task={task}
          isSelected={selectedTasks.includes(task.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default TasksListView;
