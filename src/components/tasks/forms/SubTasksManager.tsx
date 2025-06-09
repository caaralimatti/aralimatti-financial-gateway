import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface SubTask {
  id?: string;
  title: string;
  description: string;
  is_completed: boolean;
}

interface SubTasksManagerProps {
  subTasks: SubTask[];
  newSubTask: { title: string; description: string };
  onSubTasksChange: (subTasks: SubTask[]) => void;
  onNewSubTaskChange: (newSubTask: { title: string; description: string }) => void;
}

const SubTasksManager: React.FC<SubTasksManagerProps> = ({
  subTasks,
  newSubTask,
  onSubTasksChange,
  onNewSubTaskChange,
}) => {
  const addSubTask = () => {
    if (newSubTask.title.trim()) {
      const updatedSubTasks = [...subTasks, { ...newSubTask, is_completed: false }];
      onSubTasksChange(updatedSubTasks);
      onNewSubTaskChange({ title: '', description: '' });
    }
  };

  const removeSubTask = (index: number) => {
    const updatedSubTasks = subTasks.filter((_, i) => i !== index);
    onSubTasksChange(updatedSubTasks);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sub-tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing sub-tasks */}
        {subTasks.map((subTask, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium">{subTask.title}</h4>
              {subTask.description && (
                <p className="text-sm text-gray-600">{subTask.description}</p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeSubTask(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Add new sub-task */}
        <div className="space-y-2 p-3 border-2 border-dashed rounded-lg">
          <Input
            placeholder="Sub-task title"
            value={newSubTask.title}
            onChange={(e) => onNewSubTaskChange({ ...newSubTask, title: e.target.value })}
          />
          <Input
            placeholder="Sub-task description (optional)"
            value={newSubTask.description}
            onChange={(e) => onNewSubTaskChange({ ...newSubTask, description: e.target.value })}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSubTask}
            disabled={!newSubTask.title.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sub-task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubTasksManager;
