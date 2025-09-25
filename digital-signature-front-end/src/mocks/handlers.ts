import { http, HttpResponse } from 'msw';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
};

// Mock handlers for MSW
export const handlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    // Mock successful login with test@example.com and any password
    if (body.email === 'test@example.com') {
      return HttpResponse.json({
        user: mockUser,
        token: 'fake-jwt-token',
      });
    }
    
    // Return error for other credentials
    return new HttpResponse(
      JSON.stringify({
        message: 'Invalid credentials',
        errors: {
          email: ['Thông tin đăng nhập không chính xác'],
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
  http.post('/api/auth/register', async ({ request }) => {
    const userData = await request.json() as { email: string };
    
    return HttpResponse.json({
      user: {
        ...mockUser,
        email: userData.email,
      },
      token: 'fake-jwt-token',
    });
  }),
  
  // Profile endpoint
  http.get('/api/auth/profile', () => {
    return HttpResponse.json(mockUser);
  }),
];