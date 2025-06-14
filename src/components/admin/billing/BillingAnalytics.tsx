
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BillingAnalytics: React.FC = () => {
  // Fetch revenue by client
  const { data: revenueByClient = [] } = useQuery({
    queryKey: ['revenue-by-client'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          total_amount,
          clients!inner(name)
        `)
        .in('status', ['Sent', 'Paid', 'Partially Paid']);

      if (error) throw error;

      // Group by client and sum amounts
      const grouped = data.reduce((acc: any, invoice) => {
        const clientName = invoice.clients?.name || 'Unknown';
        if (!acc[clientName]) {
          acc[clientName] = { client: clientName, revenue: 0 };
        }
        acc[clientName].revenue += Number(invoice.total_amount);
        return acc;
      }, {});

      return Object.values(grouped);
    },
  });

  // Fetch outstanding invoices
  const { data: outstandingInvoices = [] } = useQuery({
    queryKey: ['outstanding-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients!inner(name)
        `)
        .in('status', ['Overdue', 'Sent', 'Partially Paid'])
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const totalOverdue = outstandingInvoices
    .filter(inv => inv.status === 'Overdue')
    .length;

  const totalOutstandingAmount = outstandingInvoices
    .reduce((sum, inv) => sum + Number(inv.total_amount), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalOverdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₹{totalOutstandingAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Client Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Client</CardTitle>
          <CardDescription>Total billed amount per client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByClient}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="client" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Invoices</CardTitle>
          <CardDescription>Invoices that are overdue or awaiting payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Invoice #</th>
                  <th className="text-left p-2">Client</th>
                  <th className="text-left p-2">Due Date</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {outstandingInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted-foreground">
                      No outstanding invoices
                    </td>
                  </tr>
                ) : (
                  outstandingInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="p-2">{invoice.invoice_number}</td>
                      <td className="p-2">{invoice.clients?.name}</td>
                      <td className="p-2">{new Date(invoice.due_date).toLocaleDateString()}</td>
                      <td className="p-2">₹{Number(invoice.total_amount).toLocaleString()}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          invoice.status === 'Overdue' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingAnalytics;
