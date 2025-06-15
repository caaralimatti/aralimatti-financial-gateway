
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useDeleteUser } from '@/hooks/mutations/useDeleteUser';
import { useUserDeletion } from '@/hooks/useUserDeletion';
import type { Tables } from '@/integrations/supabase/types';

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Tables<'profiles'> | null;
}

const DeleteUserModal = ({ open, onOpenChange, user }: DeleteUserModalProps) => {
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const { deleteUserCompletely } = useUserDeletion();

  if (!user) return null;

  const handleDelete = async () => {
    try {
      // Use the enhanced deletion method
      await deleteUserCompletely(user.id, user.email);
      onOpenChange(false);
    } catch (error) {
      // Error is already handled in the hook
      console.error('🔥 Delete user modal error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Delete User Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>User profile and authentication records</li>
                <li>All associated client data (if applicable)</li>
                <li>Login credentials and access permissions</li>
                <li>All related documents and tasks</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">User to be deleted:</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{user.full_name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> After deletion, this email address will be completely available 
              for reuse. Any portal user accounts will be fully cleaned up.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isPending ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
