
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GSTSidebar from '@/components/gst/GSTSidebar';
import GSTHeader from '@/components/gst/GSTHeader';
import ClientSelectionCard from '@/components/gst/ClientSelectionCard';
import ClientDetailsCard from '@/components/gst/ClientDetailsCard';
import GSTQuickStats from '@/components/gst/GSTQuickStats';

interface GSTClient {
  id: string;
  client_name: string;
  gstin: string;
  email: string;
  mobile: string;
  registration_type: string;
  return_frequency: string;
}

const GSTLogin = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [clients, setClients] = useState<GSTClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<GSTClient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredClients, setFilteredClients] = useState<GSTClient[]>([]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fetch GST clients from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('gst_clients')
          .select('id, client_name, gstin, email, mobile, registration_type, return_frequency')
          .order('client_name');

        if (error) {
          console.error('Error fetching GST clients:', error);
          toast({
            title: "Error",
            description: "Failed to load GST clients. Please try again.",
            variant: "destructive"
          });
          return;
        }

        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        console.error('Error in fetchClients:', error);
        toast({
          title: "Error",
          description: "Failed to load GST clients. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  // Filter clients based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    setSearchTerm('');
  };

  const handleGSTPortalLogin = () => {
    if (selectedClient) {
      window.open('https://services.gst.gov.in/services/login', '_blank');
      toast({
        title: "GST Portal Opened",
        description: `GST Portal opened for ${selectedClient.client_name}`,
      });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          <GSTSidebar />

          <SidebarInset className="flex-1">
            <GSTHeader
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              profile={profile}
              onLogout={handleLogout}
            />

            <main className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    GST Portal Login
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a client to access their GST portal
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <LogIn className="h-3 w-3 mr-1" />
                  GST Portal Access
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ClientSelectionCard
                  loading={loading}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filteredClients={filteredClients}
                  onClientSelect={handleClientSelect}
                />

                <ClientDetailsCard
                  selectedClient={selectedClient}
                  onGSTPortalLogin={handleGSTPortalLogin}
                />
              </div>

              <GSTQuickStats totalClients={clients.length} />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default GSTLogin;
