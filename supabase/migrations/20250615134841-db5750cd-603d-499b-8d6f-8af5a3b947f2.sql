
-- Phase 1: Update uploaded_by_role constraint and migrate existing data

-- First, update all existing records with 'firm' to 'admin'
UPDATE public.client_attachments 
SET uploaded_by_role = 'admin' 
WHERE uploaded_by_role = 'firm';

-- Drop the existing constraint
ALTER TABLE public.client_attachments 
DROP CONSTRAINT IF EXISTS client_attachments_uploaded_by_role_check;

-- Add the new constraint with updated allowed values
ALTER TABLE public.client_attachments 
ADD CONSTRAINT client_attachments_uploaded_by_role_check 
CHECK (uploaded_by_role IN ('admin', 'staff', 'client'));
