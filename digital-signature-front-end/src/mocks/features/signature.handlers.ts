/**
 * MSW Handlers for Signature API
 */

import { http, HttpResponse } from 'msw';
import type { Signature, SignatureType } from '@/features/signature/types';

// API Base URL for MSW handlers
const API_BASE_URL = 'http://localhost:3000';

// Mock signature data with realistic handwriting-style signatures
const mockSignatures: Signature[] = [
  {
    id: 'sig-1',
    userId: 'user-1',
    type: 'DRAW' as SignatureType,
    imageData: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">
        <path d="M 10 50 Q 20 30, 40 45 T 70 40 Q 80 35, 95 50 T 120 45" 
          stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 100 45 Q 110 30, 130 50 Q 140 60, 155 45 T 185 50" 
          stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 160 50 Q 170 55, 180 45 Q 190 35, 200 50 L 215 50" 
          stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 195 40 Q 205 45, 215 40 Q 225 35, 235 45 T 260 40" 
          stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 240 50 L 250 35 L 260 50 M 265 45 Q 270 40, 280 45" 
          stroke="#1a1a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      </svg>
    `),
    isDefault: true,
    name: 'My Default Signature',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'sig-2',
    userId: 'user-1',
    type: 'TYPE' as SignatureType,
    imageData: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80">
        <path d="M 15 40 Q 25 20, 45 35 Q 55 45, 70 30 T 100 35" 
          stroke="#2c2c2c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 85 30 Q 95 25, 105 35 Q 115 45, 130 30 Q 140 20, 155 35" 
          stroke="#2c2c2c" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 140 35 L 150 25 Q 160 30, 170 25 T 190 30" 
          stroke="#2c2c2c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 175 35 Q 185 40, 195 30 Q 205 20, 220 35 L 235 35" 
          stroke="#2c2c2c" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="245" cy="35" r="2" fill="#2c2c2c"/>
        <path d="M 250 35 Q 255 30, 265 35" 
          stroke="#2c2c2c" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `),
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

