
export interface CreateUserMutationData {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'staff' | 'client';
  isActive: boolean;
}

export interface UpdateUserMutationData {
  id: string;
  fullName?: string;
  role?: 'admin' | 'staff' | 'client';
  isActive?: boolean;
}

export interface ToggleUserStatusData {
  userId: string;
  isActive: boolean;
}
