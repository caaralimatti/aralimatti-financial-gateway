
-- Add RLS policies for clients table to ensure users can see their data
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Policy for viewing clients - all authenticated users can view all clients
CREATE POLICY "Users can view all clients" 
  ON public.clients 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Policy for creating clients - authenticated users can create clients
CREATE POLICY "Users can create clients" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for updating clients - authenticated users can update clients
CREATE POLICY "Users can update clients" 
  ON public.clients 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Policy for deleting clients - authenticated users can delete clients
CREATE POLICY "Users can delete clients" 
  ON public.clients 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Add RLS policies for client_contact_persons table
ALTER TABLE public.client_contact_persons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view client contact persons" 
  ON public.client_contact_persons 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create client contact persons" 
  ON public.client_contact_persons 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update client contact persons" 
  ON public.client_contact_persons 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete client contact persons" 
  ON public.client_contact_persons 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Add RLS policies for client_attachments table
ALTER TABLE public.client_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view client attachments" 
  ON public.client_attachments 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create client attachments" 
  ON public.client_attachments 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update client attachments" 
  ON public.client_attachments 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete client attachments" 
  ON public.client_attachments 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);
