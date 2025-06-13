
import React from 'react';

const TasksListEmpty: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-lg mb-2">No tasks found</div>
      <div className="text-gray-500 text-sm">
        Try adjusting your filters or search criteria
      </div>
    </div>
  );
};

export default TasksListEmpty;
