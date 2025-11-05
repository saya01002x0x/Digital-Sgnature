# Data Model: FE-only E-Signature Web Application

**Date**: 2025-11-05  
**Phase**: Phase 1 - Design Artifacts  
**Purpose**: Define TypeScript entities, interfaces, enums và relationships cho toàn bộ application

---

## Core Entities

### 1. User

Represents người dùng trong hệ thống (có thể là document owner, signer, hoặc admin).

```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // Unique, validated
  name: string;                  // Display name
  avatar?: string;               // URL to avatar image
  role: UserRole;                // User or Admin
  emailVerified: boolean;
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}

enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',              // Single global admin
}

// Validation Rules
const userSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(100),
  password: z.string().min(8).max(128).regex(/[A-Z]/).regex(/[0-9]/), // Registration only
});
```

**Relationships**:
- `User` 1 → N `Signature` (owns multiple signatures)
- `User` 1 → N `Document` (owns multiple documents)

**State Transitions**: N/A (static entity)

---

### 2. Signature

Represents chữ ký cá nhân của user (drawn hoặc typed).

```typescript
interface Signature {
  id: string;                    // UUID
  userId: string;                // Owner user ID
  type: SignatureType;           // Draw or Type
  imageData: string;             // Base64 PNG hoặc SVG data URL
  isDefault: boolean;            // One default per user
  name?: string;                 // Optional label (e.g., "Formal", "Casual")
  createdAt: string;
  updatedAt: string;
}

enum SignatureType {
  Draw = 'DRAW',      // Canvas drawing
  Type = 'TYPE',      // Typed text with font
}

// Validation Rules
const signatureSchema = z.object({
  type: z.enum(['DRAW', 'TYPE']),
  imageData: z.string().startsWith('data:image/'), // Data URL format
  name: z.string().max(50).optional(),
});
```

**Relationships**:
- `Signature` N → 1 `User` (belongs to user)
- `Signature` 1 → N `Field` (used in signature fields, indirect via value)

**State Transitions**: N/A

**Business Rules**:
- Only one `isDefault = true` per user
- When setting new default, previous default must be unset
- `imageData` size limit: ≤ 1MB (enforced by backend)

---

### 3. Document

Represents tài liệu cần ký (typically PDF).

```typescript
interface Document {
  id: string;                    // UUID
  title: string;                 // User-provided or filename
  fileUrl: string;               // Backend URL to PDF file
  fileSize: number;              // Bytes
  pageCount: number;             // Number of pages in PDF
  status: DocumentStatus;
  ownerId: string;               // User who created document
  createdAt: string;
  updatedAt: string;
  completedAt?: string;          // Timestamp when all signers completed
  declinedAt?: string;           // Timestamp when any signer declined
  declinedBy?: string;           // Signer ID who declined
  declineReason?: string;
}

enum DocumentStatus {
  Draft = 'DRAFT',          // Being prepared, fields placed
  Signing = 'SIGNING',      // Invitations sent, awaiting signatures
  Done = 'DONE',            // All signers completed
  Declined = 'DECLINED',    // At least one signer declined
}

// Validation Rules
const documentSchema = z.object({
  title: z.string().min(1).max(255),
  // fileUrl validated by backend after upload
});
```

**Relationships**:
- `Document` N → 1 `User` (owned by user)
- `Document` 1 → N `Field` (contains multiple fields)
- `Document` 1 → N `Signer` (has multiple signers)
- `Document` 1 → N `AuditEvent` (has event history)

**State Transitions**:
```
Draft → Signing (when invitations sent)
Signing → Done (when all signers complete)
Signing → Declined (when any signer declines)
Draft/Declined → Signing (resend after fix - requires all signers re-sign)
```

**Business Rules**:
- Cannot edit fields when `status = Signing | Done | Declined`
- Cannot send invitations when `status != Draft`
- All required fields must be assigned to signers before sending invitations
- Status auto-updates based on signer actions

---

### 4. Field

Represents một trường (field) trên document cần điền/ký.

```typescript
interface Field {
  id: string;                    // UUID
  documentId: string;
  type: FieldType;
  pageNumber: number;            // 1-indexed (page 1, 2, 3...)
  positionX: number;             // % of page width (0-100)
  positionY: number;             // % of page height (0-100)
  width: number;                 // % of page width
  height: number;                // % of page height
  signerId?: string;             // Assigned signer (null for unassigned)
  value?: string;                // Filled value (signature data URL, date, text)
  isRequired: boolean;           // Must be filled before submit
  placeholder?: string;          // Hint text for text fields
  createdAt: string;
  updatedAt: string;
}

enum FieldType {
  Signature = 'SIGNATURE',
  Initials = 'INITIALS',
  Date = 'DATE',
  Text = 'TEXT',
}

// Validation Rules
const fieldSchema = z.object({
  type: z.enum(['SIGNATURE', 'INITIALS', 'DATE', 'TEXT']),
  pageNumber: z.number().int().positive(),
  positionX: z.number().min(0).max(100),
  positionY: z.number().min(0).max(100),
  width: z.number().min(0).max(100),
  height: z.number().min(0).max(100),
  isRequired: z.boolean().default(true),
});
```

