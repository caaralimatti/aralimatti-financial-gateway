
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, FileText, Download, Upload } from 'lucide-react';
import GSTDocumentModal from './GSTDocumentModal';

interface GSTData {
  [key: string]: {
    label: string;
    icon: string;
    docCount: number;
    keyTakeaway: string;
    docs: {
      specific: { name: string; detailKey: string | null }[];
      personnel: { name: string; detailKey: string | null }[];
    };
  };
}

interface UniversalDoc {
  name: string;
  detailKey: string | null;
}

interface DetailModal {
  title: string;
  content: string;
}

const gstData: GSTData = {
  proprietorship: {
    label: 'Sole Proprietorship',
    icon: '👤',
    docCount: 4,
    keyTakeaway: "Documentation is simpler, focusing on the individual owner's identity and the business location's legitimacy.",
    docs: {
      specific: [],
      personnel: [
        { name: "Owner's PAN Card", detailKey: null },
        { name: "Owner's Aadhaar Card", detailKey: 'aadhaar' },
        { name: "Owner's Photograph", detailKey: 'photo' },
        { name: "Owner's Address Proof", detailKey: null },
      ]
    }
  },
  partnership: {
    label: 'Partnership Firm',
    icon: '👥',
    docCount: 6,
    keyTakeaway: "The Partnership Deed is the central legal document. Comprehensive identity and address proofs for all partners are crucial.",
    docs: {
      specific: [
        { name: "PAN Card of the Partnership Firm", detailKey: 'pan' },
        { name: "Partnership Deed", detailKey: null },
        { name: "Affidavit of Correctness", detailKey: null }
      ],
      personnel: [
        { name: "PAN Card of all Partners", detailKey: null },
        { name: "Aadhaar Card of all Partners", detailKey: 'aadhaar' },
        { name: "Photographs of all Partners", detailKey: 'photo' },
        { name: "Address Proof of all Partners", detailKey: null },
      ]
    }
  },
  llp: {
    label: 'LLP',
    icon: '🏢',
    docCount: 7,
    keyTakeaway: "Requires both incorporation documents (like a company) and an LLP Agreement (like a partnership deed). A DSC is mandatory.",
    docs: {
      specific: [
        { name: "PAN Card of the LLP", detailKey: 'pan' },
        { name: "LLP Agreement", detailKey: null },
        { name: "Certificate of Incorporation (MCA)", detailKey: null }
      ],
      personnel: [
        { name: "PAN Card of all Designated Partners", detailKey: null },
        { name: "Aadhaar Card of all Designated Partners", detailKey: 'aadhaar' },
        { name: "Photographs of all Designated Partners", detailKey: 'photo' },
        { name: "Digital Signature Certificate (DSC) of Authorized Signatory", detailKey: 'dsc' }
      ]
    }
  },
  pvt_ltd: {
    label: 'Private Ltd. Co.',
    icon: '💼',
    docCount: 8,
    keyTakeaway: "Extensive documentation focusing on corporate governance (MOA/AOA, Board Resolutions) is required. A DSC is mandatory.",
    docs: {
      specific: [
        { name: "Company's PAN Card", detailKey: 'pan' },
        { name: "Certificate of Incorporation (MCA)", detailKey: null },
        { name: "Memorandum / Articles of Association (MOA/AOA)", detailKey: null },
        { name: "Board Resolution for Authorized Signatory", detailKey: 'auth' },
      ],
      personnel: [
        { name: "PAN Card of all Directors", detailKey: null },
        { name: "Aadhaar Card of all Directors", detailKey: 'aadhaar' },
        { name: "Photographs of all Directors", detailKey: 'photo' },
        { name: "Address Proof of all Directors", detailKey: null },
      ]
    }
  },
  pub_ltd: {
    label: 'Public Ltd. Co.',
    icon: '📈',
    docCount: 8,
    keyTakeaway: "Document requirements are identical to a Private Ltd. Co., emphasizing formal corporate structure and governance.",
    docs: {
      specific: [
        { name: "Company's PAN Card", detailKey: 'pan' },
        { name: "Certificate of Incorporation (MCA)", detailKey: null },
        { name: "Memorandum / Articles of Association (MOA/AOA)", detailKey: null },
        { name: "Board Resolution for Authorized Signatory", detailKey: 'auth' },
      ],
      personnel: [
        { name: "PAN Card of all Directors", detailKey: null },
        { name: "Aadhaar Card of all Directors", detailKey: 'aadhaar' },
        { name: "Photographs of all Directors", detailKey: 'photo' },
        { name: "Address Proof of all Directors", detailKey: null },
      ]
    }
  },
  huf: {
    label: 'HUF',
    icon: '👨‍👩‍👧‍👦',
    docCount: 5,
    keyTakeaway: "Documentation focuses on the HUF's distinct PAN and the Karta's identity as the head and authorized representative.",
    docs: {
      specific: [
        { name: "PAN Card of the HUF", detailKey: 'pan' },
        { name: "Declaration Form", detailKey: null },
      ],
      personnel: [
        { name: "PAN Card & Aadhaar Card of the Karta", detailKey: 'aadhaar' },
        { name: "Photograph of the Karta", detailKey: 'photo' },
        { name: "Digital Signature Certificate (DSC)", detailKey: 'dsc' },
      ]
    }
  },
  aop: {
    label: 'Trust / Society / AOP',
    icon: '🤝',
    docCount: 6,
    keyTakeaway: "The foundational legal document (Trust Deed, Registration Certificate, or Bye-laws) is paramount for these entities.",
    docs: {
      specific: [
        { name: "PAN Card of the Entity", detailKey: 'pan' },
        { name: "Trust Deed / Registration Certificate", detailKey: null },
        { name: "Constitution or Bye-laws", detailKey: null },
      ],
      personnel: [
        { name: "PAN & Aadhaar of Trustees/Members", detailKey: 'aadhaar' },
        { name: "Photographs of Trustees/Members", detailKey: 'photo' },
        { name: "Digital Signature Certificate (DSC)", detailKey: 'dsc' },
      ]
    }
  }
};

