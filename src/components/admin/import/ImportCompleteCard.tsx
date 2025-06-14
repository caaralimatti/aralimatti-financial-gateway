
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ImportCompleteCardProps {
  importedCount: number;
  fileName: string;
  onImportMore: () => void;
  onBackToImport: () => void;
}

const ImportCompleteCard: React.FC<ImportCompleteCardProps> = ({
  importedCount,
  fileName,
  onImportMore,
  onBackToImport
}) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Import Successful!</h3>
        <p className="text-gray-600 mb-6">
          Successfully imported {importedCount} clients from {fileName}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={onImportMore}>
            Import More Files
          </Button>
          <Button variant="outline" onClick={onBackToImport}>
            Back to Import
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportCompleteCard;
