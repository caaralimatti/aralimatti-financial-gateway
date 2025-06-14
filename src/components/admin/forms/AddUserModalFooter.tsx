
import React from 'react';
import { Button } from '@/components/ui/button';

interface AddUserModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
  isCreating: boolean;
}

const AddUserModalFooter: React.FC<AddUserModalFooterProps> = ({
  onCancel,
  onSave,
  isCreating,
}) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button variant="outline" onClick={onCancel} disabled={isCreating}>
        Cancel
      </Button>
      <Button onClick={onSave} disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Save User'}
      </Button>
    </div>
  );
};

export default AddUserModalFooter;
