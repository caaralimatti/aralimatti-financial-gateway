
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';

interface DocumentListCardProps {
  title: string;
  description: string;
  fileCount: number;
  lastUpdated: string;
}

const DocumentListCard: React.FC<DocumentListCardProps> = ({ 
  title, 
  description, 
  fileCount, 
  lastUpdated 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              {fileCount} files
            </Badge>
          </div>
          <FileText className="h-6 w-6 text-primary flex-shrink-0 ml-2" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          Last updated: {formatDate(lastUpdated)}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentListCard;
