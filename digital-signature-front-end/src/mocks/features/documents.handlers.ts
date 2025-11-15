/**
 * MSW Handlers for Documents API
 */

import { http, HttpResponse } from 'msw';
import type { Document, Field, DocumentStatus, FieldType, AuditEvent, EventType } from '@/features/documents/types';

// API Base URL for MSW handlers
const API_BASE_URL = 'http://localhost:3000';

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Employment Contract 2024.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: 1024000,
    pageCount: 5,
    status: 'DRAFT' as DocumentStatus,
    ownerId: 'user-1',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'doc-2',
    title: 'NDA Agreement.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: 512000,
    pageCount: 3,
    status: 'SIGNING' as DocumentStatus,
    ownerId: 'user-1',
    createdAt: new Date('2024-01-08').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: 'doc-3',
    title: 'Service Agreement - Q1 2024.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: 2048000,
    pageCount: 8,
    status: 'DONE' as DocumentStatus,
    ownerId: 'user-1',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-09').toISOString(),
  },
  {
    id: 'doc-4',
    title: 'Partnership Agreement.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: 768000,
    pageCount: 4,
    status: 'DECLINED' as DocumentStatus,
    ownerId: 'user-1',
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-07').toISOString(),
  },
  {
    id: 'doc-5',
    title: 'Consulting Contract - John Doe.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: 1536000,
    pageCount: 6,
    status: 'SIGNING' as DocumentStatus,
    ownerId: 'user-1',
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-14').toISOString(),
  },
];

// Mock fields data
const mockFields: Field[] = [];

