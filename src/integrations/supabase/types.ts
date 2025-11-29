export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          activity_type: string
          description: string
          id: string
          ip_address: unknown
          metadata: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          activity_type: string
          description: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          description?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_log_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_module_permissions: {
        Row: {
          admin_profile_id: string
          created_at: string
          id: string
          is_enabled: boolean
          module_name: string
          updated_at: string
        }
        Insert: {
          admin_profile_id: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          module_name: string
          updated_at?: string
        }
        Update: {
          admin_profile_id?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          module_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_module_permissions_admin_profile_id_fkey"
            columns: ["admin_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          priority: string
          published_at: string
          target_audience: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          priority?: string
          published_at?: string
          target_audience?: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          priority?: string
          published_at?: string
          target_audience?: string
          title?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          action_parameters: Json | null
          action_type: Database["public"]["Enums"]["automation_action_type"]
          created_at: string
          created_by: string
          delay_minutes: number | null
          description: string | null
          execution_count: number | null
          frequency_type: string | null
          frequency_value: number | null
          id: string
          is_active: boolean
          last_executed_at: string | null
          max_executions: number | null
          metadata: Json | null
          name: string
          priority: number | null
          tags: string[] | null
          trigger_conditions: Json | null
          trigger_type: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at: string
        }
        Insert: {
          action_parameters?: Json | null
          action_type: Database["public"]["Enums"]["automation_action_type"]
          created_at?: string
          created_by: string
          delay_minutes?: number | null
          description?: string | null
          execution_count?: number | null
          frequency_type?: string | null
          frequency_value?: number | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          max_executions?: number | null
          metadata?: Json | null
          name: string
          priority?: number | null
          tags?: string[] | null
          trigger_conditions?: Json | null
          trigger_type: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at?: string
        }
        Update: {
          action_parameters?: Json | null
          action_type?: Database["public"]["Enums"]["automation_action_type"]
          created_at?: string
          created_by?: string
          delay_minutes?: number | null
          description?: string | null
          execution_count?: number | null
          frequency_type?: string | null
          frequency_value?: number | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          max_executions?: number | null
          metadata?: Json | null
          name?: string
          priority?: number | null
          tags?: string[] | null
          trigger_conditions?: Json | null
          trigger_type?: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_attachments: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          document_status: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_current_version: boolean
          shared_with_client: boolean
          updated_at: string
          uploaded_by: string | null
          uploaded_by_role: string | null
          version_number: number
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          document_status?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_current_version?: boolean
          shared_with_client?: boolean
          updated_at?: string
          uploaded_by?: string | null
          uploaded_by_role?: string | null
          version_number?: number
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          document_status?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_current_version?: boolean
          shared_with_client?: boolean
          updated_at?: string
          uploaded_by?: string | null
          uploaded_by_role?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_attachments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contact_persons: {
        Row: {
          client_id: string
          created_at: string
          designation: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          mobile: string | null
          name: string
          phone: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          mobile?: string | null
          name: string
          phone?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          mobile?: string | null
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contact_persons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_custom_fields: {
        Row: {
          client_id: string
          created_at: string
          field_name: string
          field_type: string
          field_value: string | null
          id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          field_name: string
          field_type?: string
          field_value?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          field_name?: string
          field_type?: string
          field_value?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_custom_fields_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_group_memberships: {
        Row: {
          client_id: string
          created_at: string
          group_id: string
          id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          group_id: string
          id?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_group_memberships_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "client_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      client_groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_it_returns: {
        Row: {
          assessment_year: string | null
          client_id: string
          created_at: string
          due_date: string | null
          filed_date: string | null
          id: string
          return_type: string
          status: string | null
        }
        Insert: {
          assessment_year?: string | null
          client_id: string
          created_at?: string
          due_date?: string | null
          filed_date?: string | null
          id?: string
          return_type: string
          status?: string | null
        }
        Update: {
          assessment_year?: string | null
          client_id?: string
          created_at?: string
          due_date?: string | null
          filed_date?: string | null
          id?: string
          return_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_it_returns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          client_type: Database["public"]["Enums"]["client_type"]
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          dgft_password: string | null
          dgft_username: string | null
          file_no: string
          gst_applicable: boolean | null
          gst_number: string | null
          gst_password: string | null
          gst_registration_type: string | null
          gst_return_frequency: string | null
          gst_username: string | null
          id: string
          income_tax_applicable: boolean | null
          it_deductor_password: string | null
          it_pan: string | null
          it_password: string | null
          it_tan: string | null
          mca_applicable: boolean | null
          mca_v2_password: string | null
          mca_v2_username: string | null
          mca_v3_password: string | null
          mca_v3_username: string | null
          name: string
          notes: string | null
          other_tax_applicable: boolean | null
          other_users: string | null
          pan: string | null
          primary_email: string | null
          primary_mobile: string | null
          primary_portal_user_profile_id: string | null
          status: Database["public"]["Enums"]["client_status"]
          tags: string[] | null
          tan: string | null
          tds_tcs_applicable: boolean | null
          traces_deductor_password: string | null
          traces_taxpayer_password: string | null
          traces_username: string | null
          trade_name: string | null
          updated_at: string
          updated_by: string | null
          working_user_id: string | null
        }
        Insert: {
          address?: string | null
          client_type: Database["public"]["Enums"]["client_type"]
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          dgft_password?: string | null
          dgft_username?: string | null
          file_no: string
          gst_applicable?: boolean | null
          gst_number?: string | null
          gst_password?: string | null
          gst_registration_type?: string | null
          gst_return_frequency?: string | null
          gst_username?: string | null
          id?: string
          income_tax_applicable?: boolean | null
          it_deductor_password?: string | null
          it_pan?: string | null
          it_password?: string | null
          it_tan?: string | null
          mca_applicable?: boolean | null
          mca_v2_password?: string | null
          mca_v2_username?: string | null
          mca_v3_password?: string | null
          mca_v3_username?: string | null
          name: string
          notes?: string | null
          other_tax_applicable?: boolean | null
          other_users?: string | null
          pan?: string | null
          primary_email?: string | null
          primary_mobile?: string | null
          primary_portal_user_profile_id?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tags?: string[] | null
          tan?: string | null
          tds_tcs_applicable?: boolean | null
          traces_deductor_password?: string | null
          traces_taxpayer_password?: string | null
          traces_username?: string | null
          trade_name?: string | null
          updated_at?: string
          updated_by?: string | null
          working_user_id?: string | null
        }
        Update: {
          address?: string | null
          client_type?: Database["public"]["Enums"]["client_type"]
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          dgft_password?: string | null
          dgft_username?: string | null
          file_no?: string
          gst_applicable?: boolean | null
          gst_number?: string | null
          gst_password?: string | null
          gst_registration_type?: string | null
          gst_return_frequency?: string | null
          gst_username?: string | null
          id?: string
          income_tax_applicable?: boolean | null
          it_deductor_password?: string | null
          it_pan?: string | null
          it_password?: string | null
          it_tan?: string | null
          mca_applicable?: boolean | null
          mca_v2_password?: string | null
          mca_v2_username?: string | null
          mca_v3_password?: string | null
          mca_v3_username?: string | null
          name?: string
          notes?: string | null
          other_tax_applicable?: boolean | null
          other_users?: string | null
          pan?: string | null
          primary_email?: string | null
          primary_mobile?: string | null
          primary_portal_user_profile_id?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tags?: string[] | null
          tan?: string | null
          tds_tcs_applicable?: boolean | null
          traces_deductor_password?: string | null
          traces_taxpayer_password?: string | null
          traces_username?: string | null
          trade_name?: string | null
          updated_at?: string
          updated_by?: string | null
          working_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_primary_portal_user_profile_id_fkey"
            columns: ["primary_portal_user_profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_working_user_id_fkey"
            columns: ["working_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_deadlines: {
        Row: {
          compliance_type: string
          created_at: string
          deadline_date: string
          description: string | null
          form_activity: string | null
          id: string
          relevant_fy_ay: string | null
          updated_at: string
          upload_id: string | null
        }
        Insert: {
          compliance_type: string
          created_at?: string
          deadline_date: string
          description?: string | null
          form_activity?: string | null
          id?: string
          relevant_fy_ay?: string | null
          updated_at?: string
          upload_id?: string | null
        }
        Update: {
          compliance_type?: string
          created_at?: string
          deadline_date?: string
          description?: string | null
          form_activity?: string | null
          id?: string
          relevant_fy_ay?: string | null
          updated_at?: string
          upload_id?: string | null
        }
        Relationships: []
      }
      dsc_certificates: {
        Row: {
          certificate_holder_profile_id: string
          contact_person_name: string | null
          contact_person_phone: string | null
          created_at: string
          given_date: string | null
          id: string
          issuing_authority: string | null
          pin: string | null
          received_date: string
          remarks: string | null
          serial_number: string | null
          status: string
          storage_location: string | null
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          certificate_holder_profile_id: string
          contact_person_name?: string | null
          contact_person_phone?: string | null
          created_at?: string
          given_date?: string | null
          id?: string
          issuing_authority?: string | null
          pin?: string | null
          received_date: string
          remarks?: string | null
          serial_number?: string | null
          status?: string
          storage_location?: string | null
          updated_at?: string
          valid_from: string
          valid_until: string
        }
        Update: {
          certificate_holder_profile_id?: string
          contact_person_name?: string | null
          contact_person_phone?: string | null
          created_at?: string
          given_date?: string | null
          id?: string
          issuing_authority?: string | null
          pin?: string | null
          received_date?: string
          remarks?: string | null
          serial_number?: string | null
          status?: string
          storage_location?: string | null
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "dsc_certificates_certificate_holder_profile_id_fkey"
            columns: ["certificate_holder_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_clients: {
        Row: {
          client_name: string
          created_at: string
          email: string
          gstin: string
          id: string
          login_id: string | null
          mobile: string
          password: string | null
          registration_type: string | null
          return_frequency: string | null
          updated_at: string
        }
        Insert: {
          client_name: string
          created_at?: string
          email: string
          gstin: string
          id?: string
          login_id?: string | null
          mobile: string
          password?: string | null
          registration_type?: string | null
          return_frequency?: string | null
          updated_at?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          email?: string
          gstin?: string
          id?: string
          login_id?: string | null
          mobile?: string
          password?: string | null
          registration_type?: string | null
          return_frequency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          rate_type: string | null
          related_task_id: string | null
          related_time_entry_id: string | null
          total_line_item_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          rate_type?: string | null
          related_task_id?: string | null
          related_time_entry_id?: string | null
          total_line_item_amount: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          rate_type?: string | null
          related_task_id?: string | null
          related_time_entry_id?: string | null
          total_line_item_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_related_task_id_fkey"
            columns: ["related_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_related_time_entry_id_fkey"
            columns: ["related_time_entry_id"]
            isOneToOne: false
            referencedRelation: "time_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          created_by_profile_id: string
          discount_amount: number | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          status: string
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by_profile_id: string
          discount_amount?: number | null
          due_date: string
          id?: string
          invoice_date: string
          invoice_number: string
          status?: string
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by_profile_id?: string
          discount_amount?: number | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          status?: string
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          metadata: Json | null
          notification_type: string
          read_at: string | null
          recipient_user_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          notification_type: string
          read_at?: string | null
          recipient_user_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          read_at?: string | null
          recipient_user_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          payment_date: string
          payment_method: string
          received_by_profile_id: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          payment_date: string
          payment_method: string
          received_by_profile_id: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          payment_date?: string
          payment_method?: string
          received_by_profile_id?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_received_by_profile_id_fkey"
            columns: ["received_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          enable_dsc_tab: boolean
          full_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          last_password_change: string | null
          role: Database["public"]["Enums"]["user_role"]
          temp_password_expires_at: string | null
          temporary_password_hash: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          enable_dsc_tab?: boolean
          full_name?: string | null
          id: string
          is_active?: boolean
          last_login_at?: string | null
          last_password_change?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          temp_password_expires_at?: string | null
          temporary_password_hash?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          enable_dsc_tab?: boolean
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          last_password_change?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          temp_password_expires_at?: string | null
          temporary_password_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff_client_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          client_id: string
          id: string
          staff_profile_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          client_id: string
          id?: string
          staff_profile_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          client_id?: string
          id?: string
          staff_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_client_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_client_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_client_assignments_staff_profile_id_fkey"
            columns: ["staff_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          task_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          task_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          task_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_audit_log: {
        Row: {
          action_type: string
          description: string
          id: string
          ip_address: unknown
          metadata: Json | null
          super_admin_id: string
          target_id: string | null
          target_resource: string | null
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          action_type: string
          description: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          super_admin_id: string
          target_id?: string | null
          target_resource?: string | null
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          description?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          super_admin_id?: string
          target_id?: string | null
          target_resource?: string | null
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      task_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          task_id: string
          uploaded_by_profile_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          task_id: string
          uploaded_by_profile_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          task_id?: string
          uploaded_by_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_attachments_uploaded_by_profile_id_fkey"
            columns: ["uploaded_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_categories: {
        Row: {
          created_at: string
          created_by_profile_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by_profile_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by_profile_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_categories_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          comment_text: string
          commented_by_profile_id: string
          created_at: string
          id: string
          task_id: string
        }
        Insert: {
          comment_text: string
          commented_by_profile_id: string
          created_at?: string
          id?: string
          task_id: string
        }
        Update: {
          comment_text?: string
          commented_by_profile_id?: string
          created_at?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_commented_by_profile_id_fkey"
            columns: ["commented_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to_profile_id: string
          category_id: string
          client_id: string | null
          created_at: string
          created_by_profile_id: string
          deadline_date: string | null
          description: string | null
          estimated_effort_hours: number | null
          estimated_effort_unit: string | null
          id: string
          is_billable: boolean
          priority: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to_profile_id: string
          category_id: string
          client_id?: string | null
          created_at?: string
          created_by_profile_id: string
          deadline_date?: string | null
          description?: string | null
          estimated_effort_hours?: number | null
          estimated_effort_unit?: string | null
          id?: string
          is_billable?: boolean
          priority: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to_profile_id?: string
          category_id?: string
          client_id?: string | null
          created_at?: string
          created_by_profile_id?: string
          deadline_date?: string | null
          description?: string | null
          estimated_effort_hours?: number | null
          estimated_effort_unit?: string | null
          id?: string
          is_billable?: boolean
          priority?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_profile_id_fkey"
            columns: ["assigned_to_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          duration_hours: number
          end_time: string
          id: string
          is_billable: boolean
          profile_id: string
          rate_type: string
          rate_value: number
          start_time: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          duration_hours: number
          end_time: string
          id?: string
          is_billable?: boolean
          profile_id: string
          rate_type: string
          rate_value: number
          start_time: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          duration_hours?: number
          end_time?: string
          id?: string
          is_billable?: boolean
          profile_id?: string
          rate_type?: string
          rate_value?: number
          start_time?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_task_deadlines_for_automation: { Args: never; Returns: undefined }
      cleanup_expired_temp_passwords: { Args: never; Returns: undefined }
      create_notification: {
        Args: {
          p_link?: string
          p_message: string
          p_metadata?: Json
          p_notification_type: string
          p_recipient_user_id: string
          p_title: string
        }
        Returns: string
      }
      delete_client_with_portal_user: {
        Args: { client_uuid: string }
        Returns: boolean
      }
      execute_automation_rule: {
        Args: { p_event_data: Json; p_trigger_type: string }
        Returns: undefined
      }
      generate_invoice_number: { Args: never; Returns: string }
      get_manageable_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }[]
      }
      is_current_user_admin: { Args: never; Returns: boolean }
      is_staff_assigned_to_client: {
        Args: { client_id: string; staff_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: never; Returns: boolean }
      is_user_active: { Args: never; Returns: boolean }
    }
    Enums: {
      automation_action_type:
        | "send_email_notification"
        | "create_task"
        | "update_task_status"
        | "create_notification"
        | "send_sms"
        | "assign_task"
        | "update_client_status"
        | "create_reminder"
        | "escalate_task"
        | "generate_report"
      automation_trigger_type:
        | "task_created"
        | "task_status_changed"
        | "task_deadline_approaching"
        | "task_overdue"
        | "document_uploaded"
        | "document_status_changed"
        | "client_created"
        | "client_status_changed"
        | "invoice_created"
        | "invoice_overdue"
        | "payment_received"
        | "compliance_deadline_approaching"
        | "dsc_expiring"
        | "user_login"
        | "scheduled_time"
      client_status: "Active" | "Inactive" | "Pending" | "Suspended"
      client_type:
        | "Individual"
        | "Company"
        | "Partnership"
        | "LLP"
        | "Trust"
        | "HUF"
        | "Other"
      user_role: "client" | "staff" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      automation_action_type: [
        "send_email_notification",
        "create_task",
        "update_task_status",
        "create_notification",
        "send_sms",
        "assign_task",
        "update_client_status",
        "create_reminder",
        "escalate_task",
        "generate_report",
      ],
      automation_trigger_type: [
        "task_created",
        "task_status_changed",
        "task_deadline_approaching",
        "task_overdue",
        "document_uploaded",
        "document_status_changed",
        "client_created",
        "client_status_changed",
        "invoice_created",
        "invoice_overdue",
        "payment_received",
        "compliance_deadline_approaching",
        "dsc_expiring",
        "user_login",
        "scheduled_time",
      ],
      client_status: ["Active", "Inactive", "Pending", "Suspended"],
      client_type: [
        "Individual",
        "Company",
        "Partnership",
        "LLP",
        "Trust",
        "HUF",
        "Other",
      ],
      user_role: ["client", "staff", "admin", "super_admin"],
    },
  },
} as const
