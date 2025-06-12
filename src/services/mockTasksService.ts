
import { Task } from '@/types/task';

// Mock data service - replace with actual data from backend later
export const mockTasks: Task[] = [
  {
    id: 'T001',
    title: 'GST Return Filing - ABC Pvt Ltd',
    description: 'Complete monthly GST return filing for March 2024',
    category_id: 'cat-gst-001',
    status: 'in_progress',
    priority: 'high',
    assigned_to_profile_id: 'profile-sarah',
    created_by_profile_id: 'profile-john',
    start_date: '2024-03-01',
    deadline_date: '2024-03-20',
    estimated_effort_hours: 8,
    client_id: 'client-abc',
    is_billable: true,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
    assigned_to: {
      full_name: 'Sarah Staff',
      email: 'sarah@example.com'
    },
    created_by: {
      full_name: 'John Manager',
      email: 'john@example.com'
    },
    client: {
      name: 'ABC Pvt Ltd'
    },
    task_categories: {
      name: 'GST'
    },
    sub_tasks: [
      { id: '1', title: 'Collect invoices', description: 'Gather all invoices', is_completed: true },
      { id: '2', title: 'Prepare return', description: 'Prepare GST return', is_completed: true },
      { id: '3', title: 'Review and file', description: 'Final review and filing', is_completed: false }
    ],
    task_comments: [
      { id: '1', comment_text: 'Started working on this', created_at: '2024-03-02T00:00:00Z', commented_by: { full_name: 'Sarah Staff', email: 'sarah@example.com' } },
      { id: '2', comment_text: 'Need clarification on invoice format', created_at: '2024-03-05T00:00:00Z', commented_by: { full_name: 'Sarah Staff', email: 'sarah@example.com' } }
    ],
    task_attachments: [
      { id: '1', file_name: 'invoices.pdf', file_url: '/files/invoices.pdf', file_type: 'application/pdf', file_size: 1024000 }
    ]
  },
  {
    id: 'T002',
    title: 'Annual Audit - XYZ Corp',
    description: 'Conduct annual statutory audit for FY 2023-24',
    category_id: 'cat-audit-001',
    status: 'pending_approval',
    priority: 'medium',
    assigned_to_profile_id: 'profile-mike',
    created_by_profile_id: 'profile-john',
    start_date: '2024-02-15',
    deadline_date: '2024-04-30',
    estimated_effort_hours: 40,
    client_id: 'client-xyz',
    is_billable: true,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
    assigned_to: {
      full_name: 'Mike Auditor',
      email: 'mike@example.com'
    },
    created_by: {
      full_name: 'John Manager',
      email: 'john@example.com'
    },
    client: {
      name: 'XYZ Corp'
    },
    task_categories: {
      name: 'Audit'
    },
    sub_tasks: [
      { id: '1', title: 'Plan audit', description: 'Create audit plan', is_completed: true },
      { id: '2', title: 'Field work', description: 'Conduct field work', is_completed: true },
      { id: '3', title: 'Draft report', description: 'Prepare draft report', is_completed: true },
      { id: '4', title: 'Final review', description: 'Final review and approval', is_completed: false }
    ],
    task_comments: [
      { id: '1', comment_text: 'Audit plan completed', created_at: '2024-02-20T00:00:00Z', commented_by: { full_name: 'Mike Auditor', email: 'mike@example.com' } },
      { id: '2', comment_text: 'Field work in progress', created_at: '2024-03-01T00:00:00Z', commented_by: { full_name: 'Mike Auditor', email: 'mike@example.com' } },
      { id: '3', comment_text: 'Draft report ready for review', created_at: '2024-03-10T00:00:00Z', commented_by: { full_name: 'Mike Auditor', email: 'mike@example.com' } },
      { id: '4', comment_text: 'Awaiting partner review', created_at: '2024-03-12T00:00:00Z', commented_by: { full_name: 'Mike Auditor', email: 'mike@example.com' } },
      { id: '5', comment_text: 'Minor revisions needed', created_at: '2024-03-14T00:00:00Z', commented_by: { full_name: 'John Manager', email: 'john@example.com' } }
    ],
    task_attachments: [
      { id: '1', file_name: 'audit_plan.pdf', file_url: '/files/audit_plan.pdf', file_type: 'application/pdf', file_size: 512000 },
      { id: '2', file_name: 'field_notes.docx', file_url: '/files/field_notes.docx', file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', file_size: 256000 },
      { id: '3', file_name: 'draft_report.pdf', file_url: '/files/draft_report.pdf', file_type: 'application/pdf', file_size: 1536000 },
      { id: '4', file_name: 'supporting_docs.zip', file_url: '/files/supporting_docs.zip', file_type: 'application/zip', file_size: 5120000 },
      { id: '5', file_name: 'client_responses.xlsx', file_url: '/files/client_responses.xlsx', file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', file_size: 768000 },
      { id: '6', file_name: 'working_papers.pdf', file_url: '/files/working_papers.pdf', file_type: 'application/pdf', file_size: 2048000 },
      { id: '7', file_name: 'management_letter.pdf', file_url: '/files/management_letter.pdf', file_type: 'application/pdf', file_size: 384000 },
      { id: '8', file_name: 'final_financials.pdf', file_url: '/files/final_financials.pdf', file_type: 'application/pdf', file_size: 1024000 }
    ]
  },
  {
    id: 'T003',
    title: 'ROC Compliance - DEF Industries',
    description: 'File annual returns and maintain ROC compliance',
    category_id: 'cat-roc-001',
    status: 'to_do',
    priority: 'low',
    assigned_to_profile_id: 'profile-alex',
    created_by_profile_id: 'profile-jane',
    start_date: '2024-03-10',
    deadline_date: '2024-03-30',
    estimated_effort_hours: 6,
    client_id: 'client-def',
    is_billable: true,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z',
    assigned_to: {
      full_name: 'Alex Junior',
      email: 'alex@example.com'
    },
    created_by: {
      full_name: 'Jane Partner',
      email: 'jane@example.com'
    },
    client: {
      name: 'DEF Industries'
    },
    task_categories: {
      name: 'ROC'
    },
    sub_tasks: [
      { id: '1', title: 'Gather documents', description: 'Collect required documents', is_completed: false },
      { id: '2', title: 'Prepare filings', description: 'Prepare ROC filings', is_completed: false },
      { id: '3', title: 'Submit to ROC', description: 'Submit filings to ROC', is_completed: false }
    ],
    task_comments: [],
    task_attachments: []
  }
];

export const getMockTasks = (): Task[] => mockTasks;
