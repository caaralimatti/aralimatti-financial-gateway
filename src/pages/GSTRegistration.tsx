import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Save, FileText, Calendar, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GSTSidebar from '@/components/gst/GSTSidebar';
import GSTHeader from '@/components/gst/GSTHeader';
import GSTOnboardingChecklist from '@/components/gst/GSTOnboardingChecklist';

const GSTRegistration = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    gstin: '',
    pan: '',
    address: '',
    contactPerson: '',
    mobile: '',
    email: '',
    registrationType: '',
    returnFrequency: ''
  });

  // Mock data for existing clients
  const existingClients = [
    {
      id: 1,
      businessName: 'ABC Pvt Ltd',
      gstin: '29ABCDE1234F1Z5',
      registrationDate: '2024-01-15',
      status: 'Active'
    },
    {
      id: 2,
      businessName: 'XYZ Corp',
      gstin: '27XYZAB5678G2W4',
      registrationDate: '2024-02-20',
      status: 'Active'
    },
    {
      id: 3,
      businessName: 'DEF Industries',
      gstin: '19DEFGH9012H3X6',
      registrationDate: '2024-03-10',
      status: 'Pending'
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "GST client registered successfully!",
      });

      // Reset form
      setFormData({
        businessName: '',
        gstin: '',
        pan: '',
        address: '',
        contactPerson: '',
        mobile: '',
        email: '',
        registrationType: '',
        returnFrequency: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register GST client. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          <GSTSidebar />

          <SidebarInset className="flex-1">
            <GSTHeader
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              profile={profile}
              onLogout={handleLogout}
            />

            <main className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    GST Client Registration
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Register new GST clients and manage existing registrations
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Registration Portal
                </Badge>
              </div>

              <Tabs defaultValue="onboarding" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="onboarding" className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Onboarding Checklist
                  </TabsTrigger>
                  <TabsTrigger value="registration" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register Client
                  </TabsTrigger>
                  <TabsTrigger value="existing" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Existing Clients
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="onboarding" className="space-y-6">
                  <GSTOnboardingChecklist />
                </TabsContent>

                <TabsContent value="registration" className="space-y-6">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Registration Form */}
                    <div className="xl:col-span-2">
                      <Card className="border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            New GST Client Registration
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name *</Label>
                                <Input
                                  id="businessName"
                                  value={formData.businessName}
                                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                                  placeholder="Enter business name"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gstin">GSTIN *</Label>
                                <Input
                                  id="gstin"
                                  value={formData.gstin}
                                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                                  placeholder="22AAAAA0000A1Z5"
                                  maxLength={15}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="pan">PAN *</Label>
                                <Input
                                  id="pan"
                                  value={formData.pan}
                                  onChange={(e) => handleInputChange('pan', e.target.value)}
                                  placeholder="AAAAA0000A"
                                  maxLength={10}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="contactPerson">Contact Person *</Label>
                                <Input
                                  id="contactPerson"
                                  value={formData.contactPerson}
                                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                  placeholder="Enter contact person name"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile *</Label>
                                <Input
                                  id="mobile"
                                  type="tel"
                                  value={formData.mobile}
                                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                                  placeholder="Enter mobile number"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange('email', e.target.value)}
                                  placeholder="Enter email address"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="registrationType">Registration Type *</Label>
                                <Select value={formData.registrationType} onValueChange={(value) => handleInputChange('registrationType', value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select registration type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Regular">Regular</SelectItem>
                                    <SelectItem value="Composition">Composition</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="returnFrequency">Return Frequency *</Label>
                                <Select value={formData.returnFrequency} onValueChange={(value) => handleInputChange('returnFrequency', value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select return frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="address">Address *</Label>
                              <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Enter complete business address"
                                rows={3}
                                required
                              />
                            </div>

                            <Button
                              type="submit"
                              disabled={loading}
                              className="w-full"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {loading ? 'Registering...' : 'Register GST Client'}
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-4">
                      <Card className="border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Registration Stats
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Clients</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">245</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                            <span className="text-lg font-bold text-green-600">238</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                            <span className="text-lg font-bold text-yellow-600">7</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                            <span className="text-lg font-bold text-blue-600">12</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="existing" className="space-y-6">
                  {/* Existing Clients Table */}
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Registered GST Clients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Business Name</TableHead>
                            <TableHead>GSTIN</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {existingClients.map((client) => (
                            <TableRow key={client.id}>
                              <TableCell className="font-medium">{client.businessName}</TableCell>
                              <TableCell>{client.gstin}</TableCell>
                              <TableCell>{new Date(client.registrationDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={client.status === 'Active' ? 'default' : 'secondary'}
                                  className={client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                >
                                  {client.status === 'Active' ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {client.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default GSTRegistration;
