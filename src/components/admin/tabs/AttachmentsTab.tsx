import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, Download, FileText, Edit, History, Eye } from 'lucide-react';
import { useClientAttachments } from '@/hooks/useClientAttachments';
import { formatFileSize, getFileTypeLabel } from '@/utils/clientFormUtils';
import { useAuth } from '@/contexts/AuthContext';
import type { ClientAttachment } from '@/types/clientForm';
import { handleFileView, handleFileDownload } from '@/utils/fileHandling';

interface AttachmentsTabProps {
  clientForm: any;
  setClientForm: (form: any) => void;
  clientId?: string;
}

const AttachmentsTab = ({ clientForm, setClientForm, clientId }: AttachmentsTabProps) => {
  const { profile } = useAuth();
  const [uploadDescription, setUploadDescription] = useState('');
  const [documentStatus, setDocumentStatus] = useState('Uploaded');
  const [sharedWithClient, setSharedWithClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { attachments, uploadAttachment, deleteAttachment, isUploading, isDeleting } = useClientAttachments(clientId);

  // Use attachments from form state when no clientId (new client), otherwise use from database
  const displayAttachments = clientId ? attachments : clientForm.attachments || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Reviewed': return 'bg-blue-100 text-blue-800';
      case 'Client Review': return 'bg-yellow-100 text-yellow-800';
      case 'Firm Shared': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUploaderDisplay = (attachment: ClientAttachment) => {
    if (attachment.uploaded_by_role === 'firm') {
      return 'Firm';
    } else if (attachment.uploaded_by_role === 'client') {
      return 'Client';
    }
    return 'Unknown';
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (clientId) {
      try {
        await uploadAttachment({ 
          clientId, 
          file, 
          description: uploadDescription,
          documentStatus,
          sharedWithClient,
          uploadedByRole: 'firm'
        });
        setUploadDescription('');
        setDocumentStatus('Uploaded');
        setSharedWithClient(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      // For new clients, store in form state
      const newAttachment: ClientAttachment = {
        id: Date.now().toString(),
        file_name: file.name,
        file_url: URL.createObjectURL(file),
        file_size: file.size,
        file_type: file.type,
        description: uploadDescription,
        document_status: documentStatus,
        shared_with_client: sharedWithClient,
        uploaded_by_role: 'firm',
        version_number: 1,
        is_current_version: true,
        created_at: new Date().toISOString()
      };
      
      const updatedAttachments = [...(clientForm.attachments || []), newAttachment];
      setClientForm(prev => ({
        ...prev,
        attachments: updatedAttachments
      }));
      setUploadDescription('');
      setDocumentStatus('Uploaded');
      setSharedWithClient(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAttachment = async (attachment: ClientAttachment) => {
    if (clientId && attachment.id) {
      try {
        await deleteAttachment(attachment);
      } catch (error) {
        console.error('Error deleting attachment:', error);
      }
    } else {
      // For new clients, remove from form state
      const updatedAttachments = (clientForm.attachments || []).filter((a: ClientAttachment) => a.id !== attachment.id);
      setClientForm(prev => ({
        ...prev,
        attachments: updatedAttachments
      }));
    }
  };

  const handleDownload = (e: React.MouseEvent, attachment: ClientAttachment) => {
    e.preventDefault();
    e.stopPropagation();
    if (attachment.file_url) {
      handleFileDownload(attachment.file_url, attachment.file_name);
    }
  };

  const handleView = (e: React.MouseEvent, attachment: ClientAttachment) => {
    e.preventDefault();
    e.stopPropagation();
    if (attachment.file_url) {
      handleFileView(attachment.file_url, attachment.file_name, attachment.file_type);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Upload New Document</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Description (Optional)</Label>
            <Input
              placeholder="Brief description of the document"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Document Status</Label>
            <Select value={documentStatus} onValueChange={setDocumentStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Uploaded">Uploaded</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Client Review">Client Review</SelectItem>
                <SelectItem value="Firm Shared">Firm Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="share-with-client"
              checked={sharedWithClient}
              onCheckedChange={setSharedWithClient}
            />
            <Label htmlFor="share-with-client">Share with Client</Label>
          </div>
          <div>
            <Label>Select File</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="cursor-pointer"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Browse'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Allowed types: PDF, DOCX, XLSX, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DOCUMENT NAME</TableHead>
              <TableHead>SIZE</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>UPLOADED BY</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>VERSION</TableHead>
              <TableHead>CLIENT ACCESS</TableHead>
              <TableHead>UPLOADED ON</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayAttachments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500">
                  No documents found!
                </TableCell>
              </TableRow>
            ) : (
              displayAttachments.map((attachment: ClientAttachment) => (
                <TableRow key={attachment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {attachment.file_name}
                      {attachment.description && (
                        <span className="text-xs text-gray-500">({attachment.description})</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(attachment.file_size)}</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                      {getFileTypeLabel(attachment.file_type)}
                    </span>
                  </TableCell>
                  <TableCell>{getUploaderDisplay(attachment)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(attachment.document_status)}>
                      {attachment.document_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      v{attachment.version_number}
                      {!attachment.is_current_version && (
                        <Badge variant="outline" className="text-xs">Old</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={attachment.shared_with_client ? "default" : "secondary"}>
                      {attachment.shared_with_client ? "Shared" : "Private"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {attachment.created_at ? new Date(attachment.created_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleView(e, attachment)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleDownload(e, attachment)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Edit Status/Sharing"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Version History"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAttachment(attachment)}
                        disabled={isDeleting}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttachmentsTab;
