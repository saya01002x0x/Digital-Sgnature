/**
 * MSW Handlers for Invite-Signing API
 * Mock endpoints for signing workflow
 */

import { http, HttpResponse } from 'msw';
import type {
  SigningSession,
  SigningCompleteResponse,
  DeclineResponse,
  InviteSignersResponse,
  Signer,
} from '@/features/invite-signing/types';
import { SignerStatus } from '@/features/invite-signing/types';
import type { Document, Field } from '@/features/documents/types';
import { DocumentStatus, FieldType } from '@/features/documents/types';

const API_BASE_URL = 'http://localhost:3000/api';

// Mock data
const mockDocument: Document = {
  id: 'doc-1',
  title: 'Employment Contract.pdf',
  fileUrl: '/doc.pdf',
  fileSize: 1024000,
  status: DocumentStatus.Signing,
  pageCount: 5,
  ownerId: 'user-1',
  createdAt: '2025-11-10T10:00:00Z',
  updatedAt: '2025-11-10T10:00:00Z',
};

const mockSigners: Signer[] = [
  {
    id: 'signer-1',
    documentId: 'doc-1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    order: 1,
    status: SignerStatus.PENDING,
    signingUrl: '/signing/token-john-123',
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-10T10:00:00Z',
  },
  {
    id: 'signer-2',
    documentId: 'doc-1',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    order: 2,
    status: SignerStatus.PENDING,
    signingUrl: '/signing/token-jane-456',
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-10T10:00:00Z',
  },
];

const mockFields: Field[] = [
  {
    id: 'field-1',
    documentId: 'doc-1',
    type: FieldType.Signature,
    pageNumber: 1,
    positionX: 20,
    positionY: 30,
    width: 30,
    height: 8,
    signerId: 'signer-1',
    isRequired: true,
    value: undefined,
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-10T10:00:00Z',
  },
  {
    id: 'field-2',
    documentId: 'doc-1',
    type: FieldType.Date,
    pageNumber: 1,
    positionX: 60,
    positionY: 30,
    width: 20,
    height: 6,
    signerId: 'signer-1',
    isRequired: true,
    value: undefined,
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-10T10:00:00Z',
  },
  {
    id: 'field-3',
    documentId: 'doc-1',
    type: FieldType.Signature,
    pageNumber: 1,
    positionX: 20,
    positionY: 50,
    width: 30,
    height: 8,
    signerId: 'signer-2',
    isRequired: true,
    value: undefined,
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-10T10:00:00Z',
  },
];

// In-memory state for signing sessions
const signingState = new Map<string, { signer: Signer; fields: Field[] }>();

// Initialize mock sessions
signingState.set('token-john-123', {
  signer: mockSigners[0],
  fields: mockFields.filter((f) => f.signerId === 'signer-1'),
});
signingState.set('token-jane-456', {
  signer: mockSigners[1],
  fields: mockFields.filter((f) => f.signerId === 'signer-2'),
});

