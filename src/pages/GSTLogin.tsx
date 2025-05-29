
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FileText, 
  Users, 
  Database, 
  MessageSquare, 
  BarChart3, 
  HelpCircle, 
  Settings, 
  LogIn,
  Bell,
  Search,
  LogOut,
  ExternalLink,
  Loader2,
  Building2,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

interface GSTClient {
  id: string;
  client_name: string;
  gstin: string;
  email: string;
  mobile: string;
  registration_type: string;
  return_frequency: string;
}

const GSTLogin = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [clients, setClients] = useState<GSTClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<GSTClient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredClients, setFilteredClients] = useState<GSTClient[]>([]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sidebarItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/staff-dashboard', active: false },
    { title: 'Tasks', icon: CheckSquare, url: '#' },
    { title: 'Compliance Calendar', icon: Calendar, url: '#' },
    { title: 'Documents', icon: FileText, url: '#' },
    { title: 'Manage', icon: Users, url: '#' },
    { title: 'Master', icon: Database, url: '#' },
    { title: 'Messages', icon: MessageSquare, url: '#' },
    { title: 'Reports', icon: BarChart3, url: '#' },
    { title: 'Support & Help', icon: HelpCircle, url: '#' },
    { title: 'Settings', icon: Settings, url: '#' },
    { title: 'GST Login', icon: LogIn, url: '/gst-login', active: true },
    { title: 'Income Tax Login', icon: LogIn, url: '#' },
  ];

  // Fetch GST clients from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('gst_clients')
          .select('id, client_name, gstin, email, mobile, registration_type, return_frequency')
          .order('client_name');

        if (error) {
          console.error('Error fetching GST clients:', error);
          toast({
            title: "Error",
            description: "Failed to load GST clients. Please try again.",
            variant: "destructive"
          });
          return;
        }

        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        console.error('Error in fetchClients:', error);
        toast({
          title: "Error",
          description: "Failed to load GST clients. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  // Filter clients based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    setSearchTerm('');
  };

  const handleGSTPortalLogin = () => {
    if (selectedClient) {
      window.open('https://services.gst.gov.in/services/login', '_blank');
      toast({
        title: "GST Portal Opened",
        description: `GST Portal opened for ${selectedClient.client_name}`,
      });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <Sidebar className="border-r border-gray-200 dark:border-gray-700">
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CA</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">C A Aralimatti & Co</span>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="px-2">
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={item.active}
                      className="w-full justify-start"
                    >
                      {item.url === '#' ? (
                        <button className="flex items-center gap-3 px-3 py-2 w-full text-left">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </button>
                      ) : (
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <SidebarInset className="flex-1">
            {/* Top Navbar */}
            <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search clients, documents, tasks..."
                      className="w-80 bg-gray-50 dark:bg-gray-700 border-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Dark Mode Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? '☀️' : '🌙'}
                  </Button>

                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                  </Button>

                  {/* User Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-medium">{profile?.full_name || 'Staff User'}</p>
                          <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            {/* GST Login Content */}
            <main className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    GST Portal Login
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a client to access their GST portal
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <LogIn className="h-3 w-3 mr-1" />
                  GST Portal Access
                </Badge>
              </div>

              {/* Client Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Client Search & Selection */}
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Select GST Client
                    </CardTitle>
                    <CardDescription>
                      Search and select a client to access their GST portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading clients...</span>
                      </div>
                    ) : (
                      <>
                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search by name, GSTIN, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        {/* Client Dropdown */}
                        <Select onValueChange={handleClientSelect}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a client" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredClients.length === 0 ? (
                              <SelectItem value="no-clients" disabled>
                                {searchTerm ? 'No clients found' : 'No clients available'}
                              </SelectItem>
                            ) : (
                              filteredClients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-blue-600">
                                        {client.client_name.charAt(0)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">{client.client_name}</span>
                                      <span className="text-xs text-gray-500 ml-2">({client.gstin})</span>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Selected Client Details */}
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Client Details
                    </CardTitle>
                    <CardDescription>
                      Review client information before accessing GST portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedClient ? (
                      <div className="space-y-4">
                        {/* Client Avatar & Name */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">
                              {selectedClient.client_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {selectedClient.client_name}
                            </h3>
                            <Badge variant="secondary" className="mt-1">
                              GSTIN: {selectedClient.gstin}
                            </Badge>
                          </div>
                        </div>

                        {/* Client Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {selectedClient.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">Mobile:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {selectedClient.mobile}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">Registration Type:</span>
                            <Badge variant={selectedClient.registration_type === 'Regular' ? 'default' : 'secondary'}>
                              {selectedClient.registration_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">Return Frequency:</span>
                            <Badge variant={selectedClient.return_frequency === 'Monthly' ? 'default' : 'outline'}>
                              {selectedClient.return_frequency}
                            </Badge>
                          </div>
                        </div>

                        {/* GST Portal Login Button */}
                        <Button 
                          onClick={handleGSTPortalLogin}
                          className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                          size="lg"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Login to GST Portal
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Select a client to view their details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    GST Portal Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Clients</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pending Returns</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Filed This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default GSTLogin;
