
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CalendarDays } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    assignedTo: '',
    client: '',
    startDate: '',
    endDate: '',
    deadline: '',
    estimatedHours: '',
    isBillable: true,
    isRecurring: false,
    recurringFrequency: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to team members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gst">GST</SelectItem>
                  <SelectItem value="roc">ROC</SelectItem>
                  <SelectItem value="itr">ITR</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assigned To and Client */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To *</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah-staff">Sarah Staff</SelectItem>
                  <SelectItem value="mike-auditor">Mike Auditor</SelectItem>
                  <SelectItem value="alex-junior">Alex Junior</SelectItem>
                  <SelectItem value="jane-senior">Jane Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                placeholder="Enter client name"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Estimated Hours */}
          <div className="space-y-2">
            <Label htmlFor="estimatedHours">Estimated Hours</Label>
            <Input
              id="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
              placeholder="Enter estimated hours"
              min="0"
              step="0.5"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBillable"
                checked={formData.isBillable}
                onCheckedChange={(checked) => handleInputChange('isBillable', checked)}
              />
              <Label htmlFor="isBillable">This task is billable</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
              />
              <Label htmlFor="isRecurring">This is a recurring task</Label>
            </div>
          </div>

          {/* Recurring Frequency */}
          {formData.isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurringFrequency">Recurring Frequency</Label>
              <Select value={formData.recurringFrequency} onValueChange={(value) => handleInputChange('recurringFrequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
