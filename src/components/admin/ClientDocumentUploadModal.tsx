
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowedFileTypes: string[];
  file: File | null;
  setFile: (file: File | null) => void;
  title: string;
  setTitle: (title: string) => void;
  documentStatus: string;
  setDocumentStatus: (status: string) => void;
  sharedWithClient: boolean;
  setSharedWithClient: (shared: boolean) => void;
  isUploading: boolean;
  onUpload: () => void;
  statuses: { label: string; value: string }[];
}

const ClientDocumentUploadModal: React.FC<Props> = ({
  open,
  onOpenChange,
  allowedFileTypes,
  file,
  setFile,
  title,
  setTitle,
  documentStatus,
  setDocumentStatus,
  sharedWithClient,
  setSharedWithClient,
  isUploading,
  onUpload,
  statuses
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Upload Document</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <Input
          type="file"
          accept={allowedFileTypes.join(",")}
          onChange={e => setFile((e.target.files && e.target.files[0]) || null)}
          disabled={isUploading}
        />
        <Input
          placeholder="Document Title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isUploading}
        />
        <Select value={documentStatus} onValueChange={setDocumentStatus}>
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
          <Switch checked={sharedWithClient} onCheckedChange={setSharedWithClient} />
          <span>Share with client</span>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button onClick={onUpload} disabled={!file || isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ClientDocumentUploadModal;
