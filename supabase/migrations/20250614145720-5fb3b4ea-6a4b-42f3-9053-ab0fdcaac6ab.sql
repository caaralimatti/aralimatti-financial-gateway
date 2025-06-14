
-- Add an "upload_id" column to compliance_deadlines for tracking batch uploads (uuid, nullable)
ALTER TABLE public.compliance_deadlines
ADD COLUMN upload_id uuid NULL;

-- Optionally, you might want a secondary table to log each upload event for admin audit trails:
-- CREATE TABLE public.compliance_upload_batches (
--   upload_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   uploaded_by uuid REFERENCES profiles (id),
--   uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   file_name TEXT,
--   year TEXT
-- );

-- (No RLS change is needed on the main table, as this is tracked data only for admin use)
