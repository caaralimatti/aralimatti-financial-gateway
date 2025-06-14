
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Trash2, Download, FileText } from 'lucide-react';
import { useClientAttachments } from '@/hooks/useClientAttachments';
import { formatFileSize, getFileTypeLabel } from '@/utils/clientFormUtils';
import type { ClientAttachment } from '@/types/clientForm';

interface AttachmentsTabProps {
  clientForm: any;
  setClientForm: (form: any) => void;
  clientId?: string;
}

const AttachmentsTab = ({ clientForm, setClientForm, clientId }: AttachmentsTabProps) => {
  const [uploadDescription, setUploadDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { attachments, uploadAttachment, deleteAttachment, isUploading, isDeleting } = useClientAttachments(clientId);

  // Use attachments from form state when no clientId (new client), otherwise use from database
  const displayAttachments = clientId ? attachments : clientForm.attachments || [];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (clientId) {
      try {
        await uploadAttachment({ clientId, file, description: uploadDescription });
        setUploadDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      // For new clients, store in form state (simplified - in real app you'd upload to temp storage)
      const newAttachment: ClientAttachment = {
        id: Date.now().toString(),
        file_name: file.name,
        file_url: URL.createObjectURL(file), // Temporary URL for preview
        file_size: file.size,
        file_type: file.type,
        description: uploadDescription,
        created_at: new Date().toISOString()
      };
      
      const updatedAttachments = [...(clientForm.attachments || []), newAttachment];
      setClientForm(prev => ({
        ...prev,
        attachments: updatedAttachments
      }));
      setUploadDescription('');
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

  const handleDownload = (attachment: ClientAttachment) => {
    if (attachment.file_url) {
      const link = document.createElement('a');
      link.href = attachment.file_url;
      link.download = attachment.file_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Upload New Attachment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Description (Optional)</Label>
            <Input
              placeholder="Brief description of the file"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
            />
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
              <TableHead>NAME</TableHead>
              <TableHead>SIZE</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>UPLOADED ON</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayAttachments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No Attachments found!
                </TableCell>
              </TableRow>
            ) : (
              displayAttachments.map((attachment: ClientAttachment) => (
                <TableRow key={attachment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {attachment.file_name}
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(attachment.file_size)}</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                      {getFileTypeLabel(attachment.file_type)}
                    </span>
                  </TableCell>
                  <TableCell>{attachment.description || '-'}</TableCell>
                  <TableCell>
                    {attachment.created_at ? new Date(attachment.created_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(attachment)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
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
