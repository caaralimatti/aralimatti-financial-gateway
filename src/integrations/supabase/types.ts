export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          activity_type: string
          description: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          activity_type: string
          description: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          description?: string
          id?: string
          ip_address?: unknown | null
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
      client_attachments: {
        Row: {
          client_id: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          uploaded_by: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          uploaded_by?: string | null
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
          status: Database["public"]["Enums"]["client_status"]
          tags: string[] | null
          tan: string | null
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
          status?: Database["public"]["Enums"]["client_status"]
          tags?: string[] | null
          tan?: string | null
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
          status?: Database["public"]["Enums"]["client_status"]
          tags?: string[] | null
          tan?: string | null
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
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_active: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      client_status: "Active" | "Inactive" | "Pending" | "Suspended"
      client_type:
        | "Individual"
        | "Company"
        | "Partnership"
        | "LLP"
        | "Trust"
        | "HUF"
        | "Other"
      user_role: "client" | "staff" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
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
      user_role: ["client", "staff", "admin"],
    },
  },
} as const
