import { UserBase } from '@/shared/types';
import { z } from 'zod';

export type AuthUser = UserBase & {
  email: string;
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
    email: z.string().email({ message: 'validation.email' }),
    password: z.string().min(6, { message: 'validation.passwordLength' }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'validation.required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordMatch',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
