
import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  file_no?: string;
}

interface StaffDocumentHeaderProps {
  clients: Client[];
  isClientsLoading: boolean;
  clientId: string | null;
  onClientChange: (clientId: string | null) => void;
  onUploadClick: () => void;
}

const StaffDocumentHeader: React.FC<StaffDocumentHeaderProps> = ({
  clients,
  isClientsLoading,
  clientId,
  onClientChange,
  onUploadClick
}) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between py-2 mb-4">
      <div className="w-full md:w-96">
        <Select value={clientId ?? ""} onValueChange={val => onClientChange(val || null)}>
          <SelectTrigger>
            <SelectValue placeholder={isClientsLoading ? "Loading clients..." : (clients.length ? "Select a client" : "No assigned clients")} />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} {c.file_no ? `(${c.file_no})` : ""}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onUploadClick}
        className="w-full md:w-auto"
        disabled={!clientId}
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );
};

export default StaffDocumentHeader;
