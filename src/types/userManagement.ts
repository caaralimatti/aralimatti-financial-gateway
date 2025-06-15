export interface UserProfile {
  id: string;
  email: string;
  full_name: string; // Make this required to match database schema
  role: 'admin' | 'staff' | 'client' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string; // Make this required to match what's expected
  enable_dsc_tab: boolean;
  last_password_change: string; // Make this required to match what's expected
  temp_password_expires_at: string; // Make this required to match what's expected
  temporary_password_hash: string; // Make this required to match what's expected
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'staff' | 'client' | 'super_admin';
  isActive?: boolean;
}

export interface UpdateUserData {
  id: string;
  fullName?: string;
  role?: 'admin' | 'staff' | 'client' | 'super_admin';
  isActive?: boolean;
}
