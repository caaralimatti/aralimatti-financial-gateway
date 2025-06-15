import type { Tables } from '@/integrations/supabase/types';
import type { ClientFormData, ContactPerson, CustomField } from '@/types/clientForm';

export const getInitialFormData = (editingClient?: Tables<'clients'> | null): ClientFormData => {
  if (!editingClient) {
    return {
      taxesApplicable: {
        gst: false,
        incomeTax: true,
        mca: false,
        tdsTcs: false,
        other: false,
      },
      basicDetails: {
        fileNo: '',
        clientType: '',
        name: '',
        tradeName: '',
        dateOfBirth: '',
        otherUsers: '',
        workingUser: '',
        tags: '',
        notes: '',
      },
      incomeTaxDetails: {
        pan: '',
        tan: '',
        incomeTaxReturns: [],
        tdsTcsReturns: [],
        gstReturns: false,
      },
      contactPersons: [],
      clientGroups: [],
      customFields: [],
      loginDetails: {
        itPan: '',
        itPassword: '',
        itTan: '',
        itDeductorPassword: '',
        tracesUsername: '',
        tracesDeductorPassword: '',
        tracesTaxpayerPassword: '',
        mcaV2Username: '',
        mcaV2Password: '',
        mcaV3Username: '',
        mcaV3Password: '',
        dgftUsername: '',
        dgftPassword: '',
        gstNumber: '',
        gstUsername: '',
        gstPassword: '',
        gstRegistrationType: 'Regular',
        gstReturnFrequency: 'Monthly',
      },
      attachments: [],
      portalUser: {
        createPortalUser: false,
        email: '',
        fullName: '',
        generatedPassword: '',
      },
    };
  }

  // Map client data to form structure
  const formData: ClientFormData = {
    taxesApplicable: {
      gst: editingClient.gst_applicable || false,
      incomeTax: editingClient.income_tax_applicable || true,
      mca: editingClient.mca_applicable || false,
      tdsTcs: editingClient.tds_tcs_applicable || false,
      other: editingClient.other_tax_applicable || false,
    },
    basicDetails: {
      fileNo: editingClient.file_no || '',
      clientType: editingClient.client_type || '',
      name: editingClient.name || '',
      tradeName: editingClient.trade_name || '',
      dateOfBirth: editingClient.date_of_birth || '',
      otherUsers: editingClient.other_users || '',
      workingUser: editingClient.working_user_id || '',
      tags: Array.isArray(editingClient.tags) ? editingClient.tags.join(', ') : '',
      notes: editingClient.notes || '',
    },
    incomeTaxDetails: {
      pan: editingClient.pan || '',
      tan: editingClient.tan || '',
      incomeTaxReturns: [],
      tdsTcsReturns: [],
      gstReturns: editingClient.gst_applicable || false,
    },
    contactPersons: [],
    clientGroups: [],
    customFields: [],
    loginDetails: {
      itPan: editingClient.it_pan || '',
      itPassword: editingClient.it_password || '',
      itTan: editingClient.it_tan || '',
      itDeductorPassword: editingClient.it_deductor_password || '',
      tracesUsername: editingClient.traces_username || '',
      tracesDeductorPassword: editingClient.traces_deductor_password || '',
      tracesTaxpayerPassword: editingClient.traces_taxpayer_password || '',
      mcaV2Username: editingClient.mca_v2_username || '',
      mcaV2Password: editingClient.mca_v2_password || '',
      mcaV3Username: editingClient.mca_v3_username || '',
      mcaV3Password: editingClient.mca_v3_password || '',
      dgftUsername: editingClient.dgft_username || '',
      dgftPassword: editingClient.dgft_password || '',
      gstNumber: editingClient.gst_number || '',
      gstUsername: editingClient.gst_username || '',
      gstPassword: editingClient.gst_password || '',
      gstRegistrationType: editingClient.gst_registration_type || 'Regular',
      gstReturnFrequency: editingClient.gst_return_frequency || 'Monthly',
    },
    attachments: [],
    portalUser: {
      createPortalUser: false,
      email: '',
      fullName: '',
      generatedPassword: '',
    },
  };

  // If client has a portal user, we'll handle this in the PortalUserTab component
  // Store the portal user ID for reference
  if (editingClient.primary_portal_user_profile_id) {
    (formData as any).existingPortalUserId = editingClient.primary_portal_user_profile_id;
  }

  return formData;
};

export const validateRequiredFields = (formData: ClientFormData): boolean => {
  const { basicDetails, portalUser } = formData;
  
  // Basic required fields
  if (!basicDetails.clientType || !basicDetails.name) {
    return false;
  }

  // Portal user validation if enabled
  if (portalUser.createPortalUser) {
    if (!portalUser.email || !portalUser.fullName) {
      return false;
    }
  }

  return true;
};

export const transformFormDataToClientData = (formData: ClientFormData) => {
  return {
    file_no: formData.basicDetails.fileNo,
    client_type: formData.basicDetails.clientType as "Individual" | "Company" | "Partnership" | "LLP" | "Trust" | "HUF" | "Other",
    name: formData.basicDetails.name,
    trade_name: formData.basicDetails.tradeName,
    date_of_birth: formData.basicDetails.dateOfBirth || null,
    other_users: formData.basicDetails.otherUsers,
    tags: formData.basicDetails.tags ? formData.basicDetails.tags.split(',').map(tag => tag.trim()) : null,
    notes: formData.basicDetails.notes,
    gst_applicable: formData.taxesApplicable.gst,
    income_tax_applicable: formData.taxesApplicable.incomeTax,
    mca_applicable: formData.taxesApplicable.mca,
    tds_tcs_applicable: formData.taxesApplicable.tdsTcs,
    other_tax_applicable: formData.taxesApplicable.other,
    pan: formData.incomeTaxDetails.pan,
    tan: formData.incomeTaxDetails.tan,
    it_pan: formData.loginDetails.itPan,
    it_password: formData.loginDetails.itPassword,
    it_tan: formData.loginDetails.itTan,
    it_deductor_password: formData.loginDetails.itDeductorPassword,
    traces_username: formData.loginDetails.tracesUsername,
    traces_deductor_password: formData.loginDetails.tracesDeductorPassword,
    traces_taxpayer_password: formData.loginDetails.tracesTaxpayerPassword,
    mca_v2_username: formData.loginDetails.mcaV2Username,
    mca_v2_password: formData.loginDetails.mcaV2Password,
    mca_v3_username: formData.loginDetails.mcaV3Username,
    mca_v3_password: formData.loginDetails.mcaV3Password,
    dgft_username: formData.loginDetails.dgftUsername,
    dgft_password: formData.loginDetails.dgftPassword,
    gst_number: formData.loginDetails.gstNumber,
    gst_username: formData.loginDetails.gstUsername,
    gst_password: formData.loginDetails.gstPassword,
    gst_registration_type: formData.loginDetails.gstRegistrationType,
    gst_return_frequency: formData.loginDetails.gstReturnFrequency,
    primary_portal_user_profile_id: null, // Will be set after user creation
  };
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeLabel = (fileType: string): string => {
  const typeMap: { [key: string]: string } = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG',
    'image/png': 'PNG'
  };
  return typeMap[fileType] || 'Unknown';
};
