
// Mock data service - replace with actual data from backend later
export const mockTasks = [
  {
    id: 'T001',
    title: 'GST Return Filing - ABC Pvt Ltd',
    description: 'Complete monthly GST return filing for March 2024',
    category: 'gst',
    status: 'in-progress',
    priority: 'high',
    assignedBy: 'John Manager',
    assignedTo: 'Sarah Staff',
    startDate: '2024-03-01',
    endDate: '2024-03-20',
    deadline: '2024-03-20',
    isBillable: true,
    loggedHours: 4.5,
    estimatedHours: 8,
    client: 'ABC Pvt Ltd',
    subTasks: [
      { id: 1, title: 'Collect invoices', completed: true },
      { id: 2, title: 'Prepare return', completed: true },
      { id: 3, title: 'Review and file', completed: false }
    ],
    comments: 2,
    attachments: 1
  },
  {
    id: 'T002',
    title: 'Annual Audit - XYZ Corp',
    description: 'Conduct annual statutory audit for FY 2023-24',
    category: 'audit',
    status: 'need-approval',
    priority: 'medium',
    assignedBy: 'John Manager',
    assignedTo: 'Mike Auditor',
    startDate: '2024-02-15',
    endDate: '2024-04-30',
    deadline: '2024-04-30',
    isBillable: true,
    loggedHours: 24,
    estimatedHours: 40,
    client: 'XYZ Corp',
    subTasks: [
      { id: 1, title: 'Plan audit', completed: true },
      { id: 2, title: 'Field work', completed: true },
      { id: 3, title: 'Draft report', completed: true },
      { id: 4, title: 'Final review', completed: false }
    ],
    comments: 5,
    attachments: 8
  },
  {
    id: 'T003',
    title: 'ROC Compliance - DEF Industries',
    description: 'File annual returns and maintain ROC compliance',
    category: 'roc',
    status: 'assigned',
    priority: 'low',
    assignedBy: 'Jane Partner',
    assignedTo: 'Alex Junior',
    startDate: '2024-03-10',
    endDate: '2024-03-25',
    deadline: '2024-03-30',
    isBillable: true,
    loggedHours: 0,
    estimatedHours: 6,
    client: 'DEF Industries',
    subTasks: [
      { id: 1, title: 'Gather documents', completed: false },
      { id: 2, title: 'Prepare filings', completed: false },
      { id: 3, title: 'Submit to ROC', completed: false }
    ],
    comments: 0,
    attachments: 0
  }
];

export const getMockTasks = () => mockTasks;
