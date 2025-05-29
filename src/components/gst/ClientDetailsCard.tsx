
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Mail, Phone, Calendar, CreditCard, ExternalLink } from 'lucide-react';

interface GSTClient {
  id: string;
  client_name: string;
  gstin: string;
  email: string;
  mobile: string;
  registration_type: string;
  return_frequency: string;
}

interface ClientDetailsCardProps {
  selectedClient: GSTClient | null;
  onGSTPortalLogin: () => void;
}

const ClientDetailsCard: React.FC<ClientDetailsCardProps> = ({
  selectedClient,
  onGSTPortalLogin
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Client Details
        </CardTitle>
        <CardDescription>
          Review client information before accessing GST portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedClient ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">
                  {selectedClient.client_name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedClient.client_name}
                </h3>
                <Badge variant="secondary" className="mt-1">
                  GSTIN: {selectedClient.gstin}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedClient.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Mobile:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedClient.mobile}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Registration Type:</span>
                <Badge variant={selectedClient.registration_type === 'Regular' ? 'default' : 'secondary'}>
                  {selectedClient.registration_type}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Return Frequency:</span>
                <Badge variant={selectedClient.return_frequency === 'Monthly' ? 'default' : 'outline'}>
                  {selectedClient.return_frequency}
                </Badge>
              </div>
            </div>

            <Button 
              onClick={onGSTPortalLogin}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Login to GST Portal
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Select a client to view their details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientDetailsCard;
