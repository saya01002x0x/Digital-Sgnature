# Tasks: FE-only E-Signature Web Application

**Input**: Design documents from `/specs/001-fe-esignature-app/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tasks include comprehensive test coverage per constitution requirement (Vitest + RTL + MSW, 70% coverage target)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend-only SPA**: `digital-signature-front-end/src/`
- **Feature modules**: `src/features/{module}/`
- **Tests**: `src/features/{module}/__tests__/`
- **MSW mocks**: `src/mocks/features/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify project structure matches plan.md (src/app, src/features, src/shared, src/mocks)
- [X] T002 [P] Configure absolute imports (@/) in tsconfig.json and vite.config.ts
- [X] T003 [P] Setup i18n configuration in src/i18n/i18n.ts (vi/en namespaces)
- [X] T004 [P] Create base translation files in public/locales/en/ and public/locales/vi/ (common.json for each)
- [X] T005 [P] Configure Ant Design theme in src/app/providers/ThemeProvider.tsx (light/dark mode)
- [X] T006 [P] Setup Tailwind CSS integration in tailwind.config.js (sync colors with Ant Design)
- [X] T007 [P] Configure MSW browser worker in src/mocks/browser.ts
- [X] T008 [P] Configure MSW server for tests in src/mocks/server.ts
- [X] T009 Create base API configuration in src/app/api/baseApi.ts (RTK Query baseQuery with auth interceptor)
- [X] T010 [P] Define base API types in src/app/api/baseTypes.ts (ApiResponse, ApiError interfaces)
- [X] T011 Configure Redux store in src/app/store.ts (setup middleware, devtools)
- [X] T012 [P] Create typed Redux hooks in src/app/hooks.ts (useAppDispatch, useAppSelector)
- [X] T013 [P] Setup React Router configuration skeleton in src/app/routes.tsx (public/protected route structure)
- [X] T014 [P] Create environment configuration in src/app/config/env.ts (VITE_API_BASE_URL, validation)
- [X] T015 [P] Define app constants in src/app/config/constants.ts (API endpoints base, timeout values)

**Checkpoint**: ✅ Project infrastructure ready for feature module development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T016 Create AppProviders wrapper in src/app/providers/AppProviders.tsx (Redux, Router, Theme, i18n, Error Boundary)
- [X] T017 [P] Implement ErrorBoundary component in src/shared/components/ErrorBoundary.tsx (catch React errors)
- [X] T018 [P] Create LoadingSpinner component in src/shared/components/LoadingSpinner.tsx (reusable loading state)
- [X] T019 [P] Create SkeletonLoader component in src/shared/components/SkeletonLoader.tsx (Ant Design Skeleton wrapper)
- [X] T020 [P] Create EmptyState component in src/shared/components/EmptyState.tsx (no data placeholder)
- [X] T021 [P] Implement LanguageSwitcher component in src/shared/components/LanguageSwitcher.tsx (vi/en toggle)
- [X] T022 [P] Implement ThemeSwitcher component in src/shared/components/ThemeSwitcher.tsx (light/dark toggle)
- [X] T023 [P] Create useDebounce hook in src/shared/hooks/useDebounce.ts (delay input handling)
- [X] T024 [P] Create useLocalStorage hook in src/shared/hooks/useLocalStorage.ts (persist theme/language)
- [X] T025 [P] Create useMediaQuery hook in src/shared/hooks/useMediaQuery.ts (responsive breakpoints)
- [X] T026 [P] Define common TypeScript types in src/shared/types/index.ts (Theme, Language, etc.)
- [X] T027 [P] Create common Zod validators in src/shared/utils/validators.ts (email, password schemas)
- [X] T028 [P] Create format utilities in src/shared/utils/formatters.ts (date, currency, file size)
- [X] T029 [P] Create API helper utilities in src/shared/utils/apiHelpers.ts (error transformation)
- [X] T030 Create test utilities in tests/utils/test-utils.tsx (custom render with all providers)
- [X] T031 Setup MSW handlers registry in src/mocks/handlers.ts (import all feature handlers)

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 7 - Đăng ký và xác thực người dùng (Priority: P1) 🎯 MVP Foundation

**Goal**: Người dùng có thể đăng ký tài khoản, đăng nhập/đăng xuất, reset mật khẩu, và quản lý profile. Đây là prerequisite cho tất cả user stories khác.

**Independent Test**: Có thể test flow hoàn chỉnh: Register → Login → View Profile → Update Profile → Logout mà không cần features khác.

### Implementation for User Story 7 (Auth Module)

**Module Structure**:

- [X] T032 [P] [US7] Create auth module directory structure (pages, components, hooks, services, types, utils, __tests__)

**Types & Validation**:

- [X] T033 [P] [US7] Define auth types in src/features/auth/types/index.ts (User, LoginRequest, RegisterRequest, UserRole enum)
- [X] T034 [P] [US7] Create auth validation schemas in src/features/auth/utils/validators.ts (loginSchema, registerSchema with Zod)

