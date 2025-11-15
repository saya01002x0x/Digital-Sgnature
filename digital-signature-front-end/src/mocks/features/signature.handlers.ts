/**
 * MSW Handlers for Signature API
 */

import { http, HttpResponse } from 'msw';
import type { Signature, SignatureType } from '@/features/signature/types';

// API Base URL for MSW handlers
const API_BASE_URL = 'http://localhost:3000';

// Mock signature data
const mockSignatures: Signature[] = [
  {
    id: 'sig-1',
    userId: 'user-1',
    type: 'DRAW' as SignatureType,
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    isDefault: true,
    name: 'My Default Signature',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'sig-2',
    userId: 'user-1',
    type: 'TYPE' as SignatureType,
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    isDefault: false,
    name: 'Formal',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
];

let signaturesStore = [...mockSignatures];

export const signatureHandlers = [
  // List signatures
  http.get(`${API_BASE_URL}/api/signatures`, ({ request }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    return HttpResponse.json({
      signatures: signaturesStore,
    });
  }),

  // Get signature by ID
  http.get(`${API_BASE_URL}/api/signatures/:id`, ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const signature = signaturesStore.find(s => s.id === id);

    if (!signature) {
      return new HttpResponse(
        JSON.stringify({ message: 'Signature not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(signature);
  }),

  // Create signature
  http.post(`${API_BASE_URL}/api/signatures`, async ({ request }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const body = await request.json() as { type: SignatureType; imageData: string; name?: string };

    const newSignature: Signature = {
      id: `sig-${Date.now()}`,
      userId: 'user-1',
      type: body.type,
      imageData: body.imageData,
      isDefault: signaturesStore.length === 0, // First signature is default
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    signaturesStore.push(newSignature);

    return HttpResponse.json(
      { signature: newSignature },
      { status: 201 }
    );
  }),

  // Update signature
  http.patch(`${API_BASE_URL}/api/signatures/:id`, async ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const body = await request.json() as { name?: string };

    const signatureIndex = signaturesStore.findIndex(s => s.id === id);

    if (signatureIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Signature not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    signaturesStore[signatureIndex] = {
      ...signaturesStore[signatureIndex],
      name: body.name,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      signature: signaturesStore[signatureIndex],
    });
  }),

  // Delete signature
  http.delete(`${API_BASE_URL}/api/signatures/:id`, ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const signatureIndex = signaturesStore.findIndex(s => s.id === id);

    if (signatureIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Signature not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    signaturesStore.splice(signatureIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),

  // Set default signature
  http.post(`${API_BASE_URL}/api/signatures/:id/set-default`, ({ request, params }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const signatureIndex = signaturesStore.findIndex(s => s.id === id);

    if (signatureIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Signature not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Unset previous default
    signaturesStore.forEach(s => {
      s.isDefault = false;
    });

    // Set new default
    signaturesStore[signatureIndex].isDefault = true;
    signaturesStore[signatureIndex].updatedAt = new Date().toISOString();

    return HttpResponse.json({
      signature: signaturesStore[signatureIndex],
    });
  }),
];

