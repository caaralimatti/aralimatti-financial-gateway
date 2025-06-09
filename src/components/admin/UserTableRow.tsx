
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserTableRowProps {
  user: User;
  onToggleStatus: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onToggleStatus,
  onDeleteUser,
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onToggleStatus(user.id)}
          >
            {user.status === 'Active' ? 
              <ToggleRight className="h-4 w-4 text-green-600" /> : 
              <ToggleLeft className="h-4 w-4 text-gray-400" />
            }
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDeleteUser(user.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
