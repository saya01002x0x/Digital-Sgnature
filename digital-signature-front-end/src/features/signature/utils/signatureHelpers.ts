/**
 * Signature Helper Utilities
 * Helper functions for signature validation and manipulation
 */

/**
 * Validate image data URL format
 */
export const isValidImageDataUrl = (dataUrl: string): boolean => {
  return dataUrl.startsWith('data:image/');
};

/**
 * Get image dimensions from data URL
 */
export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

/**
 * Convert canvas to data URL with options
 */
export const canvasToDataUrl = (
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.95
): string => {
  return canvas.toDataURL(format, quality);
};

/**
 * Estimate data URL file size in bytes
 */
export const estimateDataUrlSize = (dataUrl: string): number => {
  // Remove data URL prefix
  const base64 = dataUrl.split(',')[1] || '';
  // Base64 encoding increases size by ~33%
  return Math.ceil((base64.length * 3) / 4);
};

/**
 * Check if data URL exceeds size limit
 */
export const isDataUrlSizeValid = (dataUrl: string, maxSizeBytes = 1048576): boolean => {
  const size = estimateDataUrlSize(dataUrl);
  return size <= maxSizeBytes;
};

/**
 * Convert text to signature image data URL
 */
export const textToSignatureDataUrl = (
  text: string,
  fontFamily: string,
  options: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
  } = {}
): string => {
  const {
    fontSize = 48,
    color = '#000000',
    backgroundColor = 'transparent',
  } = options;

  // Create temporary canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set font for measurement
  ctx.font = `${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  
  // Set canvas size with padding
  const padding = 20;
  canvas.width = metrics.width + padding * 2;
  canvas.height = fontSize * 1.5 + padding * 2;

  // Fill background
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw text
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL('image/png');
};

/**
 * Clear canvas
 */
export const clearCanvas = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

/**
 * Check if canvas is empty
 */
export const isCanvasEmpty = (canvas: HTMLCanvasElement): boolean => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return true;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return !imageData.data.some(channel => channel !== 0);
};

/**
 * Trim transparent pixels from canvas
 */
export const trimCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;

  // Find bounding box
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // If canvas is empty, return as is
  if (minX > maxX || minY > maxY) {
    return canvas;
  }

  // Create trimmed canvas
  const padding = 10;
  const trimmedWidth = maxX - minX + 1 + padding * 2;
  const trimmedHeight = maxY - minY + 1 + padding * 2;
  
  const trimmedCanvas = document.createElement('canvas');
  trimmedCanvas.width = trimmedWidth;
  trimmedCanvas.height = trimmedHeight;
  
  const trimmedCtx = trimmedCanvas.getContext('2d');
  if (trimmedCtx) {
    trimmedCtx.drawImage(
      canvas,
      minX, minY, maxX - minX + 1, maxY - minY + 1,
      padding, padding, maxX - minX + 1, maxY - minY + 1
    );
  }

  return trimmedCanvas;
};

