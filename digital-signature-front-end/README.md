1. Bổ sung thông tin thêm chỉ dành cho nhóm fe
- Các nhánh riêng của mn trong fe thì merge vào nhánh: feature/front-end check trước khi pull request vào main nhé
- Và nhớ tạo nhánh riêng của mình trước trước khi sửa code chứ không trực tiếp sửa code trong nhánh feature/front-end
- Có gì không hiểu hỏi GPT



# React Boilerplate với Vite, TypeScript và Redux Toolkit

Dự án boilerplate React + Vite + TypeScript + Redux Toolkit (RTK + RTK Query) theo kiến trúc feature-first.

## 🔧 Cấu trúc dự án

- Feature-first: mỗi tính năng gom vào 1 thư mục: slice, api (RTK Query injectEndpoints), pages, components, types.
- Base API RTK Query: 1 baseApi.ts, mỗi feature injectEndpoints (code-splitting).
- Typed hooks: useAppDispatch, useAppSelector, kèm RootState, AppDispatch.
- Routing: lazy routes theo feature + guarded routes (auth/role).
- Shared UI: component/bộ phận dùng chung ở shared/.
- Strict typing: mỗi feature bắt buộc có types.ts.

## 📦 Công nghệ

- **Core**: React, React DOM, React Router DOM
- **State**: Redux Toolkit, React Redux
- **RTK Query**: Tích hợp trong @reduxjs/toolkit
- **UI**: Ant Design, @ant-design/icons, classnames
- **Forms**: React Hook Form, Zod, @hookform/resolvers
- **i18n**: i18next, react-i18next, i18next-http-backend, i18next-browser-languagedetector
- **Utils**: dayjs, uuid
- **Error boundary**: react-error-boundary
- **Testing**: Vitest, Testing Library, MSW
- **Lint/format**: ESLint, Prettier, husky, lint-staged, commitlint

## 🚀 Bắt đầu

1. Clone dự án
2. Cài đặt dependencies:

```bash
npm install
```

3. Khởi động server dev:

```bash
npm run dev
```

4. Build cho production:

```bash
npm run build
```

## 🌐 i18n

- Hỗ trợ đa ngôn ngữ (Tiếng Anh và Tiếng Việt)
- Resource ở public/locales/{en|vi}/translation.json
- Sử dụng hook useTranslation() để dịch văn bản

## 🎨 Theme

- Hỗ trợ giao diện sáng/tối với Ant Design
- ConfigProvider với theme.defaultAlgorithm và theme.darkAlgorithm
- Nút chuyển đổi theme

## 🧪 Testing

- Vitest + React Testing Library + jsdom cấu hình sẵn
- MSW (Mock Service Worker) để mock API trong development và testing

## 📝 Git Hooks

- Husky + lint-staged: kiểm tra và định dạng code trước khi commit
- Commitlint: đảm bảo commit message theo chuẩn conventional commits

## 📋 Tính năng

- Authentication demo với login form
- Protected Routes và Role-based access control
- Theme toggle (sáng/tối)
- Language switcher (EN/VI)
- Form validation với react-hook-form + zod

