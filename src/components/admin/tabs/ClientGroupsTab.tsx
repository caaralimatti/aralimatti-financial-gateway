
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import type { ClientFormData } from '@/types/clientForm';

interface ClientGroupsTabProps {
  clientForm: ClientFormData;
  setClientForm: (form: ClientFormData) => void;
}

const ClientGroupsTab = ({ clientForm, setClientForm }: ClientGroupsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="group1">Group 1</SelectItem>
            <SelectItem value="group2">Group 2</SelectItem>
          </SelectContent>
        </Select>
        <Button>Add</Button>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          New Client Group
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>DELETE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No Client Group Added
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientGroupsTab;
