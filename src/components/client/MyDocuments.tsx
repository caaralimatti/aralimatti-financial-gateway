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
import { handleFileView, handleFileDownload } from '@/utils/fileHandling';
import DocumentTable from "./DocumentTable";

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

  const [viewingDocId, setViewingDocId] = React.useState<string | null>(null);

  const handleView = async (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string,
    fileType: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const docId = `${fileUrl}-${fileName}`;
    if (viewingDocId === docId) {
      console.log(`[MyDocuments] Ignored double-view click for ${fileName}`);
      return;
    }
    setViewingDocId(docId);

    try {
      console.log(`[MyDocuments] handleView:`, { fileUrl, fileName, fileType });
      await handleFileView(fileUrl, fileName, fileType);
    } finally {
      setTimeout(() => setViewingDocId(null), 1500);
    }
  };

  const handleDownload = (e: React.MouseEvent, fileUrl: string, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileDownload(fileUrl, fileName);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
            <DocumentTable
              documents={documents}
              viewingDocId={viewingDocId}
              handleView={handleView}
              handleDownload={handleDownload}
              formatFileSize={formatFileSize}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyDocuments;
