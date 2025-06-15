
import React from 'react';
import ClientDocumentUploadModal from '../admin/ClientDocumentUploadModal';
import ClientDocumentEditModal from '../admin/ClientDocumentEditModal';
import ClientDocumentDeleteModal from '../admin/ClientDocumentDeleteModal';

interface StaffDocumentModalsProps {
  // Upload modal props
  showUpload: boolean;
  onUploadOpenChange: (open: boolean) => void;
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

  // Edit modal props
  showEdit: { open: boolean; attachment: any | null };
  onEditOpenChange: (open: boolean) => void;
  onEditAttachmentChange: (att: any | null) => void;
  isUpdating: boolean;
  onEditSave: () => void;

  // Delete modal props
  showDelete: { open: boolean; attachment: any | null };
  onDeleteOpenChange: (open: boolean) => void;
  isDeleting: boolean;
  onDelete: () => void;
}

const StaffDocumentModals: React.FC<StaffDocumentModalsProps> = ({
  showUpload,
  onUploadOpenChange,
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
  statuses,
  showEdit,
  onEditOpenChange,
  onEditAttachmentChange,
  isUpdating,
  onEditSave,
  showDelete,
  onDeleteOpenChange,
  isDeleting,
  onDelete
}) => {
  return (
    <>
      {/* Upload Modal */}
      <ClientDocumentUploadModal
        open={showUpload}
        onOpenChange={onUploadOpenChange}
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
        onUpload={onUpload}
        statuses={statuses}
      />

      {/* Edit Modal */}
      <ClientDocumentEditModal
        open={showEdit.open}
        onOpenChange={onEditOpenChange}
        attachment={showEdit.attachment}
        setAttachment={onEditAttachmentChange}
        isUpdating={isUpdating}
        onSave={onEditSave}
        statuses={statuses}
      />

      {/* Delete Modal */}
      <ClientDocumentDeleteModal
        open={showDelete.open}
        onOpenChange={onDeleteOpenChange}
        attachment={showDelete.attachment}
        isDeleting={isDeleting}
        onDelete={onDelete}
      />
    </>
  );
};

export default StaffDocumentModals;
