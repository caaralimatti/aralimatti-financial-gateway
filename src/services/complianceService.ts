
import { supabase } from '@/integrations/supabase/client';
import { ComplianceDeadline, CreateComplianceDeadlineData } from '@/types/compliance';

export interface ComplianceUploadBatch {
  upload_id: string;
  file_name: string;
  uploaded_at: string;
  total_records: number;
}

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

  async fetchComplianceUploadBatches(): Promise<ComplianceUploadBatch[]> {
    console.log('🔥 Fetching compliance upload batches');
    
    const { data, error } = await supabase
      .from('compliance_deadlines')
      .select('upload_id, created_at')
      .not('upload_id', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('🔥 Error fetching upload batches:', error);
      throw error;
    }

    // Group by upload_id to get batch info
    const batches = new Map<string, ComplianceUploadBatch>();
    data?.forEach(item => {
      if (item.upload_id && !batches.has(item.upload_id)) {
        batches.set(item.upload_id, {
          upload_id: item.upload_id,
          file_name: `Upload ${item.upload_id.slice(0, 8)}`,
          uploaded_at: item.created_at,
          total_records: 1
        });
      } else if (item.upload_id && batches.has(item.upload_id)) {
        const batch = batches.get(item.upload_id)!;
        batch.total_records++;
      }
    });

    return Array.from(batches.values());
  },

  async deleteComplianceUploadBatch(uploadId: string): Promise<void> {
    console.log('🔥 Deleting compliance upload batch:', uploadId);
    
    const { error } = await supabase
      .from('compliance_deadlines')
      .delete()
      .eq('upload_id', uploadId);

    if (error) {
      console.error('🔥 Error deleting compliance upload batch:', error);
      throw error;
    }

    console.log('🔥 Deleted compliance upload batch successfully');
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
