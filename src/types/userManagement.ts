
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'staff' | 'client';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'staff' | 'client';
}

export interface UpdateUserData {
  id: string;
  fullName?: string;
  role?: 'admin' | 'staff' | 'client';
  isActive?: boolean;
}
