
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ClientModalHeaderProps {
  isEditing: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const ClientModalHeader = ({ isEditing, isLoading, onCancel, onSave }: ClientModalHeaderProps) => {
  return (
    <DialogHeader>
      <div className="flex justify-between items-center">
        <DialogTitle className="text-xl font-semibold">
          {isEditing ? 'Edit Client' : 'Add Client'}
        </DialogTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEditing ? 'Update Client' : 'Save Client'}
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};

export default ClientModalHeader;
