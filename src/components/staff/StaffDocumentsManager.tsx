
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientAttachments } from "@/hooks/useClientAttachments";
import { useToast } from "@/hooks/use-toast";
import { handleFileView, handleFileDownload } from "@/utils/fileHandling";
import { useStaffAssignedClients } from "@/hooks/useStaffClientAssignments";
import StaffDocumentHeader from "./StaffDocumentHeader";
import StaffDocumentModals from "./StaffDocumentModals";
import StaffDocumentTable from "./StaffDocumentTable";

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

const StaffDocumentsManager: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();

  // Get only the clients assigned to this staff using the new assignment system
  const { data: assignedClients = [], isLoading: isClientsLoading } = useStaffAssignedClients();

  const [clientId, setClientId] = useState<string | null>(null);

  // Update the client id when the assignments change/initial
  useEffect(() => {
    if (assignedClients.length && !clientId) setClientId(assignedClients[0].id);
    if (!assignedClients.find(c => c.id === clientId)) setClientId(assignedClients[0]?.id ?? null);
  }, [assignedClients, clientId]);

  const { attachments, isLoading, uploadAttachment, updateAttachment, deleteAttachment, isUploading, isUpdating, isDeleting } = useClientAttachments(clientId ?? undefined);

  // Modal/interaction state
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState<{ open: boolean; attachment: any | null }>({ open: false, attachment: null });
  const [showDelete, setShowDelete] = useState<{ open: boolean; attachment: any | null }>({ open: false, attachment: null });

  // Upload form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [documentStatus, setDocumentStatus] = useState("Uploaded");
  const [sharedWithClient, setSharedWithClient] = useState(false);

  useEffect(() => {
    if (!showUpload) {
      setFile(null);
      setTitle("");
      setDocumentStatus("Uploaded");
      setSharedWithClient(false);
    }
  }, [showUpload]);

  // Upload handler - must set uploaded_by_role to 'staff'
  const handleUpload = async () => {
    if (!file || !clientId) return;
    try {
      await uploadAttachment({
        clientId,
        file,
        description: title || file.name,
        documentStatus,
        sharedWithClient,
        uploadedByRole: "staff"
      });
      setShowUpload(false);
    } catch (err) {
      // toast error will be handled in mutation
    }
  };

  // For viewing document debounce
  const [viewingDocId, setViewingDocId] = React.useState<string | null>(null);

  const handleViewDocument = async (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string,
    fileType: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const docId = `${fileUrl}-${fileName}`;
    if (viewingDocId === docId) return;
    setViewingDocId(docId);
    try {
      await handleFileView(fileUrl, fileName, fileType);
    } finally {
      setTimeout(() => setViewingDocId(null), 1500);
    }
  };

  const handleDownloadDocument = (e: React.MouseEvent, fileUrl: string, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileDownload(fileUrl, fileName);
  };

  const handleEditDocument = (attachment: any) => {
    setShowEdit({ open: true, attachment: { ...attachment } });
  };

  const handleDeleteDocument = (attachment: any) => {
    setShowDelete({ open: true, attachment });
  };

  const handleEditSave = async () => {
    if (!showEdit.attachment) return;
    await updateAttachment({
      attachmentId: showEdit.attachment.id,
      updates: {
        description: showEdit.attachment.description,
        document_status: showEdit.attachment.document_status,
        shared_with_client: !!showEdit.attachment.shared_with_client,
      }
    });
    setShowEdit({ open: false, attachment: null });
  };

  const handleDeleteConfirm = async () => {
    if (!showDelete.attachment) return;
    await deleteAttachment(showDelete.attachment);
    setShowDelete({ open: false, attachment: null });
  };

  const handleShareChange = async (attachmentId: string, shared: boolean) => {
    await updateAttachment({ attachmentId, updates: { shared_with_client: shared } });
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <StaffDocumentHeader
        clients={assignedClients}
        isClientsLoading={isClientsLoading}
        clientId={clientId}
        onClientChange={setClientId}
        onUploadClick={() => setShowUpload(true)}
      />

      <StaffDocumentModals
        showUpload={showUpload}
        onUploadOpenChange={setShowUpload}
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
        showEdit={showEdit}
        onEditOpenChange={(open) => setShowEdit({ ...showEdit, open })}
        onEditAttachmentChange={(att) => setShowEdit(prev => ({ ...prev, attachment: att }))}
        isUpdating={isUpdating}
        onEditSave={handleEditSave}
        showDelete={showDelete}
        onDeleteOpenChange={(open) => setShowDelete({ ...showDelete, open })}
        isDeleting={isDeleting}
        onDelete={handleDeleteConfirm}
      />

      {/* Document Table */}
      <div className="mt-6">
        <StaffDocumentTable
          clientId={clientId}
          assignedClientsCount={assignedClients.length}
          isLoading={isLoading}
          attachments={attachments}
          fileTypeLabel={fileTypeLabel}
          viewingDocId={viewingDocId}
          onView={handleViewDocument}
          onDownload={handleDownloadDocument}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
          onShareChange={handleShareChange}
        />
      </div>
    </div>
  );
};

export default StaffDocumentsManager;
