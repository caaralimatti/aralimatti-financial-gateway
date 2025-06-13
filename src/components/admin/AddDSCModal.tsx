
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { CreateDSCData } from '@/types/dsc';
import { useDSCManagement } from '@/hooks/useDSCManagement';
import { useUserManagement } from '@/hooks/useUserManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddDSCModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddDSCModal: React.FC<AddDSCModalProps> = ({ open, onOpenChange }) => {
  const { createDSC, isCreating } = useDSCManagement();
  const { users } = useUserManagement();
  const [newClientName, setNewClientName] = useState('');
  const [useNewClient, setUseNewClient] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateDSCData>();

  const selectedClientId = watch('certificate_holder_profile_id');
  const clientUsers = users.filter(user => user.role === 'client');

  const createNewClient = async (name: string) => {
    try {
      console.log('Creating new client with name:', name);
      
      // Create a temporary email for the new client
      const tempEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@temp.client`;
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: tempEmail,
        password: 'TempPassword123!',
        user_metadata: {
          full_name: name,
          role: 'client'
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        throw authError;
      }

      console.log('Auth user created:', authData.user);

      // The profile should be created automatically by the trigger
      // Wait a moment and then fetch the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching created profile:', profileError);
        throw profileError;
      }

      console.log('Profile created:', profile);
      return profile.id;
    } catch (error) {
      console.error('Error creating new client:', error);
      toast.error('Failed to create new client');
      throw error;
    }
  };

  const onSubmit = async (data: CreateDSCData) => {
    try {
      let clientId = data.certificate_holder_profile_id;

      // If using new client, create the client first
      if (useNewClient && newClientName.trim()) {
        clientId = await createNewClient(newClientName.trim());
      }

      // Convert date strings to ISO format for database
      const formattedData = {
        ...data,
        certificate_holder_profile_id: clientId,
        valid_from: new Date(data.valid_from).toISOString(),
        valid_until: new Date(data.valid_until).toISOString(),
        received_date: new Date(data.received_date).toISOString(),
        given_date: data.given_date ? new Date(data.given_date).toISOString() : undefined
      };

      console.log('Submitting DSC data:', formattedData);

      createDSC(formattedData, {
        onSuccess: () => {
          reset();
          setNewClientName('');
          setUseNewClient(false);
          onOpenChange(false);
        }
      });
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleClose = () => {
    reset();
    setNewClientName('');
    setUseNewClient(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add DSC Certificate</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Certificate Holder *</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="existing-client"
                  checked={!useNewClient}
                  onChange={() => setUseNewClient(false)}
                />
                <Label htmlFor="existing-client">Select Existing Client</Label>
              </div>
              {!useNewClient && (
                <Select onValueChange={(value) => setValue('certificate_holder_profile_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select certificate holder" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="new-client"
                  checked={useNewClient}
                  onChange={() => setUseNewClient(true)}
                />
                <Label htmlFor="new-client">Create New Client</Label>
              </div>
              {useNewClient && (
                <Input
                  placeholder="Enter new client name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person_phone">Contact Person Phone</Label>
            <Input
              id="contact_person_phone"
              {...register('contact_person_phone')}
              placeholder="Enter contact phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person_name">Contact Person Name</Label>
            <Input
              id="contact_person_name"
              {...register('contact_person_name')}
              placeholder="Enter contact person name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                {...register('serial_number')}
                placeholder="Enter serial number (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuing_authority">Issuing Authority</Label>
              <Input
                id="issuing_authority"
                {...register('issuing_authority')}
                placeholder="Enter issuing authority (optional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from">Valid From *</Label>
              <Input
                id="valid_from"
                type="date"
                {...register('valid_from', { required: 'Valid from date is required' })}
              />
              {errors.valid_from && (
                <p className="text-sm text-red-600">{errors.valid_from.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_until">Valid Until *</Label>
              <Input
                id="valid_until"
                type="date"
                {...register('valid_until', { required: 'Valid until date is required' })}
              />
              {errors.valid_until && (
                <p className="text-sm text-red-600">{errors.valid_until.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="received_date">Received Date *</Label>
              <Input
                id="received_date"
                type="date"
                {...register('received_date', { required: 'Received date is required' })}
              />
              {errors.received_date && (
                <p className="text-sm text-red-600">{errors.received_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="given_date">Given Date</Label>
              <Input
                id="given_date"
                type="date"
                {...register('given_date')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="Active">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expiring">Expiring</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Revoked">Revoked</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage_location">Storage Location</Label>
              <Input
                id="storage_location"
                {...register('storage_location')}
                placeholder="Enter storage location"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              {...register('pin')}
              placeholder="Enter DSC PIN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...register('remarks')}
              placeholder="Enter any remarks"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create DSC Certificate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDSCModal;
