/**
 * Signature Module Types
 * Type definitions for signature management
 */

/**
 * Signature Type Enum
 */
export enum SignatureType {
  Draw = 'DRAW',
  Type = 'TYPE',
}

/**
 * Signature Entity
 * Represents a personal signature (drawn or typed)
 */
export type Signature = {
  id: string;
  userId: string;
  type: SignatureType;
  imageData: string; // Base64 PNG or SVG data URL
  isDefault: boolean;
  name?: string; // Optional label (e.g., "Formal", "Casual")
  createdAt: string;
  updatedAt: string;
}

/**
 * API Request Types
 */

export type CreateSignatureRequest = {
  type: SignatureType;
  imageData: string;
  name?: string;
}

export type CreateSignatureResponse = {
  signature: Signature;
}

export type UpdateSignatureRequest = {
  name?: string;
}

export type UpdateSignatureResponse = {
  signature: Signature;
}

export type ListSignaturesResponse = {
  signatures: Signature[];
}

export type SetDefaultResponse = {
  signature: Signature;
}

/**
 * Form Values Types
 * For React Hook Form
 */

export type CreateSignatureFormValues = {
  type: SignatureType;
  name?: string;
  // imageData handled separately via canvas/input
}

/**
 * Canvas Options
 */
export type SignatureCanvasOptions = {
  width?: number;
  height?: number;
  backgroundColor?: string;
  penColor?: string;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * Font Options for Typed Signatures
 */
export type SignatureFontOption = {
  value: string;
  label: string;
  fontFamily: string;
}

export const SIGNATURE_FONTS: SignatureFontOption[] = [
  { value: 'dancing', label: 'Dancing Script', fontFamily: "'Dancing Script', cursive" },
  { value: 'pacifico', label: 'Pacifico', fontFamily: "'Pacifico', cursive" },
  { value: 'allura', label: 'Allura', fontFamily: "'Allura', cursive" },
  { value: 'great-vibes', label: 'Great Vibes', fontFamily: "'Great Vibes', cursive" },
  { value: 'sacramento', label: 'Sacramento', fontFamily: "'Sacramento', cursive" },
];

