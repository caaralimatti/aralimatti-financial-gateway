import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Download, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';

const MyDocuments: React.FC = () => {
  const { profile } = useAuth();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['client-shared-documents', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      console.log('Fetching documents for profile ID:', profile.id);
      
      // Get the client_id for the current user - try multiple approaches
      let clientData = null;
      
      // First try: working_user_id matches profile id
      const { data: clientByWorkingUser } = await supabase
        .from('clients')
        .select('id, name')
        .eq('working_user_id', profile.id)
        .maybeSingle();
      
      if (clientByWorkingUser) {
        clientData = clientByWorkingUser;
        console.log('Found client by working_user_id:', clientData);
      } else {
        // Second try: primary_portal_user_profile_id matches profile id
        const { data: clientByPortalUser } = await supabase
          .from('clients')
          .select('id, name')
          .eq('primary_portal_user_profile_id', profile.id)
          .maybeSingle();
        
        if (clientByPortalUser) {
          clientData = clientByPortalUser;
          console.log('Found client by primary_portal_user_profile_id:', clientData);
        }
      }

      if (!clientData) {
        console.log('No client found for profile ID:', profile.id);
        return [];
      }

      console.log('Fetching documents for client ID:', clientData.id);

      // Fetch documents shared with this client
      const { data, error } = await supabase
        .from('client_attachments')
        .select(`
          *,
          uploaded_by_profile:profiles!uploaded_by(full_name)
        `)
        .eq('client_id', clientData.id)
        .eq('shared_with_client', true)
        .eq('is_current_version', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
      
      console.log('Found documents:', data?.length || 0);
      return data || [];
    },
    enabled: !!profile?.id
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Uploaded': 'bg-blue-100 text-blue-800',
      'Reviewed': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Client Review': 'bg-purple-100 text-purple-800',
      'Firm Shared': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
        <p className="text-muted-foreground">
          View and download documents shared with you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shared Documents</CardTitle>
          <CardDescription>Documents that have been shared with your account</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading documents...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Shared By</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <span>No documents have been shared with you yet</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.description || doc.file_name}</TableCell>
                        <TableCell>{doc.file_type || 'Unknown'}</TableCell>
                        <TableCell>{doc.file_size ? formatFileSize(doc.file_size) : 'Unknown'}</TableCell>
                        <TableCell>{getStatusBadge(doc.document_status)}</TableCell>
                        <TableCell>{doc.uploaded_by_profile?.full_name || 'System'}</TableCell>
                        <TableCell>{format(new Date(doc.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleView(doc.file_url)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownload(doc.file_url, doc.file_name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
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

export default MyDocuments;
