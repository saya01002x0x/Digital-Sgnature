/**
 * Signature API Service
 * RTK Query endpoints for signature management
 */

import { baseApi } from '@/app/api/baseApi';
import type {
  Signature,
  CreateSignatureRequest,
  UpdateSignatureRequest,
} from '../types';

export const signatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List all signatures for current user
    listSignatures: builder.query<Signature[], void>({
      query: () => '/api/signatures',
      // SỬA: Lấy dữ liệu từ response.data.signatures
      // Dùng (response: any) để tránh lỗi type tạm thời nếu interface chưa cập nhật
      transformResponse: (response: any) => response.data.signatures,
      providesTags: ['Signature'],
    }),

    // Get signature by ID
    getSignature: builder.query<Signature, string>({
      query: (id) => `/api/signatures/${id}`,
      // SỬA: Lấy dữ liệu từ response.data (hoặc response.data.signature tùy backend trả về)
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Signature', id }],
    }),

    // Create new signature
    createSignature: builder.mutation<Signature, CreateSignatureRequest>({
      query: (data) => ({
        url: '/api/signatures',
        method: 'POST',
        body: data,
      }),
      // SỬA: Backend thường trả về { data: { ...signatureObj } } hoặc { data: signatureObj }
      // Tôi để response.data, nếu vẫn lỗi bạn thử response.data.signature nhé
      transformResponse: (response: any) => {
        // Nếu backend trả về { data: { signature: {...} } } thì dùng dòng dưới:
        // return response.data.signature; 

        // Nếu backend trả về { data: { ... } } (object trực tiếp) thì dùng dòng này:
        return response.data;
      },
      invalidatesTags: ['Signature'],
    }),

    // Update signature (name only)
    updateSignature: builder.mutation<Signature, { id: string; data: UpdateSignatureRequest }>({
      query: ({ id, data }) => ({
        url: `/api/signatures/${id}`,
        method: 'PATCH',
        body: data,
      }),
      // SỬA: Tương tự như create
      transformResponse: (response: any) => response.data,
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
      // SỬA: Tương tự như create
      transformResponse: (response: any) => response.data,
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