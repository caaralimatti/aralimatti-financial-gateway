
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClientMutations } from '@/hooks/useClientMutations';
import { CheckCircle } from 'lucide-react';

interface DeleteClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    id: string;
    name: string;
  } | null;
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({
  open,
  onOpenChange,
  client,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const { deleteClient, isDeleting } = useClientMutations();

  const isDeleteEnabled = confirmationText === 'DELETE';

  const handleDelete = async () => {
    if (!client || !isDeleteEnabled) return;

    try {
      await deleteClient(client.id);
      onOpenChange(false);
      setConfirmationText('');
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setConfirmationText('');
  };

  if (!client) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Confirm Client Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-4">
            <p>
              Are you sure you want to permanently delete client{' '}
              <span className="font-semibold">"{client.name}"</span>?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone and will also permanently delete ALL
              associated data (tasks, invoices, payments, documents, contact persons,
              custom fields, IT returns, etc.) for this client. If a client portal
              user was linked, that user account will also be deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="delete-confirmation" className="text-sm font-medium">
              Type 'DELETE' to confirm
            </Label>
            <div className="relative">
              <Input
                id="delete-confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type DELETE here"
                className={`pr-10 ${
                  isDeleteEnabled
                    ? 'border-green-500 focus:border-green-500'
                    : ''
                }`}
              />
              {isDeleteEnabled && (
                <CheckCircle className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isDeleteEnabled || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteClientModal;
