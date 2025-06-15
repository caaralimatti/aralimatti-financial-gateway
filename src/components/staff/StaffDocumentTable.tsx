
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ClientDocumentTableRow from '../admin/ClientDocumentTableRow';
import { useAuth } from '@/contexts/AuthContext';

interface Attachment {
  id: string;
  description?: string;
  file_name: string;
  file_type?: string;
  document_status?: string;
  version_number: number;
  is_current_version: boolean;
  uploaded_by_role?: string;
  uploaded_by?: string;
  created_at: string;
  shared_with_client?: boolean;
  file_url: string;
}

interface StaffDocumentTableProps {
  clientId: string | null;
  assignedClientsCount: number;
  isLoading: boolean;
  attachments: Attachment[] | undefined;
  fileTypeLabel: (type: string) => string;
  viewingDocId: string | null;
  onView: (e: React.MouseEvent, fileUrl: string, fileName: string, fileType: string) => void;
  onDownload: (e: React.MouseEvent, fileUrl: string, fileName: string) => void;
  onEdit: (attachment: any) => void;
  onDelete: (attachment: any) => void;
  onShareChange: (attachmentId: string, shared: boolean) => void;
}

const StaffDocumentTable: React.FC<StaffDocumentTableProps> = ({
  clientId,
  assignedClientsCount,
  isLoading,
  attachments,
  fileTypeLabel,
  viewingDocId,
  onView,
  onDownload,
  onEdit,
  onDelete,
  onShareChange
}) => {
  const { profile } = useAuth();

  if (!clientId) {
    return (
      <div className="text-center text-sm text-muted-foreground py-16">
        {assignedClientsCount === 0 ? "No clients assigned to you." : "Select a client to view documents."}
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-16">Loading documents...</div>;
  }

  if (!attachments || attachments.length === 0) {
    return <div className="text-center py-16 text-muted-foreground">No documents for this client.</div>;
  }

  return (
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
          {attachments.map((doc) => {
            // Check if current staff user can delete this document
            const canDelete = doc.uploaded_by === profile?.id && doc.uploaded_by_role === 'staff';
            
            return (
              <ClientDocumentTableRow
                key={doc.id}
                doc={doc}
                fileTypeLabel={fileTypeLabel}
                viewingDocId={viewingDocId}
                handleView={onView}
                handleDownload={onDownload}
                handleEdit={() => onEdit(doc)}
                handleDelete={canDelete ? () => onDelete(doc) : undefined}
                handleShareChange={async (val) => onShareChange(doc.id, val)}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaffDocumentTable;
