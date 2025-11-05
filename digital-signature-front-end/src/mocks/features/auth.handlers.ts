/**
 * MSW Handlers for Auth API
 */

import { http, HttpResponse } from 'msw';

// API Base URL for MSW handlers
const API_BASE_URL = 'http://localhost:3000';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
  avatar: undefined,
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockAdmin = {
  id: '2',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'ADMIN',
  avatar: undefined,
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const authHandlers = [
  // Login endpoint
  http.post(`${API_BASE_URL}/api/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    // Mock successful login for test user
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: mockUser,
        token: 'fake-jwt-token-user',
      });
    }
    
    // Mock successful login for admin
    if (body.email === 'admin@example.com' && body.password === 'admin123') {
      return HttpResponse.json({
        user: mockAdmin,
        token: 'fake-jwt-token-admin',
      });
    }
    
    // Return error for invalid credentials
    return new HttpResponse(
      JSON.stringify({
        message: 'Invalid credentials',
        errors: {
          email: ['Email hoặc mật khẩu không chính xác'],
        },
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),
  
  // Register endpoint
  http.post(`${API_BASE_URL}/api/auth/register`, async ({ request }) => {
    const body = await request.json() as { email: string; name: string; password: string };
    
    // Check if email already exists
    if (body.email === 'test@example.com' || body.email === 'admin@example.com') {
      return new HttpResponse(
        JSON.stringify({
          message: 'Email already exists',
          errors: {
            email: ['Email này đã được sử dụng'],
          },
        }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // Successful registration
    return HttpResponse.json({
      user: {
        ...mockUser,
        id: Math.random().toString(36).substring(7),
        email: body.email,
        name: body.name,
      },
      token: 'fake-jwt-token-new-user',
    }, { status: 201 });
  }),
  
  // Get profile endpoint
  http.get(`${API_BASE_URL}/api/auth/profile`, ({ request }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }
    
    // Return user based on token
    if (authHeader.includes('admin')) {
      return HttpResponse.json(mockAdmin);
    }
    
    return HttpResponse.json(mockUser);
  }),
  
  // Update profile endpoint
  http.put(`${API_BASE_URL}/api/auth/profile`, async ({ request }) => {
    const body = await request.json() as { name?: string; avatar?: string };
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }
    
    const user = authHeader.includes('admin') ? mockAdmin : mockUser;
    
    return HttpResponse.json({
      ...user,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  }),
  
  // Forgot password endpoint
  http.post(`${API_BASE_URL}/api/auth/forgot-password`, async () => {
    // Simulate sending reset email
    return HttpResponse.json({
      message: 'Password reset email sent',
    });
  }),
  
  // Reset password endpoint
  http.post(`${API_BASE_URL}/api/auth/reset-password`, async ({ request }) => {
    const body = await request.json() as { token: string; newPassword: string };
    
    // Validate token (mock)
    if (!body.token || body.token === 'invalid-token') {
      return new HttpResponse(
        JSON.stringify({
          message: 'Invalid or expired token',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    return HttpResponse.json({
      message: 'Password reset successful',
    });
  }),
  
  // Logout endpoint
  http.post(`${API_BASE_URL}/api/auth/logout`, () => {
    return HttpResponse.json({
      message: 'Logged out successfully',
    });
  }),
];

