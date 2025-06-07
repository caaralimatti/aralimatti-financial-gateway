
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CustomFieldsTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline">- Hide Blank</Button>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          New Custom Field
        </Button>
      </div>
      <p className="text-gray-500">No custom fields added yet.</p>
    </div>
  );
};

export default CustomFieldsTab;
