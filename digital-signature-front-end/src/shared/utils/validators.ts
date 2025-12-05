/**
 * Common Zod validation schemas
 * Reusable validation rules used across the application
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters');

/**
 * Password validation schema
 * Requirements: At least 8 characters, 1 uppercase letter, 1 number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]+$/, 'Name must contain only letters and spaces');

/**
 * Required string schema
 */
export const requiredStringSchema = (fieldName = 'This field') =>
  z.string().min(1, `${fieldName} is required`);

/**
 * Optional string schema (can be empty or undefined)
 */
export const optionalStringSchema = z.string().optional();

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .or(z.string().length(0)); // Allow empty string

/**
 * Phone number validation schema (basic)
 */
export const phoneSchema = z
  .string()
  .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number must be less than 20 digits')
  .optional();

/**
 * Date validation schema (ISO 8601 format)
 */
export const dateSchema = z.string().datetime('Invalid date format');

/**
 * File validation helpers
 */
export const fileSchema = (options?: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}) => {
  const maxSize = options?.maxSize || 10 * 1024 * 1024; // Default 10MB
  const allowedTypes = options?.allowedTypes || [];

  return z.instanceof(File).refine(
    (file) => file.size <= maxSize,
    `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
  ).refine(
    (file) => allowedTypes.length === 0 || allowedTypes.includes(file.type),
    `File type must be one of: ${allowedTypes.join(', ')}`
  );
};

/**
 * PDF file validation schema
 */
export const pdfFileSchema = fileSchema({
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['application/pdf'],
});

/**
 * Image file validation schema
 */
export const imageFileSchema = fileSchema({
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
});

/**
 * Positive number schema
 */
export const positiveNumberSchema = z.number().positive('Must be a positive number');

/**
 * Integer schema
 */
export const integerSchema = z.number().int('Must be an integer');

/**
 * Percentage schema (0-100)
 */
export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must be at most 100');

/**
 * UUID schema
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * Array of strings schema
 */
export const stringArraySchema = z.array(z.string());

/**
 * Validation helper to check if a value is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

/**
 * Validation helper to check if a value is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  return urlSchema.safeParse(url).success;
};

