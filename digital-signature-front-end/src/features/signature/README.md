# Signature Module

**Module Quản Lý Chữ Ký Cá Nhân**

Module này cho phép người dùng tạo, quản lý, và sử dụng chữ ký cá nhân trong ứng dụng E-Signature. Hỗ trợ 2 loại chữ ký: vẽ tay (Draw) và nhập text (Type).

## 📁 Cấu trúc

```
signature/
├── pages/                      # Signature pages
│   ├── SignatureListPage.tsx   # Danh sách chữ ký
│   └── CreateSignaturePage.tsx # Tạo chữ ký mới
├── components/                 # Signature components
│   ├── SignatureCanvas.tsx     # Canvas vẽ chữ ký
│   ├── SignatureTyped.tsx      # Nhập text chữ ký
│   ├── SignaturePreview.tsx    # Preview chữ ký
│   └── SignatureSelector.tsx   # Chọn chữ ký
├── hooks/                      # Custom hooks
│   ├── useSignature.ts         # Hook quản lý signatures
│   └── useSignatureCanvas.ts   # Hook quản lý canvas
├── services/                   # API services
│   └── signature.api.ts        # RTK Query endpoints
├── types/                      # TypeScript types
│   └── index.ts                # Signature types & enums
└── utils/                      # Utilities
    └── signatureHelpers.ts     # Helper functions
```

## ✨ Features

### Tạo Chữ Ký

- ✅ **Draw Mode** - Vẽ chữ ký bằng canvas với pen color và size tuỳ chỉnh
- ✅ **Type Mode** - Nhập text và chọn font chữ đẹp (5 fonts chữ ký)
- ✅ **Preview** - Xem trước chữ ký trước khi lưu
- ✅ **Name** - Đặt tên cho chữ ký (optional)

### Quản Lý Chữ Ký

- ✅ **List Signatures** - Xem danh sách tất cả chữ ký đã tạo
- ✅ **Edit Name** - Sửa tên chữ ký
- ✅ **Delete** - Xóa chữ ký không cần thiết
- ✅ **Set Default** - Đặt chữ ký mặc định (only one default per user)

### Canvas Features

- ✅ **Touch Support** - Hỗ trợ vẽ trên thiết bị cảm ứng
- ✅ **Undo** - Hoàn tác nét vẽ
- ✅ **Clear** - Xóa toàn bộ canvas
- ✅ **Trim** - Tự động cắt bỏ khoảng trắng thừa
- ✅ **Export** - Xuất ra PNG data URL

## 🔧 Usage

### useSignature Hook

```typescript
import { useSignature } from '@/features/signature/hooks/useSignature';

function MyComponent() {
  const {
    signatures,
    defaultSignature,
    isLoading,
    createSignature,
    deleteSignature,
    setDefaultSignature,
  } = useSignature();

  const handleCreate = async () => {
    await createSignature({
      type: SignatureType.Draw,
      imageData: 'data:image/png;base64,...',
      name: 'My Signature',
    });
  };

  return <div>{/* UI */}</div>;
}
```

### SignatureCanvas Component

```typescript
import { SignatureCanvas } from '@/features/signature/components';

function CreateSignature() {
  const handleSave = (dataUrl: string) => {
    console.log('Signature data URL:', dataUrl);
    // Save to backend
  };

  return (
    <SignatureCanvas
      options={{
        width: 600,
        height: 200,
        backgroundColor: '#ffffff',
        penColor: '#000000',
      }}
      onSave={handleSave}
    />
  );
}
```

### SignatureTyped Component

```typescript
import { SignatureTyped } from '@/features/signature/components';

function CreateTypedSignature() {
  const handleSave = (dataUrl: string) => {
    console.log('Typed signature data URL:', dataUrl);
  };

  return <SignatureTyped onSave={handleSave} />;
}
```

### SignatureSelector Component

```typescript
import { SignatureSelector } from '@/features/signature/components';

function SelectSignature() {
  const [selectedId, setSelectedId] = useState('');

  const handleChange = (id: string, signature?: Signature) => {
    setSelectedId(id);
    console.log('Selected signature:', signature);
  };

  return (
    <SignatureSelector
      value={selectedId}
      onChange={handleChange}
      placeholder="Select your signature"
    />
  );
}
```

## 📝 Types

### Signature

```typescript
type Signature = {
  id: string;
  userId: string;
  type: SignatureType;
  imageData: string; // Base64 PNG data URL
  isDefault: boolean;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
```

### SignatureType

```typescript
enum SignatureType {
  Draw = 'DRAW',
  Type = 'TYPE',
}
```

## 🌐 i18n

Module hỗ trợ đa ngôn ngữ (vi/en):

- **English**: `public/locales/en/signature.json`
- **Vietnamese**: `public/locales/vi/signature.json`

## 🎨 UI/UX

- ✅ **Ant Design Components** - Consistent với app
- ✅ **Responsive** - Hoạt động tốt trên mobile, tablet, desktop
- ✅ **Touch-friendly** - Canvas hỗ trợ touch events
- ✅ **Loading States** - Skeleton, spinners cho async operations
- ✅ **Empty States** - Friendly messages khi chưa có data

## 🔐 Security

- ✅ **Authentication Required** - Tất cả routes protected
- ✅ **User Isolation** - Mỗi user chỉ thấy signatures của mình
- ✅ **Validation** - Zod schemas cho input validation
- ✅ **Data URL Validation** - Kiểm tra format và size

## 🎯 User Stories Covered

**US1 - Tạo và quản lý chữ ký cá nhân (P1 - MVP)**

- [X] FR-001: Tạo chữ ký bằng vẽ tay
- [X] FR-002: Tạo chữ ký bằng nhập text
- [X] FR-003: Xem preview chữ ký
- [X] FR-004: Lưu nhiều mẫu chữ ký
- [X] FR-005: Đặt chữ ký mặc định
- [X] FR-006: Sửa/xóa chữ ký

## 🚀 Next Steps

Module signature đã hoàn thành và sẵn sàng sử dụng. Có thể tích hợp vào Document Editor để sử dụng chữ ký trong tài liệu.

## 📚 Related Documentation

- [Spec](../../../../specs/001-fe-esignature-app/spec.md)
- [Plan](../../../../specs/001-fe-esignature-app/plan.md)
- [Data Model](../../../../specs/001-fe-esignature-app/data-model.md)
- [Signature API Contract](../../../../specs/001-fe-esignature-app/contracts/signature-api.json)
- [Tasks](../../../../specs/001-fe-esignature-app/tasks.md)

