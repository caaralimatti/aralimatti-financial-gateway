
export interface DSCCertificate {
  id: string;
  certificate_holder_profile_id: string;
  serial_number?: string;
  issuing_authority?: string;
  valid_from: string;
  valid_until: string;
  storage_location?: string;
  pin?: string;
  contact_person_phone?: string;
  contact_person_name?: string;
  status: 'Active' | 'Expiring' | 'Expired' | 'Revoked' | 'Lost';
  received_date: string;
  given_date?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  certificate_holder_name?: string;
}

export interface CreateDSCData {
  certificate_holder_profile_id: string;
  serial_number?: string;
  issuing_authority?: string;
  valid_from: string;
  valid_until: string;
  storage_location?: string;
  pin?: string;
  contact_person_phone?: string;
  contact_person_name?: string;
  status?: 'Active' | 'Expiring' | 'Expired' | 'Revoked' | 'Lost';
  received_date: string;
  given_date?: string;
  remarks?: string;
}

export interface UpdateDSCData extends Partial<CreateDSCData> {
  id: string;
}
