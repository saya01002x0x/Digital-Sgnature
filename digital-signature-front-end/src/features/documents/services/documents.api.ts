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
  UploadDocumentResponse,
  GetDocumentResponse,
  UpdateDocumentRequest,
  UpdateDocumentResponse,
  CreateFieldRequest,
  CreateFieldResponse,
  UpdateFieldRequest,
  UpdateFieldResponse,
  GetTimelineResponse,
} from '../types';

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List documents
    listDocuments: builder.query<ListDocumentsResponse, ListDocumentsRequest | void>({
      query: (params) => ({
        url: '/api/documents',
        params,
      }),
      providesTags: ['Document'],
    }),

    // Upload document
    uploadDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: '/api/documents/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: UploadDocumentResponse) => response.document,
      invalidatesTags: ['Document'],
    }),

    // Get document with fields
    getDocument: builder.query<GetDocumentResponse, string>({
      query: (id) => `/api/documents/${id}`,
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
      transformResponse: (response: UpdateDocumentResponse) => response.document,
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
      transformResponse: (response: CreateFieldResponse) => response.field,
      invalidatesTags: ['Field', 'Document'],
    }),

    // Update field
    updateField: builder.mutation<Field, { id: string; data: UpdateFieldRequest }>({
      query: ({ id, data }) => ({
        url: `/api/documents/fields/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: UpdateFieldResponse) => response.field,
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
      providesTags: (_result, _error, documentId) => [
        { type: 'Document', id: documentId },
        'AuditEvent',
      ],
      // Enable polling for real-time updates (every 10 seconds)
      // Can be overridden in component with pollingInterval option
      keepUnusedDataFor: 60, // Keep cached for 1 minute
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