**API Service (RTK Query)**:

- [X] T035 [US7] Implement auth API service in src/features/auth/services/auth.api.ts (register, login, logout, getProfile, updateProfile, forgotPassword, resetPassword endpoints)

**Redux State**:

- [X] T036 [US7] Create auth slice in src/features/auth/authSlice.ts (user state, isAuthenticated, setUser, logout actions)

**Components**:

- [X] T037 [P] [US7] Create LoginForm component in src/features/auth/components/LoginForm.tsx (React Hook Form + Zod validation)
- [X] T038 [P] [US7] Create RegisterForm component in src/features/auth/components/RegisterForm.tsx (React Hook Form + Zod validation)
- [X] T039 [P] [US7] Create ProfileForm component in src/features/auth/components/ProfileForm.tsx (update name, avatar)

**Pages**:

- [X] T040 [P] [US7] Create LoginPage in src/features/auth/pages/LoginPage.tsx (use LoginForm, redirect after success)
- [X] T041 [P] [US7] Create RegisterPage in src/features/auth/pages/RegisterPage.tsx (use RegisterForm, redirect to login)
- [X] T042 [P] [US7] Create ForgotPasswordPage in src/features/auth/pages/ForgotPasswordPage.tsx (email input, send reset link)
- [X] T043 [P] [US7] Create ProfilePage in src/features/auth/pages/ProfilePage.tsx (display user info, use ProfileForm)

**Hooks**:

- [X] T044 [US7] Create useAuth hook in src/features/auth/hooks/useAuth.ts (access user, isAuthenticated from Redux)
- [X] T045 [US7] Create useAuthGuard hook in src/features/auth/hooks/useAuthGuard.ts (redirect if not authenticated)

**Routes**:

- [X] T046 [US7] Add auth routes to src/app/routes.tsx (/login, /register, /forgot-password, /profile protected)

**MSW Mocks**:

- [X] T047 [P] [US7] Create auth MSW handlers in src/mocks/features/auth.handlers.ts (mock all auth endpoints)

**Tests**:

- [X] T048 [P] [US7] Unit test LoginForm in src/features/auth/components/__tests__/LoginForm.test.tsx (render, validation, submit)
- [X] T049 [P] [US7] Unit test RegisterForm in src/features/auth/components/__tests__/RegisterForm.test.tsx (render, validation, submit)
- [X] T050 [P] [US7] Unit test useAuth hook in src/features/auth/hooks/__tests__/useAuth.test.ts (mock Redux)
- [X] T051 [US7] Integration test auth flow in src/features/auth/__tests__/authFlow.test.tsx (register → login → logout with MSW)

**i18n**:

- [X] T052 [P] [US7] Add auth translations to public/locales/en/auth.json (login, register, profile labels/errors)
- [X] T053 [P] [US7] Add auth translations to public/locales/vi/auth.json (Vietnamese translations)

**Checkpoint**: User authentication flow complete - users can register, login, manage profile, logout. All other user stories depend on this.

---

## Phase 4: User Story 1 - Tạo và quản lý chữ ký cá nhân (Priority: P1)

**Goal**: Người dùng có thể tạo chữ ký (vẽ tay hoặc gõ), lưu nhiều mẫu, đặt mặc định, xem trước.

**Independent Test**: User đã login có thể tạo signature → xem preview → lưu → đặt default → sử dụng trong tài liệu sau.

### Implementation for User Story 1 (Signature Module)

**Module Structure**:

- [ ] T054 [P] [US1] Create signature module directory structure (pages, components, hooks, services, types, utils, __tests__)

**Types**:

- [ ] T055 [P] [US1] Define signature types in src/features/signature/types/index.ts (Signature, SignatureType enum, CreateSignatureRequest)

**API Service**:

- [ ] T056 [US1] Implement signature API service in src/features/signature/services/signature.api.ts (listSignatures, createSignature, getSignature, updateSignature, deleteSignature, setDefault)

**Components**:

- [ ] T057 [P] [US1] Create SignatureCanvas component in src/features/signature/components/SignatureCanvas.tsx (draw mode using react-signature-canvas)
- [ ] T058 [P] [US1] Create SignatureTyped component in src/features/signature/components/SignatureTyped.tsx (type mode with font selection)
- [ ] T059 [P] [US1] Create SignaturePreview component in src/features/signature/components/SignaturePreview.tsx (display signature image)
- [ ] T060 [P] [US1] Create SignatureSelector component in src/features/signature/components/SignatureSelector.tsx (select from saved signatures)

**Hooks**:

- [ ] T061 [US1] Create useSignature hook in src/features/signature/hooks/useSignature.ts (fetch signatures, create, delete, set default)
- [ ] T062 [US1] Create useSignatureCanvas hook in src/features/signature/hooks/useSignatureCanvas.ts (canvas ref management, clear, save)

