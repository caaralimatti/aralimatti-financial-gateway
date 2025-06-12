import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

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
      const newTask: SubTask = {
        title: newSubTask.title,
        description: newSubTask.description,
        is_completed: false
      };
      onSubTasksChange([...subTasks, newTask]);
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
        <CardTitle className="text-lg">Sub-tasks (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Sub-tasks */}
        {subTasks.length > 0 && (
          <div className="space-y-2">
            <Label>Current Sub-tasks:</Label>
            {subTasks.map((subTask, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <div className="font-medium">{subTask.title}</div>
                  {subTask.description && (
                    <div className="text-sm text-gray-600">{subTask.description}</div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubTask(index)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Sub-task */}
        <div className="space-y-3 border-t pt-4">
          <Label>Add Sub-task:</Label>
          <div className="grid grid-cols-1 gap-3">
            <Input
              placeholder="Sub-task title"
              value={newSubTask.title}
              onChange={(e) => onNewSubTaskChange({ ...newSubTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Sub-task description (optional)"
              value={newSubTask.description}
              onChange={(e) => onNewSubTaskChange({ ...newSubTask, description: e.target.value })}
              rows={2}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addSubTask}
              disabled={!newSubTask.title.trim()}
              className="w-fit"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-task
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubTasksManager;
