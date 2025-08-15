import React, { lazy, Suspense, useMemo } from 'react';
import { useOptimizedTasks } from '@/hooks/useOptimizedTasks';
import { TableSkeleton } from '@/components/ui/skeleton-loader';

// Lazy load task components for code splitting
const TaskCard = lazy(() => import('./TaskCard'));
const TaskListItem = lazy(() => import('./TaskListItem'));

interface TaskListOptimizedProps {
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

const TaskListOptimized: React.FC<TaskListOptimizedProps> = ({
  filters,
  searchQuery,
  viewMode,
}) => {
  const { tasks, isLoading, error } = useOptimizedTasks({
    ...filters,
    search: searchQuery,
  });

  const memoizedTasks = useMemo(() => {
    if (!tasks) return [];
    
    // Additional client-side filtering for complex logic
    return tasks.filter(task => {
      if (filters.dateRange !== 'all') {
        const taskDate = new Date(task.deadline_date || task.created_at);
        const now = new Date();
        const daysDiff = Math.ceil((taskDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        switch (filters.dateRange) {
          case 'overdue':
            return daysDiff < 0;
          case 'today':
            return daysDiff === 0;
          case 'thisWeek':
            return daysDiff >= 0 && daysDiff <= 7;
          case 'thisMonth':
            return daysDiff >= 0 && daysDiff <= 30;
          default:
            return true;
        }
      }
      return true;
    });
  }, [tasks, filters.dateRange]);

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading tasks: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return viewMode === 'grid' ? (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <TableSkeleton rows={3} columns={1} />
          </div>
        ))}
      </div>
    ) : (
      <TableSkeleton rows={10} columns={6} />
    );
  }

  if (memoizedTasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks found matching your criteria.
      </div>
    );
  }

  return (
    <Suspense fallback={<TableSkeleton rows={5} columns={4} />}>
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {memoizedTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task as any}
              isSelected={false}
              onSelect={() => {}}
              onDelete={() => {}}
              onViewDetails={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {memoizedTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task as any}
              isSelected={false}
              onSelect={() => {}}
            />
          ))}
        </div>
      )}
    </Suspense>
  );
};

export default TaskListOptimized;