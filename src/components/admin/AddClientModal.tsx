
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useClientForm } from '@/hooks/useClientForm';
import ClientFormTabs from './ClientFormTabs';
import TaxesApplicableSection from './TaxesApplicableSection';
import ClientModalHeader from './ClientModalHeader';
import ClientOnboardingProgress from './ClientOnboardingProgress';
import type { Tables } from '@/integrations/supabase/types';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClient?: Tables<'clients'> | null;
}

const AddClientModal = ({ open, onOpenChange, editingClient }: AddClientModalProps) => {
  const { clientForm, setClientForm, saveClient, isLoading } = useClientForm(editingClient);

  const handleSave = () => {
    saveClient(() => {
      // Ensure we close the modal and stay in admin context
      onOpenChange(false);
      console.log('🔥 Client created successfully, staying in admin portal');
    });
  };

  const handleTaxesChange = (taxes: { gst: boolean; incomeTax: boolean; mca: boolean; tdsTcs: boolean; other: boolean }) => {
    setClientForm(prev => ({
      ...prev,
      taxesApplicable: taxes
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <ClientModalHeader
          isEditing={!!editingClient}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
          onSave={handleSave}
        />

        <div className="space-y-6">
          <ClientOnboardingProgress clientForm={clientForm} />
          
          <TaxesApplicableSection
            taxesApplicable={clientForm.taxesApplicable}
            onTaxesChange={handleTaxesChange}
          />

          <ClientFormTabs 
            clientForm={clientForm} 
            setClientForm={setClientForm}
            clientId={editingClient?.id}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