**Pages**:

- [ ] T063 [US1] Create SignatureListPage in src/features/signature/pages/SignatureListPage.tsx (list all signatures, delete, set default actions)
- [ ] T064 [US1] Create CreateSignaturePage in src/features/signature/pages/CreateSignaturePage.tsx (tabs for draw/type modes, save signature)

**Utilities**:

- [ ] T065 [P] [US1] Create signature helpers in src/features/signature/utils/signatureHelpers.ts (validate image data, convert formats)

**Routes**:

- [ ] T066 [US1] Add signature routes to src/app/routes.tsx (/signatures, /signatures/create protected)

**MSW Mocks**:

- [ ] T067 [P] [US1] Create signature MSW handlers in src/mocks/features/signature.handlers.ts (mock all signature endpoints)

**Tests**:

- [ ] T068 [P] [US1] Unit test SignatureCanvas in src/features/signature/components/__tests__/SignatureCanvas.test.tsx (render, draw simulation, clear, save)
- [ ] T069 [P] [US1] Unit test SignatureTyped in src/features/signature/components/__tests__/SignatureTyped.test.tsx (type input, font selection)
- [ ] T070 [P] [US1] Unit test useSignature hook in src/features/signature/hooks/__tests__/useSignature.test.ts (mock RTK Query)
- [ ] T071 [US1] Integration test signature creation flow in src/features/signature/__tests__/signatureFlow.test.tsx (create draw → save → set default with MSW)

**i18n**:

- [ ] T072 [P] [US1] Add signature translations to public/locales/en/signature.json
- [ ] T073 [P] [US1] Add signature translations to public/locales/vi/signature.json

**Checkpoint**: Signature management complete - users can create, manage, and set default signatures.

---

## Phase 5: User Story 2 - Tải lên và chuẩn bị tài liệu (Priority: P1)

**Goal**: Người dùng có thể upload PDF, xem preview đa trang, đặt các trường ký (signature/initials/date/text) bằng drag-drop, chỉnh kích thước và vị trí fields.

**Independent Test**: User upload PDF → view in editor → place fields on pages → resize/reposition → save draft.

### Implementation for User Story 2 (Documents Module - Upload & Editor)

**Module Structure**:

- [ ] T074 [P] [US2] Create documents module directory structure (pages, components, hooks, services, types, utils, __tests__)

**Types**:

- [ ] T075 [P] [US2] Define document types in src/features/documents/types/index.ts (Document, DocumentStatus enum, Field, FieldType enum)

**API Service**:

- [ ] T076 [US2] Implement documents API service in src/features/documents/services/documents.api.ts (listDocuments, uploadDocument, getDocument, updateDocument, deleteDocument, createField, updateField, deleteField endpoints)

**Components - PDF Viewer**:

- [ ] T077 [US2] Create PDFViewer component in src/features/documents/components/PDFViewer.tsx (using react-pdf, render all pages, zoom controls)
- [ ] T078 [US2] Implement usePDFViewer hook in src/features/documents/hooks/usePDFViewer.ts (page count, zoom state, loading)

**Components - Field Management**:

- [ ] T079 [P] [US2] Create FieldToolbar component in src/features/documents/components/FieldToolbar.tsx (draggable field type buttons using dnd-kit)
- [ ] T080 [US2] Create FieldOverlay component in src/features/documents/components/FieldOverlay.tsx (droppable area on PDF, render positioned fields, resize handles)
- [ ] T081 [US2] Implement useFieldPlacement hook in src/features/documents/hooks/useFieldPlacement.ts (dnd-kit integration, calculate positions, save fields)

**Components - Upload**:

- [ ] T082 [P] [US2] Create DocumentUpload component in src/features/documents/components/DocumentUpload.tsx (file input, drag-drop zone, validation)

**Pages**:

- [ ] T083 [US2] Create DocumentEditorPage in src/features/documents/pages/DocumentEditorPage.tsx (PDF viewer + field toolbar + overlay, save draft)

**Utilities**:

- [ ] T084 [P] [US2] Create field helpers in src/features/documents/utils/fieldHelpers.ts (position to percentage, percentage to pixels, validate field placement)
- [ ] T085 [P] [US2] Create PDF helpers in src/features/documents/utils/pdfHelpers.ts (validate PDF file, extract page count)

**Routes**:

- [ ] T086 [US2] Add document editor route to src/app/routes.tsx (/documents/editor/:id protected)

**MSW Mocks**:

- [ ] T087 [P] [US2] Create documents MSW handlers in src/mocks/features/documents.handlers.ts (upload, fields CRUD)

**Tests**:

