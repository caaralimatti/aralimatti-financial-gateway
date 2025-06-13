
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { UpdateDSCData, DSCCertificate } from '@/types/dsc';
import { useDSCManagement } from '@/hooks/useDSCManagement';
import { useUserManagement } from '@/hooks/useUserManagement';
import { format } from 'date-fns';

interface EditDSCModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dsc: DSCCertificate | null;
}

const EditDSCModal: React.FC<EditDSCModalProps> = ({ open, onOpenChange, dsc }) => {
  const { updateDSC, isUpdating } = useDSCManagement();
  const { users } = useUserManagement();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<UpdateDSCData>();

  useEffect(() => {
    if (dsc && open) {
      reset({
        id: dsc.id,
        certificate_holder_profile_id: dsc.certificate_holder_profile_id,
        serial_number: dsc.serial_number,
        issuing_authority: dsc.issuing_authority,
        valid_from: format(new Date(dsc.valid_from), "yyyy-MM-dd'T'HH:mm"),
        valid_until: format(new Date(dsc.valid_until), "yyyy-MM-dd'T'HH:mm"),
        storage_location: dsc.storage_location || '',
        pin: dsc.pin || '',
        contact_person_phone: dsc.contact_person_phone || '',
        contact_person_name: dsc.contact_person_name || '',
        status: dsc.status,
        received_date: format(new Date(dsc.received_date), "yyyy-MM-dd'T'HH:mm"),
        given_date: dsc.given_date ? format(new Date(dsc.given_date), "yyyy-MM-dd'T'HH:mm") : '',
        remarks: dsc.remarks || ''
      });
    }
  }, [dsc, open, reset]);

  const onSubmit = (data: UpdateDSCData) => {
    updateDSC(data, {
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

  if (!dsc) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit DSC Certificate</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('id')} />
          
          <div className="space-y-2">
            <Label htmlFor="certificate_holder_profile_id">Certificate Holder *</Label>
            <Select 
              value={dsc.certificate_holder_profile_id}
              onValueChange={(value) => setValue('certificate_holder_profile_id', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person_name">Contact Person Name</Label>
              <Input
                id="contact_person_name"
                {...register('contact_person_name')}
                placeholder="Enter contact person name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_person_phone">Contact Person Phone</Label>
              <Input
                id="contact_person_phone"
                {...register('contact_person_phone')}
                placeholder="Enter contact phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                {...register('serial_number')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuing_authority">Issuing Authority</Label>
              <Input
                id="issuing_authority"
                {...register('issuing_authority')}
              />
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
              <Select 
                value={dsc.status}
                onValueChange={(value) => setValue('status', value as any)}
              >
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              {...register('pin')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...register('remarks')}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update DSC Certificate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDSCModal;
