# Auth Feature Module

## 📝 Mô tả

Module xác thực và quản lý người dùng cho ứng dụng E-Signature. Cung cấp đầy đủ chức năng đăng ký, đăng nhập, quản lý profile, và quên mật khẩu.

## 🏗️ Cấu trúc

```
auth/
├── components/              # React components
│   ├── LoginForm.tsx       # Form đăng nhập
│   ├── RegisterForm.tsx    # Form đăng ký
│   └── ProfileForm.tsx     # Form cập nhật profile
│
├── pages/                  # Page components
│   ├── LoginPage.tsx       # Trang đăng nhập
│   ├── RegisterPage.tsx    # Trang đăng ký
│   ├── ForgotPasswordPage.tsx  # Trang quên mật khẩu
│   └── ProfilePage.tsx     # Trang profile người dùng
│
├── hooks/                  # Custom hooks
│   ├── useAuth.ts          # Hook truy cập auth state
│   └── useAuthGuard.ts     # Hook bảo vệ routes
│
├── services/               # API services
│   └── auth.api.ts         # RTK Query endpoints
│
├── types/                  # TypeScript types
│   └── index.ts            # Auth-related types
│
├── utils/                  # Utilities
│   └── validators.ts       # Zod validation schemas
│
├── authSlice.ts            # Redux slice
└── README.md              # Tài liệu này
```

## 🚀 Chức năng chính

### 1. Đăng ký (Register)
- **File**: `pages/RegisterPage.tsx`, `components/RegisterForm.tsx`
- **Chức năng**: 
  - Đăng ký tài khoản mới
  - Validation: email, password (8+ chars, uppercase, số), xác nhận password
  - Checkbox đồng ý điều khoản
- **API**: `POST /api/auth/register`
- **Redirect**: Sau đăng ký thành công → `/login`

### 2. Đăng nhập (Login)
- **File**: `pages/LoginPage.tsx`, `components/LoginForm.tsx`
- **Chức năng**:
  - Đăng nhập bằng email/password
  - Checkbox "Remember me"
  - Link "Forgot password"
- **API**: `POST /api/auth/login`
- **Redux**: Lưu user và token vào store + localStorage
- **Redirect**: Sau đăng nhập → `/documents`

### 3. Quên mật khẩu (Forgot Password)
- **File**: `pages/ForgotPasswordPage.tsx`
- **Chức năng**:
  - Gửi email reset password
  - Hiển thị thông báo thành công
- **API**: `POST /api/auth/forgot-password`

### 4. Profile
- **File**: `pages/ProfilePage.tsx`, `components/ProfileForm.tsx`
- **Chức năng**:
  - Xem thông tin profile (email, role, ngày tạo)
  - Cập nhật tên và avatar
  - Upload avatar (preview trước khi lưu)
- **API**: 
  - `GET /api/auth/profile`
  - `PUT /api/auth/profile`

### 5. Đăng xuất (Logout)
- **File**: `hooks/useAuth.ts`
- **Chức năng**:
  - Clear token và user từ Redux + localStorage
  - Redirect về `/login`
- **API**: `POST /api/auth/logout`

## 🎨 Components

### LoginForm
Props:
- `onSubmit: (values: LoginFormValues) => Promise<void>` - Handler khi submit
- `isLoading?: boolean` - Trạng thái loading
- `error?: string | null` - Error message

### RegisterForm
Props:
- `onSubmit: (values: RegisterFormValues) => Promise<void>` - Handler khi submit
- `isLoading?: boolean` - Trạng thái loading
- `error?: string | null` - Error message

### ProfileForm
Props:
- `user: User` - Thông tin user hiện tại
- `onSubmit: (values: ProfileFormValues) => Promise<void>` - Handler khi submit
- `isLoading?: boolean` - Trạng thái loading

## 🔧 Hooks

### useAuth()
Hook chính để truy cập authentication state và actions.

**Returns:**
```typescript
{
  user: User | null;              // Thông tin user
  isAuthenticated: boolean;       // Trạng thái đăng nhập
  token: string | null;          // Auth token
  error: string | null;          // Error message
  status: LoadingStatus;         // Loading status
  isLoading: boolean;            // Combined loading state
  login: (credentials) => Promise; // Hàm đăng nhập
  logout: () => Promise;         // Hàm đăng xuất
}
```

**Example:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();

