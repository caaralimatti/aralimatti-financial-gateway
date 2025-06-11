
import React from 'react';
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
import { UserProfile } from '@/types/userManagement';
import { useUserManagement } from '@/hooks/useUserManagement';

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ open, onOpenChange, user }) => {
  const { deleteUser, isDeleting } = useUserManagement();

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUser(user.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{user.full_name || user.email}</strong>? 
            This action cannot be undone and will permanently remove the user from both 
            the application and authentication system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserModal;
