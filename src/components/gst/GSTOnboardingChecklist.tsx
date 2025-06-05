
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Info, FileText, Users, Building } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import GSTDocumentModal from './GSTDocumentModal';
import GSTComplexityChart from './GSTComplexityChart';

const gstData = {
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

const universalDocs = [
  { name: "Proof of Principal Place of Business", detailKey: 'address' },
  { name: "Proof of Bank Account", detailKey: 'bank' },
  { name: "Proof of Appointment of Authorized Signatory", detailKey: 'auth' },
];

const GSTOnboardingChecklist: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const handleEntitySelect = (entityKey: string) => {
    setSelectedEntity(entityKey);
  };

  const handleDocumentDetail = (detailKey: string) => {
    const details = {
      pan: { title: "Permanent Account Number (PAN)", content: "PAN is mandatory for the business entity itself and all key individuals (proprietor, partners, directors). The details on the PAN must exactly match the application." },
      aadhaar: { title: "Aadhaar Card", content: "Aadhaar is used for identity verification of all key individuals. Opting for Aadhaar Authentication during registration is highly recommended as it speeds up the process and reduces the chances of a physical verification." },
      photo: { title: "Photograph", content: "A recent passport-size photograph is required for all key individuals (proprietor, partners, directors, Karta, trustees). Specifications: JPEG format, maximum file size 100 KB." },
      address: { title: "Proof of Place of Business", content: "This document verifies the physical location of your business. Requirements change based on property ownership. All utility bills must be recent (not older than 2-3 months)." },
      bank: { title: "Proof of Bank Account", content: "You must provide proof of a bank account held in the legal name of the business. Acceptable documents include bank passbook first page, recent bank statement, or canceled cheque." },
      dsc: { title: "Digital Signature Certificate (DSC)", content: "A valid Class 2 or Class 3 DSC is mandatory for signing the application for Companies and LLPs. It's the digital equivalent of a physical signature." },
      auth: { title: "Proof of Authorized Signatory", content: "This document formally appoints the person responsible for GST compliance. Typically a Board Resolution for Companies/LLPs or Authorization Letter for other entities." }
    };
    
    if (details[detailKey as keyof typeof details]) {
      setModalContent(details[detailKey as keyof typeof details]);
    }
  };

  const selectedEntityData = selectedEntity ? gstData[selectedEntity as keyof typeof gstData] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">GST Registration Document Checklist</h2>
        <p className="text-gray-600 dark:text-gray-400">Select your business type to view the required documents</p>
      </div>

      {/* GST Process Overview */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 text-center">
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">1. Prepare Documents</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Gather required documents based on entity type</div>
            </div>
            <div className="text-gray-300 text-2xl">→</div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">2. Submit Application</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">File GST registration online</div>
            </div>
            <div className="text-gray-300 text-2xl">→</div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">3. Get GSTIN</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Receive 15-digit GST identification number</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entity Type Selection */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Select Business Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(gstData).map(([key, entity]) => (
              <div
                key={key}
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-2 cursor-pointer hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center h-32 ${
                  selectedEntity === key 
                    ? 'border-teal-500 shadow-lg shadow-teal-100' 
                    : 'border-transparent hover:border-teal-500'
                }`}
                onClick={() => handleEntitySelect(key)}
              >
                <div className="text-4xl mb-2">{entity.icon}</div>
                <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">{entity.label}</div>
                <Badge variant="outline" className="mt-1 text-xs">
                  {entity.docCount} docs
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Checklist */}
      {selectedEntityData && (
        <div className="space-y-6">
          {/* Key Takeaway */}
          <Card className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Pro Tip</h4>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">{selectedEntityData.keyTakeaway}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Sections */}
          <div className="space-y-4">
            {/* Universal Documents */}
            <DocumentSection
              title="Universal Documents"
              icon={<FileText className="h-5 w-5" />}
              documents={universalDocs}
              onDocumentDetail={handleDocumentDetail}
            />

            {/* Entity-Specific Documents */}
            {selectedEntityData.docs.specific.length > 0 && (
              <DocumentSection
                title="Entity-Specific Documents"
                icon={<Building className="h-5 w-5" />}
                documents={selectedEntityData.docs.specific}
                onDocumentDetail={handleDocumentDetail}
              />
            )}

            {/* Personnel Documents */}
            <DocumentSection
              title="Key Personnel Documents"
              icon={<Users className="h-5 w-5" />}
              documents={selectedEntityData.docs.personnel}
              onDocumentDetail={handleDocumentDetail}
            />
          </div>

          {/* Complexity Chart */}
          <GSTComplexityChart selectedEntity={selectedEntity} />
        </div>
      )}

      {/* Document Detail Modal */}
      <GSTDocumentModal
        isOpen={!!modalContent}
        onClose={() => setModalContent(null)}
        title={modalContent?.title || ''}
        content={modalContent?.content || ''}
      />
    </div>
  );
};

interface DocumentSectionProps {
  title: string;
  icon: React.ReactNode;
  documents: Array<{ name: string; detailKey: string | null }>;
  onDocumentDetail: (detailKey: string) => void;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ title, icon, documents, onDocumentDetail }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <div className="flex items-center space-x-3">
              {icon}
              <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
              <Badge variant="outline">{documents.length}</Badge>
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.map((doc, index) => (
                <div key={index} className="py-3 flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{doc.name}</span>
                  {doc.detailKey && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 text-teal-600 hover:text-teal-800 text-xs"
                      onClick={() => onDocumentDetail(doc.detailKey!)}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default GSTOnboardingChecklist;
