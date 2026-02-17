export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinedAt?: string;
  lastLoginAt?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: string;
}

export type UpdateUserInput = Partial<CreateUserInput>;
