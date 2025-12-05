# Invite-Signing Module

## Overview

Module **invite-signing** quản lý quy trình mời người ký và phòng ký tài liệu (Signing Room). Module này bao gồm cả Phase 6 (Signing Room) và Phase 7 (Invite Workflow).

## Architecture

```
invite-signing/
├── pages/
│   ├── SigningRoomPage.tsx           # Public signing room page (Phase 6)
│   └── InviteSignersPage.tsx         # Protected invite page (Phase 7)
├── components/
│   ├── SigningView.tsx               # PDF viewer + fillable fields (Phase 6)
│   ├── DeclineDialog.tsx             # Modal to decline signing (Phase 6)
│   ├── CompleteDialog.tsx            # Confirmation modal (Phase 6)
│   ├── InviteForm.tsx                # Add signers form (Phase 7)
│   ├── SignerList.tsx                # Display signers list (Phase 7)
│   ├── OrderSelector.tsx             # Sequential/Parallel selector (Phase 7)
│   └── FieldAssignment.tsx           # Assign fields to signers (Phase 7)
├── hooks/
│   ├── useSigning.ts                 # Signing workflow logic (Phase 6)
│   └── useInvite.ts                  # Invite workflow logic (Phase 7)
├── services/
│   └── invite-signing.api.ts         # RTK Query API
├── types/
│   └── index.ts                      # TypeScript types
└── utils/                            # (Reserved for future utilities)
```

## Key Features

### Phase 6: Signing Room (Public Access) ✅

#### 1. **Signing Room**
- **Route**: `/signing/:token` (public, no authentication required)
- **Features**:
  - Load signing session by token
  - Display document with assigned fields
  - Fill signature, text, date fields
  - Complete signing or decline with reason
  - Real-time validation

#### 2. **Components**
- **SigningView**: Three-panel layout (document info, PDF viewer, fields)
- **DeclineDialog**: Modal with reason input (min 10 chars)
- **CompleteDialog**: Confirmation modal before submitting

#### 3. **API Endpoints (Public)**
- `GET /api/signing/:token` - Get signing session
- `POST /api/signing/:token/complete` - Complete signing
- `POST /api/signing/:token/decline` - Decline signing

### Phase 7: Invite Workflow (Protected) ✅

#### 1. **Invite Signers**
- **Route**: `/documents/:id/invite` (protected, authentication required)
- **Features**:
  - Add multiple signers (name + email)
  - Validate unique emails
  - Choose signing order (Sequential/Parallel)
  - Assign fields to each signer
  - Color-coded field assignment
  - Two-step wizard (Add Signers → Assign Fields)

#### 2. **Components**
- **InviteForm**: Form with dynamic signer inputs
  - Add/remove signers
  - Duplicate email validation
  - Signing order selector
  
- **SignerList**: Display signers with status
  - Order indicator
  - Status badges (Pending/Signed/Declined)
  - Timestamps
  
- **OrderSelector**: Radio selector
  - Sequential: Signers sign in order
  - Parallel: All sign simultaneously
  
- **FieldAssignment**: Assign fields
  - Color-coded signers (8 colors)
  - Field type indicators
  - Required field badges
  - Real-time assignment tracking

#### 3. **API Endpoint (Protected)**
- `POST /api/documents/:documentId/invite` - Invite signers

## Types

### Core Types
```typescript
enum SignerStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  DECLINED = 'DECLINED',
}

enum SigningOrder {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
}

interface Signer {
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
}

interface SigningSession {
  document: Document;
  signer: Signer;
  fields: Field[];        // Only assigned to this signer
  allSigners: Signer[];   // All signers (for display)
}

interface InviteFormValues {
  signers: {
    email: string;
    name: string;
    order: number;
  }[];
  signingOrder: SigningOrder;
}
```

## API Service

### RTK Query Integration
Module sử dụng `baseApi.injectEndpoints()` để tích hợp với central API configuration.

**Hooks**:
- `useGetSigningSessionQuery(token)` - Fetch session (Phase 6)
- `useCompleteSigningMutation()` - Submit signed fields (Phase 6)
- `useDeclineSigningMutation()` - Decline with reason (Phase 6)
- `useInviteSignersMutation()` - Invite signers (Phase 7)

## Usage Examples

### Phase 6: Signing Room
```typescript
import { useParams } from 'react-router-dom';
import { useSigning } from '@/features/invite-signing/hooks/useSigning';

const { token } = useParams<{ token: string }>();
const {
  session,
  fieldValues,
  handleFieldChange,
  allFieldsFilled,
  handleCompleteSigning,
  handleDeclineSigning,
} = useSigning(token || '');

// Render SigningView with session data
```

### Phase 7: Invite Workflow
```typescript
import { useInvite } from '@/features/invite-signing/hooks/useInvite';

const {
  assignedFields,
  handleAssignField,
  isReadyToSend,
  handleSendInvitations,
  isSending,
} = useInvite(documentId, fields);

// Step 1: Add signers with InviteForm
const handleFormSubmit = (values: InviteFormValues) => {
  // Values contain signers + signing order
};

// Step 2: Assign fields with FieldAssignment
handleAssignField(fieldId, signerEmail);

// Step 3: Send invitations
if (isReadyToSend) {
  await handleSendInvitations(formValues);
}
```

