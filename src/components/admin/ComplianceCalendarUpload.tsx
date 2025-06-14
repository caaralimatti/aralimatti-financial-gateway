import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Calendar } from 'lucide-react';
import { complianceService } from '@/services/complianceService';
import { CreateComplianceDeadlineData, ComplianceUploadData } from '@/types/compliance';

const ComplianceCalendarUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = 'Date (MM DD),Compliance Type,Form/Activity,Description,Relevant FY/AY\n' +
                      `03 15,Income Tax,ITR Filing,Annual Income Tax Return Filing,FY ${year}-${parseInt(year) + 1}\n` +
                      `07 31,GST,GSTR-3B,Monthly GST Return,FY ${year}-${parseInt(year) + 1}\n` +
                      `05 30,MCA,AOC-4,Annual Filing with MCA,FY ${year}-${parseInt(year) + 1}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_deadlines_template_${year}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: `Compliance deadlines template for ${year} has been downloaded successfully.`,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const parseCSV = (csvText: string): ComplianceUploadData[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data: ComplianceUploadData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      if (values.length >= 2) {
        data.push({
          date: values[0] || '',
          compliance_type: values[1] || '',
          form_activity: values[2] || undefined,
          description: values[3] || undefined,
          relevant_fy_ay: values[4] || undefined,
        });
      }
    }

    return data;
  };

  const handleUpload = async () => {
    if (!selectedFile || !year) {
      toast({
        title: "Missing Information",
        description: "Please select a file and specify the year.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const csvText = await selectedFile.text();
      const parsedData = parseCSV(csvText);
      
      const complianceDeadlines: CreateComplianceDeadlineData[] = parsedData.map(item => {
        // Parse MM DD format and combine with year
        const [month, day] = item.date.split(' ').map(str => str.padStart(2, '0'));
        const deadline_date = `${year}-${month}-${day}`;
        
        return {
          deadline_date,
          compliance_type: item.compliance_type,
          form_activity: item.form_activity || null,
          description: item.description || null,
          relevant_fy_ay: item.relevant_fy_ay || null,
        };
      });

      await complianceService.upsertComplianceDeadlines(complianceDeadlines);
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${complianceDeadlines.length} compliance deadlines.`,
      });

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('compliance-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading compliance deadlines:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload compliance deadlines. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Compliance Calendar Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year (will be applied to all dates)</Label>
          <Input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2025"
            min="2020"
            max="2030"
            className="w-32"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          
          <div className="flex items-center gap-2">
            <input
              id="compliance-file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('compliance-file-input')?.click()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
            {selectedFile && (
              <span className="text-sm text-gray-600">
                {selectedFile.name}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !year || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Compliance Deadlines'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComplianceCalendarUpload;
