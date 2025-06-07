
import type { Tables } from '@/integrations/supabase/types';

export interface ClientFormData {
  taxesApplicable: {
    gst: boolean;
    incomeTax: boolean;
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
    returns: any[];
    pan: string;
    tan: string;
  };
  contactPersons: any[];
  clientGroups: any[];
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
  attachments: any[];
}

export type ClientEntity = Tables<'clients'>;
