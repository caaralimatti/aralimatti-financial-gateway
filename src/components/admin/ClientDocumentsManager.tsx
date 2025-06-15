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
import { handleFileView, handleFileDownload } from "@/utils/fileHandling";
import ClientDocumentUploadModal from "./ClientDocumentUploadModal";
import ClientDocumentEditModal from "./ClientDocumentEditModal";
import ClientDocumentDeleteModal from "./ClientDocumentDeleteModal";
import ClientDocumentTableRow from "./ClientDocumentTableRow";

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
  const [documentStatus, setDocumentStatus] = useState("Uploaded");
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
        uploadedByRole: "admin"
      });
      setShowUpload(false);
    } catch {}
  };

  // Prevent double-click bug for "view"
  const [viewingDocId, setViewingDocId] = React.useState<string | null>(null);

  // Improved view handler with proper event handling
  const handleViewDocument = async (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string,
    fileType: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const docId = `${fileUrl}-${fileName}`;
    if (viewingDocId === docId) {
      console.log(`[ClientDocumentsManager] Ignored double-view click for ${fileName}`);
      return;
    }
    setViewingDocId(docId);

    try {
      console.log(`[ClientDocumentsManager] handleViewDocument:`, { fileUrl, fileName, fileType });
      await handleFileView(fileUrl, fileName, fileType);
    } finally {
      setTimeout(() => setViewingDocId(null), 1500);
    }
  };

  // Improved download handler with proper event handling
  const handleDownloadDocument = (e: React.MouseEvent, fileUrl: string, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileDownload(fileUrl, fileName);
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
      <ClientDocumentUploadModal
        open={showUpload}
        onOpenChange={setShowUpload}
        allowedFileTypes={allowedFileTypes}
        file={file}
        setFile={setFile}
        title={title}
        setTitle={setTitle}
        documentStatus={documentStatus}
        setDocumentStatus={setDocumentStatus}
        sharedWithClient={sharedWithClient}
        setSharedWithClient={setSharedWithClient}
        isUploading={isUploading}
        onUpload={handleUpload}
        statuses={DOCUMENT_STATUSES}
      />

      {/* Edit Metadata Modal */}
      <ClientDocumentEditModal
        open={showEdit.open}
        onOpenChange={(open) => setShowEdit({ ...showEdit, open })}
        attachment={showEdit.attachment}
        setAttachment={(att) => setShowEdit(prev => ({ ...prev, attachment: att }))}
        isUpdating={isUpdating}
        onSave={async () => {
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
        statuses={DOCUMENT_STATUSES}
      />

      {/* Delete Modal */}
      <ClientDocumentDeleteModal
        open={showDelete.open}
        onOpenChange={(open) => setShowDelete({ ...showDelete, open })}
        attachment={showDelete.attachment}
        isDeleting={isDeleting}
        onDelete={async () => {
          if (!showDelete.attachment) return;
          await deleteAttachment(showDelete.attachment);
          setShowDelete({ open: false, attachment: null });
        }}
      />

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
                    {attachments.map((doc) => (
                      <ClientDocumentTableRow
                        key={doc.id}
                        doc={doc}
                        fileTypeLabel={fileTypeLabel}
                        viewingDocId={viewingDocId}
                        handleView={handleViewDocument}
                        handleDownload={handleDownloadDocument}
                        handleEdit={() => setShowEdit({ open: true, attachment: { ...doc } })}
                        handleDelete={() => setShowDelete({ open: true, attachment: doc })}
                        handleShareChange={async (val) => await updateAttachment({ attachmentId: doc.id, updates: { shared_with_client: val } })}
                      />
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