// Mock audit events data
const mockAuditEvents: Record<string, AuditEvent[]> = {
  'doc-1': [
    {
      id: 'event-1-1',
      documentId: 'doc-1',
      eventType: 'CREATED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-10T08:00:00Z').toISOString(),
    },
    {
      id: 'event-1-2',
      documentId: 'doc-1',
      eventType: 'FIELDS_PLACED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-10T09:30:00Z').toISOString(),
      metadata: { fieldCount: 5 },
    },
  ],
  'doc-2': [
    {
      id: 'event-2-1',
      documentId: 'doc-2',
      eventType: 'CREATED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-08T10:00:00Z').toISOString(),
    },
    {
      id: 'event-2-2',
      documentId: 'doc-2',
      eventType: 'FIELDS_PLACED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-08T11:00:00Z').toISOString(),
      metadata: { fieldCount: 3 },
    },
    {
      id: 'event-2-3',
      documentId: 'doc-2',
      eventType: 'INVITATIONS_SENT' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-09T14:00:00Z').toISOString(),
      metadata: { signerCount: 2 },
    },
    {
      id: 'event-2-4',
      documentId: 'doc-2',
      eventType: 'OPENED' as EventType,
      actorEmail: 'signer1@example.com',
      timestamp: new Date('2024-01-10T09:00:00Z').toISOString(),
      metadata: { signerName: 'John Doe' },
    },
  ],
  'doc-3': [
    {
      id: 'event-3-1',
      documentId: 'doc-3',
      eventType: 'CREATED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-05T08:00:00Z').toISOString(),
    },
    {
      id: 'event-3-2',
      documentId: 'doc-3',
      eventType: 'FIELDS_PLACED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-05T09:00:00Z').toISOString(),
      metadata: { fieldCount: 8 },
    },
    {
      id: 'event-3-3',
      documentId: 'doc-3',
      eventType: 'INVITATIONS_SENT' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-06T10:00:00Z').toISOString(),
      metadata: { signerCount: 3 },
    },
    {
      id: 'event-3-4',
      documentId: 'doc-3',
      eventType: 'OPENED' as EventType,
      actorEmail: 'signer1@example.com',
      timestamp: new Date('2024-01-07T11:00:00Z').toISOString(),
      metadata: { signerName: 'Alice Smith' },
    },
    {
      id: 'event-3-5',
      documentId: 'doc-3',
      eventType: 'SIGNED' as EventType,
      actorEmail: 'signer1@example.com',
      timestamp: new Date('2024-01-07T14:00:00Z').toISOString(),
      metadata: { signerName: 'Alice Smith' },
    },
    {
      id: 'event-3-6',
      documentId: 'doc-3',
      eventType: 'OPENED' as EventType,
      actorEmail: 'signer2@example.com',
      timestamp: new Date('2024-01-08T09:00:00Z').toISOString(),
      metadata: { signerName: 'Bob Johnson' },
    },
    {
      id: 'event-3-7',
      documentId: 'doc-3',
      eventType: 'SIGNED' as EventType,
      actorEmail: 'signer2@example.com',
      timestamp: new Date('2024-01-08T15:00:00Z').toISOString(),
      metadata: { signerName: 'Bob Johnson' },
    },
    {
      id: 'event-3-8',
      documentId: 'doc-3',
      eventType: 'COMPLETED' as EventType,
      timestamp: new Date('2024-01-09T10:00:00Z').toISOString(),
    },
  ],
  'doc-4': [
    {
      id: 'event-4-1',
      documentId: 'doc-4',
      eventType: 'CREATED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-03T08:00:00Z').toISOString(),
    },
    {
      id: 'event-4-2',
      documentId: 'doc-4',
      eventType: 'FIELDS_PLACED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-03T10:00:00Z').toISOString(),
      metadata: { fieldCount: 4 },
    },
    {
      id: 'event-4-3',
      documentId: 'doc-4',
      eventType: 'INVITATIONS_SENT' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-04T09:00:00Z').toISOString(),
      metadata: { signerCount: 1 },
    },
    {
      id: 'event-4-4',
      documentId: 'doc-4',
      eventType: 'OPENED' as EventType,
      actorEmail: 'signer1@example.com',
      timestamp: new Date('2024-01-05T10:00:00Z').toISOString(),
      metadata: { signerName: 'Charlie Brown' },
    },
    {
      id: 'event-4-5',
      documentId: 'doc-4',
      eventType: 'DECLINED' as EventType,
      actorEmail: 'signer1@example.com',
      timestamp: new Date('2024-01-05T14:00:00Z').toISOString(),
      metadata: {
        signerName: 'Charlie Brown',
        reason: 'Need more time to review the terms',
      },
    },
  ],
  'doc-5': [
    {
      id: 'event-5-1',
      documentId: 'doc-5',
      eventType: 'CREATED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-12T08:00:00Z').toISOString(),
    },
    {
      id: 'event-5-2',
      documentId: 'doc-5',
      eventType: 'FIELDS_PLACED' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-12T10:00:00Z').toISOString(),
      metadata: { fieldCount: 6 },
    },
    {
      id: 'event-5-3',
      documentId: 'doc-5',
      eventType: 'INVITATIONS_SENT' as EventType,
      actorId: 'user-1',
      actorEmail: 'owner@example.com',
      timestamp: new Date('2024-01-13T09:00:00Z').toISOString(),
      metadata: { signerCount: 2 },
    },
  ],
};

let documentsStore = [...mockDocuments];
let fieldsStore = [...mockFields];
let auditEventsStore = { ...mockAuditEvents };

