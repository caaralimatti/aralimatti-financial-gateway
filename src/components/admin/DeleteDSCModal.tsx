
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { DSCCertificate } from '@/types/dsc';
import { useDSCManagement } from '@/hooks/useDSCManagement';

interface DeleteDSCModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dsc: DSCCertificate | null;
}

const DeleteDSCModal: React.FC<DeleteDSCModalProps> = ({ open, onOpenChange, dsc }) => {
  const { deleteDSC, isDeleting } = useDSCManagement();

  const handleDelete = () => {
    if (dsc) {
      deleteDSC(dsc.id, {
        onSuccess: () => {
          onOpenChange(false);
        }
      });
    }
  };

  if (!dsc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle>Delete DSC Certificate</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this DSC certificate? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p><strong>Holder:</strong> {dsc.certificate_holder_name}</p>
          <p><strong>Serial Number:</strong> {dsc.serial_number}</p>
          <p><strong>Issuing Authority:</strong> {dsc.issuing_authority}</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Certificate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDSCModal;
