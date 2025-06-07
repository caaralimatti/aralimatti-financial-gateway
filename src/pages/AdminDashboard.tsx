import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  LogOut, 
  Plus, 
  UserPlus,
  Activity,
  Database,
  Info,
  Eye,
  EyeOff,
  Calendar,
  Trash2,
  Upload
} from 'lucide-react';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [clientForm, setClientForm] = useState({
    taxesApplicable: {
      gst: false,
      incomeTax: true,
      other: false
    },
    basicDetails: {
      fileNo: '',
      clientType: '',
      name: '',
      tradeName: '',
      dateOfBirth: '',
      otherUsers: '',
      workingUser: '',
      tags: '',
      notes: ''
    },
    incomeTaxDetails: {
      returns: [],
      pan: '',
      tan: ''
    },
    contactPersons: [],
    clientGroups: [],
    loginDetails: {
      itPan: '',
      itPassword: '',
      itTan: '',
      itDeductorPassword: '',
      tracesUsername: '',
      tracesDeductorPassword: '',
      tracesTaxpayerPassword: '',
      mcaV2Username: '',
      mcaV2Password: '',
      mcaV3Username: '',
      mcaV3Password: '',
      dgftUsername: '',
      dgftPassword: ''
    },
    attachments: []
  });

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const togglePassword = (field) => {
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
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {profile?.full_name || profile?.email || 'Admin'}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Clients</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Staff Members</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">System Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-lg font-bold text-green-600">Online</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-600">Manage all users and roles</p>
                  </div>
                </div>
                <Button className="w-full">
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Settings className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">System Settings</h3>
                    <p className="text-sm text-gray-600">Configure system preferences</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  System Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-600">View system analytics</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <UserPlus className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Client Management</h3>
                    <p className="text-sm text-gray-600">Add and manage clients</p>
                  </div>
                </div>
                <Dialog open={showAddClientModal} onOpenChange={setShowAddClientModal}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex justify-between items-center">
                        <DialogTitle className="text-xl font-semibold">Add Client</DialogTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowAddClientModal(false)}>
                            Cancel
                          </Button>
                          <Button>Save Client</Button>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Taxes Applicable */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Taxes Applicable</h3>
                        <div className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="gst" 
                              checked={clientForm.taxesApplicable.gst}
                              onCheckedChange={(checked) => 
                                setClientForm(prev => ({
                                  ...prev,
                                  taxesApplicable: { ...prev.taxesApplicable, gst: checked }
                                }))
                              }
                            />
                            <Label htmlFor="gst">GST</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="incomeTax" 
                              checked={clientForm.taxesApplicable.incomeTax}
                              onCheckedChange={(checked) => 
                                setClientForm(prev => ({
                                  ...prev,
                                  taxesApplicable: { ...prev.taxesApplicable, incomeTax: checked }
                                }))
                              }
                            />
                            <Label htmlFor="incomeTax">Income Tax</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="other" 
                              checked={clientForm.taxesApplicable.other}
                              onCheckedChange={(checked) => 
                                setClientForm(prev => ({
                                  ...prev,
                                  taxesApplicable: { ...prev.taxesApplicable, other: checked }
                                }))
                              }
                            />
                            <Label htmlFor="other">Other</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Other taxes like Professional Tax, Property Tax, etc.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      {/* Tabbed Interface */}
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
                              <Select onValueChange={(value) => setClientForm(prev => ({
                                ...prev,
                                basicDetails: { ...prev.basicDetails, clientType: value }
                              }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Ownership Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="individual">Individual</SelectItem>
                                  <SelectItem value="company">Company</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                  <SelectItem value="llp">LLP</SelectItem>
                                  <SelectItem value="proprietorship">Proprietorship</SelectItem>
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
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Other Users" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user1">User 1</SelectItem>
                                  <SelectItem value="user2">User 2</SelectItem>
                                </SelectContent>
                              </Select>
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
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Working User" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="worker1">Worker 1</SelectItem>
                                  <SelectItem value="worker2">Worker 2</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tags" className="flex items-center gap-2">
                                Tags
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Tags are used to group users based on some task required to be done. For example, if you have a tag called "Professional Tax" then all users with this tag will be shown when you filter users with "Professional Tax" tag. It will ease the process of creating task. No tag is required for pre-defined GST and Income Tax tasks. You can create new tags by clicking on "New Tag" button.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <div className="flex gap-2">
                                <Select>
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select Tags" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="tag1">Professional Tax</SelectItem>
                                    <SelectItem value="tag2">Property Tax</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-1" />
                                  New Tag
                                </Button>
                              </div>
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
                          {/* IT Login Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium">IT Login Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>PAN</Label>
                                <Input placeholder="PAN" />
                              </div>
                              <div className="space-y-2">
                                <Label>IT Portal Password</Label>
                                <div className="relative">
                                  <Input 
                                    type={showPassword.itPassword ? "text" : "password"}
                                    placeholder="IT Portal Password" 
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
                                <Input placeholder="TAN" />
                              </div>
                              <div className="space-y-2">
                                <Label>IT Portal Deductor Password</Label>
                                <div className="relative">
                                  <Input 
                                    type={showPassword.itDeductorPassword ? "text" : "password"}
                                    placeholder="IT Portal Deductor Password" 
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
                                <Input placeholder="Traces Username" />
                              </div>
                              <div className="space-y-2">
                                <Label>Traces Deductor Password</Label>
                                <div className="relative">
                                  <Input 
                                    type={showPassword.tracesDeductorPassword ? "text" : "password"}
                                    placeholder="Traces Deductor Password" 
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
                                <Input placeholder="MCA V2 Username" />
                              </div>
                              <div className="space-y-2">
                                <Label>MCA V2 Password</Label>
                                <div className="relative">
                                  <Input 
                                    type={showPassword.mcaV2Password ? "text" : "password"}
                                    placeholder="MCA V2 Password" 
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
                                <Input placeholder="MCA V3 Username" />
                              </div>
                              <div className="space-y-2">
                                <Label>MCA V3 Password</Label>
                                <div className="relative">
                                  <Input 
                                    type={showPassword.mcaV3Password ? "text" : "password"}
                                    placeholder="MCA V3 Password" 
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
                                <Input placeholder="DGFT Username" />
                              </div>
                              <div className="space-y-2">
                                <Label>DGFT Password</Label>
                                <div className="relative">
                                  <Input 
                                    type={showPassword.dgftPassword ? "text" : "password"}
                                    placeholder="DGFT Password" 
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
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Recent Admin Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Admin Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Database className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">System maintenance completed</p>
                      <p className="text-sm text-gray-600">Database optimization performed</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <UserPlus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">New staff member added</p>
                      <p className="text-sm text-gray-600">Staff access granted</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">6 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Security audit completed</p>
                      <p className="text-sm text-gray-600">All systems secure</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default AdminDashboard;
