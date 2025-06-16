
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddAutomationRuleModal from './automation/AddAutomationRuleModal';
import EditAutomationRuleModal from './automation/EditAutomationRuleModal';
import DeleteAutomationRuleModal from './automation/DeleteAutomationRuleModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
  execution_count: number;
  created_at: string;
  updated_at: string;
  last_executed_at: string | null;
  created_by: string;
  tags: string[] | null;
  metadata: any;
}

const AutomationManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [deletingRule, setDeletingRule] = useState<AutomationRule | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: automationRules = [], isLoading } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AutomationRule[];
    },
  });

  const toggleRuleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('automation_rules')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast({
        title: "Success",
        description: "Automation rule status updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to update automation rule status.",
        variant: "destructive",
      });
    },
  });

  const formatTriggerType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatActionType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleToggleActive = (rule: AutomationRule) => {
    toggleRuleMutation.mutate({
      id: rule.id,
      is_active: !rule.is_active,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Automation Management</h2>
            <p className="text-muted-foreground">Manage automated workflows and reminders</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Automation Management</h2>
          <p className="text-muted-foreground">Manage automated workflows and reminders</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>
            Configure rules to automatically trigger actions based on system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {automationRules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No automation rules configured yet.</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Rule
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Executions</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automationRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{rule.name}</div>
                        {rule.description && (
                          <div className="text-sm text-muted-foreground">
                            {rule.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatTriggerType(rule.trigger_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatActionType(rule.action_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(rule)}
                        className={rule.is_active ? "text-green-600" : "text-gray-400"}
                      >
                        {rule.is_active ? (
                          <Power className="w-4 h-4" />
                        ) : (
                          <PowerOff className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {rule.execution_count || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {rule.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(rule.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRule(rule)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingRule(rule)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddAutomationRuleModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />

      {editingRule && (
        <EditAutomationRuleModal
          open={!!editingRule}
          onOpenChange={() => setEditingRule(null)}
          rule={editingRule}
        />
      )}

      {deletingRule && (
        <DeleteAutomationRuleModal
          open={!!deletingRule}
          onOpenChange={() => setDeletingRule(null)}
          rule={deletingRule}
        />
      )}
    </div>
  );
};

export default AutomationManagement;
