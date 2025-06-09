
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Upload, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

  const addSubTask = () => {
    if (newSubTask.title.trim()) {
      setSubTasks([...subTasks, { ...newSubTask, is_completed: false }]);
      setNewSubTask({ title: '', description: '' });
    }
  };

  const removeSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
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
            {/* Task Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Quarterly Audit for Alpha Corp"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed explanation of the task"
                rows={3}
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assigned To */}
            <div>
              <Label htmlFor="assigned_to">Assigned To *</Label>
              <Select 
                value={formData.assigned_to_profile_id} 
                onValueChange={(value) => setFormData({ ...formData, assigned_to_profile_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client Association */}
            <div>
              <Label htmlFor="client">Client (Optional)</Label>
              <Select 
                value={formData.client_id} 
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.file_no})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            {/* Deadline */}
            <div>
              <Label htmlFor="deadline_date">Deadline</Label>
              <Input
                id="deadline_date"
                type="date"
                value={formData.deadline_date}
                onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
              />
            </div>

            {/* Estimated Effort */}
            <div>
              <Label htmlFor="estimated_effort_hours">Estimated Effort (Hours)</Label>
              <Input
                id="estimated_effort_hours"
                type="number"
                step="0.5"
                min="0"
                value={formData.estimated_effort_hours}
                onChange={(e) => setFormData({ ...formData, estimated_effort_hours: e.target.value })}
                placeholder="e.g., 8.5"
              />
            </div>

            {/* Billable Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_billable"
                checked={formData.is_billable}
                onCheckedChange={(checked) => setFormData({ ...formData, is_billable: checked as boolean })}
              />
              <Label htmlFor="is_billable">This task is billable</Label>
            </div>
          </div>

          {/* Sub-tasks Section */}
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
                  onChange={(e) => setNewSubTask({ ...newSubTask, title: e.target.value })}
                />
                <Input
                  placeholder="Sub-task description (optional)"
                  value={newSubTask.description}
                  onChange={(e) => setNewSubTask({ ...newSubTask, description: e.target.value })}
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
