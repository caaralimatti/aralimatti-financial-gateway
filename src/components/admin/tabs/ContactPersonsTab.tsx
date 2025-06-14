
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Plus, Edit, Trash2 } from 'lucide-react';
import { useClientContactPersons } from '@/hooks/useClientContactPersons';
import type { ContactPerson } from '@/types/clientForm';

interface ContactPersonsTabProps {
  clientForm: any;
  setClientForm: (form: any) => void;
  clientId?: string;
}

const ContactPersonsTab = ({ clientForm, setClientForm, clientId }: ContactPersonsTabProps) => {
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [editingPerson, setEditingPerson] = useState<ContactPerson | null>(null);
  const [newPerson, setNewPerson] = useState<ContactPerson>({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    is_primary: false
  });

  const { contactPersons, createContactPerson, updateContactPerson, deleteContactPerson, isCreating, isUpdating, isDeleting } = useClientContactPersons(clientId);

  // Use contact persons from form state when no clientId (new client), otherwise use from database
  const displayPersons = clientId ? contactPersons : clientForm.contactPersons || [];

  const handleAddPerson = async () => {
    if (!newPerson.name.trim() || !newPerson.email.trim()) return;

    if (clientId) {
      try {
        await createContactPerson({ clientId, contactPerson: newPerson });
        setNewPerson({ name: '', email: '', mobile: '', designation: '', is_primary: false });
        setIsAddingPerson(false);
      } catch (error) {
        console.error('Error adding contact person:', error);
      }
    } else {
      // For new clients, add to form state
      const updatedPersons = [...(clientForm.contactPersons || []), { ...newPerson, id: Date.now().toString() }];
      setClientForm(prev => ({
        ...prev,
        contactPersons: updatedPersons
      }));
      setNewPerson({ name: '', email: '', mobile: '', designation: '', is_primary: false });
      setIsAddingPerson(false);
    }
  };

  const handleEditPerson = async (person: ContactPerson) => {
    if (!editingPerson || !editingPerson.name.trim() || !editingPerson.email.trim()) return;

    if (clientId && person.id) {
      try {
        await updateContactPerson({ id: person.id, contactPerson: editingPerson });
        setEditingPerson(null);
      } catch (error) {
        console.error('Error updating contact person:', error);
      }
    } else {
      // For new clients, update form state
      const updatedPersons = (clientForm.contactPersons || []).map((p: ContactPerson) => 
        p.id === person.id ? { ...editingPerson, id: person.id } : p
      );
      setClientForm(prev => ({
        ...prev,
        contactPersons: updatedPersons
      }));
      setEditingPerson(null);
    }
  };

  const handleDeletePerson = async (person: ContactPerson) => {
    if (clientId && person.id) {
      try {
        await deleteContactPerson(person.id);
      } catch (error) {
        console.error('Error deleting contact person:', error);
      }
    } else {
      // For new clients, remove from form state
      const updatedPersons = (clientForm.contactPersons || []).filter((p: ContactPerson) => p.id !== person.id);
      setClientForm(prev => ({
        ...prev,
        contactPersons: updatedPersons
      }));
    }
  };

  const designations = ['Manager', 'Director', 'Owner', 'Partner', 'Proprietor', 'CEO', 'CFO', 'Accountant', 'Other'];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setIsAddingPerson(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Contact Person
        </Button>
      </div>

      {isAddingPerson && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add New Contact Person</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Full Name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                placeholder="Email Address"
                value={newPerson.email}
                onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Mobile</Label>
              <Input
                placeholder="Mobile Number"
                value={newPerson.mobile}
                onChange={(e) => setNewPerson({ ...newPerson, mobile: e.target.value })}
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                Designation
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the designation of the contact person</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select 
                value={newPerson.designation} 
                onValueChange={(value) => setNewPerson({ ...newPerson, designation: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map(designation => (
                    <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPrimary" 
              checked={newPerson.is_primary}
              onCheckedChange={(checked) => setNewPerson({ ...newPerson, is_primary: !!checked })}
            />
            <Label htmlFor="isPrimary">Select as Primary Contact</Label>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleAddPerson} 
              disabled={isCreating || !newPerson.name.trim() || !newPerson.email.trim()}
            >
              Add Contact Person
            </Button>
            <Button variant="outline" onClick={() => setIsAddingPerson(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>MOBILE</TableHead>
              <TableHead>DESIGNATION</TableHead>
              <TableHead>IS PRIMARY</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayPersons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No Contact Person Added
                </TableCell>
              </TableRow>
            ) : (
              displayPersons.map((person: ContactPerson) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">
                    {editingPerson && editingPerson.id === person.id ? (
                      <Input
                        value={editingPerson.name}
                        onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                        className="w-32"
                      />
                    ) : (
                      person.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPerson && editingPerson.id === person.id ? (
                      <Input
                        type="email"
                        value={editingPerson.email}
                        onChange={(e) => setEditingPerson({ ...editingPerson, email: e.target.value })}
                        className="w-40"
                      />
                    ) : (
                      person.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPerson && editingPerson.id === person.id ? (
                      <Input
                        value={editingPerson.mobile}
                        onChange={(e) => setEditingPerson({ ...editingPerson, mobile: e.target.value })}
                        className="w-32"
                      />
                    ) : (
                      person.mobile || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPerson && editingPerson.id === person.id ? (
                      <Select 
                        value={editingPerson.designation} 
                        onValueChange={(value) => setEditingPerson({ ...editingPerson, designation: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {designations.map(designation => (
                            <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      person.designation || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPerson && editingPerson.id === person.id ? (
                      <Checkbox
                        checked={editingPerson.is_primary}
                        onCheckedChange={(checked) => setEditingPerson({ ...editingPerson, is_primary: !!checked })}
                      />
                    ) : (
                      person.is_primary ? 'Yes' : 'No'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingPerson && editingPerson.id === person.id ? (
                        <>
                          <Button size="sm" onClick={() => handleEditPerson(person)} disabled={isUpdating}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingPerson(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPerson(person)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePerson(person)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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

export default ContactPersonsTab;
