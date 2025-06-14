
import type { Tables } from '@/integrations/supabase/types';

export interface CustomField {
  id?: string;
  field_name: string;
  field_value: string;
  field_type: 'text' | 'number' | 'date' | 'boolean';
}

export interface ContactPerson {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  is_primary: boolean;
}

export interface ClientAttachment {
  id?: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  description?: string;
  uploaded_by?: string;
  created_at?: string;
}

export interface ClientFormData {
  taxesApplicable: {
    gst: boolean;
    incomeTax: boolean;
    mca: boolean;
    tdsTcs: boolean;
    other: boolean;
  };
  basicDetails: {
    fileNo: string;
    clientType: string;
    name: string;
    tradeName: string;
    dateOfBirth: string;
    otherUsers: string;
    workingUser: string;
    tags: string;
    notes: string;
  };
  incomeTaxDetails: {
    pan: string;
    tan: string;
    incomeTaxReturns: string[];
    tdsTcsReturns: string[];
    gstReturns: boolean;
  };
  contactPersons: ContactPerson[];
  clientGroups: any[];
  customFields: CustomField[];
  loginDetails: {
    itPan: string;
    itPassword: string;
    itTan: string;
    itDeductorPassword: string;
    tracesUsername: string;
    tracesDeductorPassword: string;
    tracesTaxpayerPassword: string;
    mcaV2Username: string;
    mcaV2Password: string;
    mcaV3Username: string;
    mcaV3Password: string;
    dgftUsername: string;
    dgftPassword: string;
    gstNumber: string;
    gstUsername: string;
    gstPassword: string;
    gstRegistrationType: string;
    gstReturnFrequency: string;
  };
  attachments: ClientAttachment[];
}

export type ClientEntity = Tables<'clients'>;
