import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Search } from 'lucide-react';

interface ClientListHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClient: () => void;
  onImportClients: () => void;
}

const ClientListHeader: React.FC<ClientListHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClient,
  onImportClients,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onImportClients}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button onClick={onAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>
    </div>
  );
};

export default ClientListHeader;