
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: any;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onOpenChange, invoice }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    transaction_id: '',
  });

  React.useEffect(() => {
    if (invoice) {
      setFormData(prev => ({
        ...prev,
        amount: Number(invoice.total_amount) || 0,
      }));
    }
  }, [invoice]);

  const recordPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      // Insert payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          invoice_id: invoice.id,
          amount: data.amount,
          payment_date: data.payment_date,
          payment_method: data.payment_method,
          transaction_id: data.transaction_id || null,
          received_by_profile_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (paymentError) throw paymentError;

      // Update invoice status
      const totalAmount = Number(invoice.total_amount);
      const newStatus = data.amount >= totalAmount ? 'Paid' : 'Partially Paid';

      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', invoice.id);

      if (invoiceError) throw invoiceError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Payment recorded successfully!');
      onOpenChange(false);
      setFormData({
        amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        transaction_id: '',
      });
    },
    onError: (error) => {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payment_method) {
      toast.error('Please select a payment method');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    recordPaymentMutation.mutate(formData);
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Invoice: {invoice.invoice_number}</div>
          <div className="text-sm text-gray-600">Client: {invoice.clients?.name}</div>
          <div className="text-lg font-semibold">Total: ₹{Number(invoice.total_amount).toLocaleString()}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_date">Payment Date *</Label>
            <Input
              id="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData(prev => ({ ...prev, payment_date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method *</Label>
            <Select value={formData.payment_method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction_id">Transaction ID</Label>
            <Input
              id="transaction_id"
              value={formData.transaction_id}
              onChange={(e) => setFormData(prev => ({ ...prev, transaction_id: e.target.value }))}
              placeholder="Optional reference number"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={recordPaymentMutation.isPending}>
              {recordPaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
