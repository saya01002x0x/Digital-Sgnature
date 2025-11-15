/**
 * Invite-Signing API Service
 * RTK Query service for invite signers and signing workflow
 */

import { baseApi } from '@/app/api/baseApi';
import type {
  SigningSession,
  SigningCompleteRequest,
  SigningCompleteResponse,
  DeclineRequest,
  DeclineResponse,
  InviteSignersRequest,
  InviteSignersResponse,
} from '../types';

export const inviteSigningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Signing Session (PUBLIC endpoint)
    getSigningSession: builder.query<SigningSession, string>({
      query: (token) => `/api/signing/${token}`,
      providesTags: ['SigningSession'],
    }),

    // Complete Signing (PUBLIC endpoint)
    completeSigning: builder.mutation<
      SigningCompleteResponse,
      { token: string; data: SigningCompleteRequest }
    >({
      query: ({ token, data }) => ({
        url: `/api/signing/${token}/complete`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SigningSession', 'Document', 'Signer'],
    }),

    // Decline Signing (PUBLIC endpoint)
    declineSigning: builder.mutation<
      DeclineResponse,
      { token: string; data: DeclineRequest }
    >({
      query: ({ token, data }) => ({
        url: `/api/signing/${token}/decline`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SigningSession', 'Document', 'Signer'],
    }),

    // Invite Signers (PROTECTED endpoint - for Phase 7)
    inviteSigners: builder.mutation<
      InviteSignersResponse,
      { documentId: string; data: InviteSignersRequest }
    >({
      query: ({ documentId, data }) => ({
        url: `/api/documents/${documentId}/invite`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Document', 'Signer'],
    }),
  }),
});

export const {
  useGetSigningSessionQuery,
  useCompleteSigningMutation,
  useDeclineSigningMutation,
  useInviteSignersMutation,
} = inviteSigningApi;

