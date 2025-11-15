/**
 * useSignatureCanvas Hook
 * Custom hook for managing signature canvas
 */

import { useRef, useCallback } from 'react';
import { clearCanvas, isCanvasEmpty, trimCanvas } from '../utils/signatureHelpers';

export const useSignatureCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clear = useCallback(() => {
    if (canvasRef.current) {
      clearCanvas(canvasRef.current);
    }
  }, []);

  const isEmpty = useCallback((): boolean => {
    if (!canvasRef.current) return true;
    return isCanvasEmpty(canvasRef.current);
  }, []);

  const getDataUrl = useCallback((
    format: 'image/png' | 'image/jpeg' = 'image/png',
    quality = 0.95
  ): string | null => {
    if (!canvasRef.current) return null;
    
    // Trim canvas before export
    const trimmedCanvas = trimCanvas(canvasRef.current);
    return trimmedCanvas.toDataURL(format, quality);
  }, []);

  const save = useCallback((): string | null => {
    if (isEmpty()) {
      return null;
    }
    return getDataUrl();
  }, [isEmpty, getDataUrl]);

  return {
    canvasRef,
    clear,
    isEmpty,
    getDataUrl,
    save,
  };
};

