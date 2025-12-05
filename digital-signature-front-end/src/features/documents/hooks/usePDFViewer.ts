/**
 * usePDFViewer Hook
 * Custom hook for managing PDF viewer state
 */

import { useState, useCallback } from 'react';

export const usePDFViewer = () => {
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 50));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(100);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, pageCount)));
  }, [pageCount]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    pageCount,
    currentPage,
    zoom,
    loading,
    setPageCount,
    setCurrentPage,
    setZoom,
    setLoading,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
    goToPage,
    nextPage,
    prevPage,
  };
};

