
-- Create table for client custom fields (key-value pairs per client)
CREATE TABLE public.client_custom_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT,
  field_type TEXT NOT NULL DEFAULT 'text', -- text, number, date, boolean
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, field_name)
);

-- Add RLS policies for client custom fields
ALTER TABLE public.client_custom_fields ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view custom fields
CREATE POLICY "Users can view client custom fields" 
  ON public.client_custom_fields 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can insert custom fields
CREATE POLICY "Users can create client custom fields" 
  ON public.client_custom_fields 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update custom fields
CREATE POLICY "Users can update client custom fields" 
  ON public.client_custom_fields 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete custom fields
CREATE POLICY "Users can delete client custom fields" 
  ON public.client_custom_fields 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create storage bucket for client attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-attachments', 'client-attachments', true);

-- Create storage policies for client attachments bucket
CREATE POLICY "Users can upload client attachments" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'client-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view client attachments" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'client-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete client attachments" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'client-attachments' AND auth.uid() IS NOT NULL);

-- Update client_attachments table to include description field if not exists
ALTER TABLE public.client_attachments 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add trigger for updating updated_at timestamp on client_custom_fields
CREATE TRIGGER update_client_custom_fields_updated_at
    BEFORE UPDATE ON public.client_custom_fields
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
