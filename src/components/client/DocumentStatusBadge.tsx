
import React from "react";
import { Badge } from "@/components/ui/badge";

interface DocumentStatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  Uploaded: "bg-blue-100 text-blue-800",
  Reviewed: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  "Client Review": "bg-purple-100 text-purple-800",
  "Firm Shared": "bg-gray-100 text-gray-800"
};

const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({ status }) => (
  <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
    {status}
  </Badge>
);

export default DocumentStatusBadge;
