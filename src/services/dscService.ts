
import { supabase } from '@/integrations/supabase/client';
import { DSCCertificate, CreateDSCData, UpdateDSCData } from '@/types/dsc';

export const dscService = {
  async fetchDSCCertificates(): Promise<DSCCertificate[]> {
    console.log('Fetching DSC certificates...');
    const { data, error } = await supabase
      .from('dsc_certificates')
      .select(`
        *,
        certificate_holder:profiles!certificate_holder_profile_id(full_name),
        contact_person:profiles!contact_person_id(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching DSC certificates:', error);
      throw error;
    }

    console.log('Fetched DSC certificates:', data);
    return data.map(cert => ({
      ...cert,
      certificate_holder_name: cert.certificate_holder?.full_name || 'Unknown',
      contact_person_name: cert.contact_person?.full_name || 'Not assigned'
    })) as DSCCertificate[];
  },

  async fetchClientDSCCertificates(clientId: string): Promise<DSCCertificate[]> {
    console.log('Fetching client DSC certificates for:', clientId);
    const { data, error } = await supabase
      .from('dsc_certificates')
      .select(`
        *,
        certificate_holder:profiles!certificate_holder_profile_id(full_name),
        contact_person:profiles!contact_person_id(full_name)
      `)
      .eq('certificate_holder_profile_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching client DSC certificates:', error);
      throw error;
    }

    console.log('Fetched client DSC certificates:', data);
    return data.map(cert => ({
      ...cert,
      certificate_holder_name: cert.certificate_holder?.full_name || 'Unknown',
      contact_person_name: cert.contact_person?.full_name || 'Not assigned'
    })) as DSCCertificate[];
  },

  async createDSCCertificate(dscData: CreateDSCData): Promise<DSCCertificate> {
    console.log('Creating DSC certificate:', dscData);
    const { data, error } = await supabase
      .from('dsc_certificates')
      .insert(dscData)
      .select(`
        *,
        certificate_holder:profiles!certificate_holder_profile_id(full_name),
        contact_person:profiles!contact_person_id(full_name)
      `)
      .single();

    if (error) {
      console.error('Error creating DSC certificate:', error);
      throw error;
    }

    console.log('DSC certificate created successfully:', data);
    return {
      ...data,
      certificate_holder_name: data.certificate_holder?.full_name || 'Unknown',
      contact_person_name: data.contact_person?.full_name || 'Not assigned'
    } as DSCCertificate;
  },

  async updateDSCCertificate(updateData: UpdateDSCData): Promise<DSCCertificate> {
    console.log('Updating DSC certificate:', updateData);
    const { id, ...updates } = updateData;
    
    const { data, error } = await supabase
      .from('dsc_certificates')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        certificate_holder:profiles!certificate_holder_profile_id(full_name),
        contact_person:profiles!contact_person_id(full_name)
      `)
      .single();

    if (error) {
      console.error('Error updating DSC certificate:', error);
      throw error;
    }

    console.log('DSC certificate updated successfully:', data);
    return {
      ...data,
      certificate_holder_name: data.certificate_holder?.full_name || 'Unknown',
      contact_person_name: data.contact_person?.full_name || 'Not assigned'
    } as DSCCertificate;
  },

  async deleteDSCCertificate(id: string): Promise<void> {
    console.log('Deleting DSC certificate:', id);
    const { error } = await supabase
      .from('dsc_certificates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting DSC certificate:', error);
      throw error;
    }

    console.log('DSC certificate deleted successfully');
  }
};
