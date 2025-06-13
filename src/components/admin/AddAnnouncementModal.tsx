
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { CreateAnnouncementData } from '@/types/announcements';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { format } from 'date-fns';

interface AddAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAnnouncementModal: React.FC<AddAnnouncementModalProps> = ({ open, onOpenChange }) => {
  const { createAnnouncement, isCreating } = useAnnouncements();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateAnnouncementData>({
    defaultValues: {
      target_audience: 'all',
      priority: 'Normal',
      is_active: true,
      published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm")
    }
  });

  const onSubmit = (data: CreateAnnouncementData) => {
    createAnnouncement(data, {
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
          <DialogTitle>Create New Announcement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter announcement title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              {...register('content', { required: 'Content is required' })}
              placeholder="Enter announcement content"
              rows={4}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <Select 
                defaultValue="all"
                onValueChange={(value) => setValue('target_audience', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Portals</SelectItem>
                  <SelectItem value="staff_portal">Staff Portal Only</SelectItem>
                  <SelectItem value="client_portal">Client Portal Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                defaultValue="Normal"
                onValueChange={(value) => setValue('priority', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="published_at">Published Date *</Label>
              <Input
                id="published_at"
                type="datetime-local"
                {...register('published_at', { required: 'Published date is required' })}
              />
              {errors.published_at && (
                <p className="text-sm text-red-600">{errors.published_at.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                {...register('expires_at')}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Announcement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnnouncementModal;
