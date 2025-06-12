
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { UpdateAnnouncementData, Announcement } from '@/types/announcements';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { format } from 'date-fns';

interface EditAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
}

const EditAnnouncementModal: React.FC<EditAnnouncementModalProps> = ({ 
  open, 
  onOpenChange, 
  announcement 
}) => {
  const { updateAnnouncement, isUpdating } = useAnnouncements();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UpdateAnnouncementData>();

  useEffect(() => {
    if (announcement && open) {
      reset({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        target_audience: announcement.target_audience,
        priority: announcement.priority,
        is_active: announcement.is_active,
        published_at: format(new Date(announcement.published_at), "yyyy-MM-dd'T'HH:mm"),
        expires_at: announcement.expires_at ? format(new Date(announcement.expires_at), "yyyy-MM-dd'T'HH:mm") : ''
      });
    }
  }, [announcement, open, reset]);

  const onSubmit = (data: UpdateAnnouncementData) => {
    updateAnnouncement(data, {
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

  if (!announcement) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('id')} />
          
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
                value={watch('target_audience')}
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
                value={watch('priority')}
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
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Announcement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAnnouncementModal;