const universalDocs: UniversalDoc[] = [
  { name: "Proof of Principal Place of Business", detailKey: 'address' },
  { name: "Proof of Bank Account", detailKey: 'bank' },
  { name: "Proof of Appointment of Authorized Signatory", detailKey: 'auth' },
];

const detailModals: { [key: string]: DetailModal } = {
  pan: { title: "Permanent Account Number (PAN)", content: `<p>PAN is mandatory for the business entity itself and all key individuals (proprietor, partners, directors). The details on the PAN must exactly match the application.</p>` },
  aadhaar: { title: "Aadhaar Card", content: `<p>Aadhaar is used for identity verification of all key individuals. Opting for Aadhaar Authentication during registration is highly recommended as it speeds up the process and reduces the chances of a physical verification.</p>` },
  photo: { title: "Photograph", content: `<p>A recent passport-size photograph is required for all key individuals (proprietor, partners, directors, Karta, trustees). </p><p><b>Specifications:</b> JPEG format, maximum file size 100 KB.</p>` },
  address: {
    title: "Proof of Place of Business",
    content: `
      <p class="mb-4">This document verifies the physical location of your business. The requirements change based on who owns the property. All utility bills must be recent (not older than 2-3 months).</p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr><th scope="col" class="px-4 py-2">Property Type</th><th scope="col" class="px-4 py-2">Required Documents</th></tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b"><td class="px-4 py-2 font-medium">Owned Property</td><td class="px-4 py-2">Any ONE: Latest Electricity Bill, Water Bill, or Property Tax Receipt in the owner's name.</td></tr>
            <tr class="bg-gray-50 border-b"><td class="px-4 py-2 font-medium">Rented / Leased</td><td class="px-4 py-2"><b>1.</b> Valid Rent/Lease Agreement<br><b>2.</b> A utility bill in the landlord's name<br><b>3.</b> A No Objection Certificate (NOC) from the landlord.</td></tr>
            <tr class="bg-white"><td class="px-4 py-2 font-medium">Shared / Consent</td><td class="px-4 py-2"><b>1.</b> Consent Letter/NOC from the property owner<br><b>2.</b> A utility bill in the owner's name to prove their ownership.</td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  bank: {
    title: "Proof of Bank Account",
    content: `
      <p class="mb-4">You must provide proof of a bank account held in the legal name of the business. While the application might proceed without it initially, it's mandatory for final approval.</p>
      <p><b>Acceptable Documents (Any ONE):</b></p>
      <ul class="list-disc list-inside mt-2">
        <li>The first page of the Bank Passbook</li>
        <li>A recent Bank Statement</li>
        <li>A canceled cheque (with the business name printed)</li>
      </ul>
      <p class="mt-2"><b>Specifications:</b> JPEG or PDF format, maximum file size 100 KB.</p>
    `
  },
  dsc: { title: "Digital Signature Certificate (DSC)", content: `<p>A valid Class 2 or Class 3 DSC is mandatory for signing the application for Companies and LLPs. It's the digital equivalent of a physical signature. For other entities, an Aadhaar-based EVC (Electronic Verification Code) can often be used instead.</p>` },
  auth: { title: "Proof of Authorized Signatory", content: `<p>This document formally appoints the person responsible for GST compliance. It is typically a <b>Board Resolution</b> for Companies/LLPs or a simple <b>Authorization Letter</b> for other entities.</p>` }
};

interface GSTOnboardingChecklistProps {
  isClient?: boolean;
}

const GSTOnboardingChecklist: React.FC<GSTOnboardingChecklistProps> = ({ isClient = false }) => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<DetailModal | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleEntitySelect = (entityKey: string) => {
    setSelectedEntity(entityKey);
  };

  const handleDetailClick = (detailKey: string) => {
    const modal = detailModals[detailKey];
    if (modal) {
      setModalContent(modal);
      setModalOpen(true);
    }
  };

  const handleFileUpload = (docName: string, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [docName]: file
    }));
  };

  const handleDownload = () => {
    if (!selectedEntity) return;

    const entity = gstData[selectedEntity];
    const allDocs = [
      ...universalDocs,
      ...entity.docs.specific,
      ...entity.docs.personnel
    ];

    const downloadData = {
      businessType: entity.label,
      businessDetails: formData,
      requiredDocuments: allDocs.map(doc => ({
        name: doc.name,
        uploaded: !!uploadedFiles[doc.name],
        fileName: uploadedFiles[doc.name]?.name || 'Not uploaded'
      })),
      generatedAt: new Date().toLocaleString()
    };

    const dataStr = JSON.stringify(downloadData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gst-registration-${entity.label.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderDocumentItem = (doc: { name: string; detailKey: string | null }) => (
    <div key={doc.name} className="py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <FileText className="h-4 w-4 text-gray-400" />
        </div>
        <span className="text-sm text-gray-700">{doc.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        {isClient && (
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(doc.name, file);
              }}
            />
            <Button
              type="button"
              variant={uploadedFiles[doc.name] ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              {uploadedFiles[doc.name] ? "Uploaded" : "Upload"}
            </Button>
          </label>
        )}
        {doc.detailKey && (
          <Button
            onClick={() => handleDetailClick(doc.detailKey!)}
            variant="outline"
            size="sm"
            className="text-xs text-teal-600 hover:text-teal-800 bg-teal-50 border-teal-200"
          >
            Details
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          GST Registration Document Checklist
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select your business type to view required documents
        </p>
      </div>

      {/* Business Type Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Object.entries(gstData).map(([key, entity]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md h-32 ${
              selectedEntity === key
                ? 'border-teal-500 shadow-lg border-2'
                : 'border-gray-200 hover:border-teal-300'
            }`}
            onClick={() => handleEntitySelect(key)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <div className="text-4xl mb-2">{entity.icon}</div>
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                {entity.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Details Form (Client Only) */}
      {isClient && selectedEntity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Checklist */}
      {selectedEntity && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Required Documents for {gstData[selectedEntity].label}
              </h3>
              <Badge variant="outline" className="mt-1">
                {gstData[selectedEntity].docCount} document categories
              </Badge>
            </div>
            {isClient && (
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Summary
              </Button>
            )}
          </div>

          {/* Universal Documents */}
          <Card>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="hover:bg-gray-50 transition-colors">
                  <CardTitle className="text-left flex items-center justify-between">
                    Universal Documents (Required for All)
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="divide-y divide-gray-200">
                    {universalDocs.map(renderDocumentItem)}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Entity-Specific Documents */}
          {gstData[selectedEntity].docs.specific.length > 0 && (
            <Card>
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-gray-50 transition-colors">
                    <CardTitle className="text-left flex items-center justify-between">
                      Entity-Specific Documents
                      <ChevronDown className="h-4 w-4" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="divide-y divide-gray-200">
                      {gstData[selectedEntity].docs.specific.map(renderDocumentItem)}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )}

          {/* Personnel Documents */}
          <Card>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="hover:bg-gray-50 transition-colors">
                  <CardTitle className="text-left flex items-center justify-between">
                    Key Personnel Documents
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="divide-y divide-gray-200">
                    {gstData[selectedEntity].docs.personnel.map(renderDocumentItem)}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Pro Tips */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong className="font-bold text-yellow-800">Pro Tip:</strong>{' '}
                  {gstData[selectedEntity].keyTakeaway}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <GSTDocumentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent?.title || ''}
        content={modalContent?.content || ''}
      />
    </div>
  );
};

export default GSTOnboardingChecklist;
