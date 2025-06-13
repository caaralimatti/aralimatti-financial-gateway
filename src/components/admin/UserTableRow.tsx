
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { 
  Edit, 
  Trash2
} from 'lucide-react';
import { UserProfile } from '@/types/userManagement';
import { useUserManagement } from '@/hooks/useUserManagement';

interface UserTableRowProps {
  user: UserProfile;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  const { toggleUserStatus, isToggling } = useUserManagement();

  const handleToggleStatus = async (checked: boolean) => {
    try {
      await toggleUserStatus({
        userId: user.id,
        isActive: checked,
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'staff':
        return 'secondary';
      case 'client':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatLastLogin = (lastLogin: string | undefined) => {
    if (!lastLogin) {
      return <span className="text-gray-400">Never</span>;
    }
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return <span className="text-green-600">Just now</span>;
    } else if (diffInHours < 24) {
      return <span className="text-green-600">{diffInHours}h ago</span>;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return <span className="text-yellow-600">{days}d ago</span>;
    } else {
      return <span className="text-gray-600">{date.toLocaleDateString()}</span>;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {user.full_name || 'No name provided'}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {formatRole(user.role)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.is_active ? 'default' : 'secondary'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell>
        {formatLastLogin(user.last_login_at)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end items-center gap-2">
          <Switch
            checked={user.is_active}
            onCheckedChange={handleToggleStatus}
            disabled={isToggling}
            className="data-[state=checked]:bg-green-600"
          />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(user)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(user)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
