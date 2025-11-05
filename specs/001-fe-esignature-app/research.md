# Technical Research: FE-only E-Signature Web Application

**Date**: 2025-11-05  
**Phase**: Phase 0 - Research & Technical Decisions  
**Purpose**: Resolve all technical unknowns và establish best practices cho implementation

---

## 1. PDF Rendering Library

### Decision: **react-pdf**

### Rationale:
- Built on PDF.js (Mozilla's battle-tested engine)
- React-native integration cho future mobile expansion
- TypeScript support tốt với @types/react-pdf
- Document/Page components declarative và React-friendly
- Text layer support cho accessibility (selectable text)
- Lazy loading pages out-of-the-box
- Active maintenance + large community

### Alternatives Considered:
- **PDF.js directly**: Imperative API, harder integration với React lifecycle, more boilerplate
- **pdfjs-dist**: Lower-level, require manual wrapper, no React optimizations
- **@react-pdf/renderer**: Tạo PDF chứ không render - wrong use case

### Implementation Notes:
```typescript
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Lazy load pages với virtualization cho large docs
<Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
  {Array.from(new Array(numPages), (el, index) => (
    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
  ))}
</Document>
```

### Performance Considerations:
- Web worker cho rendering (không block main thread)
- Canvas rendering cho pages (fallback to SVG nếu cần)
- Lazy load pages outside viewport
- Cache rendered pages

---

## 2. Signature Canvas Implementation

### Decision: **react-signature-canvas**

### Rationale:
- Wrapper around signature_pad library (proven, 10k+ stars)
- Touch + mouse support out-of-the-box
- Export to PNG/SVG/base64 easily
- Undo functionality built-in (clear canvas)
- TypeScript types available
- Lightweight (~10KB gzipped)
- Smooth stroke rendering (Bézier curves)

### Alternatives Considered:
- **Custom Canvas API**: More control nhưng phải implement touch handling, stroke smoothing, export logic from scratch
- **fabricjs**: Overkill cho simple signature drawing, large bundle size, complex API
- **Konva/react-konva**: Graphics library, không specialized cho signatures

### Implementation Notes:
```typescript
import SignatureCanvas from 'react-signature-canvas';

const SignatureDrawComponent = () => {
  const sigPadRef = useRef<SignatureCanvas>(null);
  
  const clear = () => sigPadRef.current?.clear();
  const save = () => {
    const dataURL = sigPadRef.current?.toDataURL('image/png');
    // Upload to backend
  };
  
  return (
    <SignatureCanvas
      ref={sigPadRef}
      canvasProps={{ className: 'signature-canvas' }}
      penColor="black"
      minWidth={0.5}
      maxWidth={2.5}
    />
  );
};
```

### Accessibility Notes:
- Provide alt text cho signature images
- Keyboard alternative: type-mode signature
- Touch targets ≥ 44x44px cho buttons

---

## 3. Drag-and-Drop Fields

### Decision: **dnd-kit**

### Rationale:
- Modern, accessible, performant (built 2020+)
- Touch screen support first-class citizen
- Keyboard navigation built-in (WCAG compliant)
- TypeScript native
- Collision detection algorithms for snapping
- Auto-scroll when dragging near edges
- Smaller bundle than react-dnd
- Active development + excellent docs

### Alternatives Considered:
- **react-dnd**: Older, không tối ưu cho touch, larger bundle, complex API với backends
- **react-beautiful-dnd**: Deprecated (Atlassian ngừng maintain), không support horizontal + vertical simultaneous
- **HTML5 native drag-drop**: Poor touch support, inconsistent across browsers, accessibility issues

### Implementation Notes:
```typescript
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Draggable field từ toolbar
const FieldTool = ({ id, type }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = { transform: CSS.Translate.toString(transform) };
  return <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
    {type}
  </div>;
};

// Droppable PDF page
const PDFPage = ({ pageNum }) => {
  const { setNodeRef } = useDroppable({ id: `page-${pageNum}` });
  return <div ref={setNodeRef} className="pdf-page">
    {/* PDF rendering + field overlays */}
  </div>;
};

// Context wraps entire editor
<DndContext onDragEnd={handleDragEnd}>
  <FieldToolbar />
  <PDFViewer />
</DndContext>
```

### Positioning Strategy:
- Capture drop position relative to page: `event.over.rect` + `event.delta`
- Convert to PDF coordinates (page size agnostic)
- Store as `{ x, y, width, height }` percentages (0-100%)
- Render overlays using absolute positioning with CSS transforms

---

## 4. Real-time Timeline Updates

### Decision: **Polling with Exponential Backoff**

### Rationale:
- Simplicity: No WebSocket infrastructure required (FE-only scope)
- Reliability: HTTP more universally supported than WS
- Scalability: Server stateless, no connection management
- Backend agnostic: Works với bất kỳ REST API nào
- Fallback-friendly: Network failures handled gracefully

### Alternatives Considered:
- **WebSocket**: Requires backend WebSocket server (out of scope), connection management complexity, firewall issues
- **Server-Sent Events (SSE)**: HTTP/1.1 connection limits, less browser support than polling, requires streaming endpoint
- **Long Polling**: Server holds connection, resource intensive, HTTP timeout issues

### Implementation Strategy:
```typescript
// RTK Query với pollingInterval
const { data: timeline } = useGetDocumentTimelineQuery(
  documentId,
  { pollingInterval: 5000 } // Poll every 5 seconds khi component mounted
);

// Exponential backoff on errors
const [pollInterval, setPollInterval] = useState(5000);

useEffect(() => {
  if (error) {
    setPollInterval(prev => Math.min(prev * 2, 60000)); // Max 60s
  } else {
    setPollInterval(5000); // Reset on success
  }
}, [error]);
```

### Optimization:
- Chỉ poll khi user đang xem document detail page (component mounted)
- Skip polling nếu document status = "Done" hoặc "Declined" (final states)
- RTK Query cache deduplication: multiple components poll cùng endpoint → 1 request
- Timestamp-based conditional GET: `If-Modified-Since` header

---

## 5. Form Validation Library

### Decision: **Zod**

### Rationale:
- TypeScript-first: Schema defines both runtime validation + type inference
- Better DX: `z.infer<typeof schema>` tự động tạo types
- Tree-shakeable: Import chỉ validators cần dùng
- Runtime + compile-time safety
- React Hook Form integration excellent (`@hookform/resolvers/zod`)
- Smaller bundle than Yup (~10KB vs ~15KB)
- Error messages customizable, i18n-friendly

### Alternatives Considered:
- **Yup**: String-based schema, không type-safe như Zod, larger bundle
- **Joi**: Server-side focused, bundle size lớn, không tối ưu cho browser
- **class-validator**: Decorator-based, phụ thuộc reflect-metadata, experimental decorators

### Implementation Pattern:
```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

// Infer TypeScript type
type LoginFormData = z.infer<typeof loginSchema>;

// Use in form
const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

### Validation Strategy:
- Client-side: Zod schemas cho immediate feedback
- Server-side: Backend validates again (source of truth)
- Optimistic UI: Show validation errors before submit
- i18n: Custom error messages với react-i18next

---

## 6. Error Handling Pattern

### Decision: **Unified Error Handling với RTK Query + Error Boundary**

### Rationale:
- Consistency: Mọi errors follow cùng flow
- User-friendly: Transform technical errors → readable messages
- Recoverable: Retry logic cho network failures
- Traceable: Error logging infrastructure ready

### Error Architecture:

#### API Errors (RTK Query)
```typescript
// baseApi.ts
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Add auth token
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error?.status === 401) {
    // Refresh token logic
  }
  
  // Transform error
  if (result.error) {
    result.error = {
      status: result.error.status,
      message: getErrorMessage(result.error),
      code: result.error.data?.code,
    };
  }
  
  return result;
};

