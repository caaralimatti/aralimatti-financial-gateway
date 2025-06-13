
import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskListItem from './TaskListItem';
import { Badge } from '@/components/ui/badge';

interface TasksListProps {
  filters: {
    status: string;
    priority: string;
    category: string;
    assignedTo: string;
    dateRange: string;
  };
  searchQuery: string;
  viewMode: 'grid' | 'list';
}

// Mock data - replace with actual data from backend later
const mockTasks = [
  {
    id: 'T001',
    title: 'GST Return Filing - ABC Pvt Ltd',
    description: 'Complete monthly GST return filing for March 2024',
    category: 'gst',
    status: 'in-progress',
    priority: 'high',
    assignedBy: 'John Manager',
    assignedTo: 'Sarah Staff',
    startDate: '2024-03-01',
    endDate: '2024-03-20',
    deadline: '2024-03-20',
    isBillable: true,
    loggedHours: 4.5,
    estimatedHours: 8,
    client: 'ABC Pvt Ltd',
    subTasks: [
      { id: 1, title: 'Collect invoices', completed: true },
      { id: 2, title: 'Prepare return', completed: true },
      { id: 3, title: 'Review and file', completed: false }
    ],
    comments: 2,
    attachments: 1
  },
  {
    id: 'T002',
    title: 'Annual Audit - XYZ Corp',
    description: 'Conduct annual statutory audit for FY 2023-24',
    category: 'audit',
    status: 'need-approval',
    priority: 'medium',
    assignedBy: 'John Manager',
    assignedTo: 'Mike Auditor',
    startDate: '2024-02-15',
    endDate: '2024-04-30',
    deadline: '2024-04-30',
    isBillable: true,
    loggedHours: 24,
    estimatedHours: 40,
    client: 'XYZ Corp',
    subTasks: [
      { id: 1, title: 'Plan audit', completed: true },
      { id: 2, title: 'Field work', completed: true },
      { id: 3, title: 'Draft report', completed: true },
      { id: 4, title: 'Final review', completed: false }
    ],
    comments: 5,
    attachments: 8
  },
  {
    id: 'T003',
    title: 'ROC Compliance - DEF Industries',
    description: 'File annual returns and maintain ROC compliance',
    category: 'roc',
    status: 'assigned',
    priority: 'low',
    assignedBy: 'Jane Partner',
    assignedTo: 'Alex Junior',
    startDate: '2024-03-10',
    endDate: '2024-03-25',
    deadline: '2024-03-30',
    isBillable: true,
    loggedHours: 0,
    estimatedHours: 6,
    client: 'DEF Industries',
    subTasks: [
      { id: 1, title: 'Gather documents', completed: false },
      { id: 2, title: 'Prepare filings', completed: false },
      { id: 3, title: 'Submit to ROC', completed: false }
    ],
    comments: 0,
    attachments: 0
  }
];

const TasksList: React.FC<TasksListProps> = ({ filters, searchQuery, viewMode }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Filter tasks based on selected filters and search query
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesCategory = filters.category === 'all' || task.category === filters.category;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No tasks found</div>
        <div className="text-gray-500 text-sm">
          Try adjusting your filters or search criteria
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTasks.length} of {mockTasks.length} tasks
          </span>
          {selectedTasks.length > 0 && (
            <Badge variant="secondary">
              {selectedTasks.length} selected
            </Badge>
          )}
        </div>
        
        {selectedTasks.length > 0 && (
          <div className="flex gap-2">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Bulk Assign
            </button>
            <button className="text-sm text-green-600 hover:text-green-800">
              Mark Complete
            </button>
            <button className="text-sm text-red-600 hover:text-red-800">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Tasks Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isSelected={selectedTasks.includes(task.id)}
              onSelect={(taskId, selected) => {
                if (selected) {
                  setSelectedTasks([...selectedTasks, taskId]);
                } else {
                  setSelectedTasks(selectedTasks.filter(id => id !== taskId));
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map(task => (
            <TaskListItem
              key={task.id}
              task={task}
              isSelected={selectedTasks.includes(task.id)}
              onSelect={(taskId, selected) => {
                if (selected) {
                  setSelectedTasks([...selectedTasks, taskId]);
                } else {
                  setSelectedTasks(selectedTasks.filter(id => id !== taskId));
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksList;
