
-- Create time_entries table
CREATE TABLE public.time_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id),
    profile_id UUID NOT NULL REFERENCES public.profiles(id),
    client_id UUID NOT NULL REFERENCES public.clients(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours NUMERIC NOT NULL,
    description TEXT,
    is_billable BOOLEAN NOT NULL DEFAULT true,
    rate_type TEXT NOT NULL CHECK (rate_type IN ('Hourly', 'Daily', 'Monthly', 'Project', 'Work')),
    rate_value NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    tax_amount NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Paid', 'Partially Paid', 'Overdue', 'Voided', 'Cancelled')),
    created_by_profile_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_line_items table
CREATE TABLE public.invoice_line_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    rate_type TEXT CHECK (rate_type IN ('Hourly', 'Daily', 'Monthly', 'Project', 'Work')),
    total_line_item_amount NUMERIC NOT NULL,
    related_task_id UUID REFERENCES public.tasks(id),
    related_time_entry_id UUID REFERENCES public.time_entries(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id),
    amount NUMERIC NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_id TEXT,
    received_by_profile_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add estimated_effort_unit to tasks table
ALTER TABLE public.tasks 
ADD COLUMN estimated_effort_unit TEXT CHECK (estimated_effort_unit IN ('Hours', 'Days', 'Months', 'Project', 'Work'));

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_number INTEGER;
    invoice_number TEXT;
BEGIN
    -- Get the next invoice number
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.invoices
    WHERE invoice_number ~ '^INV-[0-9]+$';
    
    -- Format as INV-000001
    invoice_number := 'INV-' || LPAD(next_number::TEXT, 6, '0');
    
    RETURN invoice_number;
END;
$$;

-- Add trigger to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_invoice_number
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_invoice_number();

-- Add updated_at triggers for all new tables
CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON public.time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_line_items_updated_at
    BEFORE UPDATE ON public.invoice_line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all new tables
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for time_entries
CREATE POLICY "Admins can manage all time entries" ON public.time_entries
    FOR ALL USING (is_current_user_admin() OR is_super_admin());

CREATE POLICY "Staff can view all time entries" ON public.time_entries
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Staff can insert own time entries" ON public.time_entries
    FOR INSERT WITH CHECK (
        profile_id = auth.uid() AND
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Staff can update own time entries" ON public.time_entries
    FOR UPDATE USING (
        profile_id = auth.uid() AND
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

-- Create RLS policies for invoices
CREATE POLICY "Admins can manage all invoices" ON public.invoices
    FOR ALL USING (is_current_user_admin() OR is_super_admin());

CREATE POLICY "Staff can view all invoices" ON public.invoices
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Staff can insert invoices" ON public.invoices
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Staff can update invoices they created" ON public.invoices
    FOR UPDATE USING (
        created_by_profile_id = auth.uid() AND
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Clients can view their own invoices" ON public.invoices
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'client' AND
        client_id IN (
            SELECT id FROM public.clients 
            WHERE working_user_id = auth.uid()
        )
    );

-- Create RLS policies for invoice_line_items
CREATE POLICY "Admins can manage all invoice line items" ON public.invoice_line_items
    FOR ALL USING (is_current_user_admin() OR is_super_admin());

CREATE POLICY "Staff can view all invoice line items" ON public.invoice_line_items
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Staff can manage line items for invoices they can access" ON public.invoice_line_items
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Staff can update line items for invoices they created" ON public.invoice_line_items
    FOR UPDATE USING (
        invoice_id IN (
            SELECT id FROM public.invoices 
            WHERE created_by_profile_id = auth.uid()
        ) AND
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Clients can view line items for their invoices" ON public.invoice_line_items
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'client' AND
        invoice_id IN (
            SELECT id FROM public.invoices 
            WHERE client_id IN (
                SELECT id FROM public.clients 
                WHERE working_user_id = auth.uid()
            )
        )
    );

-- Create RLS policies for payments
CREATE POLICY "Admins can manage all payments" ON public.payments
    FOR ALL USING (is_current_user_admin() OR is_super_admin());

CREATE POLICY "Staff can view all payments" ON public.payments
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Staff can insert payments" ON public.payments
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    );

CREATE POLICY "Clients can view payments for their invoices" ON public.payments
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'client' AND
        invoice_id IN (
            SELECT id FROM public.invoices 
            WHERE client_id IN (
                SELECT id FROM public.clients 
                WHERE working_user_id = auth.uid()
            )
        )
    );
