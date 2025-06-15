
import React, { useState, useEffect } from "react";
import { useClients } from "@/hooks/useClients";
import { useClientAttachments } from "@/hooks/useClientAttachments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Eye, Download, Edit, Trash2, Plus, CheckCircle2, XCircle, FileIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Props {
  selectedClientId?: string;
  onSelectClient?: (clientId: string | null) => void;
}

const DOCUMENT_STATUSES = [
  { label: "Uploaded", value: "Uploaded" },
  { label: "Reviewed", value: "Reviewed" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Client Review", value: "Client Review" },
  { label: "Firm Shared", value: "Firm Shared" }
];

const allowedFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "image/jpeg",
  "image/png"
];

const fileTypeLabel = (type: string) => {
  if (type?.includes("pdf")) return "PDF";
  if (type?.includes("word")) return "Word";
  if (type?.includes("sheet")) return "Excel";
  if (type?.includes("jpeg")) return "JPEG";
  if (type?.includes("png")) return "PNG";
  return type?.split("/")[1]?.toUpperCase() || "FILE";
};

const ClientDocumentsManager: React.FC<Props> = ({ selectedClientId, onSelectClient }) => {
  const { clients, isLoading: isClientsLoading } = useClients();
  // Selected client logic
  const [clientId, setClientId] = useState<string | null>(selectedClientId || null);
  useEffect(() => {
    if (selectedClientId !== clientId) setClientId(selectedClientId || null);
  }, [selectedClientId]);

  // Attachment operations
  const { attachments, isLoading, uploadAttachment, updateAttachment, deleteAttachment, isUploading, isDeleting, isUpdating } = useClientAttachments(clientId ?? undefined);

  // For modals/forms
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState<{ open: boolean; attachment: any | null }>({ open: false, attachment: null });
  const [showDelete, setShowDelete] = useState<{ open: boolean; attachment: any | null }>({ open: false, attachment: null });

  // Upload state/fields
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [documentStatus, setDocumentStatus] = useState("Uploaded"); // Set default to "Uploaded" (first allowed status)
  const [sharedWithClient, setSharedWithClient] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!showUpload) {
      setFile(null);
      setTitle("");
      setDocumentStatus("Uploaded");
      setSharedWithClient(false);
    }
  }, [showUpload]);

  // Handle client selection
  const handleSelectClient = (val: string) => {
    setClientId(val || null);
    if (onSelectClient) onSelectClient(val || null);
  };

  // Upload handler
  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadAttachment({
        clientId,
        file,
        description: title || file.name,
        documentStatus,
        sharedWithClient,
        uploadedByRole: "admin" // Changed from "firm" to "admin" to match allowed values
      });
      setShowUpload(false);
    } catch {}
  };

  // Render
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between py-2 mb-4">
        <div className="w-full md:w-96">
          <Select value={clientId ?? ""} onValueChange={handleSelectClient}>
            <SelectTrigger>
              <SelectValue placeholder={isClientsLoading ? "Loading clients..." : "Select a client"} />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} {c.file_no ? `(${c.file_no})` : ""}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setShowUpload(true)}
          className="w-full md:w-auto"
          disabled={!clientId}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
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
                {DOCUMENT_STATUSES.map(opt => (
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
            <Button onClick={handleUpload} disabled={!file || isUploading || !clientId}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Modal */}
      <Dialog open={showEdit.open} onOpenChange={open => setShowEdit({ ...showEdit, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document Metadata</DialogTitle>
          </DialogHeader>
          {showEdit.attachment && (
            <div className="space-y-3">
              <Input
                placeholder="Document Title"
                value={showEdit.attachment.description || ""}
                onChange={e => setShowEdit(prev => ({
                  ...prev,
                  attachment: { ...prev.attachment, description: e.target.value }
                }))}
                disabled={isUpdating}
              />
              <Select value={showEdit.attachment.document_status || "Uploaded"} onValueChange={val =>
                setShowEdit(prev => ({ ...prev, attachment: { ...prev.attachment, document_status: val } }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_STATUSES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch
                  checked={!!showEdit.attachment.shared_with_client}
                  onCheckedChange={val => setShowEdit(prev => ({
                    ...prev,
                    attachment: { ...prev.attachment, shared_with_client: val }
                  }))}
                />
                <span>Share with client</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={async () => {
                if (!showEdit.attachment) return;
                await updateAttachment({
                  attachmentId: showEdit.attachment.id,
                  updates: {
                    description: showEdit.attachment.description,
                    document_status: showEdit.attachment.document_status,
                    shared_with_client: !!showEdit.attachment.shared_with_client
                  }
                });
                setShowEdit({ open: false, attachment: null });
              }}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDelete.open} onOpenChange={open => setShowDelete({ ...showDelete, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          {showDelete.attachment && (
            <div>
              Are you sure you want to delete &quot;{showDelete.attachment.description || showDelete.attachment.file_name}&quot;?
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!showDelete.attachment) return;
                await deleteAttachment(showDelete.attachment);
                setShowDelete({ open: false, attachment: null });
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Table */}
      <div className="mt-6">
        {!clientId && (
          <div className="text-center text-sm text-muted-foreground py-16">Select a client to view documents.</div>
        )}
        {clientId && (
          <>
            {isLoading && (
              <div className="text-center py-16">Loading documents...</div>
            )}
            {!isLoading && attachments?.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">No documents for this client.</div>
            )}
            {!isLoading && attachments && attachments.length > 0 && (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Uploaded At</TableHead>
                      <TableHead>Shared?</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attachments.map(doc => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.description || doc.file_name}</TableCell>
                        <TableCell>{doc.file_name}</TableCell>
                        <TableCell><Badge>{fileTypeLabel(doc.file_type)}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={doc.document_status === "Active" ? "default" : "secondary"}>
                            {doc.document_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.version_number}</TableCell>
                        <TableCell>
                          {doc.is_current_version
                            ? <CheckCircle2 className="text-green-500" />
                            : <XCircle className="text-muted-foreground" />}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.uploaded_by_role || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          {doc.created_at ? format(new Date(doc.created_at), "yyyy-MM-dd") : "—"}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={!!doc.shared_with_client}
                            onCheckedChange={async (val) => {
                              await updateAttachment({ attachmentId: doc.id, updates: { shared_with_client: val } });
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" asChild>
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" title="View/Download">
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button size="icon" variant="ghost"
                              onClick={() => setShowEdit({ open: true, attachment: { ...doc } })}
                              title="Edit Metadata"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost"
                              onClick={() => setShowDelete({ open: true, attachment: doc })}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientDocumentsManager;
