/**
 * MSW Handlers for Documents API
 */

import { http, HttpResponse } from 'msw';
import type { Document, Field, DocumentStatus, FieldType } from '@/features/documents/types';

// API Base URL for MSW handlers
const API_BASE_URL = 'http://localhost:3000';

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Sample Contract.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: 1024000,
    pageCount: 5,
    status: 'DRAFT' as DocumentStatus,
    ownerId: 'user-1',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
];

// Mock fields data
const mockFields: Field[] = [];

let documentsStore = [...mockDocuments];
let fieldsStore = [...mockFields];

export const documentsHandlers = [
  // List documents
  http.get(`${API_BASE_URL}/api/documents`, ({ request }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    return HttpResponse.json({
      documents: documentsStore,
      total: documentsStore.length,
      page: 1,
      limit: 20,
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
];