if (isAuthenticated) {
  console.log('User:', user.name);
}
```

### useAuthGuard(options)
Hook để bảo vệ routes và kiểm tra quyền.

**Options:**
```typescript
{
  requireAuth?: boolean;     // Yêu cầu đăng nhập (default: true)
  requireRole?: UserRole;    // Yêu cầu role cụ thể
  redirectTo?: string;       // Redirect URL (default: '/login')
}
```

**Example:**
```typescript
// Trong protected page
const { isAuthenticated, isAuthorized } = useAuthGuard({
  requireAuth: true,
  requireRole: UserRole.Admin,
});
```

## 📡 API Endpoints

### RTK Query Hooks

```typescript
// Login
const [login] = useLoginMutation();
await login({ email, password });

// Register
const [register] = useRegisterMutation();
await register({ email, password, name });

// Get Profile
const { data: user } = useGetProfileQuery();

// Update Profile
const [updateProfile] = useUpdateProfileMutation();
await updateProfile({ name, avatar });

// Forgot Password
const [forgotPassword] = useForgotPasswordMutation();
await forgotPassword({ email });

// Logout
const [logout] = useLogoutMutation();
await logout();
```

## 🔐 Redux State

### Auth Slice

**State:**
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
```

**Actions:**
```typescript
// Set credentials sau khi login
dispatch(setCredentials({ user, token }));

// Update user info
dispatch(setUser(updatedUser));

// Logout
dispatch(logout());

// Set error
dispatch(setError(message));

// Clear error
dispatch(clearError());
```

**Selectors:**
```typescript
const user = useAppSelector(selectUser);
const isAuthenticated = useAppSelector(selectIsAuthenticated);
const token = useAppSelector(selectAuthToken);
const error = useAppSelector(selectAuthError);
const status = useAppSelector(selectAuthStatus);
```

## ✅ Validation

Validation sử dụng Zod schemas trong `utils/validators.ts`:

- **loginSchema**: Email + password
- **registerSchema**: Email + password + confirmPassword + name + terms
- **forgotPasswordSchema**: Email
- **profileSchema**: Name + avatar (optional)

## 🎯 User Roles

```typescript
enum UserRole {
  User = 'USER',    // Người dùng thường
  Admin = 'ADMIN',  // Quản trị viên
}
```

## 🔒 Security

- **Token Storage**: localStorage (key: `AUTH_TOKEN`)
- **Auto Logout**: Khi token expire hoặc invalid
- **Protected Routes**: Sử dụng `useAuthGuard` hook
- **Password Requirements**: 
  - Tối thiểu 8 ký tự
  - Ít nhất 1 chữ hoa
  - Ít nhất 1 số

## 🌐 i18n Keys

Translation keys được sử dụng (namespace: `auth`):

```
auth.login, auth.register, auth.email, auth.password
auth.forgotPassword, auth.loginSuccess, auth.registerSuccess
auth.emailRequired, auth.passwordRequired, auth.passwordMin
profile.title, profile.name, profile.avatar, profile.updateSuccess
```

## 🧪 Testing

Tests được đặt trong `__tests__/`:
- Unit tests cho components
- Integration tests cho auth flow
- Mock API với MSW

## 📝 Usage Examples

### 1. Đăng nhập programmatically

```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function MyComponent() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123',
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

### 2. Bảo vệ route

```typescript
import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard';

function AdminPage() {
  useAuthGuard({
    requireAuth: true,
    requireRole: UserRole.Admin,
  });

  return <div>Admin Content</div>;
}
```

### 3. Kiểm tra authentication

```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <span>Hello, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
```

## 🔄 Flow Diagram

```
┌─────────────┐
│   Register  │──────┐
└─────────────┘      │
                     │
┌─────────────┐      ▼
│    Login    │──► [Auth Success] ──► [Set Redux State] ──► [Redirect]
└─────────────┘      │                    │
                     │                    │
┌─────────────┐      │                    ▼
│   Profile   │◄─────┴──────────── [localStorage]
└─────────────┘
       │
       ▼
┌─────────────┐
│   Logout    │──► [Clear State] ──► [Clear localStorage] ──► [Redirect to /login]
└─────────────┘
```

## 🐛 Troubleshooting

### Token expired
- Tự động logout và redirect về `/login`
- Cần implement refresh token nếu cần

### State không sync
- Check Redux DevTools
- Verify localStorage có token không

### Form validation lỗi
- Check console cho Zod errors
- Verify schema trong `utils/validators.ts`

## 📚 Dependencies

- `@reduxjs/toolkit` - Redux state management
- `react-router-dom` - Routing
- `antd` - UI components
- `zod` - Validation
- `react-i18next` - Internationalization

## 🚀 Next Steps

- [ ] Implement email verification
- [ ] Add two-factor authentication
- [ ] Implement refresh token
- [ ] Add social login (Google, Facebook)
- [ ] Add password strength meter