- [ ] T088 [P] [US2] Unit test DocumentUpload in src/features/documents/components/__tests__/DocumentUpload.test.tsx (file selection, drag-drop, validation)
- [ ] T089 [P] [US2] Unit test FieldToolbar in src/features/documents/components/__tests__/FieldToolbar.test.tsx (render field types, draggable)
- [ ] T090 [P] [US2] Unit test FieldOverlay in src/features/documents/components/__tests__/FieldOverlay.test.tsx (drop field, resize, delete)
- [ ] T091 [US2] Integration test document editor flow in src/features/documents/__tests__/editorFlow.test.tsx (upload → place fields → save with MSW)

**i18n**:

- [ ] T092 [P] [US2] Add documents translations to public/locales/en/documents.json (upload, editor labels)
- [ ] T093 [P] [US2] Add documents translations to public/locales/vi/documents.json

**Checkpoint**: Document upload & editor complete - users can upload PDFs and prepare them for signing.

---

## Phase 6: User Story 4 - Người ký hoàn tất ký tài liệu (Priority: P1)

**Goal**: Người ký nhận link, mở Signing Room, xem tài liệu với các trường được assign cho họ, điền/ký các trường, submit hoặc decline.

**Independent Test**: Tạo signing link với document có sẵn → mở link (public access) → fill fields → complete signing hoặc decline.

### Implementation for User Story 4 (Invite-Signing Module - Signing Room)

**Module Structure**:

- [ ] T094 [P] [US4] Create invite-signing module directory structure (pages, components, hooks, services, types, utils, __tests__)

**Types**:

- [ ] T095 [P] [US4] Define invite-signing types in src/features/invite-signing/types/index.ts (Signer, SignerStatus enum, SigningSession, SigningCompleteRequest, DeclineRequest)

**API Service**:

- [ ] T096 [US4] Implement invite-signing API service in src/features/invite-signing/services/invite-signing.api.ts (getSigningSession, completeSigning, declineSigning public endpoints)

**Components**:

- [ ] T097 [P] [US4] Create SigningView component in src/features/invite-signing/components/SigningView.tsx (PDF viewer read-only + fields overlay for signer)
- [ ] T098 [P] [US4] Create DeclineDialog component in src/features/invite-signing/components/DeclineDialog.tsx (modal with reason input)
- [ ] T099 [P] [US4] Create CompleteDialog component in src/features/invite-signing/components/CompleteDialog.tsx (confirmation modal)

**Hooks**:

- [ ] T100 [US4] Create useSigning hook in src/features/invite-signing/hooks/useSigning.ts (fetch session, fill fields, submit, decline)

**Pages**:

- [ ] T101 [US4] Create SigningRoomPage in src/features/invite-signing/pages/SigningRoomPage.tsx (public route, token from URL param, display signing view, complete/decline actions)

**Routes**:

- [ ] T102 [US4] Add signing room route to src/app/routes.tsx (/signing/:token public route)

**MSW Mocks**:

- [ ] T103 [P] [US4] Create invite-signing MSW handlers in src/mocks/features/invite-signing.handlers.ts (getSigningSession, completeSigning, declineSigning)

**Tests**:

- [ ] T104 [P] [US4] Unit test SigningView in src/features/invite-signing/components/__tests__/SigningView.test.tsx (render PDF, fields, fill signature)
- [ ] T105 [P] [US4] Unit test DeclineDialog in src/features/invite-signing/components/__tests__/DeclineDialog.test.tsx (open, input reason, submit)
- [ ] T106 [US4] Integration test signing flow in src/features/invite-signing/__tests__/signingFlow.test.tsx (open room → fill → complete with MSW)

**i18n**:

- [ ] T107 [P] [US4] Add invite-signing translations to public/locales/en/invite-signing.json (signing room, complete, decline labels)
- [ ] T108 [P] [US4] Add invite-signing translations to public/locales/vi/invite-signing.json

**Checkpoint**: Signing room complete - signers can sign documents without needing an account.

---

## Phase 7: User Story 3 - Mời người ký (Priority: P2)

**Goal**: Người tạo tài liệu có thể mời nhiều người ký, chọn thứ tự (sequential/parallel), assign fields cho từng signer, gửi invitations.

**Independent Test**: Document đã có fields → add signers → assign fields → send invitations → verify người ký nhận được access.

### Implementation for User Story 3 (Invite-Signing Module - Invite Workflow)

**Components**:

- [ ] T109 [P] [US3] Create InviteForm component in src/features/invite-signing/components/InviteForm.tsx (add signers, sequential/parallel selector)
- [ ] T110 [P] [US3] Create SignerList component in src/features/invite-signing/components/SignerList.tsx (display signers with order, status)
- [ ] T111 [P] [US3] Create OrderSelector component in src/features/invite-signing/components/OrderSelector.tsx (radio: Sequential/Parallel)
- [ ] T112 [P] [US3] Create FieldAssignment component in src/features/invite-signing/components/FieldAssignment.tsx (assign fields to signers, color-coding)

**Hooks**:

- [ ] T113 [US3] Create useInvite hook in src/features/invite-signing/hooks/useInvite.ts (add signers, validate unique emails, send invitations)

