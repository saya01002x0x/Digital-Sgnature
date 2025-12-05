# Implementation Plan: FE-only E-Signature Web Application

**Branch**: `001-fe-esignature-app` | **Date**: 2025-11-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-fe-esignature-app/spec.md`

## Summary

Xây dựng ứng dụng front-end React cho e-signature platform, cho phép người dùng tạo chữ ký, upload PDF, đặt các signing fields, mời người ký, và theo dõi document lifecycle (Draft → Signing → Done). Ứng dụng tập trung vào UX trực quan, accessibility, và integration với backend API qua RTK Query. Architecture theo module-first pattern với 5 core modules: auth, signature, documents, invite-signing, admin (simplified - metrics dashboard only). Testing strategy với Vitest + RTL + MSW. Support i18n (vi/en) và theme (light/dark). **Note**: Single global admin role only (no multi-organization, no Org Admin).

## Technical Context

**Language/Version**: TypeScript 5.8+ (strict mode), ES2022+ target  
**Framework**: React 19.1 + Vite 6.2  
**Primary Dependencies**: 
- State Management: Redux Toolkit 2.6+, RTK Query
- UI: Ant Design 5.27+, Tailwind CSS 4.0+
- Forms: React Hook Form 7.63+, Zod 4.1+ (validation)
- Routing: React Router 7.9+
- i18n: react-i18next 15.7+
- PDF: PDF.js hoặc react-pdf (needs research)
- Signature Canvas: react-signature-canvas 1.1+ hoặc custom Canvas API

**Storage**: Local storage cho theme/language preferences; Session storage cho draft data; NO file storage (backend handles)  
**Testing**: Vitest 3.1+ + React Testing Library 16.3+ + MSW 2.11+  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), Desktop primary + Tablet/Mobile responsive  
**Project Type**: Single-page web application (SPA)  
**Performance Goals**: 
- Initial load: < 3s (TTI)
- Page navigation: < 500ms
- PDF rendering: < 3s for 50-page docs
- Field drag/drop: 60fps smooth interactions
- Search/filter: < 1s response for 500 documents

**Constraints**:
- Client-side validation only (protective layer)
- No server-side rendering (CSR only)
- Browser storage limits (~5-10MB for localStorage)
- NO file persistence in FE
- XSS/CSP compliance required
- WCAG 2.1 Level AA target

**Scale/Scope**: 
- 5 core modules + shared utilities
- ~50-70 React components
- ~20-30 API endpoints (via RTK Query)
- ~8 main user flows
- Support ~500 concurrent users (browser-side)
- Handle docs with 50 pages, 10MB size

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Compliance Status

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Module-First Architecture** | ✅ Pass | 5 core modules planned: auth, signature, documents, invite-signing, admin. Each with standard structure (pages, components, hooks, services, types, utils). |
| **II. RTK Query (NON-NEGOTIABLE)** | ✅ Pass | All API communication via RTK Query. Base URL from env. Each module has dedicated API service. |
| **III. Security-First (NON-NEGOTIABLE)** | ✅ Pass | No file storage in FE. Input sanitization. Zod validation. Tokens via httpOnly cookies (backend assumption). |
| **IV. Testing Strategy** | ✅ Pass | Vitest + RTL + MSW mandatory. 70% coverage target. Integration tests for critical flows. |
| **V. UX & Accessibility** | ✅ Pass | Ant Design + Tailwind. i18n (vi/en). Theme (light/dark). Keyboard nav + ARIA. WCAG 2.1 AA target. |
| **Tech Stack Compliance** | ✅ Pass | React 19, TypeScript strict, Redux Toolkit, React Router v7, Vite. All per constitution. |
| **Code Conventions** | ✅ Pass | PascalCase components, absolute imports (@/), TypeScript interfaces, ESLint + Prettier. |
| **Quality Gates** | ✅ Pass | type-check, lint, format, test, build - all configured via package.json scripts. |

### 🔍 Constitution Validation

**Module Structure Compliance**:
```
src/features/{module}/
├── pages/           ✅ Per constitution
├── components/      ✅ Per constitution
├── hooks/           ✅ Per constitution
├── services/        ✅ RTK Query API files
├── types/           ✅ TypeScript definitions
└── utils/           ✅ Module-specific utilities
```

**API Communication Pattern**:
```typescript
// Each module: auth.api.ts, signature.api.ts, etc.
import { createApi } from '@reduxjs/toolkit/query/react';
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  endpoints: (builder) => ({...})
});
```

**No Violations**: Toàn bộ architecture tuân thủ constitution 100%.

## Project Structure

### Documentation (this feature)

```text
specs/001-fe-esignature-app/
├── spec.md              # Feature specification (DONE)
├── plan.md              # This file - implementation plan
├── research.md          # Phase 0 output - technical decisions
├── data-model.md        # Phase 1 output - entities & types
├── contracts/           # Phase 1 output - API contracts
│   ├── auth-api.yaml
│   ├── signature-api.yaml
│   ├── documents-api.yaml
│   ├── invite-signing-api.yaml
│   └── admin-api.yaml
├── quickstart.md        # Phase 1 output - developer onboarding
├── checklists/
│   └── requirements.md  # Spec validation (DONE)
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT YET)
```

### Source Code (repository root: digital-signature-front-end/)

```text
digital-signature-front-end/
├── public/
│   └── locales/              # i18n translation files
│       ├── en/translation.json
│       └── vi/translation.json
│
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Root component
│   │
│   ├── app/                  # App-level config
│   │   ├── store.ts          # Redux store
│   │   ├── hooks.ts          # Typed hooks (useAppDispatch, useAppSelector)
│   │   ├── routes.tsx        # React Router config
│   │   ├── api/
│   │   │   ├── baseApi.ts    # RTK Query base config
│   │   │   └── baseTypes.ts  # Common API types
│   │   ├── config/
│   │   │   ├── constants.ts  # App constants
│   │   │   └── env.ts        # Environment variables
│   │   └── providers/
│   │       ├── AppProviders.tsx    # All providers wrapper
│   │       └── ThemeProvider.tsx   # Theme context
│   │
│   ├── features/             # Feature modules (Module-First)
│   │   │
│   │   ├── auth/             # Authentication module
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   └── ProfilePage.tsx
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProfileForm.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useAuthGuard.ts
│   │   │   ├── services/
│   │   │   │   └── auth.api.ts         # RTK Query
│   │   │   ├── types/
│   │   │   │   └── index.ts            # User, LoginRequest, etc.
│   │   │   ├── utils/
│   │   │   │   └── validators.ts       # Zod schemas
│   │   │   ├── authSlice.ts            # Redux slice
│   │   │   └── __tests__/              # Tests
│   │   │
│   │   ├── signature/        # Signature management module
│   │   │   ├── pages/
│   │   │   │   ├── SignatureListPage.tsx
│   │   │   │   └── CreateSignaturePage.tsx
│   │   │   ├── components/
│   │   │   │   ├── SignatureCanvas.tsx      # Draw mode
│   │   │   │   ├── SignatureTyped.tsx       # Type mode
│   │   │   │   ├── SignaturePreview.tsx
│   │   │   │   └── SignatureSelector.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSignature.ts
│   │   │   │   └── useSignatureCanvas.ts
│   │   │   ├── services/
│   │   │   │   └── signature.api.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts            # Signature, SignatureType
│   │   │   ├── utils/
│   │   │   │   └── signatureHelpers.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── documents/        # Document management module
│   │   │   ├── pages/
│   │   │   │   ├── DocumentListPage.tsx
│   │   │   │   ├── DocumentDetailPage.tsx
│   │   │   │   └── DocumentEditorPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── DocumentUpload.tsx
│   │   │   │   ├── DocumentList.tsx
│   │   │   │   ├── DocumentFilters.tsx
│   │   │   │   ├── PDFViewer.tsx
│   │   │   │   ├── FieldToolbar.tsx
│   │   │   │   ├── FieldOverlay.tsx          # Draggable fields
│   │   │   │   ├── Timeline.tsx              # Audit trail
│   │   │   │   └── StatusBadge.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDocuments.ts
│   │   │   │   ├── usePDFViewer.ts
│   │   │   │   └── useFieldPlacement.ts
│   │   │   ├── services/
│   │   │   │   └── documents.api.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts            # Document, Field, AuditEvent
│   │   │   ├── utils/
│   │   │   │   ├── fieldHelpers.ts
│   │   │   │   └── pdfHelpers.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── invite-signing/   # Invite & signing workflow module
│   │   │   ├── pages/
│   │   │   │   ├── InviteSignersPage.tsx
│   │   │   │   └── SigningRoomPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── InviteForm.tsx
│   │   │   │   ├── SignerList.tsx
│   │   │   │   ├── OrderSelector.tsx         # Sequential/Parallel
│   │   │   │   ├── FieldAssignment.tsx
│   │   │   │   ├── SigningView.tsx
│   │   │   │   ├── DeclineDialog.tsx
│   │   │   │   └── CompleteDialog.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useInvite.ts
│   │   │   │   └── useSigning.ts
│   │   │   ├── services/
│   │   │   │   └── invite-signing.api.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts            # Signer, InviteRequest
│   │   │   ├── utils/
│   │   │   │   └── signingHelpers.ts
│   │   │   └── __tests__/
│   │   │
│   │   └── admin/            # Admin dashboard module (simplified)
│   │       ├── pages/
│   │       │   └── DashboardPage.tsx
│   │       ├── components/
│   │       │   ├── MetricsCard.tsx
│   │       │   ├── MetricsSummary.tsx
│   │       │   └── DateRangeFilter.tsx
│   │       ├── hooks/
│   │       │   └── useAdminMetrics.ts
│   │       ├── services/
│   │       │   └── admin.api.ts
│   │       ├── types/
│   │       │   └── index.ts            # Metrics types
│   │       ├── utils/
│   │       │   └── metricsHelpers.ts
│   │       └── __tests__/
│   │
│   ├── shared/               # Shared utilities & components
│   │   ├── components/
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── ThemeSwitcher.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── types/
│   │   │   └── index.ts              # Common types
│   │   ├── utils/
│   │   │   ├── validators.ts         # Common Zod schemas
│   │   │   ├── formatters.ts
│   │   │   └── apiHelpers.ts
│   │   └── lib/                      # Third-party integrations
│   │
│   ├── i18n/
│   │   └── i18n.ts                   # i18next config
│   │
│   ├── styles/
│   │   ├── globals.css               # Global styles
│   │   └── variables.css             # CSS variables
│   │
│   └── mocks/                        # MSW mocks for testing
│       ├── browser.ts                # Browser setup
│       ├── server.ts                 # Node setup
│       ├── handlers.ts               # Request handlers
│       └── features/
│           ├── auth.handlers.ts
│           ├── signature.handlers.ts
│           ├── documents.handlers.ts
│           ├── invite-signing.handlers.ts
│           └── admin.handlers.ts
│
├── tests/                            # Test utilities
│   └── utils/
│       └── test-utils.tsx            # RTL custom render
│
├── .specify/                         # Speckit config (already exists)
├── .cursor/                          # Cursor IDE config
├── public/                           # Static assets
├── dist/                             # Build output
│
├── package.json                      # Dependencies (already exists)
├── tsconfig.json                     # TypeScript config
├── vite.config.ts                    # Vite config
├── tailwind.config.js                # Tailwind config
├── eslint.config.js                  # ESLint config
├── vitest.config.ts                  # Vitest config (or in vite.config)
├── .env.example                      # Env template
└── README.md                         # Project readme
```

**Structure Decision**: Chọn cấu trúc **Frontend-only SPA** với module-first architecture như đã define trong constitution. Mỗi feature module (auth, signature, documents, invite-signing, admin) tự chứa toàn bộ logic, UI, và tests của mình. Shared code được tách ra `shared/` để tái sử dụng. Structure này cho phép:
- Parallel development (mỗi module độc lập)
- Easy testing (module isolation)
- Clear boundaries (no circular deps)
- Scalability (add new modules easily)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected** - Constitution compliance 100%. Không cần justify complexity.

## Phase 0: Research & Technical Decisions

**Output**: [research.md](./research.md)

### Research Tasks

1. **PDF Rendering Library**
   - Evaluate: PDF.js vs react-pdf vs pdfjs-dist
   - Criteria: Performance (50 pages), bundle size, TypeScript support, mobile compatibility
   - Decision needed: Which library for PDF viewer?

2. **Signature Canvas Implementation**
   - Evaluate: react-signature-canvas vs custom Canvas API vs fabricjs
   - Criteria: Touch support, export formats (PNG/SVG), undo/redo, TypeScript types
   - Decision needed: Draw mode implementation

3. **Drag-and-Drop Fields**
   - Evaluate: react-dnd vs dnd-kit vs native HTML5 drag-drop
   - Criteria: Touch support, performance, accessibility, positioning accuracy
   - Decision needed: Field placement UX

4. **Real-time Updates**
   - Evaluate: Polling vs WebSocket vs Server-Sent Events
   - Criteria: Backend support, complexity, fallback strategies
   - Decision needed: Timeline real-time updates

5. **Form Validation Strategy**
   - Evaluate: Zod vs Yup performance and DX
   - Criteria: Bundle size, TypeScript inference, React Hook Form integration
   - Decision needed: Primary validation library

6. **Error Handling Pattern**
   - Research: RTK Query error transformation best practices
   - Research: React Error Boundary patterns for async boundaries
   - Decision needed: Unified error handling approach

7. **State Management Boundaries**
   - Research: What goes in Redux vs React Query cache vs local state
   - Decision needed: State architecture guidelines

8. **Testing Strategy Details**
   - Research: MSW best practices for RTK Query
   - Research: Integration test boundaries (component vs page vs flow)
   - Decision needed: Test organization and coverage targets per type

### Best Practices Research

- **Ant Design + Tailwind**: Research integration patterns, CSS conflicts resolution
- **i18n Performance**: Research lazy loading strategies for translations
- **Accessibility Testing**: Research tools (axe-core, jest-axe) and automation
- **Bundle Optimization**: Research code splitting strategies for Vite

## Phase 1: Design Artifacts

**Prerequisites**: research.md complete

### Outputs

1. **[data-model.md](./data-model.md)**: TypeScript entities, interfaces, và types cho toàn bộ application
2. **[contracts/](./contracts/)**: OpenAPI/JSON specs cho API endpoints (RTK Query contracts)
3. **[quickstart.md](./quickstart.md)**: Developer onboarding guide

### Design Tasks

1. **Extract Entities from Spec**:
   - User, Signature, Document, Field, Signer, AuditEvent
   - Define TypeScript interfaces với validation rules
   - Document relationships và state transitions

2. **Generate API Contracts**:
   - Auth API: register, login, logout, profile, forgot-password, reset-password
   - Signature API: list, create, update, delete, setDefault
   - Documents API: list, upload, get, update, delete, search, filter
   - Fields API: create, update, delete, assign
   - Invite-Signing API: invite, getSigning, sign, decline, complete
   - Admin API: getMetrics, listUsers, addUser, updateRole, removeUser

3. **Define RTK Query Services**:
   - BaseQuery configuration với auth interceptor
   - Caching strategies cho mỗi endpoint
   - Optimistic updates cho critical actions
   - Error handling và retry logic

4. **Component Architecture**:
   - Component hierarchy cho mỗi module
   - Props interfaces
   - Shared component design (ErrorBoundary, LoadingSpinner, etc.)

5. **Routing Structure**:
   - Public routes: /, /login, /register, /forgot-password, /signing/:token
   - Protected routes: /dashboard, /signatures, /documents, /documents/:id, /admin
   - Role-based guards (User, Admin - single global admin)

## Phase 2: Implementation Tasks

**NOT GENERATED BY /speckit.plan** - Use `/speckit.tasks` command after Phase 1 complete.

## Implementation Priority

Theo spec priorities (P1 → P2 → P3):

### P1 - MVP Core (Weeks 1-4)
1. **Auth Module** (Week 1)
   - Login/Register/Profile
   - Authentication flow
   - Token management
   - Tests

2. **Signature Module** (Week 1)
   - Create signature (draw/type)
   - Manage signatures
   - Set default
   - Tests

3. **Documents Upload & Editor** (Week 2-3)
   - Upload PDF
   - PDF viewer
   - Field placement (drag-drop)
   - Field resize/positioning
   - Tests

4. **Signing Room** (Week 3-4)
   - View document with fields
   - Fill & sign fields
   - Submit/decline
   - Tests

### P2 - Multi-party & Management (Weeks 5-6)
5. **Invite Workflow** (Week 5)
   - Add signers
   - Sequential/Parallel order
   - Assign fields
   - Send invitations
   - Tests

6. **Audit Trail & Timeline** (Week 5)
   - Event tracking
   - Timeline display
   - Real-time updates
   - Tests

7. **Document Management** (Week 6)
   - List/search/filter
   - Status tracking
   - Tests

### P3 - Admin & Polish (Week 7)
8. **Admin Dashboard** (Week 7 - simplified)
   - Metrics display (total users, documents, pending signatures)
   - Date range filters
   - Polling for real-time updates
   - Tests

9. **Polish & Optimization** (Week 7)
   - Performance optimization
   - Accessibility audit
   - i18n completeness
   - Error handling polish

## Testing Strategy

### Unit Tests (70% coverage target)
- Components: Render, props, user interactions
- Hooks: State changes, side effects
- Utils: Pure functions, validators, helpers

### Integration Tests
- Auth flow: Register → Login → Logout
- Signature creation: Draw → Preview → Save
- Document workflow: Upload → Place fields → Save draft
- Signing flow: Open room → Fill fields → Complete
- Invite flow: Add signers → Assign → Send

### E2E Critical Paths (Manual + Optional Automation)
- Complete document signing journey
- Multi-party signing (sequential & parallel)
- Admin user management

### MSW Mock Handlers
- All API endpoints mocked
- Success + error scenarios
- Edge cases (network failures, validation errors)

## Deployment & DevOps

**Out of Scope for /speckit.plan** - Assume CI/CD already exists

- Build: `npm run build` → dist/
- Preview: `npm run preview`
- Type check: `npm run type-check`
- Lint: `npm run lint`
- Test: `npm run test`
- Format: `npm run format`

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| PDF rendering performance với large docs | High | Lazy load pages, virtualization, research đã identify best lib |
| Drag-drop UX complexity trên mobile | Medium | Touch-optimized controls, research đã evaluate touch-friendly libs |
| Real-time updates reliability | Medium | Polling fallback nếu WebSocket không khả dụng |
| Browser compatibility với Canvas API | Low | Polyfills, modern browser requirement |
| i18n bundle size | Low | Lazy loading translations, tree-shaking |
| Test coverage cho complex interactions | Medium | Prioritize critical flows, MSW coverage đầy đủ |

## Next Steps

1. ✅ **Phase 0**: Complete research.md (all technical decisions documented)
2. ✅ **Phase 1**: Generate design artifacts:
   - data-model.md
   - contracts/ directory with API specs
   - quickstart.md
3. ⏭️ **Phase 2**: Run `/speckit.tasks` to generate implementation task breakdown
4. 🚀 **Implementation**: Start với P1 modules theo priority order

---

**Plan Status**: ✅ READY FOR PHASE 0 & 1 GENERATION

Constitution compliance verified ✅  
All prerequisites met ✅  
Structure defined ✅  
Ready to generate research and design artifacts ✅
