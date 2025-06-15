
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import { format } from "date-fns";

interface DocumentTableRowProps {
  doc: any;
  viewingDocId: string | null;
  handleView: (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string,
    fileType: string
  ) => void;
  handleDownload: (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string
  ) => void;
  formatFileSize: (bytes: number) => string;
}

const DocumentTableRow: React.FC<DocumentTableRowProps> = ({
  doc,
  viewingDocId,
  handleView,
  handleDownload,
  formatFileSize
}) => (
  <TableRow key={doc.id}>
    <TableCell className="font-medium">{doc.description || doc.file_name}</TableCell>
    <TableCell>{doc.file_type || "Unknown"}</TableCell>
    <TableCell>{doc.file_size ? formatFileSize(doc.file_size) : "Unknown"}</TableCell>
    <TableCell>
      <DocumentStatusBadge status={doc.document_status} />
    </TableCell>
    <TableCell>{doc.uploaded_by_profile?.full_name || "System"}</TableCell>
    <TableCell>{format(new Date(doc.created_at), "MMM dd, yyyy")}</TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={e => handleView(e, doc.file_url, doc.file_name, doc.file_type)}
          title="View Document"
          disabled={viewingDocId === `${doc.file_url}-${doc.file_name}`}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={e => handleDownload(e, doc.file_url, doc.file_name)}
          title="Download Document"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export default DocumentTableRow;
