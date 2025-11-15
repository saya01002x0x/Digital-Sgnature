# Documents Module

**Module Quản Lý Tài Liệu và Field Placement**

Module này cho phép người dùng upload tài liệu PDF, xem preview, và đặt các trường ký (fields) lên tài liệu để chuẩn bị cho quá trình ký điện tử.

## 📁 Cấu trúc

```
documents/
├── pages/                      # Document pages
│   └── DocumentEditorPage.tsx  # Page chỉnh sửa tài liệu
├── components/                 # Document components
│   ├── DocumentUpload.tsx      # Upload PDF file
│   ├── PDFViewer.tsx           # Hiển thị PDF
│   ├── FieldToolbar.tsx        # Toolbar field types
│   └── FieldOverlay.tsx        # Overlay fields trên PDF
├── hooks/                      # Custom hooks
│   ├── usePDFViewer.ts         # Hook quản lý PDF viewer
│   └── useFieldPlacement.ts    # Hook quản lý field placement
├── services/                   # API services
│   └── documents.api.ts        # RTK Query endpoints
├── types/                      # TypeScript types
│   └── index.ts                # Document, Field types
└── utils/                      # Utilities
    ├── fieldHelpers.ts         # Field positioning utilities
    └── pdfHelpers.ts           # PDF validation utilities
```

## ✨ Features

### Upload Tài Liệu

- ✅ **Drag & Drop Upload** - Kéo thả file PDF để upload
- ✅ **File Validation** - Kiểm tra định dạng và kích thước (max 10MB)
- ✅ **Auto Preview** - Tự động hiển thị sau khi upload

### PDF Viewer

- ✅ **Iframe Viewer** - Hiển thị PDF đơn giản với iframe
- ✅ **Zoom Controls** - Phóng to/thu nhỏ (50%-200%)
- ✅ **Fullscreen Mode** - Chế độ toàn màn hình
- ✅ **Page Count Display** - Hiển thị số trang

### Field Management

- ✅ **4 Field Types**: Signature, Initials, Date, Text
- ✅ **Click-to-Place** - Click field type → click vị trí trên PDF
- ✅ **Visual Overlay** - Hiển thị fields với màu sắc phân biệt
- ✅ **Delete Fields** - Xóa field với confirmation
- ✅ **Position Management** - Vị trí relative (%) cho responsive

### Field Types

1. **Signature** (Chữ ký) - Màu xanh dương (#1890ff)
2. **Initials** (Ký tắt) - Màu xanh lá (#52c41a)
3. **Date** (Ngày tháng) - Màu cam (#fa8c16)
4. **Text** (Văn bản) - Màu tím (#722ed1)

## 🔧 Usage

### DocumentUpload Component

```typescript
import { DocumentUpload } from '@/features/documents/components';

function MyPage() {
  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
    // Upload logic
  };

  return <DocumentUpload onFileSelect={handleFileSelect} />;
}
```

### PDFViewer Component

```typescript
import { PDFViewer } from '@/features/documents/components';

function ViewPDF() {
  return (
    <PDFViewer
      fileUrl="https://example.com/document.pdf"
      pageCount={5}
      onLoad={() => console.log('PDF loaded')}
    />
  );
}
```

### Document Editor (Full Example)

```typescript
import { DocumentEditorPage } from '@/features/documents/pages';

// Route: /documents/editor/:id
// Tự động load document, hiển thị PDF, cho phép đặt fields
```

## 📝 Types

### Document

```typescript
type Document = {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: number;
  pageCount: number;
  status: DocumentStatus; // DRAFT | SIGNING | DONE | DECLINED
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Field

```typescript
type Field = {
  id: string;
  documentId: string;
  type: FieldType; // SIGNATURE | INITIALS | DATE | TEXT
  pageNumber: number;
  positionX: number; // % (0-100)
  positionY: number; // % (0-100)
  width: number; // % (0-100)
  height: number; // % (0-100)
  signerId?: string;
  value?: string;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🌐 i18n

Module hỗ trợ đa ngôn ngữ (vi/en):

- **English**: `public/locales/en/documents.json`
- **Vietnamese**: `public/locales/vi/documents.json`

## 🎨 UI/UX

- ✅ **Ant Design Components** - Consistent UI
- ✅ **Color-coded Fields** - Dễ phân biệt field types
- ✅ **Click-to-Place** - Đơn giản hơn drag-drop
- ✅ **Responsive** - Vị trí fields theo % để responsive
- ✅ **Visual Feedback** - Border, background color cho fields

## ⚙️ API Endpoints

- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents/:id` - Get document with fields
- `PATCH /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:documentId/fields` - Create field
- `PATCH /api/documents/fields/:id` - Update field
- `DELETE /api/documents/fields/:id` - Delete field

## 🔐 Security

- ✅ **File Validation** - Chỉ cho phép PDF, max 10MB
- ✅ **Auth Required** - Tất cả endpoints cần authentication
- ✅ **User Isolation** - User chỉ thấy documents của mình
- ✅ **Status Lock** - Không edit khi status != DRAFT

## 🎯 User Stories Covered

**US2 - Tải lên và chuẩn bị tài liệu (P1 - MVP)**

- [X] FR-006: Upload PDF file
- [X] FR-007: View PDF preview
- [X] FR-008: Place signature fields
- [X] FR-009: Place date/text fields
- [X] FR-010: Resize and position fields
- [X] FR-011: Delete fields

## ⚠️ Limitations

- **PDF Viewer**: Sử dụng iframe đơn giản, không có advanced features như react-pdf
- **Field Placement**: Click-to-place thay vì drag-drop phức tạp
- **No Resize**: Fields không có resize handles (có thể thêm sau)
- **Single Page View**: Chỉ hiển thị 1 page (có thể cải thiện với multi-page view)

## 🚀 Next Steps

Module documents đã hoàn thành core features. Tiếp theo cần:
- Phase 6 (US4): Signing Room - để signers ký documents
- Phase 7 (US3): Invite Workflow - để mời signers
- Phase 8 (US6): Document List/Search - quản lý documents

## 📚 Related Documentation

- [Spec](../../../../specs/001-fe-esignature-app/spec.md)
- [Plan](../../../../specs/001-fe-esignature-app/plan.md)
- [Data Model](../../../../specs/001-fe-esignature-app/data-model.md)
- [Documents API Contract](../../../../specs/001-fe-esignature-app/contracts/documents-api.json)
- [Tasks](../../../../specs/001-fe-esignature-app/tasks.md)

