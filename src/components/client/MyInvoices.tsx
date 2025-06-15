
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';

const MyInvoices: React.FC = () => {
  const { profile } = useAuth();

  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['my-invoices', profile?.id],
    queryFn: async () => {
      if (!profile?.id) {
        console.log('🔥 MyInvoices: No profile ID available');
        return [];
      }

      console.log('🔥 MyInvoices: Starting invoice fetch for profile:', profile.id);
      
      // First, let's check if there's a client record for this user
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, name, file_no')
        .eq('working_user_id', profile.id);

      console.log('🔥 MyInvoices: Client lookup result:', { clientData, clientError });

      if (clientError) {
        console.error('🔥 MyInvoices: Error fetching client:', clientError);
        throw clientError;
      }

      if (!clientData || clientData.length === 0) {
        console.log('🔥 MyInvoices: No client found for user:', profile.id);
        return [];
      }

      const client = clientData[0];
      console.log('🔥 MyInvoices: Found client:', client);

      // Now fetch invoices for this client
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          clients!inner(name),
          invoice_line_items(*)
        `)
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });

      console.log('🔥 MyInvoices: Invoices query result:', { invoicesData, invoicesError });

      if (invoicesError) {
        console.error('🔥 MyInvoices: Error fetching invoices:', invoicesError);
        throw invoicesError;
      }

      return invoicesData || [];
    },
    enabled: !!profile?.id
  });

  console.log('🔥 MyInvoices: Final data:', { invoices, isLoading, error, profileId: profile?.id });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Sent': 'bg-blue-100 text-blue-800',
      'Paid': 'bg-green-100 text-green-800',
      'Partially Paid': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Voided': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const calculateAmountDue = (invoice: any) => {
    // This would need to calculate based on payments made
    // For now, showing total amount
    return Number(invoice.total_amount);
  };

  if (error) {
    console.error('🔥 MyInvoices: Query error:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Invoices</h1>
        <p className="text-muted-foreground">
          View and track all your invoices
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>All invoices issued to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading invoices...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>Error loading invoices: {error.message}</p>
              <p className="text-sm text-gray-500 mt-2">Check console for details</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <div className="space-y-2">
                          <p>No invoices found</p>
                          <p className="text-sm">
                            {profile?.id ? 
                              `Profile ID: ${profile.id}` : 
                              'No profile loaded'
                            }
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>₹{Number(invoice.total_amount).toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>₹{calculateAmountDue(invoice).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyInvoices;