## i18n Support

**Namespaces**: `invite-signing`

**Languages**: English (`en`), Vietnamese (`vi`)

**Key Categories**:
- `signingRoom.*` - Signing room UI (Phase 6)
- `signingView.*` - PDF viewer & fields (Phase 6)
- `declineDialog.*` - Decline modal (Phase 6)
- `completeDialog.*` - Complete modal (Phase 6)
- `useSigning.*` - Phase 6 hook messages
- `inviteForm.*` - Invite form (Phase 7)
- `signerList.*` - Signer list (Phase 7)
- `orderSelector.*` - Order selector (Phase 7)
- `fieldAssignment.*` - Field assignment (Phase 7)
- `invitePage.*` - Invite page (Phase 7)
- `useInvite.*` - Phase 7 hook messages

## MSW Mocks

**Mock Data**:
- 1 sample document: `Employment Contract.pdf` (SIGNING status)
- 2 mock signers: John Doe, Jane Smith
- 3 mock fields: 2 signature fields, 1 date field
- In-memory state for session management

**Mock Tokens** (Phase 6):
- `token-john-123` → Signer 1 (John Doe)
- `token-jane-456` → Signer 2 (Jane Smith)

**Mock Endpoints**:
- Phase 6: Signing session, complete, decline
- Phase 7: Invite signers (validates emails, creates signers)

## Testing Flows

### Phase 6: Signing Flow
```bash
# 1. Navigate to signing room
http://localhost:5173/signing/token-john-123

# 2. Fill assigned fields
# 3. Click "Complete Signing" or "Decline"
```

### Phase 7: Invite Flow
```bash
# 1. Navigate from document editor
http://localhost:5173/documents/doc-1/invite

# 2. Add signers (name + email)
# 3. Choose signing order (Sequential/Parallel)
# 4. Assign fields to each signer
# 5. Send invitations
```

## Error Handling

### HTTP Status Codes
- `400` - Validation error (duplicate emails, unassigned fields, missing data)
- `404` - Document/token not found
- `410` - Already signed or declined (Phase 6)
- `401` - Not authenticated (Phase 7 only)

### Validation Rules
- **Unique emails**: Each signer must have unique email per document
- **All fields assigned**: Cannot send invitations with unassigned fields
- **Signer info**: Name (2-100 chars) + valid email required
- **Decline reason**: Min 10 chars, max 500 chars (Phase 6)

## Workflows

### Complete Signing Workflow

```
Owner Creates Document
  ↓
Adds Fields (Phase 5)
  ↓
Invites Signers (Phase 7)
  ├─ Add signers
  ├─ Choose order (Sequential/Parallel)
  └─ Assign fields
  ↓
System generates signing links
  ↓
Signers receive emails with links
  ↓
Signers open Signing Room (Phase 6)
  ├─ View document
  ├─ Fill assigned fields
  └─ Complete or Decline
  ↓
System updates document status
  ├─ All signed → DONE
  └─ Any declined → DECLINED
```

### Sequential vs Parallel Signing

**Sequential**:
```
Signer 1 receives link → Signs → Signer 2 receives link → Signs → Done
```

**Parallel**:
```
All signers receive link simultaneously → All sign independently → Done
```

## Security Considerations

- **Public endpoints** (Phase 6): Token-based access only
- **Protected endpoints** (Phase 7): Authentication required
- **Token validation**: Backend validates token expiry
- **Input sanitization**: All user inputs sanitized
- **Email validation**: Unique emails enforced
- **Field assignment**: Signers only see their assigned fields

## Dependencies

### Internal
- `@/features/documents` - Document & Field types, PDFViewer
- `@/features/signature` - SignatureSelector component
- `@/app/api/baseApi` - API integration
- `@/shared/types` - Common types

### External
- Ant Design - UI components (Form, Modal, Steps, Select, etc.)
- React Router - Routing & URL params
- react-i18next - Internationalization
- dayjs - Date handling

## Future Enhancements

1. **Email Notifications**: Actual email sending with templates
2. **Reminder System**: Auto-reminders for pending signers
3. **Sequential Enforcement**: Lock signing order for sequential mode
4. **Signer Templates**: Save frequently used signer groups
5. **Bulk Invite**: Import signers from CSV
6. **Custom Messages**: Add personal message to invitations
7. **Access Expiry**: Set expiration time for signing links

## Notes

- **Phase 6** (Signing Room): Fully public, no auth required
- **Phase 7** (Invite Workflow): Protected, requires authentication
- API endpoint and MSW handler for invitations already exist from Phase 6
- SignerList component created in Phase 7 can be used in both phases
- Color palette supports up to 8 signers with unique colors
- Tests skipped per user request (can be added later if needed)

---

**Status**: ✅ Phase 6 & 7 Complete  
**Routes**: 
- `/signing/:token` (public)
- `/documents/:id/invite` (protected)

**Next**: Phase 8 - Document List & Search
