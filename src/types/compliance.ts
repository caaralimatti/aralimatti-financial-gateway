
export interface ComplianceDeadline {
  id: string;
  deadline_date: string;
  compliance_type: string;
  form_activity?: string | null;
  description?: string | null;
  relevant_fy_ay?: string | null;
  upload_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateComplianceDeadlineData {
  deadline_date: string;
  compliance_type: string;
  form_activity?: string;
  description?: string;
  relevant_fy_ay?: string;
  upload_id?: string;
}

export interface ComplianceUploadData {
  date: string; // MM DD format
  compliance_type: string;
  form_activity?: string;
  description?: string;
  relevant_fy_ay?: string;
}
