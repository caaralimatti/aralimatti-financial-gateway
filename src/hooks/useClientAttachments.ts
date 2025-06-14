
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { ClientAttachment } from '@/types/clientForm';
import { validateFileType, validateFileSize } from '@/utils/clientFormUtils';

export const useClientAttachments = (clientId?: string) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['client-attachments', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('client_attachments')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId
  });

  const uploadAttachmentMutation = useMutation({
    mutationFn: async ({ clientId, file, description }: { clientId: string; file: File; description?: string }) => {
      // Validate file
      if (!validateFileType(file)) {
        throw new Error('Invalid file type. Only PDF, DOCX, XLSX, JPG, and PNG files are allowed.');
      }
      
      if (!validateFileSize(file)) {
        throw new Error('File size too large. Maximum size is 10MB.');
      }

      // Upload to storage
      const fileName = `${clientId}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('client-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('client-attachments')
        .getPublicUrl(fileName);

      // Insert record to database
      const { data, error } = await supabase
        .from('client_attachments')
        .insert({
          client_id: clientId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: file.type,
          description: description || null,
          uploaded_by: profile?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-attachments', clientId] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      console.error('Error uploading attachment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    }
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: async (attachment: ClientAttachment) => {
      // Delete from storage
      const fileName = attachment.file_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('client-attachments')
          .remove([fileName]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('client_attachments')
        .delete()
        .eq('id', attachment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-attachments', clientId] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting attachment:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  });

  return {
    attachments,
    isLoading,
    uploadAttachment: uploadAttachmentMutation.mutateAsync,
    deleteAttachment: deleteAttachmentMutation.mutateAsync,
    isUploading: uploadAttachmentMutation.isPending,
    isDeleting: deleteAttachmentMutation.isPending
  };
};
