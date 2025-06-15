
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateFileType, validateFileSize } from '@/utils/clientFormUtils';
import type { ClientAttachment } from '@/types/clientForm';

export const useClientAttachmentMutation = (clientId?: string) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadAttachmentMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      file, 
      description,
      documentStatus = 'Uploaded',
      sharedWithClient = false,
      uploadedByRole = 'admin'
    }: { 
      clientId: string; 
      file: File; 
      description?: string;
      documentStatus?: string;
      sharedWithClient?: boolean;
      uploadedByRole?: string;
    }) => {
      if (!validateFileType(file)) {
        throw new Error('Invalid file type. Only PDF, DOCX, XLSX, JPG, and PNG files are allowed.');
      }
      if (!validateFileSize(file)) {
        throw new Error('File size too large. Maximum size is 10MB.');
      }
      const { data: existingFiles } = await supabase
        .from('client_attachments')
        .select('version_number, id')
        .eq('client_id', clientId)
        .eq('file_name', file.name)
        .eq('is_current_version', true);

      let versionNumber = 1;
      if (existingFiles && existingFiles.length > 0) {
        const maxVersion = Math.max(...existingFiles.map(f => Number(f.version_number)));
        versionNumber = maxVersion + 1;
        await supabase
          .from('client_attachments')
          .update({ is_current_version: false })
          .eq('client_id', clientId)
          .eq('file_name', file.name);
      }

      const fileName = `${clientId}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('client-attachments')
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from('client-attachments')
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from('client_attachments')
        .insert({
          client_id: clientId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: file.type,
          description: description || null,
          document_status: documentStatus,
          shared_with_client: sharedWithClient,
          uploaded_by: profile?.id,
          uploaded_by_role: uploadedByRole,
          version_number: versionNumber,
          is_current_version: true
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
        description: "Document uploaded successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error uploading attachment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    }
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: async (attachment: ClientAttachment) => {
      const fileName = attachment.file_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('client-attachments')
          .remove([fileName]);
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
        }
      }
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
        description: "Document deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting attachment:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  });

  const updateAttachmentMutation = useMutation({
    mutationFn: async ({ 
      attachmentId, 
      updates 
    }: { 
      attachmentId: string; 
      updates: { 
        document_status?: string; 
        shared_with_client?: boolean; 
        description?: string; 
      } 
    }) => {
      const { data, error } = await supabase
        .from('client_attachments')
        .update(updates)
        .eq('id', attachmentId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-attachments', clientId] });
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error updating attachment:', error);
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
    }
  });

  return {
    uploadAttachment: uploadAttachmentMutation.mutateAsync,
    deleteAttachment: deleteAttachmentMutation.mutateAsync,
    updateAttachment: updateAttachmentMutation.mutateAsync,
    isUploading: uploadAttachmentMutation.isPending,
    isDeleting: deleteAttachmentMutation.isPending,
    isUpdating: updateAttachmentMutation.isPending
  };
};
