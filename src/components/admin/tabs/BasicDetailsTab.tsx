
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Calendar } from 'lucide-react';
import type { ClientFormData } from '@/types/clientForm';

interface BasicDetailsTabProps {
  clientForm: ClientFormData;
  setClientForm: (form: ClientFormData) => void;
}

const BasicDetailsTab = ({ clientForm, setClientForm }: BasicDetailsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fileNo">File No.</Label>
          <Input
            id="fileNo"
            placeholder="File No."
            value={clientForm.basicDetails.fileNo}
            onChange={(e) => setClientForm({
              ...clientForm,
              basicDetails: { ...clientForm.basicDetails, fileNo: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientType">Type of Client <span className="text-red-500">*</span></Label>
          <Select 
            value={clientForm.basicDetails.clientType}
            onValueChange={(value) => setClientForm({
              ...clientForm,
              basicDetails: { ...clientForm.basicDetails, clientType: value }
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Ownership Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Company">Company</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="LLP">LLP</SelectItem>
              <SelectItem value="Trust">Trust</SelectItem>
              <SelectItem value="HUF">HUF</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            placeholder="Name"
            value={clientForm.basicDetails.name}
            onChange={(e) => setClientForm({
              ...clientForm,
              basicDetails: { ...clientForm.basicDetails, name: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tradeName">Trade Name</Label>
          <Input
            id="tradeName"
            placeholder="Trade Name"
            value={clientForm.basicDetails.tradeName}
            onChange={(e) => setClientForm({
              ...clientForm,
              basicDetails: { ...clientForm.basicDetails, tradeName: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth/Date of Incorporation</Label>
          <div className="relative">
            <Input
              id="dateOfBirth"
              type="date"
              value={clientForm.basicDetails.dateOfBirth}
              onChange={(e) => setClientForm({
                ...clientForm,
                basicDetails: { ...clientForm.basicDetails, dateOfBirth: e.target.value }
              })}
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="otherUsers" className="flex items-center gap-2">
            Other Users <span className="text-red-500">*</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>These are users who manage this client's task like proprietor/partner/manager.</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="otherUsers"
            placeholder="Other Users"
            value={clientForm.basicDetails.otherUsers}
            onChange={(e) => setClientForm({
              ...clientForm,
              basicDetails: { ...clientForm.basicDetails, otherUsers: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workingUser" className="flex items-center gap-2">
            Working User
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Working user is the one who is currently working or required to work on this task. If you select a user here, he/she is allocated as working user for any task created for this client.</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="workingUser"
            placeholder="Working User"
            value={clientForm.basicDetails.workingUser}
            onChange={(e) => setClientForm({
              ...clientForm,
              basicDetails: { ...clientForm.basicDetails, workingUser: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags" className="flex items-center gap-2">
            Tags
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tags are used to group users based on some task required to be done. Enter tags separated by commas.</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="tags"
            placeholder="Enter tags separated by commas"
            value={clientForm.basicDetails.tags}
            onChange={(e) => setClientForm({
              ...clientForm,
              basicDetails: { ...clientForm.basicDetails, tags: e.target.value }
            })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add Notes..."
          value={clientForm.basicDetails.notes}
          onChange={(e) => setClientForm({
            ...clientForm,
            basicDetails: { ...clientForm.basicDetails, notes: e.target.value }
          })}
        />
      </div>
    </div>
  );
};

export default BasicDetailsTab;
