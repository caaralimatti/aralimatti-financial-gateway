
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Search, Loader2 } from 'lucide-react';

interface GSTClient {
  id: string;
  client_name: string;
  gstin: string;
  email: string;
  mobile: string;
  registration_type: string;
  return_frequency: string;
}

interface ClientSelectionCardProps {
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredClients: GSTClient[];
  onClientSelect: (clientId: string) => void;
}

const ClientSelectionCard: React.FC<ClientSelectionCardProps> = ({
  loading,
  searchTerm,
  setSearchTerm,
  filteredClients,
  onClientSelect
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Select GST Client
        </CardTitle>
        <CardDescription>
          Search and select a client to access their GST portal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading clients...</span>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, GSTIN, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select onValueChange={onClientSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {filteredClients.length === 0 ? (
                  <SelectItem value="no-clients" disabled>
                    {searchTerm ? 'No clients found' : 'No clients available'}
                  </SelectItem>
                ) : (
                  filteredClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {client.client_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">{client.client_name}</span>
                          <span className="text-xs text-gray-500 ml-2">({client.gstin})</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelectionCard;
