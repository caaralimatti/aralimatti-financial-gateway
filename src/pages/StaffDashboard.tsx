
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  FileText, 
  Users, 
  Calendar, 
  CheckSquare,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
  Bell,
  Settings,
  MessageCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffTaskDashboard from '@/components/staff/StaffTaskDashboard';

const StaffDashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const stats = [
    {
      title: 'Pending Tasks',
      value: '24',
      subtitle: '+2 from yesterday',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Upcoming Deadlines',
      value: '8',
      subtitle: 'Next 7 days',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Filed Returns This Month',
      value: '156',
      subtitle: '+12% from last month',
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Open Tickets',
      value: '5',
      subtitle: '2 high priority',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const quickAccessPortals = [
    { name: 'GST Portal', url: '#' },
    { name: 'Income Tax Portal', url: '#' },
    { name: 'MCA Portal', url: '#' }
  ];

  const recentMessages = [
    {
      id: 1,
      client: 'ABC Pvt Ltd',
      message: 'GST return filing query',
      time: '2 hours ago',
      priority: 'high',
      status: 'unread'
    },
    {
      id: 2,
      client: 'XYZ Corp',
      message: 'Tax audit documentation required',
      time: '4 hours ago',
      priority: 'medium',
      status: 'read'
    },
    {
      id: 3,
      client: 'DEF Industries',
      message: 'Annual compliance checklist',
      time: '1 day ago',
      priority: 'low',
      status: 'read'
    }
  ];

  const firmAnnouncements = [
    'New GST filing deadline extended to 25th of this month',
    'Staff meeting scheduled for Friday 3 PM - Conference Room A',
    'Updated audit checklist available in Documents section'
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <span className="font-semibold text-gray-900">C A Aralimatti & Co</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-blue-600">Announcements</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <span className="text-sm text-gray-600">1</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">Staff</span>
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
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              <Button 
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('dashboard')}
              >
                <CheckSquare className="h-4 w-4 mr-3" />
                Dashboard
              </Button>
              <Button 
                variant={activeTab === 'tasks' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('tasks')}
              >
                <FileText className="h-4 w-4 mr-3" />
                Tasks
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-3" />
                Compliance Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-3" />
                Documents
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="h-4 w-4 mr-3" />
                Manage
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-3" />
                Master
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-3" />
                Messages
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-3" />
                Reports
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Tax Portals</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <ExternalLink className="h-4 w-4 mr-3" />
                  GST Login
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <ExternalLink className="h-4 w-4 mr-3" />
                  Income Tax
                </Button>
              </div>
            </div>
          </nav>

          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, Staff!</h1>
                    <p className="text-gray-600">Here's what's happening with your clients today.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-medium">All systems operational</div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.subtitle}</p>
                          </div>
                          <div className={`p-3 rounded-full ${stat.bgColor}`}>
                            <IconComponent className={`h-6 w-6 ${stat.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Access */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Access</CardTitle>
                    <p className="text-sm text-gray-600">Direct links to important portals</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quickAccessPortals.map((portal, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <span className="font-medium">{portal.name}</span>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Messages */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Messages</CardTitle>
                      <p className="text-sm text-gray-600">Latest client communications</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentMessages.map((message) => (
                        <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{message.client}</h4>
                              <Badge className={getPriorityColor(message.priority)}>
                                {message.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{message.message}</p>
                            <p className="text-xs text-gray-500">{message.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Firm Announcements */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-500" />
                    Firm Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {firmAnnouncements.map((announcement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">{announcement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'tasks' && <StaffTaskDashboard />}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
