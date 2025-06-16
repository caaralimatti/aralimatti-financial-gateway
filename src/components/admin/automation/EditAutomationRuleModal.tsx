
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AutomationRuleForm from './AutomationRuleForm';

interface AutomationRule {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  action_type: string;
  is_active: boolean;
  trigger_conditions: any;
  action_parameters: any;
  delay_minutes: number;
  frequency_type: string;
  frequency_value: number;
  priority: number;
  max_executions: number | null;
  tags: string[] | null;
  metadata: any;
}

interface EditAutomationRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AutomationRule;
}

const EditAutomationRuleModal: React.FC<EditAutomationRuleModalProps> = ({
  open,
  onOpenChange,
  rule,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Automation Rule</DialogTitle>
          <DialogDescription>
            Modify the automation rule configuration.
          </DialogDescription>
        </DialogHeader>
        <AutomationRuleForm
          initialData={rule}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAutomationRuleModal;
