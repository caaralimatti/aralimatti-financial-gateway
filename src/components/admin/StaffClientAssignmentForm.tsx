
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useClients } from '@/hooks/useClients';
import { useStaffClientAssignments } from '@/hooks/useStaffClientAssignments';

interface StaffClientAssignmentFormProps {
  staffProfileId: string;
  isVisible: boolean;
}

const StaffClientAssignmentForm: React.FC<StaffClientAssignmentFormProps> = ({
  staffProfileId,
  isVisible
}) => {
  const { clients, isLoading: isClientsLoading } = useClients();
  const { getStaffAssignments, updateStaffAssignments, isUpdating } = useStaffClientAssignments();
  const { data: assignedClientIds = [], isLoading: isAssignmentsLoading } = getStaffAssignments(staffProfileId);
  
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  useEffect(() => {
    if (assignedClientIds) {
      setSelectedClientIds(assignedClientIds);
    }
  }, [assignedClientIds]);

  const handleClientToggle = (clientId: string, checked: boolean) => {
    setSelectedClientIds(prev => 
      checked 
        ? [...prev, clientId]
        : prev.filter(id => id !== clientId)
    );
  };

  const handleSave = () => {
    updateStaffAssignments({
      staffProfileId,
      clientIds: selectedClientIds
    });
  };

  if (!isVisible) return null;

  if (isClientsLoading || isAssignmentsLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Client Assignments</h3>
        <div className="text-sm text-gray-500">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Client Assignments</h3>
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {isUpdating ? 'Saving...' : 'Save Assignments'}
        </button>
      </div>
      
      <div className="space-y-2">
        <Label>Assign Clients to this Staff Member</Label>
        <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
          {clients?.length === 0 ? (
            <div className="text-sm text-gray-500">No clients available</div>
          ) : (
            clients?.map((client) => (
              <div key={client.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`client-${client.id}`}
                  checked={selectedClientIds.includes(client.id)}
                  onCheckedChange={(checked) => 
                    handleClientToggle(client.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`client-${client.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {client.name} {client.file_no ? `(${client.file_no})` : ''}
                </Label>
              </div>
            ))
          )}
        </div>
        {selectedClientIds.length > 0 && (
          <div className="text-sm text-gray-600">
            {selectedClientIds.length} client(s) selected
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffClientAssignmentForm;
