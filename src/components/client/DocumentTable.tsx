
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import DocumentTableRow from "./DocumentTableRow";

interface DocumentTableProps {
  documents: any[];
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

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  viewingDocId,
  handleView,
  handleDownload,
  formatFileSize
}) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Shared By</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <span>No documents have been shared with you yet</span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          documents.map(doc => (
            <DocumentTableRow
              key={doc.id}
              doc={doc}
              viewingDocId={viewingDocId}
              handleView={handleView}
              handleDownload={handleDownload}
              formatFileSize={formatFileSize}
            />
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export default DocumentTable;
