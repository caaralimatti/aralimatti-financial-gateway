
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number;
  category: string;
  uploaded_at: string;
  uploaded_by: string;
  uploader_name: string | null;
}

const DocumentsPage = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['client-documents', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          profiles!documents_uploaded_by_fkey(full_name)
        `)
        .eq('client_id', profile.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      return data?.map(doc => ({
        ...doc,
        uploader_name: doc.profiles?.full_name || 'Unknown'
      })) || [];
    },
    enabled: !!profile?.id,
  });

  const handleDownload = async (document: Document) => {
    try {
      // In a real implementation, you would handle the file download here
      // For now, we'll just show a toast
      toast({
        title: "Download Started",
        description: `Downloading ${document.title}`,
      });
      
      // You could implement actual file download logic here
      // window.open(document.file_url, '_blank');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error downloading the file.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(documents?.map(doc => doc.category) || [])];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/client-dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Documents</h1>
                <p className="text-sm text-gray-600">
                  Welcome, {profile?.full_name || profile?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Error loading documents. Please try again.</p>
          </div>
        )}

        {!error && filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Your documents will appear here once they are uploaded by our staff.'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {document.category}
                    </Badge>
                  </div>
                  <FileText className="h-6 w-6 text-primary flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              <CardContent>
                {document.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {document.description}
                  </p>
                )}
                
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {formatDate(document.uploaded_at)}
                  </div>
                  <div>Size: {formatFileSize(document.file_size)}</div>
                  <div>Uploaded by: {document.uploader_name}</div>
                </div>

                <Button 
                  onClick={() => handleDownload(document)}
                  className="w-full"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;