**Relationships**:
- `Field` N → 1 `Document` (belongs to document)
- `Field` N → 1 `Signer` (assigned to signer, optional)

**State Transitions**: N/A (fields don't have lifecycle)

**Business Rules**:
- All fields must be assigned (`signerId != null`) before sending invitations
- No duplicate `signerId` in same document (each email once) - enforced via parent Signer
- `value` populated by signer during signing process
- Position coordinates are relative (%) to support different screen sizes

---

### 5. Signer

Represents người được mời ký tài liệu.

```typescript
interface Signer {
  id: string;                    // UUID
  documentId: string;
  email: string;                 // Invitation sent to this email
  name: string;                  // Display name
  order: number;                 // Signing sequence (1, 2, 3...) for sequential mode
  status: SignerStatus;
  signingUrl: string;            // Unique token-based URL for signing room
  invitedAt?: string;            // Timestamp when invitation sent
  openedAt?: string;             // Timestamp when signing URL first accessed
  signedAt?: string;             // Timestamp when completed signing
  declinedAt?: string;           // Timestamp when declined
  declineReason?: string;        // User-provided reason for decline
}

enum SignerStatus {
  Pending = 'PENDING',       // Invited but not yet signed/declined
  Opened = 'OPENED',         // Opened signing room but not completed
  Signed = 'SIGNED',         // Completed signing
  Declined = 'DECLINED',     // Declined to sign
}

// Validation Rules
const signerSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(100),
  order: z.number().int().positive(),
});
```

**Relationships**:
- `Signer` N → 1 `Document` (belongs to document)
- `Signer` 1 → N `Field` (has assigned fields)

**State Transitions**:
```
Pending → Opened (first access signing URL)
Opened → Signed (complete signing)
Opened/Pending → Declined (decline action)
```

**Business Rules**:
- `email` must be unique per document (validated at API level per FR-032a)
- Sequential mode: invitation sent only to `order = 1` initially; next signer invited after previous signs
- Parallel mode: all signers invited simultaneously (order ignored)
- `signingUrl` format: `/signing/{token}` where token is unique, non-guessable UUID
- Cannot complete signing if any required fields unassigned to this signer are empty

---

### 6. AuditEvent

Represents sự kiện trong lifecycle của document (audit trail).

```typescript
interface AuditEvent {
  id: string;                    // UUID
  documentId: string;
  eventType: EventType;
  actorId?: string;              // User ID (null for system events)
  actorEmail?: string;           // Email for display (denormalized for UX)
  timestamp: string;             // ISO 8601, server-generated
  metadata?: Record<string, unknown>; // Additional context (e.g., signer name, decline reason)
}

enum EventType {
  Created = 'CREATED',                  // Document created
  Updated = 'UPDATED',                  // Document metadata updated
  FieldsPlaced = 'FIELDS_PLACED',       // Fields added/modified
  InvitationsSent = 'INVITATIONS_SENT', // Signers invited
  Opened = 'OPENED',                    // Signer opened signing room
  Signed = 'SIGNED',                    // Signer completed signing
  Declined = 'DECLINED',                // Signer declined
  Completed = 'COMPLETED',              // All signers signed (document done)
}

// Validation Rules: Server-side only (FE displays readonly)
```

**Relationships**:
- `AuditEvent` N → 1 `Document` (belongs to document)
- `AuditEvent` N → 1 `User` (optional, performed by user)

**State Transitions**: N/A (immutable log)

**Business Rules**:
- Events are append-only (never deleted or modified)
- Timeline displays in **newest-first** order (per FR-048 clarification)
- `metadata` examples:
  - `{ signerName: "John Doe" }` for Signed event
  - `{ reason: "Need more time" }` for Declined event
  - `{ fieldCount: 5 }` for FieldsPlaced event

---

## Supporting Types

### API Request/Response Types

```typescript
// Auth
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string; // JWT or session token (stored in httpOnly cookie preferred)
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Documents
interface DocumentListQuery {
  status?: DocumentStatus;
  search?: string;           // Search by title
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface DocumentUploadRequest {
  file: File;                // PDF file
  title?: string;            // Optional, defaults to filename
}

interface DocumentUploadResponse {
  document: Document;
  uploadUrl?: string;        // If backend requires direct upload
}

// Invite
interface InviteRequest {
  documentId: string;
  signers: Array<{
    email: string;
    name: string;
    order: number;
  }>;
  signingOrder: 'SEQUENTIAL' | 'PARALLEL';
}

interface SigningCompleteRequest {
  signerId: string;
  fieldValues: Array<{
    fieldId: string;
    value: string;
  }>;
}

interface DeclineRequest {
  signerId: string;
  reason: string;
}

// Admin
interface AdminMetrics {
  totalUsers: number;
  totalDocuments: number;
  pendingSignatures: number;
  documentsCreatedThisMonth: number;
  documentsCreatedThisWeek?: number;
  totalDocumentsCompleted?: number;
}
```

### UI State Types

```typescript
// Theme
type Theme = 'light' | 'dark';

// Language
type Language = 'vi' | 'en';

// Loading states (RTK Query auto-generates these)
interface QueryState<T> {
  data?: T;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: ApiError;
}

// Error handling
interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Form states (React Hook Form)
interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}
```

---

## Validation Schemas (Zod)

Centralized validation schemas cho consistency.

```typescript
// shared/utils/validators.ts
import { z } from 'zod';

// Common
export const emailSchema = z.string().email('Invalid email address').max(255);
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[0-9]/, 'Password must contain number');

// Auth
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

// Signature
export const signatureCreateSchema = z.object({
  type: z.enum(['DRAW', 'TYPE']),
  imageData: z.string().startsWith('data:image/', 'Invalid image data'),
  name: z.string().max(50).optional(),
});

// Document
export const documentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
});

// Field
export const fieldCreateSchema = z.object({
  type: z.enum(['SIGNATURE', 'INITIALS', 'DATE', 'TEXT']),
  pageNumber: z.number().int().positive('Invalid page number'),
  positionX: z.number().min(0).max(100),
  positionY: z.number().min(0).max(100),
  width: z.number().min(0).max(100),
  height: z.number().min(0).max(100),
  signerId: z.string().uuid().optional(),
  isRequired: z.boolean().default(true),
});

// Invite
export const inviteSchema = z.object({
  signers: z.array(
    z.object({
      email: emailSchema,
      name: z.string().min(2).max(100),
      order: z.number().int().positive(),
    })
  ).min(1, 'At least one signer required'),
  signingOrder: z.enum(['SEQUENTIAL', 'PARALLEL']),
});

// Decline
export const declineSchema = z.object({
  reason: z.string().min(10, 'Please provide reason (at least 10 characters)').max(500),
});
```

---

## Type Guards & Utilities

```typescript
// Type guards for runtime checks
export const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'role' in obj
  );
};

export const isDocumentDraft = (doc: Document): boolean => {
  return doc.status === DocumentStatus.Draft;
};

export const isSignerPending = (signer: Signer): boolean => {
  return signer.status === SignerStatus.Pending || signer.status === SignerStatus.Opened;
};

export const canEditDocument = (doc: Document, userId: string): boolean => {
  return doc.ownerId === userId && doc.status === DocumentStatus.Draft;
};

export const canInviteSigners = (doc: Document, userId: string): boolean => {
  return (
    doc.ownerId === userId &&
    doc.status === DocumentStatus.Draft &&
    doc.fields?.every(f => f.signerId !== null) // All fields assigned
  );
};

// Date formatters
export const formatTimestamp = (iso: string, locale: Language): string => {
  return new Date(iso).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US');
};

export const formatRelativeTime = (iso: string, locale: Language): string => {
  const rtf = new Intl.RelativeTimeFormat(locale === 'vi' ? 'vi' : 'en', { numeric: 'auto' });
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');
  const days = Math.floor(hours / 24);
  return rtf.format(-days, 'day');
};
```

---

## Entity Relationship Diagram (ERD)

```
┌──────────────────┐
│ User             │
│  id              │
│  email           │
│  name            │
│  role            │
└──┬───────────┬───┘
   │1          │1
   │           │
   │N          │N
┌──┴────────┐ ┌┴──────────┐
│ Signature │ │ Document  │
│  id       │ │  id       │
│  userId   │ │  title    │
│  type     │ │  status   │
│  imageData│ │  ownerId  │
└───────────┘ └┬──────┬───┘
               │1     │1
               │      │
               │N     │N
            ┌──┴───┐ ┌┴───────────┐
            │Field │ │ Signer     │
            │  id  │ │  id        │
            │  type│ │  email     │
            │signerId ─┘status    │
            └──────┘ └┬───────────┘
                      │
                      │1
                   ┌──┴───────────┐
                   │ AuditEvent   │
                   │  id          │
                   │  documentId  │
                   │  eventType   │
                   │  timestamp   │
                   └──────────────┘
```

---

## Summary

**Total Entities**: 6 core entities + supporting types

**Key Design Decisions**:
1. **Percentage-based positioning**: Fields use % coordinates để responsive across screen sizes
2. **Enum-based states**: TypeScript enums cho type safety và auto-complete
3. **Zod validation**: Runtime + compile-time type safety
4. **Denormalized audit events**: `actorEmail` stored for display performance
5. **Unique signing URLs**: Token-based security, non-guessable
6. **Sequential vs Parallel**: Single `signingOrder` attribute controls workflow
7. **Immutable audit log**: Append-only event history

**Data Flow**:
- **Create**: User → Signature → Document → Field → Signer → AuditEvent
- **Sign**: Signer receives URL → Opens → Fills Fields → Completes → AuditEvent → Document status updates
- **Track**: AuditEvents displayed in timeline (newest-first)

---

**Data Model Status**: ✅ COMPLETE

Ready for API contract generation (Phase 1 continued).

