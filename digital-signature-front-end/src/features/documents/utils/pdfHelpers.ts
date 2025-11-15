/**
 * PDF Helper Utilities
 * Helper functions for PDF validation and processing
 */

/**
 * Validate if file is PDF
 */
export const isPDFFile = (file: File): boolean => {
  return file.type === 'application/pdf' || file.name.endsWith('.pdf');
};

/**
 * Validate PDF file size (max 10MB)
 */
export const isValidPDFSize = (file: File, maxSizeMB = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Format file size to human readable
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Extract page count from PDF (mock - in real app use pdf.js)
 */
export const extractPDFPageCount = async (file: File): Promise<number> => {
  // Mock implementation - in real app, use pdf.js to extract actual page count
  // For now, return a mock value based on file size
  const sizeInMB = file.size / (1024 * 1024);
  // Rough estimate: 1 page ≈ 0.1MB
  return Math.max(1, Math.ceil(sizeInMB / 0.1));
};

/**
 * Create object URL for PDF file
 */
export const createPDFObjectURL = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke object URL
 */
export const revokePDFObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Validate PDF upload
 */
export const validatePDFUpload = (
  file: File
): { valid: boolean; error?: string } => {
  if (!isPDFFile(file)) {
    return { valid: false, error: 'Only PDF files are allowed' };
  }

  if (!isValidPDFSize(file)) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  return { valid: true };
};

