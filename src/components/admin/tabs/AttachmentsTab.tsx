
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload } from 'lucide-react';

const AttachmentsTab = () => {
  return (
    <div className="space-y-4">
      <Button variant="outline">
        <Upload className="h-4 w-4 mr-2" />
        Upload Attachment
      </Button>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>SIZE</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>UPLOADED ON</TableHead>
              <TableHead>USER</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No Attachments found!
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttachmentsTab;
