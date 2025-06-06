
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, FileText, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

const IncomeTaxApp = () => {
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);
  const [collectedDocumentDetails, setCollectedDocumentDetails] = useState<Record<string, { value: string; fileName: string }>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string }>({ title: '', content: '' });
  const [validationMessages, setValidationMessages] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});
  const chartRef = useRef<HTMLCanvasElement>(null);

  const itData = {
    salaried_individual: {
      label: 'Salaried Individual',
      icon: '💼',
      docCount: 5,
      keyTakeaway: "Primarily focuses on employment and investment proofs. Ensure Form 16 matches your salary slips and bank statements.",
      docs: {
        income: [
          { name: "PAN Card", detailKey: 'pan' },
          { name: "Aadhaar Card", detailKey: 'aadhaar' },
          { name: "Bank Account Details (Bank Statements/Passbook)", detailKey: 'bank' },
          { name: "Form 16 (TDS Certificate from Employer)", detailKey: 'form16' },
          { name: "Salary Slips (for all months)", detailKey: 'generic-doc-desc' },
          { name: "Form 26AS & AIS/TIS (Taxpayer Information Summary)", detailKey: 'generic-doc-desc' },
        ],
        deductions: [
          { name: "Investment Proofs (80C, ELSS, PPF, etc.)", detailKey: 'invest' },
          { name: "Health Insurance Premium (80D)", detailKey: 'generic-doc-desc' },
          { name: "Home Loan Interest Certificate", detailKey: 'generic-doc-desc' },
          { name: "Education Loan Interest Certificate (80E)", detailKey: 'generic-doc-desc' },
          { name: "Rent Receipts (if HRA claimed)", detailKey: 'generic-doc-desc' },
          { name: "Donation Receipts (80G)", detailKey: 'generic-doc-desc' },
        ],
        other: [
          { name: "Capital Gains Statement (if applicable)", detailKey: 'generic-doc-desc' },
          { name: "Interest Income Certificates (FDs, Savings A/C)", detailKey: 'generic-doc-desc' },
        ]
      }
    },
    self_employed: {
      label: 'Self-Employed / Freelancer',
      icon: '📈',
      docCount: 7,
      keyTakeaway: "Requires detailed financial records of your business/profession. Bookkeeping is key for accurate income and expense reporting.",
      docs: {
        income: [
          { name: "PAN Card", detailKey: 'pan' },
          { name: "Aadhaar Card", detailKey: 'aadhaar' },
          { name: "Bank Account Details (Bank Statements/Passbook)", detailKey: 'bank' },
          { name: "Books of Accounts (Cash book, Ledgers, etc.)", detailKey: 'generic-doc-desc' },
          { name: "Balance Sheet & Profit & Loss Account", detailKey: 'generic-doc-desc' },
          { name: "Audit Report (if applicable, Form 3CD)", detailKey: 'generic-doc-desc' },
          { name: "GST Returns (if GST registered)", detailKey: 'generic-doc-desc' },
          { name: "Form 26AS & AIS/TIS", detailKey: 'generic-doc-desc' },
        ],
        deductions: [
          { name: "Investment Proofs (80C, 80D, etc.)", detailKey: 'invest' },
          { name: "TDS Certificates (Form 16A, 16B, 16C)", detailKey: 'generic-doc-desc' },
        ],
        other: [
          { name: "Property Sale Documents (for capital gains)", detailKey: 'generic-doc-desc' },
          { name: "Other Income Proofs (Rent, Interest, etc.)", detailKey: 'generic-doc-desc' },
        ]
      }
    },
    proprietorship_business: {
      label: 'Proprietorship Business',
      icon: '🏪',
      docCount: 8,
      keyTakeaway: "Business income and expenses are filed under the owner's PAN. Clear segregation of personal and business transactions is vital.",
      docs: {
        income: [
          { name: "Proprietor's PAN Card", detailKey: 'pan' },
          { name: "Proprietor's Aadhaar Card", detailKey: 'aadhaar' },
          { name: "Bank Account Details (Business & Personal)", detailKey: 'bank' },
          { name: "Books of Accounts (Cash book, Ledgers, etc.)", detailKey: 'generic-doc-desc' },
          { name: "Balance Sheet & Profit & Loss Account", detailKey: 'generic-doc-desc' },
          { name: "Audit Report (if applicable, Form 3CB-3CD)", detailKey: 'generic-doc-desc' },
          { name: "GST Returns (if GST registered)", detailKey: 'generic-doc-desc' },
          { name: "TDS Certificates received (Form 16A)", detailKey: 'generic-doc-desc' },
          { name: "Form 26AS & AIS/TIS", detailKey: 'generic-doc-desc' },
        ],
        deductions: [
          { name: "All personal investment/expense proofs", detailKey: 'invest' },
          { name: "Business expense receipts/invoices", detailKey: 'generic-doc-desc' },
        ],
        other: [
          { name: "Property Sale Documents (for capital gains)", detailKey: 'generic-doc-desc' },
        ]
      }
    },
    partnership_firm: {
      label: 'Partnership Firm',
      icon: '👥',
      docCount: 9,
      keyTakeaway: "Requires firm's PAN and detailed financial statements. Partners' individual tax documents are also needed for their personal filings.",
      docs: {
        income: [
          { name: "Firm's PAN Card", detailKey: 'pan' },
          { name: "Partnership Deed", detailKey: 'generic-doc-desc' },
          { name: "Bank Account Statements (Firm's)", detailKey: 'bank' },
          { name: "Books of Accounts (Firm's)", detailKey: 'generic-doc-desc' },
          { name: "Balance Sheet & Profit & Loss Account (Firm's)", detailKey: 'generic-doc-desc' },
          { name: "Audit Report (if applicable, Form 3CB-3CD)", detailKey: 'generic-doc-desc' },
          { name: "GST Returns (if GST registered)", detailKey: 'generic-doc-desc' },
          { name: "TDS Certificates received by Firm (Form 16A)", detailKey: 'generic-doc-desc' },
          { name: "Form 26AS & AIS/TIS of Firm", detailKey: 'generic-doc-desc' },
        ],
        deductions: [],
        other: [
          { name: "Individual PAN & Aadhaar of all Partners", detailKey: 'pan-aadhaar' },
          { name: "Partners' capital account statements", detailKey: 'generic-doc-desc' },
        ]
      }
    },
    llp: {
      label: 'Limited Liability Partnership (LLP)',
      icon: '🏢',
      docCount: 10,
      keyTakeaway: "Similar to partnership, but with separate legal entity. Audit is mandatory for higher turnover. Digital Signature Certificate (DSC) is needed.",
      docs: {
        income: [
          { name: "LLP's PAN Card", detailKey: 'pan' },
          { name: "LLP Agreement", detailKey: 'generic-doc-desc' },
          { name: "Certificate of Incorporation (MCA)", detailKey: 'generic-doc-desc' },
          { name: "Bank Account Statements (LLP's)", detailKey: 'bank' },
          { name: "Books of Accounts (LLP's)", detailKey: 'generic-doc-desc' },
          { name: "Balance Sheet & Profit & Loss Account (LLP's)", detailKey: 'generic-doc-desc' },
          { name: "Audit Report (if applicable, Form 3CB-3CD)", detailKey: 'generic-doc-desc' },
          { name: "GST Returns (if GST registered)", detailKey: 'generic-doc-desc' },
          { name: "TDS Certificates received by LLP (Form 16A)", detailKey: 'generic-doc-desc' },
          { name: "Form 26AS & AIS/TIS of LLP", detailKey: 'generic-doc-desc' },
        ],
        deductions: [],
        other: [
          { name: "Individual PAN & Aadhaar of all Designated Partners", detailKey: 'pan-aadhaar' },
          { name: "Digital Signature Certificate (DSC) of Designated Partner", detailKey: 'dsc' },
        ]
      }
    },
    company: {
      label: 'Private/Public Limited Company',
      icon: '🏭',
      docCount: 11,
      keyTakeaway: "Most extensive documentation due to corporate structure and compliance. Audit is mandatory regardless of turnover. DSC is required.",
      docs: {
        income: [
          { name: "Company's PAN Card", detailKey: 'pan' },
          { name: "Certificate of Incorporation (MCA)", detailKey: 'generic-doc-desc' },
          { name: "Memorandum & Articles of Association (MOA/AOA)", detailKey: 'generic-doc-desc' },
          { name: "Bank Account Statements (Company's)", detailKey: 'bank' },
          { name: "Books of Accounts (Company's)", detailKey: 'generic-doc-desc' },
          { name: "Balance Sheet & Profit & Loss Account (Company's)", detailKey: 'generic-doc-desc' },
          { name: "Audit Report (Mandatory, Form 3CD)", detailKey: 'generic-doc-desc' },
          { name: "GST Returns (if GST registered)", detailKey: 'generic-doc-desc' },
          { name: "TDS Certificates received by Company (Form 16A)", detailKey: 'generic-doc-desc' },
          { name: "Form 26AS & AIS/TIS of Company", detailKey: 'generic-doc-desc' },
          { name: "Board Resolutions (for significant transactions)", detailKey: 'generic-doc-desc' },
        ],
        deductions: [],
        other: [
          { name: "Individual PAN & Aadhaar of all Directors", detailKey: 'pan-aadhaar' },
          { name: "Digital Signature Certificate (DSC) of Authorized Signatory", detailKey: 'dsc' },
        ]
      }
    }
  };

  const itDetailModals = {
    pan: { 
      title: "Permanent Account Number (PAN)", 
      content: "PAN is mandatory for every taxpayer in India, whether individual or entity. It's crucial for all financial transactions and tax filings. Ensure details match your other documents." 
    },
    aadhaar: { 
      title: "Aadhaar Card", 
      content: "Aadhaar is mandatory for linking with PAN for most individuals to file ITR. It is also used for e-verification of your return." 
    },
    bank: {
      title: "Bank Account Details",
      content: "Bank statements are essential to verify income, expenses, and to check for any TDS deductions. You'll need: Bank Statements for the entire financial year (April 1 to March 31), Bank Passbook (first page with account details), IFSC Code and Account Number. Note: If you have multiple bank accounts, statements for all active accounts are required."
    },
    form16: {
      title: "Form 16 (TDS Certificate)",
      content: "Form 16 is issued by your employer if tax has been deducted from your salary. It has two parts: Part A: Details of TDS, PAN, TAN of employer, assessment year, and period of employment. Part B: Details of gross salary, deductions (under Chapter VIA), and other allowances. Note: You need Form 16 from all employers if you changed jobs during the financial year."
    },
    invest: {
      title: "Investment Proofs for Deductions",
      content: "Documents supporting claims for deductions under various sections of the Income Tax Act (e.g., 80C, 80D, 80E, 80G). Common Examples: Life Insurance Premium receipts, Public Provident Fund (PPF) passbook, ELSS investment statements, Fixed Deposit (FD) certificates (if eligible for tax-saving), Home Loan Principal repayment statement, Tuition Fee receipts for children, Medical Insurance Premium receipts (80D), Donation receipts (80G)."
    },
    dsc: { 
      title: "Digital Signature Certificate (DSC)", 
      content: "A valid Class 2 or Class 3 DSC is mandatory for filing income tax returns for Companies and LLPs, and for individuals/firms whose accounts are subject to audit. It's the digital equivalent of a physical signature." 
    },
    'pan-aadhaar': { 
      title: "PAN & Aadhaar Card (Individual)", 
      content: "For individuals, both PAN and Aadhaar are required. Ensure your Aadhaar is linked with your PAN." 
    },
    'generic-doc-desc': { 
      title: "General Document Details", 
      content: "Please describe the document details briefly. For example, 'Books of accounts as on 31st March 20XX' or 'TDS Certificate from Bank for FY 20XX-YY'." 
    }
  };

  const validateInput = (value: string, detailKey: string) => {
    if (detailKey === 'pan') {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(value)) {
        return { type: 'error' as const, message: 'Invalid PAN format. Should be like ABCDE1234F' };
      }
      return { type: 'success' as const, message: 'Valid PAN format' };
    }
    
    if (detailKey === 'aadhaar') {
      const aadhaarRegex = /^[0-9]{12}$/;
      if (!aadhaarRegex.test(value.replace(/\s/g, ''))) {
        return { type: 'error' as const, message: 'Invalid Aadhaar format. Should be 12 digits' };
      }
      return { type: 'success' as const, message: 'Valid Aadhaar format' };
    }
    
    if (value.length === 0) {
      return { type: 'error' as const, message: 'This field is required' };
    }
    
    return { type: 'success' as const, message: 'Field captured' };
  };

  const handleInputChange = (docName: string, field: 'value' | 'fileName', newValue: string) => {
    setCollectedDocumentDetails(prev => ({
      ...prev,
      [docName]: {
        ...prev[docName],
        [field]: newValue
      }
    }));
  };

  const handleFileChange = (docName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange(docName, 'fileName', file.name);
    }
  };

  const validateField = (docName: string, detailKey: string) => {
    const value = collectedDocumentDetails[docName]?.value || '';
    const validation = validateInput(value, detailKey);
    setValidationMessages(prev => ({
      ...prev,
      [docName]: validation
    }));
  };

  const generatePDF = () => {
    // Create a simple text summary for download
    const selectedEntity = selectedEntityType ? itData[selectedEntityType as keyof typeof itData] : null;
    if (!selectedEntity) return;

    let summary = `Income Tax Document Summary\n\n`;
    summary += `Entity Type: ${selectedEntity.label}\n`;
    summary += `Key Takeaway: ${selectedEntity.keyTakeaway}\n\n`;
    summary += `Documents and Details:\n\n`;

    Object.entries(collectedDocumentDetails).forEach(([docName, details]) => {
      summary += `${docName}:\n`;
      summary += `  Details: ${details.value || 'Not provided'}\n`;
      summary += `  File: ${details.fileName || 'No file uploaded'}\n\n`;
    });

    // Create and download the summary as a text file
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Income_Tax_Details_Summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAllDocuments = () => {
    if (!selectedEntityType) return [];
    const entity = itData[selectedEntityType as keyof typeof itData];
    return [
      ...entity.docs.income,
      ...entity.docs.deductions,
      ...entity.docs.other
    ];
  };

  const openModal = (detailKey: string) => {
    const modal = itDetailModals[detailKey as keyof typeof itDetailModals];
    if (modal) {
      setModalContent(modal);
      setShowModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Process Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Income Tax Filing Process at a Glance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">1️⃣</div>
              <h3 className="font-semibold">Select Entity</h3>
              <p className="text-sm text-gray-600">Choose your income source type</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">2️⃣</div>
              <h3 className="font-semibold">Review Documents</h3>
              <p className="text-sm text-gray-600">See personalized checklist</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">3️⃣</div>
              <h3 className="font-semibold">Fill Details</h3>
              <p className="text-sm text-gray-600">Enter document information</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">4️⃣</div>
              <h3 className="font-semibold">Generate Summary</h3>
              <p className="text-sm text-gray-600">Download your compiled data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entity Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select Your Income Source / Entity Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(itData).map(([key, entity]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedEntityType === key ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => setSelectedEntityType(key)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{entity.icon}</div>
                  <h3 className="font-semibold mb-2">{entity.label}</h3>
                  <Badge variant="secondary">{entity.docCount} documents</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Checklist */}
      {selectedEntityType && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Document Checklist for {itData[selectedEntityType as keyof typeof itData].label}</CardTitle>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Key Takeaway:</strong> {itData[selectedEntityType as keyof typeof itData].keyTakeaway}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {Object.entries(itData[selectedEntityType as keyof typeof itData].docs).map(([category, docs]) => (
                  docs.length > 0 && (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="text-left">
                        <span className="capitalize font-semibold">{category} Documents ({docs.length})</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {docs.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium">{doc.name}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openModal(doc.detailKey)}
                              >
                                Details
                              </Button>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Document Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Enter Document Details and Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getAllDocuments().map((doc, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <Label className="text-base font-semibold">{doc.name}</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor={`details-${index}`} className="text-sm">Document Details</Label>
                        <Textarea
                          id={`details-${index}`}
                          placeholder="Enter document details..."
                          value={collectedDocumentDetails[doc.name]?.value || ''}
                          onChange={(e) => handleInputChange(doc.name, 'value', e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex justify-between items-center mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => validateField(doc.name, doc.detailKey)}
                          >
                            Validate
                          </Button>
                          {validationMessages[doc.name] && (
                            <div className={`text-sm ${
                              validationMessages[doc.name].type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {validationMessages[doc.name].type === 'success' ? (
                                <CheckCircle className="inline h-4 w-4 mr-1" />
                              ) : (
                                <AlertTriangle className="inline h-4 w-4 mr-1" />
                              )}
                              {validationMessages[doc.name].message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`file-${index}`} className="text-sm">Upload File</Label>
                        <div className="mt-1">
                          <Input
                            id={`file-${index}`}
                            type="file"
                            onChange={(e) => handleFileChange(doc.name, e)}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          {collectedDocumentDetails[doc.name]?.fileName && (
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                              <Upload className="h-4 w-4 mr-1" />
                              {collectedDocumentDetails[doc.name].fileName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate PDF Section */}
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Generate Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Button onClick={generatePDF} size="lg" className="bg-primary hover:bg-primary/90">
                  <Download className="h-5 w-5 mr-2" />
                  Generate PDF Summary
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Download a summary of all your entered details and uploaded files
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal for document details */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalContent.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>{modalContent.content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncomeTaxApp;
