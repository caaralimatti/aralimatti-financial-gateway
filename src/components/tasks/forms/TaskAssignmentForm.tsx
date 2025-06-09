
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskAssignmentFormProps {
  assignedToProfileId: string;
  clientId: string;
  staffUsers: any[];
  clients: any[];
  onAssignedToChange: (value: string) => void;
  onClientChange: (value: string) => void;
}

const TaskAssignmentForm: React.FC<TaskAssignmentFormProps> = ({
  assignedToProfileId,
  clientId,
  staffUsers,
  clients,
  onAssignedToChange,
  onClientChange,
}) => {
  return (
    <>
      {/* Assigned To */}
      <div>
        <Label htmlFor="assigned_to">Assigned To *</Label>
        <Select value={assignedToProfileId} onValueChange={onAssignedToChange}>
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
        <Select value={clientId} onValueChange={onClientChange}>
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
    </>
  );
};

export default TaskAssignmentForm;
