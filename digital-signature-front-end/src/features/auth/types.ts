import { UserBase } from '@/shared/types';
import { z } from 'zod';

export type AuthUser = UserBase & {
  username?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

// Schemas for form validation with zod
export const loginSchema = z.object({
  email: z.string().email({ message: 'validation.email' }),
  password: z.string().min(6, { message: 'validation.passwordLength' }),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }).max(50, { message: 'Username must be at most 50 characters' }),
    email: z.string().email({ message: 'validation.email' }),
    password: z.string().min(6, { message: 'validation.passwordLength' }),
    confirmPassword: z.string(),
    fullName: z.string().min(1, { message: 'Full name is required' }),
    phone: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional().or(z.date().optional()),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    otp: z.string().optional(),
    avatar: z.instanceof(File).optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'validation.required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordMatch',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

export type OtpFormValues = z.infer<typeof otpSchema>;