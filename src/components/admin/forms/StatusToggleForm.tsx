
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface StatusToggleFormProps {
  status: boolean;
  onStatusChange: (status: boolean) => void;
}

const StatusToggleForm = ({ status, onStatusChange }: StatusToggleFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Status</h3>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={status}
          onCheckedChange={onStatusChange}
        />
        <Label htmlFor="status">Active User</Label>
      </div>
    </div>
  );
};

export default StatusToggleForm;
