import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Info, 
  Eye, 
  EyeOff, 
  Calendar, 
  Plus, 
  Upload 
} from 'lucide-react';

interface ClientFormTabsProps {
  clientForm: any;
  setClientForm: (form: any) => void;
}

const ClientFormTabs = ({ clientForm, setClientForm }: ClientFormTabsProps) => {
  const [showPassword, setShowPassword] = useState({
    itPassword: false,
    itDeductorPassword: false,
    tracesDeductorPassword: false,
    tracesTaxpayerPassword: false,
    mcaV2Password: false,
    mcaV3Password: false,
    dgftPassword: false,
    gstPassword: false
  });

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const incomeTypes = [
    'ITR - Unaudited',
    'ITR - Stat Audit',
    'ITR - Income Tax Audit',
    'TDS Return - Salary',
    'TDS Return - Non Salary',
    'TDS Return - Non Resident',
    'TCS Return',
    'Advance Tax',
    'Advance Tax - One Instalment',
    'SFT'
  ];

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="basic">Basic Details</TabsTrigger>
        <TabsTrigger value="income-tax">Income Tax Details</TabsTrigger>
        <TabsTrigger value="contact">Contact Persons</TabsTrigger>
        <TabsTrigger value="groups">Client Groups</TabsTrigger>
        <TabsTrigger value="custom">Custom Fields</TabsTrigger>
        <TabsTrigger value="login">Login Details</TabsTrigger>
        <TabsTrigger value="attachments">Attachments</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fileNo">File No.</Label>
            <Input
              id="fileNo"
              placeholder="File No."
              value={clientForm.basicDetails.fileNo}
              onChange={(e) => setClientForm(prev => ({
                ...prev,
                basicDetails: { ...prev.basicDetails, fileNo: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientType">Type of Client <span className="text-red-500">*</span></Label>
            <Select 
              value={clientForm.basicDetails.clientType}
              onValueChange={(value) => setClientForm(prev => ({
                ...prev,
                basicDetails: { ...prev.basicDetails, clientType: value }
              }))}
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
              onChange={(e) => setClientForm(prev => ({
                ...prev,
                basicDetails: { ...prev.basicDetails, name: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tradeName">Trade Name</Label>
            <Input
              id="tradeName"
              placeholder="Trade Name"
              value={clientForm.basicDetails.tradeName}
              onChange={(e) => setClientForm(prev => ({
                ...prev,
                basicDetails: { ...prev.basicDetails, tradeName: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth/Date of Incorporation</Label>
            <div className="relative">
              <Input
                id="dateOfBirth"
                type="date"
                value={clientForm.basicDetails.dateOfBirth}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  basicDetails: { ...prev.basicDetails, dateOfBirth: e.target.value }
                }))}
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
              onChange={(e) => setClientForm(prev => ({
                ...prev,
                basicDetails: { ...prev.basicDetails, otherUsers: e.target.value }
              }))}
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
              onChange={(e) => setClientForm(prev => ({
                ...prev,
                basicDetails: { ...prev.basicDetails, workingUser: e.target.value }
              }))}
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
              onChange={(e) => setClientForm(prev => ({
                ...prev,
                basicDetails: { ...prev.basicDetails, tags: e.target.value }
              }))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add Notes..."
            value={clientForm.basicDetails.notes}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              basicDetails: { ...prev.basicDetails, notes: e.target.value }
            }))}
          />
        </div>
      </TabsContent>

      <TabsContent value="income-tax" className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Returns You File in IT <span className="text-red-500">*</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the types of returns you file for income tax</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {incomeTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={type} />
                  <Label htmlFor={type} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pan">PAN</Label>
              <Input
                id="pan"
                placeholder="PAN"
                value={clientForm.incomeTaxDetails.pan}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  incomeTaxDetails: { ...prev.incomeTaxDetails, pan: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tan">TAN</Label>
              <Input
                id="tan"
                placeholder="TAN"
                value={clientForm.incomeTaxDetails.tan}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  incomeTaxDetails: { ...prev.incomeTaxDetails, tan: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="contact" className="space-y-4">
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
      </TabsContent>

      <TabsContent value="groups" className="space-y-4">
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
      </TabsContent>

      <TabsContent value="custom" className="space-y-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline">- Hide Blank</Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              New Custom Field
            </Button>
          </div>
          <p className="text-gray-500">No custom fields added yet.</p>
        </div>
      </TabsContent>

      <TabsContent value="login" className="space-y-6">
        {/* GST Login Details - Only show when GST is applicable */}
        {clientForm.taxesApplicable.gst && (
          <div className="space-y-4">
            <h4 className="font-medium">GST Login Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GST Number/GSTIN</Label>
                <Input 
                  placeholder="GST Number"
                  value={clientForm.loginDetails.gstNumber}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, gstNumber: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>GST Username</Label>
                <Input 
                  placeholder="GST Username"
                  value={clientForm.loginDetails.gstUsername}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, gstUsername: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>GST Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword.gstPassword ? "text" : "password"}
                    placeholder="GST Password"
                    value={clientForm.loginDetails.gstPassword}
                    onChange={(e) => setClientForm(prev => ({
                      ...prev,
                      loginDetails: { ...prev.loginDetails, gstPassword: e.target.value }
                    }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePassword('gstPassword')}
                  >
                    {showPassword.gstPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Registration Type</Label>
                <Select 
                  value={clientForm.loginDetails.gstRegistrationType}
                  onValueChange={(value) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, gstRegistrationType: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Registration Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Composition">Composition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Return Frequency</Label>
                <Select 
                  value={clientForm.loginDetails.gstReturnFrequency}
                  onValueChange={(value) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, gstReturnFrequency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Return Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* IT Login Details */}
        <div className="space-y-4">
          <h4 className="font-medium">IT Login Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PAN</Label>
              <Input 
                placeholder="PAN"
                value={clientForm.loginDetails.itPan}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, itPan: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>IT Portal Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword.itPassword ? "text" : "password"}
                  placeholder="IT Portal Password"
                  value={clientForm.loginDetails.itPassword}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, itPassword: e.target.value }
                  }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePassword('itPassword')}
                >
                  {showPassword.itPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>TAN</Label>
              <Input 
                placeholder="TAN"
                value={clientForm.loginDetails.itTan}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, itTan: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>IT Portal Deductor Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword.itDeductorPassword ? "text" : "password"}
                  placeholder="IT Portal Deductor Password"
                  value={clientForm.loginDetails.itDeductorPassword}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, itDeductorPassword: e.target.value }
                  }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePassword('itDeductorPassword')}
                >
                  {showPassword.itDeductorPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Traces Login Details */}
        <div className="space-y-4">
          <h4 className="font-medium">Traces Login Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Traces Username</Label>
              <Input 
                placeholder="Traces Username"
                value={clientForm.loginDetails.tracesUsername}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, tracesUsername: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Traces Deductor Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword.tracesDeductorPassword ? "text" : "password"}
                  placeholder="Traces Deductor Password"
                  value={clientForm.loginDetails.tracesDeductorPassword}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, tracesDeductorPassword: e.target.value }
                  }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePassword('tracesDeductorPassword')}
                >
                  {showPassword.tracesDeductorPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Traces Taxpayer Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword.tracesTaxpayerPassword ? "text" : "password"}
                  placeholder="Traces Taxpayer Password"
                  value={clientForm.loginDetails.tracesTaxpayerPassword}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, tracesTaxpayerPassword: e.target.value }
                  }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePassword('tracesTaxpayerPassword')}
                >
                  {showPassword.tracesTaxpayerPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Login Details */}
        <div className="space-y-4">
          <h4 className="font-medium">Other Login Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>MCA V2 Username</Label>
              <Input 
                placeholder="MCA V2 Username"
                value={clientForm.loginDetails.mcaV2Username}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, mcaV2Username: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>MCA V2 Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword.mcaV2Password ? "text" : "password"}
                  placeholder="MCA V2 Password"
                  value={clientForm.loginDetails.mcaV2Password}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, mcaV2Password: e.target.value }
                  }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePassword('mcaV2Password')}
                >
                  {showPassword.mcaV2Password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>MCA V3 Username</Label>
              <Input 
                placeholder="MCA V3 Username"
                value={clientForm.loginDetails.mcaV3Username}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, mcaV3Username: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>MCA V3 Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword.mcaV3Password ? "text" : "password"}
                  placeholder="MCA V3 Password"
                  value={clientForm.loginDetails.mcaV3Password}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, mcaV3Password: e.target.value }
                  }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePassword('mcaV3Password')}
                >
                  {showPassword.mcaV3Password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>DGFT Username</Label>
              <Input 
                placeholder="DGFT Username"
                value={clientForm.loginDetails.dgftUsername}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, dgftUsername: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>DGFT Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword.dgftPassword ? "text" : "password"}
                  placeholder="DGFT Password"
                  value={clientForm.loginDetails.dgftPassword}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, dgftPassword: e.target.value }
                  }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePassword('dgftPassword')}
                >
                  {showPassword.dgftPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="attachments" className="space-y-4">
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
      </TabsContent>
    </Tabs>
  );
};

export default ClientFormTabs;
