
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  Edit3, 
  CheckCircle, 
  Search,
  Loader2,
  X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Client {
  id: string;
  name: string;
  fileNo: string;
  typeOfClient: string;
  email: string;
  workingUser: string;
  status: 'Active' | 'Inactive';
}

const ClientBulkEdit: React.FC = () => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldsToEdit, setFieldsToEdit] = useState<string[]>([]);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [isApplying, setIsApplying] = useState(false);
  const [editComplete, setEditComplete] = useState(false);

  // Simulated client data
  const clients: Client[] = [
    { id: '1', name: 'ABC Corporation', fileNo: 'FILE001', typeOfClient: 'Company', email: 'contact@abc.com', workingUser: 'John Doe', status: 'Active' },
    { id: '2', name: 'XYZ Limited', fileNo: 'FILE002', typeOfClient: 'Company', email: 'info@xyz.com', workingUser: 'Jane Smith', status: 'Active' },
    { id: '3', name: 'Global Enterprises', fileNo: 'FILE003', typeOfClient: 'LLP', email: 'hello@global.com', workingUser: 'Mike Johnson', status: 'Inactive' },
    { id: '4', name: 'Tech Solutions', fileNo: 'FILE004', typeOfClient: 'Partnership', email: 'support@tech.com', workingUser: 'Sarah Wilson', status: 'Active' },
    { id: '5', name: 'Marketing Pro', fileNo: 'FILE005', typeOfClient: 'Individual', email: 'team@marketing.com', workingUser: 'David Brown', status: 'Active' },
  ];

  const editableFields = [
    { id: 'type_of_client', label: 'Type of Client', type: 'select', options: ['Company', 'LLP', 'Partnership', 'Individual'] },
    { id: 'working_user', label: 'Working User', type: 'select', options: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'] },
    { id: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
    { id: 'tags', label: 'Tags', type: 'text' },
    { id: 'notes', label: 'Notes', type: 'textarea' }
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.fileNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(filteredClients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    }
  };

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    if (checked) {
      setFieldsToEdit([...fieldsToEdit, fieldId]);
    } else {
      setFieldsToEdit(fieldsToEdit.filter(id => id !== fieldId));
      const newEditValues = { ...editValues };
      delete newEditValues[fieldId];
      setEditValues(newEditValues);
    }
  };

  const handleValueChange = (fieldId: string, value: any) => {
    setEditValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleApplyChanges = () => {
    setIsApplying(true);
    
    // Simulate bulk edit process
    setTimeout(() => {
      setIsApplying(false);
      setEditComplete(true);
    }, 2000);
  };

  const resetForm = () => {
    setSelectedClients([]);
    setFieldsToEdit([]);
    setEditValues({});
    setEditComplete(false);
  };

  if (editComplete) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk Edit Complete</h2>
          <p className="text-gray-600">Client data has been successfully updated</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Bulk Edit Successful!</h3>
            <p className="text-gray-600 mb-6">
              Successfully updated {selectedClients.length} clients with the new field values.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={resetForm}>
                Edit More Clients
              </Button>
              <Button variant="outline">
                View Updated Clients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bulk Edit Clients</h2>
        <p className="text-gray-600">Select multiple clients and update their information in bulk</p>
      </div>

      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients by name, email, or file number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Count */}
          {selectedClients.length > 0 && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {selectedClients.length} client(s) selected for bulk editing
              </AlertDescription>
            </Alert>
          )}

          {/* Client List */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>File No</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Working User</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => handleSelectClient(client.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.fileNo}</TableCell>
                    <TableCell>{client.typeOfClient}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.workingUser}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Fields to Edit */}
      {selectedClients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Select Fields to Edit
            </CardTitle>
            <p className="text-sm text-gray-600">
              Choose which fields you want to update for the selected clients
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {editableFields.map((field) => (
                <div key={field.id} className="flex items-start space-x-3">
                  <Checkbox 
                    id={field.id}
                    checked={fieldsToEdit.includes(field.id)}
                    onCheckedChange={(checked) => handleFieldToggle(field.id, !!checked)}
                  />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    {fieldsToEdit.includes(field.id) && (
                      <div className="w-full max-w-sm">
                        {field.type === 'select' ? (
                          <Select 
                            value={editValues[field.id] || ''} 
                            onValueChange={(value) => handleValueChange(field.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === 'textarea' ? (
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={editValues[field.id] || ''}
                            onChange={(e) => handleValueChange(field.id, e.target.value)}
                            rows={3}
                          />
                        ) : (
                          <Input
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={editValues[field.id] || ''}
                            onChange={(e) => handleValueChange(field.id, e.target.value)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apply Changes */}
      {selectedClients.length > 0 && fieldsToEdit.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Review and Apply Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Summary:</h4>
                <p className="text-sm text-gray-600 mb-2">
                  You are about to update <strong>{selectedClients.length} client(s)</strong> with the following changes:
                </p>
                <ul className="text-sm space-y-1">
                  {fieldsToEdit.map((fieldId) => {
                    const field = editableFields.find(f => f.id === fieldId);
                    return (
                      <li key={fieldId} className="flex items-center gap-2">
                        <span className="font-medium">{field?.label}:</span>
                        <span className="bg-white px-2 py-1 rounded border">
                          {editValues[fieldId] || 'Not set'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleApplyChanges} 
                  disabled={isApplying}
                  className="flex items-center gap-2"
                >
                  {isApplying && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isApplying ? 'Applying Changes...' : 'Apply Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientBulkEdit;
