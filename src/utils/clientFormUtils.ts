
import type { Tables } from '@/integrations/supabase/types';
import type { ClientFormData } from '@/types/clientForm';

export const getInitialFormData = (editingClient?: Tables<'clients'> | null): ClientFormData => {
  return {
    taxesApplicable: {
      gst: editingClient?.gst_applicable || false,
      incomeTax: editingClient?.income_tax_applicable || false,
      mca: editingClient?.mca_applicable || false,
      tdsTcs: editingClient?.tds_tcs_applicable || false,
      other: editingClient?.other_tax_applicable || false,
    },
    basicDetails: {
      fileNo: editingClient?.file_no || '',
      clientType: editingClient?.client_type || 'Individual',
      name: editingClient?.name || '',
      tradeName: editingClient?.trade_name || '',
      dateOfBirth: editingClient?.date_of_birth || '',
      otherUsers: editingClient?.other_users || '',
      workingUser: editingClient?.working_user_id || '',
      tags: editingClient?.tags?.join(', ') || '',
      notes: editingClient?.notes || '',
    },
    incomeTaxDetails: {
      incomeTaxReturns: [],
      tdsTcsReturns: [],
      gstReturns: false,
      pan: editingClient?.pan || '',
      tan: editingClient?.tan || '',
    },
    contactPersons: [],
    clientGroups: [],
    loginDetails: {
      itPan: editingClient?.it_pan || '',
      itPassword: editingClient?.it_password || '',
      itTan: editingClient?.it_tan || '',
      itDeductorPassword: editingClient?.it_deductor_password || '',
      tracesUsername: editingClient?.traces_username || '',
      tracesDeductorPassword: editingClient?.traces_deductor_password || '',
      tracesTaxpayerPassword: editingClient?.traces_taxpayer_password || '',
      mcaV2Username: editingClient?.mca_v2_username || '',
      mcaV2Password: editingClient?.mca_v2_password || '',
      mcaV3Username: editingClient?.mca_v3_username || '',
      mcaV3Password: editingClient?.mca_v3_password || '',
      dgftUsername: editingClient?.dgft_username || '',
      dgftPassword: editingClient?.dgft_password || '',
      gstNumber: editingClient?.gst_number || '',
      gstUsername: editingClient?.gst_username || '',
      gstPassword: editingClient?.gst_password || '',
      gstRegistrationType: editingClient?.gst_registration_type || 'Regular',
      gstReturnFrequency: editingClient?.gst_return_frequency || 'Monthly',
    },
    attachments: [],
  };
};

const mapClientTypeToDatabase = (clientType: string): 'Individual' | 'Company' | 'Partnership' | 'LLP' | 'Trust' | 'HUF' | 'Other' => {
  const mapping: Record<string, 'Individual' | 'Company' | 'Partnership' | 'LLP' | 'Trust' | 'HUF' | 'Other'> = {
    'individual': 'Individual',
    'business': 'Company',
    'company': 'Company',
    'partnership': 'Partnership',
    'llp': 'LLP',
    'trust': 'Trust',
    'huf': 'HUF',
    'other': 'Other'
  };
  
  return mapping[clientType.toLowerCase()] || 'Individual';
};

export const transformFormDataToClientData = (formData: ClientFormData) => {
  return {
    // Basic Details
    file_no: formData.basicDetails.fileNo,
    client_type: mapClientTypeToDatabase(formData.basicDetails.clientType),
    name: formData.basicDetails.name,
    trade_name: formData.basicDetails.tradeName || null,
    date_of_birth: formData.basicDetails.dateOfBirth || null,
    other_users: formData.basicDetails.otherUsers || null,
    notes: formData.basicDetails.notes || null,
    tags: formData.basicDetails.tags ? formData.basicDetails.tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,

    // Tax Applicability
    gst_applicable: formData.taxesApplicable.gst,
    income_tax_applicable: formData.taxesApplicable.incomeTax,
    mca_applicable: formData.taxesApplicable.mca,
    tds_tcs_applicable: formData.taxesApplicable.tdsTcs,
    other_tax_applicable: formData.taxesApplicable.other,

    // These tax returns fields don't exist in table, so NOT included in the returned object

    // Income Tax Details
    pan: formData.incomeTaxDetails.pan || null,
    tan: formData.incomeTaxDetails.tan || null,

    // Login Details
    it_pan: formData.loginDetails.itPan || null,
    it_password: formData.loginDetails.itPassword || null,
    it_tan: formData.loginDetails.itTan || null,
    it_deductor_password: formData.loginDetails.itDeductorPassword || null,
    traces_username: formData.loginDetails.tracesUsername || null,
    traces_deductor_password: formData.loginDetails.tracesDeductorPassword || null,
    traces_taxpayer_password: formData.loginDetails.tracesTaxpayerPassword || null,
    mca_v2_username: formData.loginDetails.mcaV2Username || null,
    mca_v2_password: formData.loginDetails.mcaV2Password || null,
    mca_v3_username: formData.loginDetails.mcaV3Username || null,
    mca_v3_password: formData.loginDetails.mcaV3Password || null,
    dgft_username: formData.loginDetails.dgftUsername || null,
    dgft_password: formData.loginDetails.dgftPassword || null,
    gst_number: formData.loginDetails.gstNumber || null,
    gst_username: formData.loginDetails.gstUsername || null,
    gst_password: formData.loginDetails.gstPassword || null,
    gst_registration_type: formData.loginDetails.gstRegistrationType || null,
    gst_return_frequency: formData.loginDetails.gstReturnFrequency || null,
  };
};

export const validateRequiredFields = (formData: ClientFormData): boolean => {
  if (!formData.basicDetails.fileNo.trim()) {
    console.error('File No is required');
    return false;
  }
  
  if (!formData.basicDetails.name.trim()) {
    console.error('Client name is required');
    return false;
  }
  
  return true;
};