**Pages**:

- [ ] T114 [US3] Create InviteSignersPage in src/features/invite-signing/pages/InviteSignersPage.tsx (from document editor, invite form, field assignment, send)

**API Service (extend)**:

- [ ] T115 [US3] Add inviteSigners endpoint to src/features/invite-signing/services/invite-signing.api.ts (inviteSigners mutation)

**Routes**:

- [ ] T116 [US3] Add invite route to src/app/routes.tsx (/documents/:id/invite protected)

**MSW Mocks (extend)**:

- [ ] T117 [P] [US3] Add inviteSigners mock handler to src/mocks/features/invite-signing.handlers.ts

**Tests**:

- [ ] T118 [P] [US3] Unit test InviteForm in src/features/invite-signing/components/__tests__/InviteForm.test.tsx (add signers, validate duplicate emails)
- [ ] T119 [P] [US3] Unit test FieldAssignment in src/features/invite-signing/components/__tests__/FieldAssignment.test.tsx (assign fields, color coding)
- [ ] T120 [US3] Integration test invite flow in src/features/invite-signing/__tests__/inviteFlow.test.tsx (add signers → assign → send with MSW)

**i18n (extend)**:

- [ ] T121 [P] [US3] Add invite workflow translations to public/locales/en/invite-signing.json
- [ ] T122 [P] [US3] Add invite workflow translations to public/locales/vi/invite-signing.json

**Checkpoint**: Invite workflow complete - document owners can invite signers and manage signing workflow.

---

## Phase 8: User Story 6 - Quản lý và tìm kiếm tài liệu (Priority: P2)

**Goal**: Người dùng có thể xem danh sách tài liệu, lọc theo trạng thái, tìm kiếm theo tên, sắp xếp theo ngày.

**Independent Test**: User có nhiều documents → view list → filter by status → search by name → sort by date.

### Implementation for User Story 6 (Documents Module - List & Search)

**Components**:

- [ ] T123 [P] [US6] Create DocumentList component in src/features/documents/components/DocumentList.tsx (Ant Design Table with pagination)
- [ ] T124 [P] [US6] Create DocumentFilters component in src/features/documents/components/DocumentFilters.tsx (status dropdown, search input, sort selector)
- [ ] T125 [P] [US6] Create StatusBadge component in src/features/documents/components/StatusBadge.tsx (color-coded status badges)

**Hooks**:

- [ ] T126 [US6] Create useDocuments hook in src/features/documents/hooks/useDocuments.ts (list with filters, search, sort, pagination)

**Pages**:

- [ ] T127 [US6] Create DocumentListPage in src/features/documents/pages/DocumentListPage.tsx (filters + list, navigate to details)

**Routes**:

- [ ] T128 [US6] Add documents list route to src/app/routes.tsx (/documents protected)

**MSW Mocks (extend)**:

- [ ] T129 [P] [US6] Extend documents handlers in src/mocks/features/documents.handlers.ts (list with query params)

**Tests**:

- [ ] T130 [P] [US6] Unit test DocumentFilters in src/features/documents/components/__tests__/DocumentFilters.test.tsx (change filters, search input)
- [ ] T131 [P] [US6] Unit test DocumentList in src/features/documents/components/__tests__/DocumentList.test.tsx (render rows, pagination)
- [ ] T132 [US6] Integration test document list flow in src/features/documents/__tests__/listFlow.test.tsx (filters → search → results with MSW)

**i18n (extend)**:

- [ ] T133 [P] [US6] Add document list translations to public/locales/en/documents.json (filters, statuses)
- [ ] T134 [P] [US6] Add document list translations to public/locales/vi/documents.json

**Checkpoint**: Document management complete - users can efficiently find and manage their documents.

---

## Phase 9: User Story 5 - Xem trạng thái và audit trail (Priority: P2)

**Goal**: Người dùng có thể xem chi tiết document với timeline events (created, sent, opened, signed, declined), status updates real-time.

**Independent Test**: Open document detail → view timeline → see events chronologically (newest first) → observe real-time updates.

### Implementation for User Story 5 (Documents Module - Timeline & Audit)

**Components**:

- [ ] T135 [US5] Create Timeline component in src/features/documents/components/Timeline.tsx (Ant Design Timeline, display AuditEvents newest-first)

**API Service (extend)**:

- [ ] T136 [US5] Add getTimeline endpoint to src/features/documents/services/documents.api.ts (getDocumentTimeline query with polling)

**Pages**:

- [ ] T137 [US5] Create DocumentDetailPage in src/features/documents/pages/DocumentDetailPage.tsx (document info + timeline + signers status)

**Routes**:

- [ ] T138 [US5] Add document detail route to src/app/routes.tsx (/documents/:id protected)

**MSW Mocks (extend)**:

- [ ] T139 [P] [US5] Add getTimeline mock handler to src/mocks/features/documents.handlers.ts

