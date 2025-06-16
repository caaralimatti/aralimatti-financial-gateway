
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AutomationRuleForm from './AutomationRuleForm';

interface AddAutomationRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAutomationRuleModal: React.FC<AddAutomationRuleModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Automation Rule</DialogTitle>
          <DialogDescription>
            Configure a new automation rule to trigger actions based on system events.
          </DialogDescription>
        </DialogHeader>
        <AutomationRuleForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddAutomationRuleModal;
