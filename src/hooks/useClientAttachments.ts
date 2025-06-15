
import { useClientAttachmentsFetch } from './useClientAttachmentsFetch';
import { useClientAttachmentMutation } from './useClientAttachmentMutation';

export const useClientAttachments = (clientId?: string) => {
  const { attachments, isLoading } = useClientAttachmentsFetch(clientId);
  const {
    uploadAttachment,
    deleteAttachment,
    updateAttachment,
    isUploading,
    isDeleting,
    isUpdating
  } = useClientAttachmentMutation(clientId);

  return {
    attachments,
    isLoading,
    uploadAttachment,
    deleteAttachment,
    updateAttachment,
    isUploading,
    isDeleting,
    isUpdating
  };
};