export const documentsHandlers = [
  // List documents with filtering, search, sort, pagination
  http.get(`${API_BASE_URL}/api/documents`, ({ request }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    // Parse query params
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as DocumentStatus | null;
    const search = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    // Filter documents
    let filteredDocs = [...documentsStore];

    // Filter by status
    if (status) {
      filteredDocs = filteredDocs.filter(doc => doc.status === status);
    }

    // Search by title
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.title.toLowerCase().includes(searchLower)
      );
    }

    // Sort documents
    filteredDocs.sort((a, b) => {
      const aValue = sortBy === 'createdAt' ? a.createdAt : a.updatedAt;
      const bValue = sortBy === 'createdAt' ? b.createdAt : b.updatedAt;
      
      const comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const total = filteredDocs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

    return HttpResponse.json({
      documents: paginatedDocs,
      total,
      page,
      limit,
    });
  }),

  // Upload document
  http.post(`${API_BASE_URL}/api/documents/upload`, async ({ request }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    // Mock document upload
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') || 'Uploaded Document.pdf';

    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: title as string,
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSize: 1024000,
      pageCount: 3,
      status: 'DRAFT' as DocumentStatus,
      ownerId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    documentsStore.push(newDocument);

    return HttpResponse.json(
      { document: newDocument },
      { status: 201 }
    );
  }),

  // Get document
  http.get(`${API_BASE_URL}/api/documents/:id`, ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const document = documentsStore.find(d => d.id === id);

    if (!document) {
      return new HttpResponse(
        JSON.stringify({ message: 'Document not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const documentFields = fieldsStore.filter(f => f.documentId === id);

    return HttpResponse.json({
      document,
      fields: documentFields,
      signers: [],
    });
  }),

  // Update document
  http.patch(`${API_BASE_URL}/api/documents/:id`, async ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const body = await request.json() as { title?: string };

    const documentIndex = documentsStore.findIndex(d => d.id === id);

    if (documentIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Document not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    documentsStore[documentIndex] = {
      ...documentsStore[documentIndex],
      title: body.title || documentsStore[documentIndex].title,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      document: documentsStore[documentIndex],
    });
  }),

  // Delete document
  http.delete(`${API_BASE_URL}/api/documents/:id`, ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const documentIndex = documentsStore.findIndex(d => d.id === id);

    if (documentIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Document not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    documentsStore.splice(documentIndex, 1);
    fieldsStore = fieldsStore.filter(f => f.documentId !== id);

    return new HttpResponse(null, { status: 204 });
  }),

  // Create field
  http.post(`${API_BASE_URL}/api/documents/:documentId/fields`, async ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { documentId } = params;
    const body = await request.json() as {
      type: FieldType;
      pageNumber: number;
      positionX: number;
      positionY: number;
      width: number;
      height: number;
      signerId?: string;
      isRequired?: boolean;
    };

    const newField: Field = {
      id: `field-${Date.now()}`,
      documentId: documentId as string,
      type: body.type,
      pageNumber: body.pageNumber,
      positionX: body.positionX,
      positionY: body.positionY,
      width: body.width,
      height: body.height,
      signerId: body.signerId,
      isRequired: body.isRequired ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fieldsStore.push(newField);

    return HttpResponse.json(
      { field: newField },
      { status: 201 }
    );
  }),

  // Update field
  http.patch(`${API_BASE_URL}/api/documents/fields/:id`, async ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const body = await request.json() as {
      positionX?: number;
      positionY?: number;
      width?: number;
      height?: number;
      signerId?: string;
    };

    const fieldIndex = fieldsStore.findIndex(f => f.id === id);

    if (fieldIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Field not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    fieldsStore[fieldIndex] = {
      ...fieldsStore[fieldIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      field: fieldsStore[fieldIndex],
    });
  }),

  // Delete field
  http.delete(`${API_BASE_URL}/api/documents/fields/:id`, ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const fieldIndex = fieldsStore.findIndex(f => f.id === id);

    if (fieldIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Field not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    fieldsStore.splice(fieldIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),

  // Get document timeline (audit trail)
  http.get(`${API_BASE_URL}/api/documents/:documentId/timeline`, ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { documentId } = params;
    
    // Check if document exists
    const document = documentsStore.find(d => d.id === documentId);
    if (!document) {
      return new HttpResponse(
        JSON.stringify({ message: 'Document not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get audit events for this document (sorted newest-first)
    const events = auditEventsStore[documentId as string] || [];
    const sortedEvents = [...events].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return HttpResponse.json({
      events: sortedEvents,
    });
  }),
];

