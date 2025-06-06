
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Calendar, FileText, AlertCircle } from 'lucide-react';
import IncomeTaxApp from './IncomeTaxApp';

const FileITR = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [showIncomeTaxApp, setShowIncomeTaxApp] = useState(false);

  const assessmentYears = [
    { value: 'AY2024-25', label: 'AY 2024-25 (FY 2023-24)' },
    { value: 'AY2023-24', label: 'AY 2023-24 (FY 2022-23)' },
    { value: 'AY2022-23', label: 'AY 2022-23 (FY 2021-22)' },
    { value: 'AY2021-22', label: 'AY 2021-22 (FY 2020-21)' },
  ];

  const itrForms = [
    { form: 'ITR-1', description: 'For salaried individuals with income up to ₹50 lakhs' },
    { form: 'ITR-2', description: 'For individuals/HUFs with capital gains or foreign income' },
    { form: 'ITR-3', description: 'For individuals/HUFs with business/professional income' },
    { form: 'ITR-4', description: 'For presumptive business income (Sugam)' },
  ];

  if (showIncomeTaxApp) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setShowIncomeTaxApp(false)}>
            ← Back to ITR Filing
          </Button>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Document Checklist for {selectedYear}
          </Badge>
        </div>
        <IncomeTaxApp />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Income Tax Return</h2>
          <p className="text-gray-600 dark:text-gray-400">
            File your ITR for the selected assessment year
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Calendar className="h-3 w-3 mr-1" />
          ITR Filing
        </Badge>
      </div>

      {/* Year Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Assessment Year</CardTitle>
          <CardDescription>Choose the assessment year for which you want to file ITR</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Assessment Year" />
            </SelectTrigger>
            <SelectContent>
              {assessmentYears.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedYear && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Filing Period Information</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Due date for {selectedYear}: July 31, 2024 (for individuals without audit requirement)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Checklist Access */}
      {selectedYear && (
        <Card>
          <CardHeader>
            <CardTitle>Document Preparation</CardTitle>
            <CardDescription>Prepare your documents before filing ITR</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                📋 Document Checklist Available
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                Use our interactive document checklist to ensure you have all required documents for your ITR filing.
              </p>
              <Button 
                onClick={() => setShowIncomeTaxApp(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Open Document Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ITR Form Selection */}
      {selectedYear && (
        <Card>
          <CardHeader>
            <CardTitle>Select ITR Form</CardTitle>
            <CardDescription>Choose the appropriate ITR form based on your income sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {itrForms.map((form) => (
              <div key={form.form} className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{form.form}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{form.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upload Documents */}
      {selectedYear && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>Upload your documents for ITR preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload Your Documents
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your files here, or click to browse
              </p>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileITR;
