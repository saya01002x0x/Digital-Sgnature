# Quickstart Guide: FE-only E-Signature Web Application

**Date**: 2025-11-05  
**Phase**: Phase 1 - Developer Onboarding  
**Purpose**: Get developers up and running quickly với best practices

---

## Prerequisites

### Required Tools
- **Node.js**: 18.x hoặc 20.x (LTS recommended)
- **npm**: 9.x+ (hoặc yarn/pnpm nếu prefer)
- **Git**: 2.x+
- **IDE**: VS Code (recommended) hoặc tương đương
- **Browser**: Chrome/Firefox/Edge (latest) cho development

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript + JavaScript
- Tailwind CSS IntelliSense
- i18n Ally (for translations)
- Error Lens (inline error display)

---

## Initial Setup

### 1. Clone Repository

```bash
cd digital-signature-front-end
git checkout 001-fe-esignature-app
```

### 2. Install Dependencies

```bash
npm install
```

**Note**: First install có thể mất 2-3 phút. Dependencies đã được lock trong `package-lock.json`.

### 3. Environment Variables

Tạo file `.env.local` (copy từ `.env.example`):

```bash
cp .env.example .env.local
```

Required variables:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Environment
VITE_ENV=development

# Feature flags (optional)
VITE_ENABLE_MSW=true  # Enable MSW mocking for development
```

### 4. Verify Setup

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format:check

# Build
npm run build
```

Tất cả commands trên phải pass (no errors).

---

## Development Workflow

### Start Development Server

```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:5173` (Vite default port)

**Hot Module Replacement (HMR)**: Code changes auto-reload, state preserved.

### With MSW (Mock API)

MSW (Mock Service Worker) mocks backend API cho development/testing.

**Enabled by default** khi `VITE_ENABLE_MSW=true`.

Mock handlers tại: `src/mocks/`
- `handlers.ts` - tổng hợp handlers
- `features/*.handlers.ts` - module-specific handlers

**Add new mock endpoint**:

```typescript
// src/mocks/features/auth.handlers.ts
import { rest } from 'msw';

export const authHandlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    
    // Mock logic
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          user: { id: '1', email, name: 'Test User', role: 'USER' },
          token: 'fake-jwt-token',
        })
      );
    }
    
    return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
  }),
];
```

---

## Project Structure Navigation

### Key Directories

```
src/
├── app/              # App-level config (store, routes, API base)
├── features/         # Feature modules (auth, signature, documents, etc.)
├── shared/           # Shared components/utilities
├── i18n/             # Internationalization config
├── mocks/            # MSW mock handlers
└── styles/           # Global styles
```

### Module Structure (Example: `auth`)

```
features/auth/
├── pages/            # Route components (LoginPage, RegisterPage)
├── components/       # Feature-specific components (LoginForm)
├── hooks/            # Custom hooks (useAuth)
├── services/         # API services (auth.api.ts - RTK Query)
├── types/            # TypeScript types
├── utils/            # Utilities (validators)
├── authSlice.ts      # Redux slice (if needed)
└── __tests__/        # Tests
```

---

## Common Tasks

### 1. Create New Feature Module

**Example**: Creating `notifications` module

```bash
mkdir -p src/features/notifications/{pages,components,hooks,services,types,utils,__tests__}
```

**Files to create**:

1. **API Service** (`services/notifications.api.ts`):
```typescript
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/app/api/baseApi';

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } = notificationsApi;
```

2. **Register API** in `app/store.ts`:
```typescript
import { notificationsApi } from '@/features/notifications/services/notifications.api';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // ... existing middleware
      notificationsApi.middleware,
    ),
});
```

3. **Create Page Component** (`pages/NotificationsPage.tsx`)
4. **Add Route** in `app/routes.tsx`
5. **Add Tests** in `__tests__/`

### 2. Add New API Endpoint

**Example**: Add "archive document" endpoint

1. Update API service (`features/documents/services/documents.api.ts`):
```typescript
export const documentsApi = createApi({
  // ... existing config
  endpoints: (builder) => ({
    // ... existing endpoints
    archiveDocument: builder.mutation<Document, string>({
      query: (id) => ({
        url: `/documents/${id}/archive`,
        method: 'POST',
      }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const { useArchiveDocumentMutation } = documentsApi;
```

2. Add MSW mock (`mocks/features/documents.handlers.ts`):
```typescript
rest.post('/api/documents/:id/archive', (req, res, ctx) => {
  const { id } = req.params;
  return res(
    ctx.status(200),
    ctx.json({ ...mockDocument, id, status: 'ARCHIVED' })
  );
}),
```

3. Use in component:
```typescript
const [archiveDocument, { isLoading }] = useArchiveDocumentMutation();

const handleArchive = async () => {
  try {
    await archiveDocument(documentId).unwrap();
    message.success('Document archived');
  } catch (error) {
    message.error('Failed to archive document');
  }
};
```

### 3. Add Translations (i18n)

**Add new keys**:

1. `public/locales/en/common.json`:
```json
{
  "buttons": {
    "archive": "Archive",
    "restore": "Restore"
  }
}
```

2. `public/locales/vi/common.json`:
```json
{
  "buttons": {
    "archive": "Lưu trữ",
    "restore": "Khôi phục"
  }
}
```

