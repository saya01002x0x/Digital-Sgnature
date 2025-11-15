# Auth Module

**Module Authentication và User Management**

Module này chịu trách nhiệm quản lý toàn bộ authentication flow, user profile management, và authorization guard cho ứng dụng E-Signature.

## 📁 Cấu trúc

```
auth/
├── pages/                  # Auth pages
│   ├── LoginPage.tsx       # Trang đăng nhập
│   ├── RegisterPage.tsx    # Trang đăng ký
│   ├── ForgotPasswordPage.tsx  # Trang quên mật khẩu
│   └── ProfilePage.tsx     # Trang profile người dùng
├── components/             # Auth components
│   ├── LoginForm.tsx       # Form đăng nhập
│   ├── RegisterForm.tsx    # Form đăng ký
│   ├── ProfileForm.tsx     # Form cập nhật profile
│   └── AuthLayout.tsx      # Layout cho auth pages
├── hooks/                  # Custom hooks
│   ├── useAuth.ts          # Hook truy cập auth state
│   └── useAuthGuard.ts     # Hook bảo vệ routes
├── services/               # API services
│   └── auth.api.ts         # RTK Query auth endpoints
├── types/                  # TypeScript types
│   └── index.ts            # User, Auth types
├── utils/                  # Utilities
│   └── validators.ts       # Zod validation schemas
├── authSlice.ts            # Redux slice cho auth state
└── __tests__/              # Tests
    ├── authFlow.test.tsx   # Integration tests
    └── components/
        └── __tests__/
            ├── LoginForm.test.tsx
            └── RegisterForm.test.tsx
```

## ✨ Features

### Authentication

- ✅ **Đăng ký tài khoản** - User có thể đăng ký với email, password, và name
- ✅ **Đăng nhập** - Support remember me, redirect sau khi login
- ✅ **Đăng xuất** - Clear session và redirect về login
- ✅ **Quên mật khẩu** - Gửi email reset password
- ✅ **Reset mật khẩu** - Đặt lại mật khẩu với token

### User Profile

- ✅ **Xem profile** - Hiển thị thông tin user (name, email, avatar, role)
- ✅ **Cập nhật profile** - Update name và avatar
- ✅ **Email verification status** - Hiển thị trạng thái email đã verify

### Authorization

- ✅ **Protected Routes** - Guard routes yêu cầu authentication
- ✅ **Role-based Access** - Phân quyền theo role (USER, ADMIN)
- ✅ **Auth Guards** - Custom hooks để protect components

## 🔧 Usage

### useAuth Hook

```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### useAuthGuard Hook

```typescript
import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard';
import { UserRole } from '@/features/auth/types';

function AdminPage() {
  const { isAuthorized } = useAuthGuard({
    requireAuth: true,
    requireRole: UserRole.Admin,
    redirectTo: '/login',
  });

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <div>Admin Content</div>;
}
```

### Auth API

```typescript
import { useLoginMutation, useRegisterMutation } from '@/features/auth/services/auth.api';

function LoginComponent() {
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values) => {
    const result = await login(values).unwrap();
    // Handle success
  };

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} />;
}
```

## 📝 Types

### User

```typescript
type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### UserRole

```typescript
enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}
```

## 🧪 Testing

Module này có comprehensive test coverage:

- **Unit Tests**: Components (LoginForm, RegisterForm), Hooks (useAuth)
- **Integration Tests**: Complete auth flow (register → login → logout)
- **MSW Mocks**: Mock handlers cho tất cả auth endpoints

Chạy tests:

```bash
npm test src/features/auth
```

## 🌐 i18n

Module hỗ trợ đa ngôn ngữ (vi/en):

- **English**: `public/locales/en/auth.json`
- **Vietnamese**: `public/locales/vi/auth.json`

## 🔐 Security

- ✅ Password validation: Min 8 ký tự, có uppercase và number
- ✅ Email validation với Zod schemas
- ✅ Token stored trong localStorage (hoặc httpOnly cookies từ backend)
- ✅ CSRF protection (backend responsibility)
- ✅ Input sanitization

## 🎯 User Stories Covered

**US7 - Đăng ký và xác thực người dùng (P1 - MVP)**

- [X] FR-059: Đăng ký với email/password
- [X] FR-060: Login/Logout
- [X] FR-061: Profile management
- [X] FR-062: Forgot password
- [X] FR-063: Session persistence

## 🚀 Next Steps

Module auth đã hoàn thành và sẵn sàng cho các user stories khác sử dụng. Các modules tiếp theo (Signature, Documents, Invite-Signing) có thể depend vào auth module này.

## 📚 Related Documentation

- [Spec](../../../../specs/001-fe-esignature-app/spec.md)
- [Plan](../../../../specs/001-fe-esignature-app/plan.md)
- [Data Model](../../../../specs/001-fe-esignature-app/data-model.md)
- [Auth API Contract](../../../../specs/001-fe-esignature-app/contracts/auth-api.json)
- [Tasks](../../../../specs/001-fe-esignature-app/tasks.md)
