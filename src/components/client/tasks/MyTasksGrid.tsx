
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/types/task';
import MyTaskCard from './MyTaskCard';

interface MyTasksGridProps {
  tasks: Task[];
  filter: string;
}

const MyTasksGrid: React.FC<MyTasksGridProps> = ({ tasks, filter }) => {
  if (tasks.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <MyTaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default MyTasksGrid;
