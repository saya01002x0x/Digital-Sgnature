/**
 * Documents Module Types
 * Type definitions for document and field management
 */

/**
 * Document Status Enum
 */
export enum DocumentStatus {
  Draft = 'DRAFT',
  Signing = 'SIGNING',
  Done = 'DONE',
  Declined = 'DECLINED',
}

/**
 * Field Type Enum
 */
export enum FieldType {
  Signature = 'SIGNATURE',
  Initials = 'INITIALS',
  Date = 'DATE',
  Text = 'TEXT',
}

/**
 * Document Entity
 */
export type Document = {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: number;
  pageCount: number;
  status: DocumentStatus;
  ownerId: string;
  ownerName?: string;  // Display name of the owner (from backend)
  isOwner?: boolean;   // True if current user is the owner
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  declinedAt?: string;
  declinedBy?: string;
  declineReason?: string;
}

/**
 * Field Entity
 */
export type Field = {
  id: string;
  documentId: string;
  type: FieldType;
  pageNumber: number; // 1-indexed
  positionX: number; // % of page width (0-100)
  positionY: number; // % of page height (0-100)
  width: number; // % of page width
  height: number; // % of page height
  signerId?: string;
  value?: string;
  isRequired: boolean;
  placeholder?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Request/Response Types
 */

export type ListDocumentsRequest = {
  status?: DocumentStatus;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export type ListDocumentsResponse = {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

export type UploadDocumentRequest = {
  file: File;
  title?: string;
}

export type UploadDocumentResponse = {
  document: Document;
}

export type GetDocumentResponse = {
  document: Document;
  fields: Field[];
  signers: any[]; // Signer type from invite-signing module
}

export type UpdateDocumentRequest = {
  title?: string;
}

export type UpdateDocumentResponse = {
  document: Document;
}

export type CreateFieldRequest = {
  type: FieldType;
  pageNumber: number;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  signerId?: string;
  isRequired?: boolean;
  placeholder?: string;
}

export type CreateFieldResponse = {
  field: Field;
}

export type UpdateFieldRequest = {
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  signerId?: string;
}

export type UpdateFieldResponse = {
  field: Field;
}

/**
 * Field Toolbar Item
 */
export type FieldToolbarItem = {
  type: FieldType;
  label: string;
  icon: string;
  color: string;
}

export const FIELD_TOOLBAR_ITEMS: FieldToolbarItem[] = [
  { type: FieldType.Signature, label: 'Signature', icon: 'EditOutlined', color: '#1890ff' },
  { type: FieldType.Initials, label: 'Initials', icon: 'FontSizeOutlined', color: '#52c41a' },
  { type: FieldType.Date, label: 'Date', icon: 'CalendarOutlined', color: '#fa8c16' },
  { type: FieldType.Text, label: 'Text', icon: 'AlignLeftOutlined', color: '#722ed1' },
];

/**
 * Default field dimensions (in %) - optimized for A4 documents
 */
export const DEFAULT_FIELD_DIMENSIONS = {
  [FieldType.Signature]: { width: 25, height: 10 }, // Larger for A4 documents
  [FieldType.Initials]: { width: 12, height: 10 },
  [FieldType.Date]: { width: 18, height: 6 },
  [FieldType.Text]: { width: 30, height: 6 },
};

/**
 * Audit Event Type Enum
 */
export enum EventType {
  Created = 'CREATED',
  Updated = 'UPDATED',
  FieldsPlaced = 'FIELDS_PLACED',
  InvitationsSent = 'INVITATIONS_SENT',
  Opened = 'OPENED',
  Signed = 'SIGNED',
  Declined = 'DECLINED',
  Completed = 'COMPLETED',
}

/**
 * Audit Event Entity
 */
export type AuditEvent = {
  id: string;
  documentId: string;
  eventType: EventType;
  actorId?: string;
  actorEmail?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Get Timeline Response
 */
export type GetTimelineResponse = {
  events: AuditEvent[];
}