// Error message mapping
const getErrorMessage = (error: FetchBaseQueryError): string => {
  if ('status' in error) {
    switch (error.status) {
      case 400: return 'Invalid request. Please check your input.';
      case 401: return 'Unauthorized. Please log in again.';
      case 403: return 'Access denied.';
      case 404: return 'Resource not found.';
      case 500: return 'Server error. Please try again later.';
      default: return 'An error occurred. Please try again.';
    }
  }
  return 'Network error. Please check your connection.';
};
```

#### Component Errors (React Error Boundary)
```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to error tracking service (e.g., Sentry)
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// Wrap async boundaries
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

#### User-Facing Errors
- Toast notifications cho API errors (Ant Design `message` component)
- Inline error messages cho form validation
- Error pages cho route-level errors (404, 500)
- Retry buttons cho recoverable errors

---

## 7. State Management Boundaries

### Decision: **Redux for Global, React Query Cache for Server, Local State for UI**

### State Architecture Guidelines:

| State Type | Storage | Example |
|------------|---------|---------|
| **Authentication** | Redux (`authSlice`) | User info, token status, permissions |
| **Server Data** | RTK Query cache | Documents, signatures, signers, audit events |
| **UI State (global)** | Redux | Theme, language, sidebar open/closed |
| **UI State (local)** | `useState` | Modal open, form input, field dragging |
| **Form State** | React Hook Form | Field values, validation, touched |
| **Preferences** | localStorage + Redux | Theme, language (persist across sessions) |

