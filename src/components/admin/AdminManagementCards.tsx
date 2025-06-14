
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, CheckSquare, BarChart3, Plus, List } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';

interface AdminManagementCardsProps {
  setActiveTab: (tab: string) => void;
  showAddClientModal: boolean;
  setShowAddClientModal: (show: boolean) => void;
}

const AdminManagementCards: React.FC<AdminManagementCardsProps> = ({
  setActiveTab,
  showAddClientModal,
  setShowAddClientModal
}) => {
  const { profile } = useAuth();
  const { data: permissions = {} } = useCurrentUserPermissions();

  const isSuperAdmin = profile?.role === 'super_admin';
  const isAdmin = profile?.role === 'admin';

  // Helper function to check if a module is enabled
  const isModuleEnabled = (moduleName: string): boolean => {
    if (isSuperAdmin) return true;
    if (!isAdmin) return false;
    return permissions[moduleName] !== false;
  };

  const managementCards = [
    {
      title: 'User Management',
      description: 'Manage staff, clients, and admin accounts',
      icon: Users,
      action: () => setActiveTab('users'),
      buttonText: 'Manage Users',
      module: 'user_management'
    },
    {
      title: 'Client Management',
      description: 'Add, edit, and organize client information',
      icon: FileText,
      action: () => setActiveTab('clients'),
      buttonText: 'Manage Clients',
      module: 'client_management_parent'
    },
    {
      title: 'Task Management',
      description: 'Create and track tasks across the organization',
      icon: CheckSquare,
      action: () => setActiveTab('tasks'),
      buttonText: 'View Tasks',
      module: 'task_management_parent'
    },
    {
      title: 'Analytics',
      description: 'View performance metrics and insights',
      icon: BarChart3,
      action: () => setActiveTab('analytics'),
      buttonText: 'View Analytics',
      module: 'analytics'
    }
  ];

  // Filter cards based on permissions
  const visibleCards = managementCards.filter(card => isModuleEnabled(card.module));

  if (visibleCards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {visibleCards.map((card, index) => (
        <Card key={index} className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <card.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">{card.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {card.description}
            </p>
            <Button 
              onClick={card.action}
              className="w-full"
              variant="outline"
            >
              {card.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
      
      {/* Quick Actions */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isModuleEnabled('client_management_add') && (
            <Button 
              onClick={() => setShowAddClientModal(true)}
              className="w-full justify-start"
              variant="ghost"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          )}
          <Button 
            onClick={() => setActiveTab('task-overview')}
            className="w-full justify-start"
            variant="ghost"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Create Task
          </Button>
          {isModuleEnabled('user_management') && (
            <Button 
              onClick={() => setActiveTab('users')}
              className="w-full justify-start"
              variant="ghost"
            >
              <List className="h-4 w-4 mr-2" />
              View All Users
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagementCards;
