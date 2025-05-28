
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number;
  category: string;
  uploaded_at: string;
  uploader_name: string | null;
}

interface DocumentCardProps {
  document: Document;
  onDownload: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDownload }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              {document.category}
            </Badge>
          </div>
          <FileText className="h-6 w-6 text-primary flex-shrink-0 ml-2" />
        </div>
      </CardHeader>
      <CardContent>
        {document.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {document.description}
          </p>
        )}
        
        <div className="space-y-2 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            {formatDate(document.uploaded_at)}
          </div>
          <div>Size: {formatFileSize(document.file_size)}</div>
          <div>Uploaded by: {document.uploader_name || 'Unknown'}</div>
        </div>

        <Button 
          onClick={() => onDownload(document)}
          className="w-full"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