export const inviteSigningHandlers = [
  // GET /api/signing/:token - Get signing session (PUBLIC)
  http.get(`${API_BASE_URL}/signing/:token`, ({ params }) => {
    const { token } = params;
    const session = signingState.get(token as string);

    if (!session) {
      return HttpResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    // Check if already completed
    if (
      session.signer.status === SignerStatus.SIGNED ||
      session.signer.status === SignerStatus.DECLINED
    ) {
      return HttpResponse.json(
        { error: 'Already signed or declined' },
        { status: 410 }
      );
    }

    const response: SigningSession = {
      document: mockDocument,
      signer: session.signer,
      fields: session.fields,
      allSigners: mockSigners,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/signing/:token/complete - Complete signing (PUBLIC)
  http.post(`${API_BASE_URL}/signing/:token/complete`, async ({ params, request }) => {
    const { token } = params;
    const session = signingState.get(token as string);

    if (!session) {
      return HttpResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    // Check if already completed
    if (
      session.signer.status === SignerStatus.SIGNED ||
      session.signer.status === SignerStatus.DECLINED
    ) {
      return HttpResponse.json(
        { error: 'Already signed or declined' },
        { status: 410 }
      );
    }

    const body = await request.json();
    const { fieldValues } = body as any;

    // Validate all required fields are filled
    const requiredFields = session.fields.filter((f) => f.isRequired);
    const providedFieldIds = fieldValues.map((fv: any) => fv.fieldId);
    const allFilled = requiredFields.every((f) => providedFieldIds.includes(f.id));

    if (!allFilled) {
      return HttpResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Update signer status
    const updatedSigner: Signer = {
      ...session.signer,
      status: SignerStatus.SIGNED,
      signedAt: new Date().toISOString(),
    };

    // Update session
    signingState.set(token as string, {
      ...session,
      signer: updatedSigner,
    });

    // Check if all signers have signed
    const allSigners = Array.from(signingState.values()).map((s) => s.signer);
    const allSigned = allSigners.every((s) => s.status === SignerStatus.SIGNED);

    const updatedDocument: Document = {
      ...mockDocument,
      status: allSigned ? DocumentStatus.Done : DocumentStatus.Signing,
      updatedAt: new Date().toISOString(),
    };

    const response: SigningCompleteResponse = {
      signer: updatedSigner,
      document: updatedDocument,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/signing/:token/decline - Decline signing (PUBLIC)
  http.post(`${API_BASE_URL}/signing/:token/decline`, async ({ params, request }) => {
    const { token } = params;
    const session = signingState.get(token as string);

    if (!session) {
      return HttpResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    // Check if already completed
    if (
      session.signer.status === SignerStatus.SIGNED ||
      session.signer.status === SignerStatus.DECLINED
    ) {
      return HttpResponse.json(
        { error: 'Already signed or declined' },
        { status: 410 }
      );
    }

    const body = await request.json();
    const { reason } = body as any;

    // Validate reason length
    if (!reason || reason.length < 10) {
      return HttpResponse.json(
        { error: 'Reason must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Update signer status
    const updatedSigner: Signer = {
      ...session.signer,
      status: SignerStatus.DECLINED,
      declinedAt: new Date().toISOString(),
      declineReason: reason,
    };

    // Update session
    signingState.set(token as string, {
      ...session,
      signer: updatedSigner,
    });

    // Document status becomes DECLINED when someone declines
    const updatedDocument: Document = {
      ...mockDocument,
      status: DocumentStatus.Declined,
      updatedAt: new Date().toISOString(),
    };

    const response: DeclineResponse = {
      signer: updatedSigner,
      document: updatedDocument,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/documents/:documentId/invite - Invite signers (PROTECTED - for Phase 7)
  http.post(`${API_BASE_URL}/documents/:documentId/invite`, async ({ params, request }) => {
    const { documentId } = params;
    const body = await request.json();
    const { signers } = body as any;

    // Validate signers
    if (!signers || signers.length === 0) {
      return HttpResponse.json({ error: 'At least one signer required' }, { status: 400 });
    }

    // Check for duplicate emails
    const emails = signers.map((s: any) => s.email);
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      return HttpResponse.json({ error: 'Duplicate emails not allowed' }, { status: 400 });
    }

    // Create mock signers
    const newSigners: Signer[] = signers.map((s: any, index: number) => ({
      id: `signer-${Date.now()}-${index}`,
      documentId: documentId as string,
      email: s.email,
      name: s.name,
      order: s.order || index + 1,
      status: SignerStatus.PENDING,
      signingUrl: `/signing/token-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Update document status to SIGNING
    const updatedDocument: Document = {
      ...mockDocument,
      id: documentId as string,
      status: DocumentStatus.Signing,
      updatedAt: new Date().toISOString(),
    };

    const response: InviteSignersResponse = {
      document: updatedDocument,
      signers: newSigners,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/documents/:documentId/self-sign - Self sign document (PROTECTED)
  http.post(`${API_BASE_URL}/documents/:documentId/self-sign`, async ({ params, request }) => {
    const { documentId } = params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock owner email (trong thực tế sẽ lấy từ JWT token)
    const ownerEmail = 'owner@example.com';
    const ownerName = 'Document Owner';

    // Tạo signing token
    const timestamp = Date.now();
    const signingToken = `token-self-${timestamp}`;

    // Tạo signer cho owner
    const ownerSigner: Signer = {
      id: `signer-self-${timestamp}`,
      documentId: documentId as string,
      email: ownerEmail,
      name: ownerName,
      order: 1,
      status: SignerStatus.PENDING,
      signingUrl: `/signing/${signingToken}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Mock fields - trong thực tế sẽ lấy từ database
    // Tự động gán tất cả fields cho owner
    const documentFields: Field[] = mockFields.map(field => ({
      ...field,
      signerId: ownerSigner.id,
    }));

    // Initialize signing session
    signingState.set(signingToken, {
      signer: ownerSigner,
      fields: documentFields,
    });

    const response = {
      signingUrl: ownerSigner.signingUrl,
      signer: ownerSigner,
    };

    return HttpResponse.json(response);
  }),
];

