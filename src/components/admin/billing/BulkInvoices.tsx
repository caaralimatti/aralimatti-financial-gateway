
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { parseCSV } from '@/utils/csvParser';

const BulkInvoices: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState<any[]>([]);

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

  // Fetch clients for validation
  const { data: clients = [] } = useQuery({
    queryKey: ['clients-bulk'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, file_no')
        .eq('status', 'Active');
      if (error) throw error;
      return data;
    },
  });

  const downloadTemplate = () => {
    const template = `Client Name,Invoice Date,Due Date,Description,Quantity,Unit Price,Rate Type,Tax Amount,Discount Amount
ABC Corp,2024-01-15,2024-02-15,Consulting Services,10,150,Hourly,270,0
XYZ Ltd,2024-01-16,2024-02-16,Software Development,1,5000,Project,900,500`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'invoice_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Template downloaded successfully');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      const { headers, rows } = parseCSV(text);
      
      const expectedHeaders = ['Client Name', 'Invoice Date', 'Due Date', 'Description', 'Quantity', 'Unit Price', 'Rate Type', 'Tax Amount', 'Discount Amount'];
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        toast.error(`Missing required columns: ${missingHeaders.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      const processedData = rows.map((row, index) => {
        const rowData: any = {};
        headers.forEach((header, i) => {
          rowData[header] = row[i] || '';
        });
        rowData.rowIndex = index + 2; // +2 for header row and 1-based indexing
        return rowData;
      });

      setUploadedData(processedData);
      validateData(processedData);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Error parsing CSV file');
    }
    setIsProcessing(false);
  };

  const validateData = (data: any[]) => {
    const results = data.map((row, index) => {
      const errors: string[] = [];
      
      // Validate client exists
      const client = clients.find(c => c.name === row['Client Name']);
      if (!client) {
        errors.push('Client not found');
      }

      // Validate dates
      if (!row['Invoice Date'] || isNaN(Date.parse(row['Invoice Date']))) {
        errors.push('Invalid invoice date');
      }
      if (!row['Due Date'] || isNaN(Date.parse(row['Due Date']))) {
        errors.push('Invalid due date');
      }

      // Validate numeric fields
      if (!row['Quantity'] || isNaN(Number(row['Quantity']))) {
        errors.push('Invalid quantity');
      }
      if (!row['Unit Price'] || isNaN(Number(row['Unit Price']))) {
        errors.push('Invalid unit price');
      }

      // Validate rate type
      const validRateTypes = ['Hourly', 'Daily', 'Monthly', 'Project', 'Work'];
      if (row['Rate Type'] && !validRateTypes.includes(row['Rate Type'])) {
        errors.push('Invalid rate type');
      }

      return {
        index,
        row,
        client,
        errors,
        isValid: errors.length === 0
      };
    });

    setValidationResults(results);
  };

  const bulkImportMutation = useMutation({
    mutationFn: async (validData: any[]) => {
      if (!currentProfile) {
        throw new Error('No current user profile found');
      }

      const invoices = [];
      
      for (const item of validData) {
        const { row, client } = item;
        
        // Create invoice with invoice_number set to empty string to trigger the database function
        const invoiceData = {
          client_id: client.id,
          invoice_date: row['Invoice Date'],
          due_date: row['Due Date'],
          tax_amount: Number(row['Tax Amount']) || 0,
          discount_amount: Number(row['Discount Amount']) || 0,
          status: 'Draft',
          created_by_profile_id: currentProfile.id,
          invoice_number: '', // This will be auto-generated by the database trigger
          total_amount: 0 // Will be updated after line item creation
        };

        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert(invoiceData)
          .select()
          .single();

        if (invoiceError) throw invoiceError;

        // Create line item
        const lineItemData = {
          invoice_id: invoice.id,
          description: row['Description'],
          quantity: Number(row['Quantity']),
          unit_price: Number(row['Unit Price']),
          rate_type: row['Rate Type'] || null,
          total_line_item_amount: Number(row['Quantity']) * Number(row['Unit Price'])
        };

        const { error: lineItemError } = await supabase
          .from('invoice_line_items')
          .insert(lineItemData);

        if (lineItemError) throw lineItemError;

        // Update invoice total
        const total = lineItemData.total_line_item_amount + invoiceData.tax_amount - invoiceData.discount_amount;
        const { error: updateError } = await supabase
          .from('invoices')
          .update({ total_amount: total })
          .eq('id', invoice.id);

        if (updateError) throw updateError;

        invoices.push(invoice);
      }

      return invoices;
    },
    onSuccess: (invoices) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success(`Successfully imported ${invoices.length} invoices`);
      setUploadedData([]);
      setValidationResults([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      console.error('Error importing invoices:', error);
      toast.error('Failed to import invoices');
    },
  });

  const handleImport = () => {
    const validData = validationResults.filter(result => result.isValid);
    if (validData.length === 0) {
      toast.error('No valid rows to import');
      return;
    }
    bulkImportMutation.mutate(validData);
  };

  const validCount = validationResults.filter(r => r.isValid).length;
  const errorCount = validationResults.filter(r => !r.isValid).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Invoice Import</h1>
          <p className="text-muted-foreground">
            Upload CSV files to create multiple invoices at once
          </p>
        </div>
      </div>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            CSV Template
          </CardTitle>
          <CardDescription>
            Download the template file to see the required format for bulk invoice import
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Invoice Data
          </CardTitle>
          <CardDescription>
            Select a CSV file containing invoice data to import
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </div>
          
          {isProcessing && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Processing file...</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Validation Results
            </CardTitle>
            <CardDescription>
              {validCount} valid rows, {errorCount} rows with errors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {validCount > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {validCount} invoices are ready to be imported.
                </AlertDescription>
              </Alert>
            )}

            {errorCount > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorCount} rows have validation errors and will be skipped.
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Errors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.row.rowIndex}</TableCell>
                      <TableCell>{result.row['Client Name']}</TableCell>
                      <TableCell>{result.row['Description']}</TableCell>
                      <TableCell>
                        ₹{(Number(result.row['Quantity']) * Number(result.row['Unit Price'])).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {result.isValid ? (
                          <span className="text-green-600 font-medium">Valid</span>
                        ) : (
                          <span className="text-red-600 font-medium">Invalid</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.errors.length > 0 && (
                          <span className="text-red-600 text-sm">
                            {result.errors.join(', ')}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {validCount > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleImport}
                  disabled={bulkImportMutation.isPending}
                >
                  {bulkImportMutation.isPending ? 'Importing...' : `Import ${validCount} Invoices`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkInvoices;
