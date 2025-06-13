
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
import { Announcement } from '@/types/announcements';
import { useAnnouncements } from '@/hooks/useAnnouncements';

interface DeleteAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
}

const DeleteAnnouncementModal: React.FC<DeleteAnnouncementModalProps> = ({
  open,
  onOpenChange,
  announcement,
}) => {
  const { deleteAnnouncement, isDeleting } = useAnnouncements();

  const handleDelete = () => {
    if (announcement) {
      deleteAnnouncement(announcement.id, {
        onSuccess: () => {
          onOpenChange(false);
        }
      });
    }
  };

  if (!announcement) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the announcement "{announcement.title}"? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAnnouncementModal;
