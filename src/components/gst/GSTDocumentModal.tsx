
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GSTDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const GSTDocumentModal: React.FC<GSTDocumentModalProps> = ({ isOpen, onClose, title, content }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div 
            className="prose max-w-none text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GSTDocumentModal;
