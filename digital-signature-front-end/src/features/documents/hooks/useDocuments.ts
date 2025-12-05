/**
 * useDocuments Hook
 * Custom hook for managing documents list with filters, search, sort, pagination
 */

import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useListDocumentsQuery,
  useDeleteDocumentMutation,
} from '../services/documents.api';
import type { DocumentStatus } from '../types';
import type { DocumentFiltersValue } from '../components/DocumentFilters';

export const useDocuments = () => {
  const { t } = useTranslation('documents');
  
  // Filters state
  const [filters, setFilters] = useState<DocumentFiltersValue>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Build query params
  const queryParams = useMemo(() => ({
    status: filters.status,
    search: filters.search,
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
    page,
    limit: pageSize,
  }), [filters, page, pageSize]);

  // Fetch documents
  const {
    data: documentsData,
    isLoading,
    error,
    refetch,
  } = useListDocumentsQuery(queryParams);

  // Delete document mutation
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  // Handle filter change
  const handleFiltersChange = useCallback((newFilters: DocumentFiltersValue) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  // Handle delete document
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteDocument(id).unwrap();
        message.success(t('useDocuments.deleteSuccess'));
        
        // If current page becomes empty after delete, go to previous page
        if (documentsData?.documents.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          refetch();
        }
      } catch (error: any) {
        console.error('Delete document error:', error);
        
        if (error.status === 404) {
          message.error(t('useDocuments.documentNotFound'));
        } else if (error.status === 403) {
          message.error(t('useDocuments.deleteNotAllowed'));
        } else {
          message.error(t('useDocuments.deleteError'));
        }
      }
    },
    [deleteDocument, documentsData, page, t, refetch]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPage(1);
  }, []);

  return {
    // Data
    documents: documentsData?.documents || [],
    total: documentsData?.total || 0,
    isLoading,
    error,

    // Filters
    filters,
    handleFiltersChange,
    handleClearFilters,

    // Pagination
    pagination: {
      current: page,
      pageSize,
      total: documentsData?.total || 0,
    },
    handlePageChange,

    // Actions
    handleDelete,
    isDeleting,
    refetch,
  };
};

