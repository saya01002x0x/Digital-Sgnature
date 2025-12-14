/**
 * MSW Handlers for Admin API
 */

import { http, HttpResponse } from 'msw';

// Using relative URLs so MSW can intercept requests regardless of the base URL

// Mock admin user
const mockAdminUser = {
  id: 'admin-1',
  username: 'miiao29',
  email: 'miiao29@gmail.com',
  fullName: 'Nguyễn Chiêu Văn',
  phone: '+84901234567',
  address: 'Hà Nội, Việt Nam',
  role: 'ADMIN',
  isActive: true,
  avatar: null,
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock users data
const generateMockUsers = () => {
  const roles = ['ADMIN', 'USER'] as const;
  return Array.from({ length: 25 }, (_, i) => ({
    id: `user-${i + 1}`,
    username: i === 0 ? 'miiao29' : `user${i + 1}`,
    email: i === 0 ? 'miiao29@gmail.com' : `user${i + 1}@example.com`,
    fullName: i === 0 ? 'Nguyễn Chiêu Văn' : `Người dùng ${i + 1}`,
    phone: i < 5 ? `+8490${String(i).padStart(7, '0')}` : undefined,
    address: i < 3 ? `Địa chỉ ${i + 1}, Hà Nội` : undefined,
    role: i === 0 ? 'ADMIN' : roles[i % 2],
    isActive: i < 20,
    avatar: i % 3 === 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}` : null,
    createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));
};

let mockUsers = generateMockUsers();

// Mock audit logs data
const generateMockAuditLogs = () => {
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'DOWNLOAD', 'SIGN'];
  const targetTypes = ['USER', 'DOCUMENT', 'SIGNATURE', 'FIELD'];
  const statuses = [true, true, true, false]; // Mostly success

  return Array.from({ length: 50 }, (_, i) => {
    const success = statuses[i % statuses.length];
    return {
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      action: actions[i % actions.length],
      target: `target-${i + 1}`,
      targetType: targetTypes[i % targetTypes.length],
      performedBy: i % 10 === 0 ? 'admin-1' : `user-${(i % 10) + 1}`,
      performedByName: i % 10 === 0 ? 'Nguyễn Chiêu Văn' : `Người dùng ${(i % 10) + 1}`,
      description: `${actions[i % actions.length]} ${targetTypes[i % targetTypes.length].toLowerCase()} target-${i + 1}`,
      ipAddress: `192.168.1.${(i % 255) + 1}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      success,
      errorMessage: success ? undefined : 'Operation failed due to validation error',
    };
  });
};

const mockAuditLogs = generateMockAuditLogs();

export const adminHandlers = [
  // Get Metrics
  http.get('/api/admin/metrics', () => {
    const totalUsers = mockUsers.length;
    const activeUsers = mockUsers.filter(u => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    return HttpResponse.json({
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalDocuments: 156,
        pendingDocuments: 23,
        completedDocuments: 98,
        totalSignatures: 342,
        recentActivityCount: 45,
      },
    });
  }),

  // List Users (with pagination and filters)
  http.get('/api/admin/users', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);
    const search = url.searchParams.get('search')?.toLowerCase();
    const role = url.searchParams.get('role');
    const isActiveParam = url.searchParams.get('isActive');

    // Filter users
    let filteredUsers = [...mockUsers];

    if (search) {
      filteredUsers = filteredUsers.filter(
        u =>
          u.fullName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.username.toLowerCase().includes(search)
      );
    }

    if (role && role !== 'ALL') {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }

    if (isActiveParam && isActiveParam !== 'ALL') {
      const isActive = isActiveParam === 'true';
      filteredUsers = filteredUsers.filter(u => u.isActive === isActive);
    }

    // Paginate
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / size);
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: {
        data: paginatedUsers,
        meta: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: size,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      message: 'Success',
    });
  }),

  // Get User by ID
  http.get('/api/admin/users/:userId', ({ params }) => {
    const userId = params.userId as string;
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: user,
    });
  }),

  // Update User Status
  http.patch('/api/admin/users/:userId/status', async ({ params, request }) => {
    const userId = params.userId as string;
    const body = await request.json() as { isActive: boolean };

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      isActive: body.isActive,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockUsers[userIndex],
      message: `User ${body.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  }),

  // Update User
  http.patch('/api/admin/users/:userId', async ({ params, request }) => {
    const userId = params.userId as string;
    const body = await request.json() as { fullName?: string; phone?: string; address?: string };

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockUsers[userIndex],
      message: 'User updated successfully',
    });
  }),

  // List Audit Logs (with pagination and filters)
  http.get('/api/admin/logs', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const size = parseInt(url.searchParams.get('size') || '20', 10);
    const search = url.searchParams.get('search')?.toLowerCase();
    const action = url.searchParams.get('action');
    const targetType = url.searchParams.get('targetType');
    const performedBy = url.searchParams.get('performedBy');
    const successParam = url.searchParams.get('success');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Filter logs
    let filteredLogs = [...mockAuditLogs];

    if (search) {
      filteredLogs = filteredLogs.filter(
        log =>
          log.action.toLowerCase().includes(search) ||
          log.description.toLowerCase().includes(search) ||
          log.target.toLowerCase().includes(search) ||
          (log.performedByName && log.performedByName.toLowerCase().includes(search))
      );
    }

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    if (targetType) {
      filteredLogs = filteredLogs.filter(log => log.targetType === targetType);
    }

    if (performedBy) {
      filteredLogs = filteredLogs.filter(log => log.performedBy === performedBy);
    }

    if (successParam && successParam !== 'ALL') {
      const success = successParam === 'true';
      filteredLogs = filteredLogs.filter(log => log.success === success);
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() : Date.now();
      filteredLogs = filteredLogs.filter(log => {
        const logTime = new Date(log.timestamp).getTime();
        return logTime >= start && logTime <= end;
      });
    }

    // Sort by timestamp descending (newest first)
    filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Paginate
    const totalItems = filteredLogs.length;
    const totalPages = Math.ceil(totalItems / size);
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: {
        data: paginatedLogs,
        meta: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: size,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      message: 'Success',
    });
  }),
];
