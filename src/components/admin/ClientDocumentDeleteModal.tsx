
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachment: any | null;
  isDeleting: boolean;
  onDelete: () => void;
}

const ClientDocumentDeleteModal: React.FC<Props> = ({
  open,
  onOpenChange,
  attachment,
  isDeleting,
  onDelete
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Document</DialogTitle>
      </DialogHeader>
      {attachment && (
        <div>
          Are you sure you want to delete &quot;{attachment.description || attachment.file_name}&quot;?
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ClientDocumentDeleteModal;
