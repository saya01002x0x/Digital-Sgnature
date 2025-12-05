/**
 * Signature API Service
 * RTK Query endpoints for signature management
 */

import { baseApi } from '@/app/api/baseApi';
import type {
  Signature,
  CreateSignatureRequest,
  CreateSignatureResponse,
  UpdateSignatureRequest,
  UpdateSignatureResponse,
  ListSignaturesResponse,
  SetDefaultResponse,
} from '../types';

export const signatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List all signatures for current user
    listSignatures: builder.query<Signature[], void>({
      query: () => '/api/signatures',
      transformResponse: (response: ListSignaturesResponse) => response.signatures,
      providesTags: ['Signature'],
    }),

    // Get signature by ID
    getSignature: builder.query<Signature, string>({
      query: (id) => `/api/signatures/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Signature', id }],
    }),

    // Create new signature
    createSignature: builder.mutation<Signature, CreateSignatureRequest>({
      query: (data) => ({
        url: '/api/signatures',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: CreateSignatureResponse) => response.signature,
      invalidatesTags: ['Signature'],
    }),

    // Update signature (name only)
    updateSignature: builder.mutation<Signature, { id: string; data: UpdateSignatureRequest }>({
      query: ({ id, data }) => ({
        url: `/api/signatures/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: UpdateSignatureResponse) => response.signature,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Signature', id }, 'Signature'],
    }),

    // Delete signature
    deleteSignature: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/signatures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Signature'],
    }),

    // Set signature as default
    setDefaultSignature: builder.mutation<Signature, string>({
      query: (id) => ({
        url: `/api/signatures/${id}/set-default`,
        method: 'POST',
      }),
      transformResponse: (response: SetDefaultResponse) => response.signature,
      invalidatesTags: ['Signature'],
    }),
  }),
});

export const {
  useListSignaturesQuery,
  useGetSignatureQuery,
  useCreateSignatureMutation,
  useUpdateSignatureMutation,
  useDeleteSignatureMutation,
  useSetDefaultSignatureMutation,
} = signatureApi;