**Tests**:

- [ ] T140 [P] [US5] Unit test Timeline in src/features/documents/components/__tests__/Timeline.test.tsx (render events, newest first order)
- [ ] T141 [US5] Integration test document detail with timeline in src/features/documents/__tests__/detailFlow.test.tsx (fetch document + timeline with MSW, polling simulation)

**i18n (extend)**:

- [ ] T142 [P] [US5] Add timeline/audit translations to public/locales/en/documents.json (event types)
- [ ] T143 [P] [US5] Add timeline/audit translations to public/locales/vi/documents.json

**Checkpoint**: Audit trail complete - users can track document lifecycle and events.

---

## Phase 10: User Story 8 - Admin Dashboard cơ bản (Priority: P3)

**Goal**: Admin có thể xem platform-wide metrics (total users, documents, pending signatures), filter by date range.

**Independent Test**: Admin login → access dashboard → view metrics → change date filter → metrics update.

### Implementation for User Story 8 (Admin Module - Simplified Dashboard)

**Module Structure**:

- [ ] T144 [P] [US8] Create admin module directory structure (pages, components, hooks, services, types, utils, __tests__)

**Types**:

- [ ] T145 [P] [US8] Define admin types in src/features/admin/types/index.ts (AdminMetrics interface)

**API Service**:

- [ ] T146 [US8] Implement admin API service in src/features/admin/services/admin.api.ts (getMetrics query with polling)

**Components**:

- [ ] T147 [P] [US8] Create MetricsCard component in src/features/admin/components/MetricsCard.tsx (display single metric with icon)
- [ ] T148 [P] [US8] Create MetricsSummary component in src/features/admin/components/MetricsSummary.tsx (grid of MetricsCards)
- [ ] T149 [P] [US8] Create DateRangeFilter component in src/features/admin/components/DateRangeFilter.tsx (Ant Design DatePicker range or quick filters)

**Hooks**:

- [ ] T150 [US8] Create useAdminMetrics hook in src/features/admin/hooks/useAdminMetrics.ts (fetch metrics, date range state)

**Pages**:

- [ ] T151 [US8] Create DashboardPage in src/features/admin/pages/DashboardPage.tsx (Admin only, metrics summary + date filter)

**Utilities**:

- [ ] T152 [P] [US8] Create metrics helpers in src/features/admin/utils/metricsHelpers.ts (format numbers, calculate percentages)

**Routes**:

- [ ] T153 [US8] Add admin dashboard route to src/app/routes.tsx (/admin protected, role guard Admin only)

**MSW Mocks**:

- [ ] T154 [P] [US8] Create admin MSW handlers in src/mocks/features/admin.handlers.ts (getMetrics with query params)

**Tests**:

- [ ] T155 [P] [US8] Unit test MetricsCard in src/features/admin/components/__tests__/MetricsCard.test.tsx (render metric value)
- [ ] T156 [P] [US8] Unit test DateRangeFilter in src/features/admin/components/__tests__/DateRangeFilter.test.tsx (change date range)
- [ ] T157 [US8] Integration test admin dashboard in src/features/admin/__tests__/dashboardFlow.test.tsx (fetch metrics → change filter with MSW)

**i18n**:

- [ ] T158 [P] [US8] Add admin translations to public/locales/en/admin.json (metrics labels, dashboard)
- [ ] T159 [P] [US8] Add admin translations to public/locales/vi/admin.json

**Checkpoint**: Admin dashboard complete - admin can monitor platform usage.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories or overall app quality

### Accessibility

- [ ] T160 [P] Add ARIA labels to all interactive elements across features (buttons, inputs, links)
- [ ] T161 [P] Implement keyboard navigation for PDF viewer (arrow keys, tab navigation)
- [ ] T162 [P] Add keyboard navigation for field placement (arrow keys to move fields)
- [ ] T163 [P] Implement focus management in modals/drawers across all features
- [ ] T164 [P] Add screen reader announcements for status changes (document status, signing completion)

### Performance Optimization

- [ ] T165 [P] Implement lazy loading for PDF pages in PDFViewer component (virtualization)
- [ ] T166 [P] Add code splitting for routes in src/app/routes.tsx (React.lazy for page components)
- [ ] T167 [P] Optimize bundle size - analyze with vite-bundle-visualizer and tree-shake unused code
- [ ] T168 [P] Add memoization to expensive components (React.memo for signature preview, field overlays)
- [ ] T169 [P] Implement image optimization for signature thumbnails (compress, resize on upload)

### Error Handling

- [ ] T170 [P] Add comprehensive error boundaries for each feature module (catch and display user-friendly errors)
- [ ] T171 [P] Implement retry logic for failed API calls in RTK Query base config
- [ ] T172 [P] Add error logging to console (development) and error tracking service (production)
- [ ] T173 [P] Create user-friendly error pages (404, 500, network error)

### Testing Coverage

