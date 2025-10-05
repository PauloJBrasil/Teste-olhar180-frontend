export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string | null;
  userId?: string | null;
}

export interface TaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface EditUserRequest {
  email?: string;
  phone?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}