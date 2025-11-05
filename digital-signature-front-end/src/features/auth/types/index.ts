/**
 * Auth Module Types
 * Type definitions for authentication and user management
 */

/**
 * User Role Enum
 */
export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}

/**
 * User Entity
 * Represents a user in the system
 */
export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth State
 * Redux state for authentication
 */
export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

/**
 * API Request Types
 */

export type LoginRequest = {
  email: string;
  password: string;
  remember?: boolean;
}

export type LoginResponse = {
  user: User;
  token: string;
}

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
}

export type RegisterResponse = {
  user: User;
  token: string;
}

export type ForgotPasswordRequest = {
  email: string;
}

export type ForgotPasswordResponse = {
  message: string;
}

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
}

export type ResetPasswordResponse = {
  message: string;
}

export type UpdateProfileRequest = {
  name?: string;
  avatar?: string;
}

export type UpdateProfileResponse = {
  user: User;
}

/**
 * Form Values Types
 * For React Hook Form
 */

export type LoginFormValues = {
  email: string;
  password: string;
  remember?: boolean;
}

export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  terms: boolean;
}

export type ForgotPasswordFormValues = {
  email: string;
}

export type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
}

export type ProfileFormValues = {
  name: string;
  avatar?: string;
}

