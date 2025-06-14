
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useClientCustomFields } from '@/hooks/useClientCustomFields';
import type { CustomField } from '@/types/clientForm';

interface CustomFieldsTabProps {
  clientForm: any;
  setClientForm: (form: any) => void;
  clientId?: string;
}

const CustomFieldsTab = ({ clientForm, setClientForm, clientId }: CustomFieldsTabProps) => {
  const [showBlankFields, setShowBlankFields] = useState(true);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [newField, setNewField] = useState<CustomField>({
    field_name: '',
    field_value: '',
    field_type: 'text'
  });

  const { customFields, createCustomField, updateCustomField, deleteCustomField, isCreating, isUpdating, isDeleting } = useClientCustomFields(clientId);

  // Use custom fields from form state when no clientId (new client), otherwise use from database
  const displayFields = clientId ? customFields : clientForm.customFields || [];
  const filteredFields = showBlankFields ? displayFields : displayFields.filter((field: CustomField) => field.field_value?.trim());

  const handleAddField = async () => {
    if (!newField.field_name.trim()) return;

    if (clientId) {
      try {
        await createCustomField({ clientId, customField: newField });
        setNewField({ field_name: '', field_value: '', field_type: 'text' });
        setIsAddingField(false);
      } catch (error) {
        console.error('Error adding custom field:', error);
      }
    } else {
      // For new clients, add to form state
      const updatedFields = [...(clientForm.customFields || []), { ...newField, id: Date.now().toString() }];
      setClientForm(prev => ({
        ...prev,
        customFields: updatedFields
      }));
      setNewField({ field_name: '', field_value: '', field_type: 'text' });
      setIsAddingField(false);
    }
  };

  const handleEditField = async (field: CustomField) => {
    if (!editingField || !editingField.field_name.trim()) return;

    if (clientId && field.id) {
      try {
        await updateCustomField({ id: field.id, customField: editingField });
        setEditingField(null);
      } catch (error) {
        console.error('Error updating custom field:', error);
      }
    } else {
      // For new clients, update form state
      const updatedFields = (clientForm.customFields || []).map((f: CustomField) => 
        f.id === field.id ? { ...editingField, id: field.id } : f
      );
      setClientForm(prev => ({
        ...prev,
        customFields: updatedFields
      }));
      setEditingField(null);
    }
  };

  const handleDeleteField = async (field: CustomField) => {
    if (clientId && field.id) {
      try {
        await deleteCustomField(field.id);
      } catch (error) {
        console.error('Error deleting custom field:', error);
      }
    } else {
      // For new clients, remove from form state
      const updatedFields = (clientForm.customFields || []).filter((f: CustomField) => f.id !== field.id);
      setClientForm(prev => ({
        ...prev,
        customFields: updatedFields
      }));
    }
  };

  const renderFieldValue = (field: CustomField) => {
    if (editingField && editingField.id === field.id) {
      return (
        <div className="flex gap-2">
          {editingField.field_type === 'boolean' ? (
            <Select 
              value={editingField.field_value} 
              onValueChange={(value) => setEditingField({ ...editingField, field_value: value })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={editingField.field_type === 'number' ? 'number' : editingField.field_type === 'date' ? 'date' : 'text'}
              value={editingField.field_value}
              onChange={(e) => setEditingField({ ...editingField, field_value: e.target.value })}
              className="w-32"
            />
          )}
          <Button size="sm" onClick={() => handleEditField(field)} disabled={isUpdating}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
            Cancel
          </Button>
        </div>
      );
    }

    if (field.field_type === 'boolean') {
      return field.field_value === 'true' ? 'Yes' : 'No';
    }
    return field.field_value || '-';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => setShowBlankFields(!showBlankFields)}
          className="flex items-center gap-1"
        >
          {showBlankFields ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showBlankFields ? 'Hide' : 'Show'} Blank Fields
        </Button>
        <Button variant="outline" onClick={() => setIsAddingField(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Custom Field
        </Button>
      </div>

      {isAddingField && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add New Custom Field</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Field Name</Label>
              <Input
                placeholder="Field Name"
                value={newField.field_name}
                onChange={(e) => setNewField({ ...newField, field_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Field Type</Label>
              <Select 
                value={newField.field_type} 
                onValueChange={(value: 'text' | 'number' | 'date' | 'boolean') => 
                  setNewField({ ...newField, field_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Field Value</Label>
              {newField.field_type === 'boolean' ? (
                <Select 
                  value={newField.field_value} 
                  onValueChange={(value) => setNewField({ ...newField, field_value: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={newField.field_type === 'number' ? 'number' : newField.field_type === 'date' ? 'date' : 'text'}
                  placeholder="Field Value"
                  value={newField.field_value}
                  onChange={(e) => setNewField({ ...newField, field_value: e.target.value })}
                />
              )}
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleAddField} disabled={isCreating || !newField.field_name.trim()}>
                Add
              </Button>
              <Button variant="outline" onClick={() => setIsAddingField(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FIELD NAME</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>VALUE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No custom fields added yet.
                </TableCell>
              </TableRow>
            ) : (
              filteredFields.map((field: CustomField) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.field_name}</TableCell>
                  <TableCell className="capitalize">{field.field_type}</TableCell>
                  <TableCell>{renderFieldValue(field)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingField(field)}
                        disabled={editingField?.id === field.id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteField(field)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomFieldsTab;
