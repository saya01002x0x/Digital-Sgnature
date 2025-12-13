/**
 * Documents API Service
 * RTK Query endpoints for document and field management
 */

import { baseApi } from '@/app/api/baseApi';
import type {
  Document,
  Field,
  ListDocumentsRequest,
  ListDocumentsResponse,
  UpdateDocumentRequest,
  CreateFieldRequest,
  UpdateFieldRequest,
  GetTimelineResponse,
  GetDocumentResponse,
  UploadDocumentResponse,
  CreateFieldResponse,
  UpdateFieldResponse,
  UpdateDocumentResponse
} from '../types';

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List documents
    listDocuments: builder.query<ListDocumentsResponse, ListDocumentsRequest | void>({
      query: (params) => ({
        url: '/api/documents',
        params: params || undefined,
      }),
      // FIX: Bóc tách data từ response backend
      transformResponse: (response: any) => response.data,
      providesTags: ['Document'],
    }),

    // Upload document
    uploadDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: '/api/documents/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['Document'],
    }),

    // Get document with fields
    getDocument: builder.query<GetDocumentResponse, string>({
      query: (id) => `/api/documents/${id}`,
      // FIX: Bóc tách data
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [
        { type: 'Document', id },
        'Field',
        'Signer',
      ],
    }),

    // Update document
    updateDocument: builder.mutation<Document, { id: string; data: UpdateDocumentRequest }>({
      query: ({ id, data }) => ({
        url: `/api/documents/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Document', id }, 'Document'],
    }),

    // Delete document
    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),

    // Create field
    createField: builder.mutation<Field, { documentId: string; data: CreateFieldRequest }>({
      query: ({ documentId, data }) => ({
        url: `/api/documents/${documentId}/fields`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['Field', 'Document'],
    }),

    // Update field
    updateField: builder.mutation<Field, { id: string; data: UpdateFieldRequest }>({
      query: ({ id, data }) => ({
        url: `/api/documents/fields/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Field', id }, 'Field'],
    }),

    // Delete field
    deleteField: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/documents/fields/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Field', 'Document'],
    }),

    // Get document timeline (audit trail)
    getDocumentTimeline: builder.query<GetTimelineResponse, string>({
      query: (documentId) => `/api/documents/${documentId}/timeline`,
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, documentId) => [
        { type: 'Document', id: documentId },
        'AuditEvent',
      ],
      // Tắt polling nếu backend chưa có API timeline để đỡ báo lỗi liên tục
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useListDocumentsQuery,
  useUploadDocumentMutation,
  useGetDocumentQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useCreateFieldMutation,
  useUpdateFieldMutation,
  useDeleteFieldMutation,
  useGetDocumentTimelineQuery,
} = documentsApi;