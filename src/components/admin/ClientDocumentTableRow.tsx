
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, XCircle, Eye, Download, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  doc: any;
  fileTypeLabel: (type: string) => string;
  viewingDocId: string | null;
  handleView: (e: React.MouseEvent, fileUrl: string, fileName: string, fileType: string) => void;
  handleDownload: (e: React.MouseEvent, fileUrl: string, fileName: string) => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleShareChange: (val: boolean) => void;
}

const ClientDocumentTableRow: React.FC<Props> = ({
  doc,
  fileTypeLabel,
  viewingDocId,
  handleView,
  handleDownload,
  handleEdit,
  handleDelete,
  handleShareChange
}) => (
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
        onCheckedChange={handleShareChange}
      />
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <Button size="icon" variant="ghost"
          onClick={e => handleView(e, doc.file_url, doc.file_name, doc.file_type)}
          title="View Document"
          disabled={viewingDocId === `${doc.file_url}-${doc.file_name}`}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost"
          onClick={e => handleDownload(e, doc.file_url, doc.file_name)}
          title="Download Document"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost"
          onClick={handleEdit}
          title="Edit Metadata"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost"
          onClick={handleDelete}
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export default ClientDocumentTableRow;