### Rationale:
- **Redux**: Single source of truth cho auth và global UI state
- **RTK Query**: Automatic caching, deduplication, invalidation cho server data
- **Local State**: Component-scoped, không cần share → `useState`
- **Form State**: Specialized library (React Hook Form) cho performance

### Anti-patterns to Avoid:
- ❌ Storing server data in Redux slices (use RTK Query instead)
- ❌ Lifting UI state to Redux unnecessarily (use local state)
- ❌ Duplicating data between Redux và RTK Query cache

### Example:
```typescript
// ✅ Good: Auth in Redux
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: { setUser, logout },
});

// ✅ Good: Documents in RTK Query
const documentsApi = createApi({
  endpoints: (builder) => ({
    getDocuments: builder.query<Document[], void>({...}),
  }),
});

// ✅ Good: Modal state local
const [isModalOpen, setIsModalOpen] = useState(false);
```

---

## 8. Testing Strategy Details

### Unit Tests (70% coverage target)

**Scope**: Pure logic, individual components, hooks

**Tools**: Vitest + React Testing Library

**Patterns**:
```typescript
// Component test
describe('SignatureCanvas', () => {
  it('renders canvas element', () => {
    render(<SignatureCanvas />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('calls onSave with signature data', () => {
    const onSave = vi.fn();
    render(<SignatureCanvas onSave={onSave} />);
    // Simulate drawing
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledWith(expect.stringContaining('data:image'));
  });
});

// Hook test
describe('useAuth', () => {
  it('returns user when authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBe(true);
  });
});

// Util test
describe('validators', () => {
  it('validates email correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });
});
```

### Integration Tests

**Scope**: User flows spanning multiple components, API interactions

**Tools**: Vitest + RTL + MSW (Mock Service Worker)

**Critical Flows**:
1. Auth: Register → Login → Profile update → Logout
2. Signature: Create → Preview → Save → Set default → Use in signing
3. Document: Upload → Place fields → Assign signers → Send invite
4. Signing: Open room → Fill fields → Complete/Decline

**MSW Setup**:
```typescript
// mocks/handlers.ts
export const handlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ user: mockUser, token: 'fake-token' }));
  }),
  rest.get('/api/documents', (req, res, ctx) => {
    return res(ctx.json({ documents: mockDocuments }));
  }),
  // ... all endpoints mocked
];

// Test with MSW
describe('Document Upload Flow', () => {
  it('uploads PDF and shows in list', async () => {
    render(<DocumentListPage />);
    
    const file = new File(['dummy'], 'contract.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('Upload Document');
    await userEvent.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByText('contract.pdf')).toBeInTheDocument();
    });
  });
});
```

### Coverage Targets:

| Type | Target | Priority |
|------|--------|----------|
| Unit Tests | 70%+ | High |
| Integration Tests | Critical flows covered | High |
| E2E Tests | Manual initially | Low |
| Accessibility Tests | jest-axe on key components | Medium |

### Accessibility Testing:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 9. Ant Design + Tailwind Integration

### Decision: **Coexist with Scoped Usage**

### Strategy:
- **Ant Design**: Complex components (Table, Modal, Drawer, Form, DatePicker, Select)
- **Tailwind**: Utility styling (spacing, colors, flex, grid, responsive)

### Integration Pattern:
```typescript
// Use Ant Design component + Tailwind utilities
<Modal
  open={isOpen}
  onCancel={onClose}
  className="max-w-2xl" // Tailwind utility
>
  <div className="flex flex-col gap-4 p-6">
    <Input placeholder="Name" />
  </div>
</Modal>
```

