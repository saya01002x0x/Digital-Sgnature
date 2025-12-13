/**
 * Invite-Signing Module Types
 * Types for inviting signers and signing workflow
 */

import type { Document, Field } from '@/features/documents/types';

/**
 * Signer Status Enum
 */
export enum SignerStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  DECLINED = 'DECLINED',
}

/**
 * Signing Order Type
 */
export enum SigningOrder {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
}

/**
 * Signer Interface
 */
export interface Signer {
  id: string;
  documentId: string;
  email: string;
  name: string;
  order: number;
  status: SignerStatus;
  signingUrl: string;
  signedAt?: string;
  declinedAt?: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Signing Session Response
 * Public endpoint response for signer
 */
export interface SigningSession {
  document: Document;
  signer: Signer;
  fields: Field[]; // Only fields assigned to this signer
  allSigners: Signer[]; // All signers for display
}

/**
 * Field Value for Signing
 */
export interface FieldValue {
  fieldId: string;
  value: string; // signature data URL, date string, or text
}

/**
 * API Request/Response Types
 */

// Invite Signers Request
export interface InviteSignersRequest {
  signers: {
    email: string;
    name: string;
    order: number;
  }[];
  signingOrder: SigningOrder;
  fieldAssignments?: Record<string, string>; // fieldId -> signerEmail
}

// Invite Signers Response
export interface InviteSignersResponse {
  document: Document;
  signers: Signer[];
}

// Complete Signing Request
export interface SigningCompleteRequest {
  fieldValues: FieldValue[];
}

// Complete Signing Response
export interface SigningCompleteResponse {
  signer: Signer;
  document: Document;
}

// Decline Signing Request
export interface DeclineRequest {
  reason: string;
}

// Decline Signing Response
export interface DeclineResponse {
  signer: Signer;
  document: Document;
}

/**
 * Form Value Types
 */

// Invite Form Values
export interface InviteFormValues {
  signers: {
    email: string;
    name: string;
    order: number;
  }[];
  signingOrder: SigningOrder;
}

// Decline Form Values
export interface DeclineFormValues {
  reason: string;
}