**Use in component**:
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('common');
  return <Button>{t('buttons.archive')}</Button>;
};
```

### 4. Add Form with Validation

**Example**: Document create form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  file: z.instanceof(File).refine(
    (file) => file.type === 'application/pdf',
    'Only PDF files are allowed'
  ),
});

type FormData = z.infer<typeof schema>;

const DocumentCreateForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const [upload] = useUploadDocumentMutation();
  
  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    
    await upload(formData).unwrap();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <input type="file" {...register('file')} />
      {errors.file && <span>{errors.file.message}</span>}
      
      <Button type="submit">Upload</Button>
    </form>
  );
};
```

### 5. Write Tests

**Component test**:

```typescript
import { render, screen, waitFor } from '@/utils/test-utils'; // Custom render with providers
import { userEvent } from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
  
  it('shows validation errors', async () => {
    render(<LoginForm />);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });
});
```

**API integration test** (với MSW):

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useLoginMutation } from './auth.api';
import { wrapper } from '@/utils/test-utils'; // Redux store wrapper

describe('Auth API', () => {
  it('logs in successfully', async () => {
    const { result } = renderHook(() => useLoginMutation(), { wrapper });
    
    const [login] = result.current;
    const promise = login({ email: 'test@example.com', password: 'password123' });
    
    await waitFor(() => expect(result.current[1].isSuccess).toBe(true));
    
    const data = await promise.unwrap();
    expect(data.user.email).toBe('test@example.com');
    expect(data.token).toBeDefined();
  });
});
```

---

## Testing

### Run All Tests

```bash
npm run test
```

### Watch Mode (during development)

```bash
npm run test -- --watch
```

### Coverage Report

```bash
npm run test -- --coverage
```

Target: 70%+ coverage.

### Test Single File

```bash
npm run test src/features/auth/components/LoginForm.test.tsx
```

---

## Code Quality

### Pre-commit Checks

Husky + lint-staged tự động chạy khi commit:
- Format code (Prettier)
- Lint code (ESLint)
- Type check (TypeScript)

**Manual run**:

```bash
npm run format      # Auto-fix formatting
npm run lint:fix    # Auto-fix linting issues
npm run type-check  # Check types
```

### ESLint Rules

Key rules:
- No `any` type (use `unknown` và type guard)
- Prefer `const` over `let`
- No unused variables
- React hooks rules (dependencies, exhaustive deps)
- Accessibility rules (jsx-a11y)

**Disable rule** (only when necessary):

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValue: any = JSON.parse(input);
```

---

## Build & Deploy

### Production Build

```bash
npm run build
```

Output: `dist/` directory

**Build includes**:
- Code minification
- Tree shaking (unused code removed)
- Code splitting (route-based chunks)
- Asset optimization (images, fonts)

### Preview Production Build

```bash
npm run preview
```

Serves production build locally for testing.

### Environment-specific Builds

Create `.env.production`:

```env
VITE_API_BASE_URL=https://api.production.com
VITE_ENV=production
VITE_ENABLE_MSW=false
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```
Error: Port 5173 is already in use
```

**Solution**: Kill process hoặc change port:

```bash
npm run dev -- --port 3000
```

#### 2. Module Not Found

```
Cannot find module '@/features/auth'
```

**Solution**: Check `tsconfig.json` paths config:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 3. Type Errors After npm install

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check
```

#### 4. MSW Not Working

Check:
1. `VITE_ENABLE_MSW=true` in `.env.local`
2. Service worker registered in `src/main.tsx`
3. Handlers defined in `src/mocks/handlers.ts`

**Debug MSW**:

```typescript
// src/mocks/browser.ts
export const worker = setupWorker(...handlers);

// Log all requests
worker.printHandlers(); // In console
```

#### 5. Stale RTK Query Cache

Clear cache:

```typescript
import { useAppDispatch } from '@/app/hooks';
import { authApi } from '@/features/auth/services/auth.api';

const dispatch = useAppDispatch();

// Reset specific API
dispatch(authApi.util.resetApiState());

// Or reset all
window.location.reload(); // Nuclear option
```

---

## Resources

### Documentation Links

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Redux Toolkit**: https://redux-toolkit.js.org
- **RTK Query**: https://redux-toolkit.js.org/rtk-query/overview
- **React Router**: https://reactrouter.com
- **Ant Design**: https://ant.design/components/overview
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zod**: https://zod.dev
- **Vitest**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/react
- **MSW**: https://mswjs.io

### Project-Specific Docs

- **Specification**: `specs/001-fe-esignature-app/spec.md`
- **Implementation Plan**: `specs/001-fe-esignature-app/plan.md`
- **Research**: `specs/001-fe-esignature-app/research.md`
- **Data Model**: `specs/001-fe-esignature-app/data-model.md`
- **API Contracts**: `specs/001-fe-esignature-app/contracts/`
- **Constitution**: `.specify/memory/constitution.md`

### Getting Help

1. **Check spec docs** (above links)
2. **Review similar code** in existing modules
3. **Search tests** for usage examples
4. **Ask team** in Slack/Discord
5. **Create issue** with reproduction steps

---

## Next Steps After Setup

1. **Familiarize với codebase**:
   - Read constitution
   - Browse feature modules
   - Run tests để understand patterns

2. **Pick a starter task**:
   - Check `specs/001-fe-esignature-app/tasks.md` (after Phase 2)
   - Start với P1 tasks (high priority, foundational)

3. **Follow TDD workflow**:
   - Write test first
   - Run test (should fail - red)
   - Implement feature
   - Run test (should pass - green)
   - Refactor

4. **Submit PR**:
   - Create feature branch
   - Implement + test
   - Run quality checks
   - Push + create PR
   - Address review feedback

---

**Quickstart Status**: ✅ COMPLETE

Developer onboarding guide ready. Happy coding! 🚀

