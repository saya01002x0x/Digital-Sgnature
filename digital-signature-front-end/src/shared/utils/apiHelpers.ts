/**
 * API helper utilities
 * Functions to help with API calls, error handling, and data transformation
 */

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

/**
 * API Error type
 */
export interface ApiError {
  status?: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Transform RTK Query error to user-friendly message
 * @param error - RTK Query error object
 * @returns User-friendly error message
 */
export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
): string => {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Handle FetchBaseQueryError
  if ('status' in error) {
    // HTTP error
    if (typeof error.status === 'number') {
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'You are not authorized. Please log in again.';
        case 403:
          return 'Access denied. You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'Conflict. The resource already exists or is in use.';
        case 422:
          return 'Validation error. Please check your input.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service unavailable. Please try again later.';
        default:
          return `An error occurred (Status: ${error.status})`;
      }
    }

    // FETCH_ERROR
    if (error.status === 'FETCH_ERROR') {
      return 'Network error. Please check your internet connection.';
    }

    // PARSING_ERROR
    if (error.status === 'PARSING_ERROR') {
      return 'Error parsing server response. Please try again.';
    }

    // TIMEOUT_ERROR
    if (error.status === 'TIMEOUT_ERROR') {
      return 'Request timed out. Please try again.';
    }

    // Check if error has data with message
    if (error.data && typeof error.data === 'object' && 'message' in error.data) {
      return (error.data as { message: string }).message;
    }
  }

  // Handle SerializedError
  if ('message' in error && error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Transform error to ApiError object
 * @param error - RTK Query error object
 * @returns Structured ApiError object
 */
export const transformError = (
  error: FetchBaseQueryError | SerializedError | undefined
): ApiError => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
    };
  }

  if ('status' in error && typeof error.status === 'number') {
    return {
      status: error.status,
      message: getErrorMessage(error),
      code: error.data && typeof error.data === 'object' && 'code' in error.data
        ? (error.data as { code: string }).code
        : undefined,
      details: error.data && typeof error.data === 'object'
        ? error.data as Record<string, unknown>
        : undefined,
    };
  }

  return {
    message: getErrorMessage(error),
  };
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: FetchBaseQueryError | SerializedError): boolean => {
  return 'status' in error && error.status === 'FETCH_ERROR';
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: FetchBaseQueryError | SerializedError): boolean => {
  return 'status' in error && (error.status === 401 || error.status === 403);
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: FetchBaseQueryError | SerializedError): boolean => {
  return 'status' in error && (error.status === 400 || error.status === 422);
};

/**
 * Build query string from params object
 * @param params - Object with query parameters
 * @returns Query string (e.g., "?key1=value1&key2=value2")
 */
export const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Parse query string to object
 * @param queryString - Query string (with or without leading "?")
 * @returns Object with parsed parameters
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString.replace(/^\?/, ''));
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

/**
 * Delay helper for retry logic
 * @param ms - Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry helper for API calls
 * @param fn - Async function to retry
 * @param retries - Number of retries (default: 3)
 * @param delayMs - Delay between retries in ms (default: 1000)
 * @param backoff - Use exponential backoff (default: true)
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000,
  backoff: boolean = true
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    const nextDelay = backoff ? delayMs * 2 : delayMs;
    await delay(delayMs);

    return retryAsync(fn, retries - 1, nextDelay, backoff);
  }
};

/**
 * Convert FormData to object
 * @param formData - FormData instance
 * @returns Plain object
 */
export const formDataToObject = (formData: FormData): Record<string, unknown> => {
  const object: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    if (object[key]) {
      // If key already exists, convert to array
      if (Array.isArray(object[key])) {
        (object[key] as unknown[]).push(value);
      } else {
        object[key] = [object[key], value];
      }
    } else {
      object[key] = value;
    }
  });

  return object;
};

/**
 * Convert object to FormData
 * @param obj - Plain object
 * @returns FormData instance
 */
export const objectToFormData = (obj: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, String(item)));
      } else if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

/**
 * Check if response is successful (status 2xx)
 */
export const isSuccessResponse = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Safe JSON parse with fallback
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};

