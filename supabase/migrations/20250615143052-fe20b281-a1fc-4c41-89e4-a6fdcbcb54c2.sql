
-- Phase 2: Create client-attachments storage bucket (fixed version)

-- Create the client-attachments bucket (this will only create if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-attachments', 'client-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;

-- Create RLS policies for the bucket to allow authenticated users to manage files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'client-attachments');

CREATE POLICY "Authenticated users can view files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'client-attachments');

CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'client-attachments');

CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'client-attachments');
