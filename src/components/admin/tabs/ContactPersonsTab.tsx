
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Plus } from 'lucide-react';

const ContactPersonsTab = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Person</Label>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person1">Person 1</SelectItem>
                <SelectItem value="person2">Person 2</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Contact Person
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Designation
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select the designation of the contact person</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="isPrimary" />
        <Label htmlFor="isPrimary">Select as Primary</Label>
      </div>
      <Button>Add</Button>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>MOBILE</TableHead>
              <TableHead>DESIGNATION</TableHead>
              <TableHead>IS PRIMARY</TableHead>
              <TableHead>DELETE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No Contact Person Added
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContactPersonsTab;
