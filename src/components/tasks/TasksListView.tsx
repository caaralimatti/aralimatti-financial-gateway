
import React from 'react';
import { Task } from '@/types/task';
import TaskListItem from './TaskListItem';

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
