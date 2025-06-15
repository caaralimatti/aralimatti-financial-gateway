
-- Add new columns to client_attachments table for document exchange and archiving

-- Add document status tracking
ALTER TABLE public.client_attachments 
ADD COLUMN document_status TEXT NOT NULL DEFAULT 'Uploaded' 
CHECK (document_status IN ('Uploaded', 'Reviewed', 'Approved', 'Rejected', 'Client Review', 'Firm Shared'));

-- Add client visibility control
ALTER TABLE public.client_attachments 
ADD COLUMN shared_with_client BOOLEAN NOT NULL DEFAULT FALSE;

-- Add version tracking
ALTER TABLE public.client_attachments 
ADD COLUMN version_number NUMERIC NOT NULL DEFAULT 1.0;

-- Add current version tracking
ALTER TABLE public.client_attachments 
ADD COLUMN is_current_version BOOLEAN NOT NULL DEFAULT TRUE;

-- Add uploader role identification
ALTER TABLE public.client_attachments 
ADD COLUMN uploaded_by_role TEXT 
CHECK (uploaded_by_role IN ('firm', 'client'));

-- Add updated_at timestamp if it doesn't exist
ALTER TABLE public.client_attachments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE TRIGGER update_client_attachments_updated_at
    BEFORE UPDATE ON public.client_attachments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing records to set uploaded_by_role based on uploaded_by profile
UPDATE public.client_attachments 
SET uploaded_by_role = CASE 
    WHEN uploaded_by IN (
        SELECT id FROM public.profiles WHERE role IN ('admin', 'super_admin', 'staff')
    ) THEN 'firm'
    ELSE 'client'
END
WHERE uploaded_by_role IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_client_attachments_client_shared 
ON public.client_attachments(client_id, shared_with_client);

CREATE INDEX IF NOT EXISTS idx_client_attachments_version 
ON public.client_attachments(client_id, file_name, version_number);
