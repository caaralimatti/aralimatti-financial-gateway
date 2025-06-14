import type { Tables } from '@/integrations/supabase/types';

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
    incomeTaxReturns: string[]; // e.g. ITR - Unaudited, SFT, etc.
    tdsTcsReturns: string[]; // e.g. TDS Return - Salary, etc.
    gstReturns: boolean; // New checkbox for GST Returns in Tax Details tab
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
