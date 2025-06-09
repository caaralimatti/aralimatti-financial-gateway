
import React, { useState } from 'react';
import AddUserModal from './AddUserModal';
import UserManagementHeader from './UserManagementHeader';
import UserManagementFilters from './UserManagementFilters';
import UserManagementTable from './UserManagementTable';
import UserManagementPagination from './UserManagementPagination';

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Simulated user data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Staff', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Client', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Staff', status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Client', status: 'Active' },
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (userId: number) => {
    console.log('Toggle status for user:', userId);
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Delete user:', userId);
  };

  return (
    <div className="space-y-6">
      <UserManagementHeader onAddUser={() => setShowAddUserModal(true)} />
      
      <UserManagementFilters
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onRoleFilterChange={setRoleFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <UserManagementTable
        users={filteredUsers}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
      />

      <UserManagementPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredUsers.length}
        onPageChange={setCurrentPage}
      />

      <AddUserModal 
        open={showAddUserModal} 
        onOpenChange={setShowAddUserModal} 
      />
    </div>
  );
};

export default UserManagement;
