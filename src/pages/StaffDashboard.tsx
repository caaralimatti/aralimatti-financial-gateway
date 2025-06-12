import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
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
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Search,
  LogOut,
  ExternalLink,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calculator,
  ChevronRight,
  Eye,
  Upload,
  History
} from 'lucide-react';
import IncomeTaxApp from '@/components/client/IncomeTaxApp';
import FileITR from '@/components/client/FileITR';
import PastITRFilings from '@/components/client/PastITRFilings';
import NotificationDropdown from '@/components/staff/NotificationDropdown';

const StaffDashboard = () => {
  const { profile, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incomeTaxOpen, setIncomeTaxOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sidebarItems = [
    { title: 'Dashboard', icon: LayoutDashboard, id: 'dashboard', url: '/staff-dashboard' },
    { title: 'Tasks', icon: CheckSquare, id: 'tasks', url: '#' },
    { title: 'Compliance Calendar', icon: Calendar, id: 'calendar', url: '#' },
    { title: 'Documents', icon: FileText, id: 'documents', url: '#' },
    { title: 'Manage', icon: Users, id: 'manage', url: '#' },
    { title: 'Master', icon: Database, id: 'master', url: '#' },
    { title: 'Messages', icon: MessageSquare, id: 'messages', url: '#' },
    { title: 'Reports', icon: BarChart3, id: 'reports', url: '#' },
    { title: 'Support & Help', icon: HelpCircle, id: 'support', url: '#' },
    { title: 'Settings', icon: Settings, id: 'settings', url: '#' },
    { title: 'GST Login', icon: LogIn, id: 'gst-login', url: '/gst-login' },
  ];

  const incomeTaxSubItems = [
    { id: 'income-tax-quick', title: 'Quick Glance', icon: Eye },
    { id: 'file-itr-staff', title: 'File ITR', icon: Upload },
    { id: 'past-itr-staff', title: 'Past ITR Filings', icon: History },
  ];

  const statsCards = [
    {
      title: 'Pending Tasks',
      value: '24',
      description: '+2 from yesterday',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Upcoming Deadlines',
      value: '8',
      description: 'Next 7 days',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Filed Returns This Month',
      value: '156',
      description: '+12% from last month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Open Tickets',
      value: '5',
      description: '2 high priority',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const quickAccessLinks = [
    { name: 'GST Portal', url: '/gst-login', icon: ExternalLink },
    { name: 'Income Tax Portal', url: '#', icon: ExternalLink },
    { name: 'MCA Portal', url: '#', icon: ExternalLink }
  ];

  const recentMessages = [
    {
      id: 1,
      client: 'ABC Pvt Ltd',
      message: 'GST return filing query',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      client: 'XYZ Corp',
      message: 'Tax audit documentation required',
      time: '4 hours ago',
      priority: 'medium'
    },
    {
      id: 3,
      client: 'DEF Industries',
      message: 'Annual compliance checklist',
      time: '1 day ago',
      priority: 'low'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'income-tax-quick':
        return <IncomeTaxApp />;
      case 'file-itr-staff':
        return <FileITR />;
      case 'past-itr-staff':
        return <PastITRFilings />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.full_name || 'Staff Member'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your clients today.
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          All systems operational
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Access Links */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Access
            </CardTitle>
            <CardDescription>
              Direct links to important portals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickAccessLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between"
                asChild
              >
                {link.url === '#' ? (
                  <button className="flex items-center justify-between w-full">
                    <span>{link.name}</span>
                    <link.icon className="h-4 w-4" />
                  </button>
                ) : (
                  <Link to={link.url} className="flex items-center justify-between">
                    <span>{link.name}</span>
                    <link.icon className="h-4 w-4" />
                  </Link>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Messages
            </CardTitle>
            <CardDescription>
              Latest client communications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">{message.client}</p>
                    <Badge 
                      variant={message.priority === 'high' ? 'destructive' : message.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {message.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{message.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{message.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Announcements Banner */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            📢 Firm Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-blue-800 dark:text-blue-200">
              • New GST filing deadline extended to 25th of this month
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              • Staff meeting scheduled for Friday 3 PM - Conference Room A
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              • Updated audit checklist available in Documents section
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild
                          isActive={activeTab === item.id}
                          className="w-full justify-start"
                        >
                          {item.url === '#' ? (
                            <button 
                              className="flex items-center gap-3 px-3 py-2 w-full text-left"
                              onClick={() => setActiveTab(item.id)}
                            >
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
                    
                    {/* Income Tax with submenu */}
                    <SidebarMenuItem>
                      <Collapsible open={incomeTaxOpen} onOpenChange={setIncomeTaxOpen}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full justify-start">
                            <Calculator className="h-4 w-4" />
                            <span>Income Tax</span>
                            <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${incomeTaxOpen ? 'rotate-90' : ''}`} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {incomeTaxSubItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.id}>
                                <SidebarMenuSubButton
                                  isActive={activeTab === subItem.id}
                                  onClick={() => setActiveTab(subItem.id)}
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
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
                  {/* Announcements Banner Toggle */}
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    📢 Announcements
                  </Button>

                  {/* Dark Mode Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? '☀️' : '🌙'}
                  </Button>

                  {/* Notifications with Last Login */}
                  <NotificationDropdown />

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

            {/* Dashboard Content */}
            <main className="p-6 space-y-6">
              {renderContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StaffDashboard;
