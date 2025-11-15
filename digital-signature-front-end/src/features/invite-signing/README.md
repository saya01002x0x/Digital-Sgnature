# Invite-Signing Module

## Overview

Module **invite-signing** quản lý quy trình mời người ký và phòng ký tài liệu (Signing Room). Module này bao gồm:

- **Signing Room (Public)**: Người ký nhận link công khai, mở tài liệu, điền/ký các trường được assign, và hoàn tất hoặc từ chối ký.
- **Invite Workflow (Protected - Phase 7)**: Chủ tài liệu mời nhiều người ký, assign fields, chọn thứ tự ký (sequential/parallel).

## Architecture

```
invite-signing/
├── pages/
│   └── SigningRoomPage.tsx          # Public signing room page
├── components/
│   ├── SigningView.tsx              # PDF viewer + fillable fields
│   ├── DeclineDialog.tsx            # Modal to decline signing
│   └── CompleteDialog.tsx           # Confirmation modal
├── hooks/
│   └── useSigning.ts                # Signing workflow logic
├── services/
│   └── invite-signing.api.ts        # RTK Query API
├── types/
│   └── index.ts                     # TypeScript types
└── utils/                           # (Reserved for future utilities)
```

## Key Features

### Phase 6 (Implemented)

#### 1. **Signing Room (Public Access)**
- **Route**: `/signing/:token` (public, no authentication required)
- **Features**:
  - Load signing session by token
  - Display document with assigned fields
  - Fill signature, text, date fields
  - Complete signing or decline with reason
  - Real-time validation

#### 2. **Components**
- **SigningView**: Three-panel layout
  - Left: Document info & signers list
  - Middle: PDF viewer
  - Right: Fields to fill
- **DeclineDialog**: Modal with reason input (min 10 chars)
- **CompleteDialog**: Confirmation modal before submitting

#### 3. **API Endpoints (Public)**
- `GET /api/signing/:token` - Get signing session
- `POST /api/signing/:token/complete` - Complete signing
- `POST /api/signing/:token/decline` - Decline signing

### Phase 7 (To Be Implemented)
- Invite workflow UI (add signers, assign fields, send invitations)
- `POST /api/documents/:documentId/invite` endpoint integration

## Types

### Core Types
```typescript
enum SignerStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  DECLINED = 'DECLINED',
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
```

## API Service

### RTK Query Integration
Module sử dụng `baseApi.injectEndpoints()` để tích hợp với central API configuration.

**Hooks**:
- `useGetSigningSessionQuery(token)` - Fetch session
- `useCompleteSigningMutation()` - Submit signed fields
- `useDeclineSigningMutation()` - Decline with reason
- `useInviteSignersMutation()` - (Phase 7) Invite signers

## Usage Example

### Signing Room Page
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

### Field Value Handling
```typescript
// Update field value
handleFieldChange('field-id-1', 'signature-data-url');

// Check if all fields filled
if (allFieldsFilled) {
  await handleCompleteSigning();
}
```

## i18n Support

**Namespaces**: `invite-signing`

**Languages**: English (`en`), Vietnamese (`vi`)

**Keys**:
- `signingRoom.*` - Signing room UI
- `signingView.*` - PDF viewer & fields
- `declineDialog.*` - Decline modal
- `completeDialog.*` - Complete modal
- `useSigning.*` - Hook messages

## MSW Mocks

**Mock Data**:
- 1 sample document: `Employment Contract.pdf` (SIGNING status)
- 2 mock signers: John Doe, Jane Smith
- 3 mock fields: 2 signature fields, 1 date field
- In-memory state for session management

**Mock Tokens**:
- `token-john-123` → Signer 1 (John Doe)
- `token-jane-456` → Signer 2 (Jane Smith)

**Test Flow**:
1. Navigate to `/signing/token-john-123`
2. Fill assigned fields (signature + date)
3. Click "Complete Signing"
4. Verify success message and status update

## Error Handling

### HTTP Status Codes
- `404` - Invalid or expired token
- `410` - Already signed or declined
- `400` - Validation error (missing fields, reason too short)

### User-Friendly Messages
All errors display user-friendly messages via `message.error()` with i18n support.

## Testing

**Status**: Tests skipped per user request (Phase 6)

**Planned Tests** (if needed):
- Unit: SigningView, DeclineDialog, CompleteDialog
- Integration: Full signing flow with MSW

## Dependencies

### Internal
- `@/features/documents` - Document & Field types, PDFViewer
- `@/features/signature` - SignatureSelector component
- `@/app/api/baseApi` - API integration
- `@/shared/types` - Common types

### External
- Ant Design - UI components (Modal, Form, Input, Alert, etc.)
- React Router - Routing & URL params
- react-i18next - Internationalization
- dayjs - Date handling

## Future Enhancements (Phase 7)

1. **Invite Workflow**:
   - Add signers form
   - Field assignment UI
   - Sequential vs Parallel selector
   - Send invitations

2. **Advanced Features**:
   - Email notifications
   - Reminder system
   - Signing order enforcement (sequential)
   - Signature templates

## Security Considerations

- **Public endpoints**: Signing room endpoints are public (token-based access)
- **Token validation**: Backend validates token expiry and ownership
- **No authentication required**: Signers don't need accounts
- **Input sanitization**: All user inputs (reason, field values) must be sanitized
- **CORS**: Ensure backend allows public access to signing endpoints

## Notes

- Signing room is **fully public** - no authentication required
- Token serves as access control mechanism
- Each signer gets unique token in `signingUrl`
- Document status changes to `DONE` when all signers complete
- Document status changes to `DECLINED` when any signer declines
- MSW handlers simulate backend logic for development

---

**Status**: ✅ Phase 6 Complete (Signing Room)  
**Next**: Phase 7 - Invite Workflow UI