- [ ] T174 [P] Add accessibility tests using jest-axe for key components (forms, modals, PDF viewer)
- [ ] T175 [P] Add E2E critical path test (manual or Playwright): full document signing journey
- [ ] T176 [P] Add visual regression tests for key UI components (optional, using Chromatic or Percy)
- [ ] T177 Run coverage report and ensure 70%+ coverage target: `npm run test -- --coverage`

### Documentation

- [ ] T178 [P] Update README.md with project overview, setup instructions, architecture summary
- [ ] T179 [P] Document API contracts in contracts/ files (ensure up-to-date with implementation)
- [ ] T180 [P] Add inline JSDoc comments to public APIs (hooks, utilities, shared components)
- [ ] T181 [P] Create module-level README for each feature (auth, signature, documents, invite-signing, admin)

### Security Hardening

- [ ] T182 [P] Implement XSS prevention - sanitize all user inputs (signature names, document titles, decline reasons)
- [ ] T183 [P] Add CSP headers configuration in vite.config.ts or deployment config
- [ ] T184 [P] Audit dependencies for vulnerabilities: `npm audit` and fix issues
- [ ] T185 [P] Ensure sensitive data not logged to console in production (check error handlers)

### i18n Completeness

- [ ] T186 [P] Audit all hardcoded English strings and migrate to translation files
- [ ] T187 [P] Verify Vietnamese translations completeness (all keys have vi translations)
- [ ] T188 [P] Test language switching across all pages (no missing translations)
- [ ] T189 [P] Add loading states for translation namespace loading (Suspense fallbacks)

### Final Validation

- [ ] T190 Run all quality gates: type-check, lint, format, test, build
- [ ] T191 Validate quickstart.md - follow setup instructions and verify app works
- [ ] T192 Smoke test all user stories independently (US1 → US2 → ... → US8)
- [ ] T193 Test app on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] T194 Test responsive design on mobile, tablet, desktop screen sizes
- [ ] T195 Verify theme switching (light/dark) works across all pages
- [ ] T196 Verify language switching (vi/en) works across all pages

**Final Checkpoint**: Application ready for deployment - all features complete, tested, polished.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion
- **User Story 7 - Auth (Phase 3)**: Depends on Foundational (Phase 2) - BLOCKS all other user stories (authentication required)
- **User Stories 1-6, 8 (Phases 4-10)**: All depend on Auth (Phase 3) completion
  - Can proceed in parallel after Auth is complete (if team capacity allows)
  - Recommended sequential order: US1 → US2 → US4 (P1 stories) → US3 → US6 → US5 (P2 stories) → US8 (P3 story)
- **Polish (Phase 11)**: Depends on desired user stories completion

### User Story Dependencies

**Critical Path (P1 - Must Have for MVP)**:
- ✅ **Phase 3 (US7 - Auth)**: Foundation - BLOCKS all other stories
- ✅ **Phase 4 (US1 - Signatures)**: Independent after Auth
- ✅ **Phase 5 (US2 - Document Upload/Editor)**: Independent after Auth
- ✅ **Phase 6 (US4 - Signing Room)**: Requires documents & signatures concepts but can implement with mock data

**Secondary Features (P2 - Important but not blocking MVP)**:
- **Phase 7 (US3 - Invite Workflow)**: Requires US2 (document editor) to assign fields
- **Phase 8 (US6 - Document List)**: Independent after Auth, enhances document management
- **Phase 9 (US5 - Timeline/Audit)**: Independent after Auth, adds visibility

**Nice to Have (P3 - Can defer)**:
- **Phase 10 (US8 - Admin Dashboard)**: Independent after Auth, admin-only feature

### Parallel Opportunities

**Within Setup (Phase 1)**:
- All [P] tasks can run in parallel (T002-T015)

**Within Foundational (Phase 2)**:
- All [P] tasks can run in parallel (T017-T029)

**Across User Stories (after Auth complete)**:
- US1 (Signatures) + US2 (Documents) can be developed in parallel by different developers
- US4 (Signing Room) can start after US2 (needs document structure understanding)
- US3 (Invite) depends on US2 completion
- US5, US6, US8 are independent and can be done in any order

**Within Each User Story**:
- All [P] tasks within a story can run in parallel (e.g., all components marked [P])
- Tests can run in parallel (all marked [P])
- Follow dependency chain: Types → API Service → Components → Pages → Routes

**Example Parallel Execution (3 developers after Foundational complete)**:
- Developer A: Phase 3 (Auth) - blocks others initially
- After Auth done:
  - Developer A: Phase 4 (US1 - Signatures)
  - Developer B: Phase 5 (US2 - Documents)
  - Developer C: Phase 4 parallel tasks, then Phase 6 (US4 - Signing Room)

---

## Implementation Strategy

### MVP First (Minimum Viable Product)

**Goal**: Deliverable product with core signing capability

