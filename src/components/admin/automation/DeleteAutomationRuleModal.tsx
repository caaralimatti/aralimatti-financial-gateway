
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutomationRule {
  id: string;
  name: string;
}

interface DeleteAutomationRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AutomationRule;
}

const DeleteAutomationRuleModal: React.FC<DeleteAutomationRuleModalProps> = ({
  open,
  onOpenChange,
  rule,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast({
        title: "Success",
        description: "Automation rule deleted successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error deleting automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete automation rule.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(rule.id);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Automation Rule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the automation rule "{rule.name}"? 
            This action cannot be undone and will stop all future executions of this rule.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Rule
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAutomationRuleModal;
