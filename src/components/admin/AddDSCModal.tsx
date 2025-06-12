
import React from 'react';
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

interface AddDSCModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddDSCModal: React.FC<AddDSCModalProps> = ({ open, onOpenChange }) => {
  const { createDSC, isCreating } = useDSCManagement();
  const { users } = useUserManagement();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateDSCData>();

  const onSubmit = (data: CreateDSCData) => {
    createDSC(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      }
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add DSC Certificate</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certificate_holder_profile_id">Certificate Holder *</Label>
              <Select onValueChange={(value) => setValue('certificate_holder_profile_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select certificate holder" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.certificate_holder_profile_id && (
                <p className="text-sm text-red-600">Certificate holder is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_person_id">Contact Person</Label>
              <Select onValueChange={(value) => setValue('contact_person_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact person" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(user => user.role === 'staff' || user.role === 'admin').map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number *</Label>
              <Input
                id="serial_number"
                {...register('serial_number', { required: 'Serial number is required' })}
                placeholder="Enter serial number"
              />
              {errors.serial_number && (
                <p className="text-sm text-red-600">{errors.serial_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuing_authority">Issuing Authority *</Label>
              <Input
                id="issuing_authority"
                {...register('issuing_authority', { required: 'Issuing authority is required' })}
                placeholder="Enter issuing authority"
              />
              {errors.issuing_authority && (
                <p className="text-sm text-red-600">{errors.issuing_authority.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from">Valid From *</Label>
              <Input
                id="valid_from"
                type="datetime-local"
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
                type="datetime-local"
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
                type="datetime-local"
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
                type="datetime-local"
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
