
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Calendar, Trash2 } from 'lucide-react';
import { complianceService, ComplianceUploadBatch } from '@/services/complianceService';
import { CreateComplianceDeadlineData, ComplianceUploadData } from '@/types/compliance';

const ComplianceCalendarUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadBatches, setUploadBatches] = useState<ComplianceUploadBatch[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUploadBatches();
  }, []);

  const fetchUploadBatches = async () => {
    setIsLoadingBatches(true);
    try {
      const batches = await complianceService.fetchComplianceUploadBatches();
      setUploadBatches(batches);
    } catch (error) {
      console.error('Error fetching upload batches:', error);
    } finally {
      setIsLoadingBatches(false);
    }
  };

  const handleDeleteBatch = async (uploadId: string) => {
    try {
      await complianceService.deleteComplianceUploadBatch(uploadId);
      toast({
        title: "Upload Deleted",
        description: "The compliance upload and all its data have been successfully deleted.",
      });
      await fetchUploadBatches(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting upload batch:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete the upload batch.",
        variant: "destructive",
      });
    }
  };

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

  // Utility: Parse date from various formats to { month: MM, day: DD }
  const parseDateCell = (dateRaw: string): { month: string, day: string } | null => {
    let value = dateRaw.replace(/"/g, '').trim();

    // Try extended formats with dots, slashes, dashes or spaces (dd-mm, mm/dd, dd/mm etc)
    // Support mmm (3-letter month, any capitalization, e.g., Jan, JAN, jan)
    // We try in order from most explicit to least

    // 1. "yyyy-mm-dd"
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) return { month: isoMatch[2], day: isoMatch[3] };

    // 2. "dd-mmm" (e.g. 5-Mar)
    let match = value.match(/^(\d{1,2})-([A-Za-z]{3,})$/);
    if (match) {
      const day = match[1], mon = match[2];
      const monthNum = {
        jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
        jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
      }[mon.toLowerCase().slice(0, 3)];
      if (monthNum) return { month: monthNum, day: day.padStart(2, "0") };
    }
    // 3. "mmm dd"
    match = value.match(/^([A-Za-z]{3,})[\s\-\.\/](\d{1,2})$/);
    if (match) {
      const mon = match[1], day = match[2];
      const monthNum = {
        jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
        jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
      }[mon.toLowerCase().slice(0, 3)];
      if (monthNum) return { month: monthNum, day: day.padStart(2, "0") };
    }
    // 4. "dd/mm" or "mm/dd" or "dd-mm" or "mm-dd" or "dd.mm"
    match = value.match(/^(\d{1,2})[\/\-\.\s]{1}(\d{1,2})$/);
    if (match) {
      // You may want to control for Indian DMY vs MDY style:
      // Let's assume first is month, second is day (as per template)
      return { month: match[1].padStart(2, '0'), day: match[2].padStart(2, '0') };
    }

    // 5. "mm yyyy" or "mm dd"
    match = value.match(/^(\d{1,2})[\s]{1,2}(\d{1,2})$/);
    if (match)
      return { month: match[1].padStart(2, '0'), day: match[2].padStart(2, '0') };

    // Not parsed
    return null;
  };

  const parseCSV = (csvText: string): ComplianceUploadData[] => {
    const lines = csvText.split('\n').filter(line => line.trim() !== "");
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data: ComplianceUploadData[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',').map(v => v.trim());
      // Only proceed if first two columns are present
      if (!values[0] || !values[1]) continue;
      data.push({
        date: values[0],
        compliance_type: values[1],
        form_activity: values[2] || undefined,
        description: values[3] || undefined,
        relevant_fy_ay: values[4] || undefined,
      });
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
      if (parsedData.length === 0) throw new Error("No valid data rows found in the CSV file.");

      // Generate a unique upload ID for this batch
      const uploadId = crypto.randomUUID();

      let errorCount = 0;
      let duplicateCount = 0;
      const complianceMap = new Map<string, CreateComplianceDeadlineData>();

      parsedData.forEach(item => {
        const parsed = parseDateCell(item.date);
        if (!parsed) {
          errorCount++;
          return;
        }
        const { month, day } = parsed;
        const yearInt = parseInt(year);
        const isMonthValid = /^\d{2}$/.test(month) && Number(month) >= 1 && Number(month) <= 12;
        const isDayValid = /^\d{2}$/.test(day) && Number(day) >= 1 && Number(day) <= 31;
        if (!isMonthValid || !isDayValid || isNaN(yearInt)) {
          errorCount++;
          return;
        }
        const deadline_date = `${year}-${month}-${day}`;
        const compliance_type = item.compliance_type;
        const form_activity = item.form_activity || null;

        // Key for deduplication
        const key = `${deadline_date}|${compliance_type}|${form_activity ?? ""}`;

        if (complianceMap.has(key)) {
          duplicateCount++;
        }
        complianceMap.set(key, {
          deadline_date,
          compliance_type,
          form_activity,
          description: item.description || null,
          relevant_fy_ay: item.relevant_fy_ay || null,
          upload_id: uploadId, // Add the upload ID to track this batch
        });
      });

      const complianceDeadlines = Array.from(complianceMap.values());

      if (complianceDeadlines.length === 0) {
        throw new Error(
          "No valid data rows to upload. Please check the Date column formats and see help tip."
        );
      }

      await complianceService.upsertComplianceDeadlines(complianceDeadlines);

      let description = `Successfully uploaded ${complianceDeadlines.length} compliance deadlines.`;
      if (errorCount > 0)
        description += ` Skipped ${errorCount} invalid record(s) (bad date format or missing type).`;
      if (duplicateCount > 0)
        description += ` ${duplicateCount} duplicate row(s) were merged by (date, type, activity).`;

      toast({
        title: "Upload Successful",
        description,
      });

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('compliance-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh the upload batches list
      await fetchUploadBatches();

    } catch (error: any) {
      console.error('Error uploading compliance deadlines:', error);
      let description = error.message || "Failed to upload compliance deadlines.";
      if (description.includes("ON CONFLICT")) {
        description += " — This usually means your file had duplicate compliance entries with the same date, type, and (optionally) activity. Please check your file for accidental duplicate rows."
      }
      toast({
        title: "Upload Failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Upload History and Delete Options */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBatches ? (
            <p className="text-gray-600">Loading upload history...</p>
          ) : uploadBatches.length === 0 ? (
            <p className="text-gray-600">No uploads found.</p>
          ) : (
            <div className="space-y-2">
              {uploadBatches.map((batch) => (
                <div key={batch.upload_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{batch.file_name}</p>
                    <p className="text-sm text-gray-600">
                      {batch.total_records} records • {new Date(batch.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteBatch(batch.upload_id)}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceCalendarUpload;
