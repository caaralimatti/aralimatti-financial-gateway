import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: any;
}

interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  rate_type?: string;
  total_line_item_amount: number;
  related_task_id?: string;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, onOpenChange, invoice }) => {
  const queryClient = useQueryClient();
  const isEditing = !!invoice;

  const [formData, setFormData] = useState({
    invoice_number: '',
    client_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Draft',
    tax_amount: 0,
    discount_amount: 0,
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unit_price: 0, total_line_item_amount: 0 }
  ]);

  // Get current user profile
  const { data: currentProfile } = useQuery({
    queryKey: ['current-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch clients with better error handling and logging
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useQuery({
    queryKey: ['clients-for-invoice'],
    queryFn: async () => {
      console.log('🔥 InvoiceModal: Fetching clients for dropdown');
      
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, file_no, status')
        .eq('status', 'Active')
        .order('name');
      
      console.log('🔥 InvoiceModal: Clients fetch result:', { data, error });
      
      if (error) {
        console.error('🔥 InvoiceModal: Error fetching clients:', error);
        throw error;
      }
      
      return data || [];
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch tasks for selected client
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', formData.client_id],
    queryFn: async () => {
      if (!formData.client_id) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title')
        .eq('client_id', formData.client_id)
        .order('title');
      if (error) throw error;
      return data;
    },
    enabled: !!formData.client_id,
  });

  // Populate form when editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_number: invoice.invoice_number,
        client_id: invoice.client_id,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        status: invoice.status,
        tax_amount: Number(invoice.tax_amount) || 0,
        discount_amount: Number(invoice.discount_amount) || 0,
      });
      // TODO: Fetch and set line items
    } else {
      // Reset form for new invoice
      setFormData({
        invoice_number: '',
        client_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Draft',
        tax_amount: 0,
        discount_amount: 0,
      });
      setLineItems([{ description: '', quantity: 1, unit_price: 0, total_line_item_amount: 0 }]);
    }
  }, [invoice]);

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total_line_item_amount, 0);
  const total = subtotal + formData.tax_amount - formData.discount_amount;

  // Update line item total when quantity or unit_price changes
  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const newLineItems = [...lineItems];
    newLineItems[index] = { ...newLineItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      newLineItems[index].total_line_item_amount = 
        newLineItems[index].quantity * newLineItems[index].unit_price;
    }
    
    setLineItems(newLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0, total_line_item_amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  // Save invoice mutation
  const saveInvoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!currentProfile) {
        throw new Error('No current user profile found');
      }

      const invoiceData = {
        ...data,
        total_amount: total,
        created_by_profile_id: currentProfile.id
      };

      if (isEditing) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', invoice.id);
        if (error) throw error;
        return invoice.id;
      } else {
        const { data: result, error } = await supabase
          .from('invoices')
          .insert(invoiceData)
          .select()
          .single();
        if (error) throw error;
        return result.id;
      }
    },
    onSuccess: async (invoiceId) => {
      // Save line items
      const lineItemsToSave = lineItems
        .filter(item => item.description.trim())
        .map(item => ({
          invoice_id: invoiceId,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_line_item_amount: item.total_line_item_amount,
          rate_type: item.rate_type,
          related_task_id: item.related_task_id,
        }));

      if (lineItemsToSave.length > 0) {
        if (isEditing) {
          // Delete existing line items and insert new ones
          await supabase.from('invoice_line_items').delete().eq('invoice_id', invoiceId);
        }
        
        const { error } = await supabase
          .from('invoice_line_items')
          .insert(lineItemsToSave);
        
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success(isEditing ? 'Invoice updated successfully!' : 'Invoice created successfully!');
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_id) {
      toast.error('Please select a client');
      return;
    }

    if (!currentProfile) {
      toast.error('User profile not loaded');
      return;
    }

    const validLineItems = lineItems.filter(item => item.description.trim());
    if (validLineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    saveInvoiceMutation.mutate(formData);
  };

  // Log client dropdown state for debugging
  console.log('🔥 InvoiceModal: Client dropdown state:', { 
    clients, 
    clientsLoading, 
    clientsError, 
    selectedClientId: formData.client_id 
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_number: e.target.value }))}
                  placeholder="Auto-generated"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_id">Client *</Label>
                {clientsError ? (
                  <div className="text-red-600 text-sm">
                    Error loading clients: {clientsError.message}
                  </div>
                ) : (
                  <Select 
                    value={formData.client_id} 
                    onValueChange={(value) => {
                      console.log('🔥 InvoiceModal: Client selected:', value);
                      setFormData(prev => ({ ...prev, client_id: value }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select client"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 max-h-[200px] overflow-y-auto">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} ({client.file_no})
                        </SelectItem>
                      ))}
                      {clients.length === 0 && !clientsLoading && (
                        <SelectItem value="" disabled>
                          No active clients found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice_date">Invoice Date</Label>
                <Input
                  id="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Voided">Voided</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Line Items</CardTitle>
                <Button type="button" variant="outline" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      placeholder="Service description"
                      rows={2}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateLineItem(index, 'unit_price', Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Rate Type</Label>
                    <Select value={item.rate_type || ''} onValueChange={(value) => updateLineItem(index, 'rate_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="Hourly">Hourly</SelectItem>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <Label>Total</Label>
                    <div className="text-sm font-medium pt-2">
                      ₹{item.total_line_item_amount.toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax_amount">Tax Amount</Label>
                  <Input
                    id="tax_amount"
                    type="number"
                    value={formData.tax_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, tax_amount: Number(e.target.value) }))}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_amount">Discount Amount</Label>
                  <Input
                    id="discount_amount"
                    type="number"
                    value={formData.discount_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: Number(e.target.value) }))}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <div className="text-2xl font-bold pt-2">
                    ₹{total.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Subtotal: ₹{subtotal.toFixed(2)}</span>
                <span>Tax: ₹{formData.tax_amount.toFixed(2)}</span>
                <span>Discount: -₹{formData.discount_amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveInvoiceMutation.isPending}>
              {saveInvoiceMutation.isPending ? 'Saving...' : (isEditing ? 'Update Invoice' : 'Create Invoice')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