**Phases Required**:
1. ✅ Phase 1: Setup
2. ✅ Phase 2: Foundational
3. ✅ Phase 3: User Story 7 (Auth) - Login/Register/Profile
4. ✅ Phase 4: User Story 1 (Signatures) - Create & manage signatures
5. ✅ Phase 5: User Story 2 (Documents) - Upload & edit documents
6. ✅ Phase 6: User Story 4 (Signing Room) - Complete signing flow
7. ✅ Selected polish tasks (T160-T173: accessibility, error handling)

**MVP Scope Validation**:
- Can user register? ✅
- Can user create signature? ✅
- Can user upload PDF? ✅
- Can user place fields? ✅
- Can signer sign document? ✅
- End-to-end signing works? ✅

**MVP = Phases 1-6 complete** (~4 weeks with 2 developers)

### Incremental Delivery

**Release 1 (MVP)**: Phases 1-6 (Auth + Signature + Document + Signing)
- Deploy and gather user feedback
- Validate core workflow

**Release 2**: Add Phase 7 (US3 - Invite Workflow)
- Multi-party signing capability
- Deploy and test sequential/parallel signing

**Release 3**: Add Phase 8-9 (US6 - List/Search + US5 - Timeline)
- Enhanced document management
- Better visibility and tracking

**Release 4**: Add Phase 10 (US8 - Admin Dashboard) + remaining Polish
- Admin monitoring capabilities
- Final polish and optimization

### Parallel Team Strategy

**Team of 3 Developers**:

**Week 1-2**: All together
- Complete Phase 1 (Setup) - 2 days
- Complete Phase 2 (Foundational) - 3 days
- Complete Phase 3 (Auth) - 3 days (pair programming recommended)

**Week 3-4**: Parallel development
- Dev A: Phase 4 (US1 - Signatures) - 5 days
- Dev B: Phase 5 (US2 - Documents Upload/Editor) - 8 days
- Dev C: Help Dev A, then Phase 6 (US4 - Signing Room) - 5 days

**Week 5**: Integration & Testing
- Integrate US1 + US2 + US4
- Run full E2E tests
- Fix integration issues
- Polish (selected tasks from Phase 11)

**Week 6-7**: Secondary features (if needed)
- Dev A: Phase 7 (US3 - Invite Workflow)
- Dev B: Phase 8 (US6 - List/Search)
- Dev C: Phase 9 (US5 - Timeline)

**Week 7**: Final polish
- All: Phase 10 (Admin Dashboard) if needed
- All: Remaining polish tasks
- Final testing and deployment prep

---

## Task Summary

**Total Tasks**: 196

**Tasks by Phase**:
- Phase 1 (Setup): 15 tasks
- Phase 2 (Foundational): 16 tasks
- Phase 3 (US7 - Auth): 22 tasks
- Phase 4 (US1 - Signatures): 20 tasks
- Phase 5 (US2 - Documents Upload/Editor): 21 tasks
- Phase 6 (US4 - Signing Room): 15 tasks
- Phase 7 (US3 - Invite Workflow): 14 tasks
- Phase 8 (US6 - List/Search): 12 tasks
- Phase 9 (US5 - Timeline): 9 tasks
- Phase 10 (US8 - Admin Dashboard): 16 tasks
- Phase 11 (Polish): 36 tasks

**Parallel Tasks**: 108 tasks marked with [P] (55% can run in parallel)

**Testing Tasks**: 41 test tasks (21% of total) - comprehensive test coverage

**User Story Breakdown**:
- US7 (Auth): 22 tasks - Foundation
- US1 (Signatures): 20 tasks
- US2 (Documents): 21 tasks (upload/editor)
- US3 (Invite): 14 tasks
- US4 (Signing Room): 15 tasks
- US5 (Timeline): 9 tasks
- US6 (List/Search): 12 tasks
- US8 (Admin): 16 tasks

**MVP Tasks**: 94 tasks (Phases 1-6 + selected polish)

**Estimated Timeline**:
- MVP (Phases 1-6): 4 weeks (2 developers)
- Full Feature Set: 7 weeks (3 developers)

---

## Notes

- **[P] marker**: Task can run in parallel with other [P] tasks in same phase (different files, no blocking dependencies)
- **[Story] label**: Maps task to specific user story for traceability and independent testing
- **File paths**: Exact paths included in task descriptions for LLM executability
- **Test-first**: Constitution requires testing (Vitest + RTL + MSW), tests included for all features
- **Independent stories**: Each user story phase produces testable increment
- **Format validation**: All tasks follow `- [ ] [ID] [P?] [Story?] Description` format
- **Checkpoints**: Validate after each phase before proceeding
- **Constitution compliance**: Architecture follows module-first, RTK Query, security-first, testing, UX/accessibility principles

**Status**: ✅ **TASKS READY FOR EXECUTION**

Begin with Phase 1 (Setup) and proceed sequentially through phases, or parallelize user stories after Foundational phase complete!

