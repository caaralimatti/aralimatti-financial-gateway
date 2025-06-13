
import { supabase } from '@/integrations/supabase/client';
import { ComplianceDeadline, CreateComplianceDeadlineData } from '@/types/compliance';

export const complianceService = {
  async fetchComplianceDeadlines(): Promise<ComplianceDeadline[]> {
    console.log('🔥 Fetching compliance deadlines');
    
    const { data, error } = await supabase
      .from('compliance_deadlines')
      .select('*')
      .order('deadline_date', { ascending: true });

    if (error) {
      console.error('🔥 Error fetching compliance deadlines:', error);
      throw error;
    }

    console.log('🔥 Fetched compliance deadlines:', data);
    return data || [];
  },

  async createComplianceDeadline(deadlineData: CreateComplianceDeadlineData): Promise<ComplianceDeadline> {
    console.log('🔥 Creating compliance deadline:', deadlineData);
    
    const { data, error } = await supabase
      .from('compliance_deadlines')
      .insert(deadlineData)
      .select()
      .single();

    if (error) {
      console.error('🔥 Error creating compliance deadline:', error);
      throw error;
    }

    console.log('🔥 Created compliance deadline:', data);
    return data;
  },

  async upsertComplianceDeadlines(deadlines: CreateComplianceDeadlineData[]): Promise<void> {
    console.log('🔥 Upserting compliance deadlines:', deadlines);
    
    const { error } = await supabase
      .from('compliance_deadlines')
      .upsert(deadlines, {
        onConflict: 'deadline_date,compliance_type,form_activity'
      });

    if (error) {
      console.error('🔥 Error upserting compliance deadlines:', error);
      throw error;
    }

    console.log('🔥 Upserted compliance deadlines successfully');
  },

  async deleteComplianceDeadline(id: string): Promise<void> {
    console.log('🔥 Deleting compliance deadline:', id);
    
    const { error } = await supabase
      .from('compliance_deadlines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('🔥 Error deleting compliance deadline:', error);
      throw error;
    }

    console.log('🔥 Deleted compliance deadline successfully');
  }
};