### CSS Conflicts Resolution:
1. **CSS Reset**: Tailwind's preflight reset có thể conflict với Ant Design styles
   - Solution: Scope preflight hoặc disable nếu cần
   
2. **Specificity**: Ant Design sử dụng class selectors, Tailwind utilities cũng vậy
   - Solution: Import order: Ant Design CSS → Tailwind CSS → Custom CSS
   
3. **Theme Variables**: Cả hai đều có theming system
   - Solution: Sync colors giữa `tailwind.config.js` và Ant Design theme

### Theme Configuration:
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1890ff', // Match Ant Design primary color
        success: '#52c41a',
        warning: '#faad14',
        error: '#ff4d4f',
      },
    },
  },
};

// Ant Design ConfigProvider
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }}
>
  <App />
</ConfigProvider>
```

---

## 10. i18n Performance Optimization

### Decision: **Lazy Loading with Namespace Splitting**

### Strategy:
- Split translations by module: `auth.json`, `signature.json`, `documents.json`, etc.
- Lazy load namespaces chỉ khi module được sử dụng
- Preload common namespace (`common.json`) at app init

### Implementation:
```typescript
// i18n.ts
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'], // Initially load only common
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true, // Lazy load with Suspense
    },
  });

// Module-specific usage
const { t } = useTranslation('signature'); // Load signature namespace on demand
```

### Bundle Optimization:
- Separate JSON files per language per namespace
- CDN caching cho translation files
- Gzip compression (JSON compresses well)

### Translation File Structure:
```
public/locales/
├── en/
│   ├── common.json       # ~2KB: buttons, labels, errors
│   ├── auth.json         # ~1KB: login, register
│   ├── signature.json    # ~1KB: signature UI
│   ├── documents.json    # ~2KB: document management
│   └── admin.json        # ~1KB: admin panel
└── vi/
    └── [same structure]
```

---

## 11. Bundle Optimization & Code Splitting

### Strategy: **Route-based Code Splitting + Component-level Lazy Loading**

### Route Splitting:
```typescript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load route components
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DocumentsPage = lazy(() => import('@/features/documents/pages/DocumentListPage'));
const SigningRoom = lazy(() => import('@/features/invite-signing/pages/SigningRoomPage'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/documents" element={<DocumentsPage />} />
    <Route path="/signing/:token" element={<SigningRoom />} />
  </Routes>
</Suspense>
```

### Component-level Lazy Loading:
```typescript
// Lazy load heavy components (PDF viewer, signature canvas)
const PDFViewer = lazy(() => import('./PDFViewer'));
const SignatureCanvas = lazy(() => import('./SignatureCanvas'));
```

### Vite Optimization:
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-ui': ['antd', '@ant-design/icons'],
          'vendor-pdf': ['react-pdf', 'pdfjs-dist'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 1MB threshold
  },
});
```

### Expected Bundle Sizes:
- Initial load: ~200-300KB gzipped (vendor-react, vendor-redux, common chunk)
- Route chunks: ~50-100KB each
- PDF module: ~150KB (lazy loaded)
- Total budget: < 1MB for initial + first route

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| PDF Rendering | react-pdf | React-friendly, TypeScript, performance, accessibility |
| Signature Canvas | react-signature-canvas | Touch support, lightweight, proven library |
| Drag-and-Drop | dnd-kit | Modern, accessible, touch-first, TypeScript native |
| Real-time Updates | Polling (5s interval) | Simple, reliable, backend agnostic, RTK Query friendly |
| Validation | Zod | TypeScript-first, type inference, smaller bundle, RHF integration |
| Error Handling | RTK Query + Error Boundary | Unified, user-friendly, recoverable, traceable |
| State Management | Redux + RTK Query + Local | Clear boundaries, avoid duplication, performance |
| Testing | Vitest + RTL + MSW | Fast, React-friendly, API mocking, 70% coverage target |
| UI Integration | Ant Design + Tailwind | Coexist, use each for strengths, theme sync |
| i18n | Lazy namespaces | Performance, module splitting, CDN caching |
| Code Splitting | Route-based + Component lazy | Bundle optimization, faster initial load |

---

**Research Status**: ✅ COMPLETE

All technical unknowns resolved. Ready to proceed to Phase 1 (Design Artifacts).

