/**
 * Formatting utilities
 * Common functions to format dates, numbers, file sizes, etc.
 */

/**
 * Format a date to a localized string
 * @param date - Date string or Date object
 * @param locale - Locale code (vi-VN, en-US, etc.)
 * @param options - Intl.DateTimeFormat options
 */
export const formatDate = (
  date: string | Date,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date to include time
 * @param date - Date string or Date object
 * @param locale - Locale code
 */
export const formatDateTime = (
  date: string | Date,
  locale = 'en-US'
): string => {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format timestamp with full date and time
 * @param timestamp - ISO timestamp string or Date object
 * @param locale - Locale code ('vi' or 'en')
 */
export const formatTimestamp = (
  timestamp: string | Date,
  locale: 'vi' | 'en' = 'en'
): string => {
  try {
    const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US';
    
    return new Intl.DateTimeFormat(localeCode, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @param locale - Locale code
 */
export const formatRelativeTime = (
  date: string | Date,
  locale = 'en-US'
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    // Seconds
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(-diffInSeconds, 'second');
    }

    // Minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(-diffInMinutes, 'minute');
    }

    // Hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(-diffInHours, 'hour');
    }

    // Days
    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(-diffInDays, 'day');
    }

    // Months
    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(-diffInMonths, 'month');
    }

    // Years
    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, 'year');
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

/**
 * Format file size to human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Format currency
 * @param amount - Amount to format
 * @param currency - Currency code (USD, VND, etc.)
 * @param locale - Locale code
 */
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount} ${currency}`;
  }
};

/**
 * Format number with thousands separator
 * @param num - Number to format
 * @param locale - Locale code
 */
export const formatNumber = (num: number, locale = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
};

/**
 * Format percentage
 * @param value - Value to format (0-1 range)
 * @param decimals - Number of decimal places
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  try {
    return `${(value * 100).toFixed(decimals)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return '0%';
  }
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 */
export const truncateText = (text: string, maxLength = 50): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Format phone number (basic)
 * @param phone - Phone number string
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Return original if can't format
  return phone;
};

/**
 * Capitalize first letter of each word
 * @param text - Text to capitalize
 */
export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert camelCase or PascalCase to Title Case
 * @param text - Text to convert
 */
export const camelToTitle = (text: string): string => {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Format duration in milliseconds to human-readable format
 * @param ms - Duration in milliseconds
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

