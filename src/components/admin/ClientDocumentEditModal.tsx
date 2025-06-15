
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachment: any | null;
  setAttachment: (att: any | null) => void;
  isUpdating: boolean;
  onSave: () => void;
  statuses: { label: string; value: string }[];
}

const ClientDocumentEditModal: React.FC<Props> = ({
  open,
  onOpenChange,
  attachment,
  setAttachment,
  isUpdating,
  onSave,
  statuses
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Document Metadata</DialogTitle>
      </DialogHeader>
      {attachment && (
        <div className="space-y-3">
          <Input
            placeholder="Document Title"
            value={attachment.description || ""}
            onChange={e => setAttachment({ ...attachment, description: e.target.value })}
            disabled={isUpdating}
          />
          <Select value={attachment.document_status || "Uploaded"} onValueChange={val =>
            setAttachment({ ...attachment, document_status: val })
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={!!attachment.shared_with_client}
              onCheckedChange={val => setAttachment({ ...attachment, shared_with_client: val })}
            />
            <span>Share with client</span>
          </div>
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button onClick={onSave} disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ClientDocumentEditModal;
