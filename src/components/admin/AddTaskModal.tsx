
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import TaskBasicDetailsForm from '@/components/tasks/forms/TaskBasicDetailsForm';
import TaskCategoryPriorityForm from '@/components/tasks/forms/TaskCategoryPriorityForm';
import TaskAssignmentForm from '@/components/tasks/forms/TaskAssignmentForm';
import TaskDatesForm from '@/components/tasks/forms/TaskDatesForm';
import TaskOptionsForm from '@/components/tasks/forms/TaskOptionsForm';
import SubTasksManager from '@/components/tasks/forms/SubTasksManager';

interface SubTask {
  id?: string;
  title: string;
  description: string;
  is_completed: boolean;
}

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onOpenChange, onTaskCreated }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assigned_to_profile_id: '',
    start_date: '',
    deadline_date: '',
    estimated_effort_hours: '',
    client_id: '',
    is_billable: false
  });

  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTask, setNewSubTask] = useState({ title: '', description: '' });

  useEffect(() => {
    if (open) {
      fetchStaffUsers();
      fetchClients();
      fetchCategories();
    }
  }, [open]);

  const fetchStaffUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'staff');
      
      if (error) throw error;
      setStaffUsers(data || []);
    } catch (error) {
      console.error('Error fetching staff users:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, file_no')
        .eq('status', 'Active')
        .order('name');
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('task_categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setLoading(true);
    try {
      // Create the main task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert([{
          ...formData,
          created_by_profile_id: profile.id,
          estimated_effort_hours: formData.estimated_effort_hours ? Number(formData.estimated_effort_hours) : null,
          client_id: formData.client_id === 'none' ? null : formData.client_id || null
        }])
        .select()
        .single();

      if (taskError) throw taskError;

      // Create sub-tasks if any
      if (subTasks.length > 0 && taskData) {
        const subTasksToInsert = subTasks.map(subTask => ({
          task_id: taskData.id,
          title: subTask.title,
          description: subTask.description,
          is_completed: false
        }));

        const { error: subTaskError } = await supabase
          .from('sub_tasks')
          .insert(subTasksToInsert);

        if (subTaskError) throw subTaskError;
      }

      toast.success('Task created successfully!');
      onTaskCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category_id: '',
        priority: 'medium',
        assigned_to_profile_id: '',
        start_date: '',
        deadline_date: '',
        estimated_effort_hours: '',
        client_id: '',
        is_billable: false
      });
      setSubTasks([]);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskBasicDetailsForm
              title={formData.title}
              description={formData.description}
              onTitleChange={(value) => setFormData({ ...formData, title: value })}
              onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
            />

            <TaskCategoryPriorityForm
              categoryId={formData.category_id}
              priority={formData.priority}
              categories={categories}
              onCategoryChange={(value) => setFormData({ ...formData, category_id: value })}
              onPriorityChange={(value) => setFormData({ ...formData, priority: value })}
            />

            <TaskAssignmentForm
              assignedToProfileId={formData.assigned_to_profile_id}
              clientId={formData.client_id}
              staffUsers={staffUsers}
              clients={clients}
              onAssignedToChange={(value) => setFormData({ ...formData, assigned_to_profile_id: value })}
              onClientChange={(value) => setFormData({ ...formData, client_id: value })}
            />

            <TaskDatesForm
              startDate={formData.start_date}
              deadlineDate={formData.deadline_date}
              estimatedEffortHours={formData.estimated_effort_hours}
              onStartDateChange={(value) => setFormData({ ...formData, start_date: value })}
              onDeadlineDateChange={(value) => setFormData({ ...formData, deadline_date: value })}
              onEstimatedEffortHoursChange={(value) => setFormData({ ...formData, estimated_effort_hours: value })}
            />

            <TaskOptionsForm
              isBillable={formData.is_billable}
              onIsBillableChange={(checked) => setFormData({ ...formData, is_billable: checked })}
            />
          </div>

          <SubTasksManager
            subTasks={subTasks}
            newSubTask={newSubTask}
            onSubTasksChange={setSubTasks}
            onNewSubTaskChange={setNewSubTask}
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.category_id || !formData.assigned_to_profile_id}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
