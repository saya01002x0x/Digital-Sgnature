# 🚀 Hướng dẫn Setup Supabase + Cloudflare R2

Hướng dẫn chi tiết cách lấy các API keys để deploy ứng dụng lên cloud sử dụng **Supabase** (database) và **Cloudflare R2** (file storage).

---

## 📋 Mục lục

1. [Setup Supabase (Database)](#1-setup-supabase-database)
2. [Setup Cloudflare R2 (File Storage)](#2-setup-cloudflare-r2-file-storage)
3. [Cấu hình biến môi trường](#3-cấu-hình-biến-môi-trường)
4. [Kiểm tra kết nối](#4-kiểm-tra-kết-nối)

---

## 1. Setup Supabase (Database)

### Bước 1: Tạo tài khoản và Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** hoặc **"Sign in"**
3. Đăng nhập bằng GitHub (khuyến nghị) hoặc email
4. Click **"New Project"**
5. Điền thông tin:
   - **Name**: `digital-signature` (hoặc tên bạn muốn)
   - **Database Password**: Tạo password mạnh (LƯU LẠI!)
   - **Region**: Chọn region gần nhất (Singapore cho VN)
6. Click **"Create new project"**
7. Đợi 1-2 phút để project được tạo

### Bước 2: Lấy Database Connection String

1. Vào **Project Settings** (icon bánh răng góc trái)
2. Chọn tab **"Database"**
3. Kéo xuống phần **"Connection string"**
4. Chọn tab **"URI"**
5. Copy connection string, có dạng:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

📝 **Các giá trị cần lưu:**
| Biến | Giá trị | Ví dụ |
|------|---------|-------|
| `SUPABASE_PROJECT_REF` | Phần sau `db.` và trước `.supabase.co` | `abcdefghijklmnop` |
| `SUPABASE_DB_HOST` | Host database | `db.abcdefghijklmnop.supabase.co` |
| `SUPABASE_DB_PASSWORD` | Password bạn đã tạo | `MySecurePassword123!` |
| `SPRING_DATASOURCE_URL` | Full connection string | `jdbc:postgresql://db.xxx.supabase.co:5432/postgres` |

### Bước 3: Lấy API Keys

1. Vào **Project Settings** → tab **"API"**
2. Tìm section **"Project API keys"**
3. Copy các keys:

| Key | Mô tả | Sử dụng |
|-----|-------|---------|
| `anon` (public) | Key công khai, giới hạn quyền | Frontend |
| `service_role` | Key admin, full quyền | Backend (BẢO MẬT!) |

📝 **Các giá trị cần lưu:**
```env
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

> ⚠️ **QUAN TRỌNG**: KHÔNG BAO GIỜ commit `service_role` key lên GitHub!

---

## 2. Setup Cloudflare R2 (File Storage)

### Bước 1: Tạo tài khoản Cloudflare

1. Truy cập [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Đăng ký tài khoản (miễn phí)
3. Xác nhận email

### Bước 2: Bật R2 Storage

1. Từ Dashboard, tìm **"R2"** trong sidebar (hoặc search)
2. Click **"Get Started"** nếu chưa bật
3. Có thể cần thêm payment method (nhưng R2 có free tier rộng rãi!)

### Bước 3: Tạo Bucket

1. Trong R2 Dashboard, click **"Create bucket"**
2. Điền thông tin:
   - **Bucket name**: `digital-signature-files`
   - **Location**: Chọn region (Automatic recommended)
3. Click **"Create bucket"**

📝 **Ghi chú:**
```env
R2_BUCKET_NAME=digital-signature-files
```

### Bước 4: Lấy Account ID

1. Quay lại R2 Dashboard
2. Nhìn vào URL hoặc sidebar, bạn sẽ thấy **Account ID**
   - URL: `https://dash.cloudflare.com/[ACCOUNT_ID]/r2`
3. Hoặc vào **Overview** → Copy **Account ID**

📝 **Ghi chú:**
```env
R2_ACCOUNT_ID=a1b2c3d4e5f6g7h8i9j0...
R2_ENDPOINT=https://a1b2c3d4e5f6g7h8i9j0.r2.cloudflarestorage.com
```

### Bước 5: Tạo API Token

1. Trong R2 Dashboard, click **"Manage R2 API Tokens"**
2. Click **"Create API token"**
3. Cấu hình token:
   - **Token name**: `digital-signature-backend`
   - **Permissions**: 
     - ✅ Object Read
     - ✅ Object Write
   - **Specify bucket(s)**: Chọn `digital-signature-files`
   - **TTL**: Optional (để trống = không hết hạn)
4. Click **"Create API Token"**
5. **QUAN TRỌNG**: Copy ngay cả 2 keys, chỉ hiển thị 1 lần!

📝 **Các giá trị cần lưu:**
```env
R2_ACCESS_KEY_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
R2_SECRET_ACCESS_KEY=abcdefghijklmnopqrstuvwxyz123456789...
```

> ⚠️ **QUAN TRỌNG**: LƯU CẢ 2 KEY NGAY! Không thể xem lại Secret Key sau khi đóng dialog.

### Bước 6: (Optional) Setup Public Access

Nếu muốn files có thể truy cập công khai qua URL:

1. Vào bucket `digital-signature-files`
2. Tab **"Settings"**
3. Section **"Public access"**
4. Click **"Connect domain"** hoặc bật **"R2.dev subdomain"**

📝 **Ghi chú:**
```env
# Nếu dùng R2.dev subdomain:
R2_PUBLIC_URL=https://pub-[random].r2.dev

# Nếu dùng custom domain:
R2_PUBLIC_URL=https://files.yourdomain.com
```

---

## 3. Cấu hình biến môi trường

### File `.env` hoàn chỉnh cho Production

Copy từ `.env-example` và điền các giá trị:

```env
# ==========================================
# DEPLOYMENT MODE
# ==========================================
DEPLOY_MODE=cloud

# ==========================================
# SUPABASE DATABASE
# ==========================================
SUPABASE_PROJECT_REF=your-actual-project-ref
SUPABASE_DB_HOST=db.your-actual-project-ref.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-actual-database-password

# Spring Boot connection
SPRING_DATASOURCE_URL=jdbc:postgresql://db.your-actual-project-ref.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-actual-database-password

# API Keys
SUPABASE_URL=https://your-actual-project-ref.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# ==========================================
# CLOUDFLARE R2
# ==========================================
STORAGE_TYPE=r2
R2_ACCOUNT_ID=your-actual-account-id
R2_BUCKET_NAME=digital-signature-files
R2_ACCESS_KEY_ID=your-actual-access-key-id
R2_SECRET_ACCESS_KEY=your-actual-secret-key
R2_ENDPOINT=https://your-actual-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-bucket-public-url

# ==========================================
# BACKEND (Update these for production!)
# ==========================================
JWT_SECRET=generate-a-very-long-random-string-at-least-32-chars
JWT_EXPIRATION=900000
SERVER_PORT=5555
APP_BASE_URL=https://your-backend.onrender.com
CORS_ALLOWED_ORIGIN=https://your-frontend.onrender.com
FRONTEND_URL=https://your-frontend.onrender.com

# ==========================================
# FRONTEND
# ==========================================
VITE_API_URL=https://your-backend.onrender.com
VITE_APP_NAME=Digital Signature
VITE_IS_DEV=false
VITE_IS_PROD=true

# ==========================================
# CRYPTO
# ==========================================
CRYPTO_AES_KEY=Generate32CharacterRandomString!
```

### Thiết lập trên Render

Khi deploy lên Render, thêm các biến môi trường này:

1. Vào Render Dashboard → Service → **Environment**
2. Thêm từng biến hoặc dùng **"Add from .env"**
3. Click **"Save Changes"**

---

## 4. Kiểm tra kết nối

### Test Database Connection

```bash
# Dùng psql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Hoặc dùng tool như DBeaver, TablePlus, etc.
```

### Test R2 Connection

```bash
# Dùng AWS CLI (R2 tương thích S3)
aws configure --profile r2
# Access Key ID: [R2_ACCESS_KEY_ID]
# Secret Access Key: [R2_SECRET_ACCESS_KEY]

# List objects
aws s3 ls s3://digital-signature-files --endpoint-url https://[ACCOUNT_ID].r2.cloudflarestorage.com --profile r2
```

---

## 📊 Bảng tổng hợp tất cả keys cần lấy

| Service | Biến môi trường | Nơi lấy |
|---------|-----------------|---------|
| **Supabase** | `SUPABASE_PROJECT_REF` | Dashboard URL |
| | `SUPABASE_DB_PASSWORD` | Khi tạo project |
| | `SUPABASE_URL` | Settings → API |
| | `SUPABASE_ANON_KEY` | Settings → API |
| | `SUPABASE_SERVICE_ROLE_KEY` | Settings → API |
| **Cloudflare R2** | `R2_ACCOUNT_ID` | Dashboard → Overview |
| | `R2_BUCKET_NAME` | Tự đặt khi tạo bucket |
| | `R2_ACCESS_KEY_ID` | R2 → Manage API Tokens |
| | `R2_SECRET_ACCESS_KEY` | R2 → Manage API Tokens |

---

## ⚠️ Lưu ý bảo mật

1. **KHÔNG commit** file `.env` chứa keys thực lên GitHub
2. **Thêm `.env` vào `.gitignore`** (đã có sẵn)
3. **Rotate keys định kỳ** (3-6 tháng)
4. **Dùng biến môi trường riêng** cho mỗi môi trường (dev, staging, prod)
5. **Service Role Key** của Supabase có quyền ADMIN, bảo mật tuyệt đối!

---

## 🆘 Troubleshooting

### Lỗi kết nối Database

```
Connection refused
```
→ Kiểm tra lại `SPRING_DATASOURCE_URL`, đảm bảo format đúng

### Lỗi R2 Access Denied

```
AccessDenied
```
→ Kiểm tra `R2_ACCESS_KEY_ID` và `R2_SECRET_ACCESS_KEY`
→ Đảm bảo token có quyền Read/Write cho đúng bucket

### Lỗi CORS

```
CORS policy blocked
```
→ Update `CORS_ALLOWED_ORIGIN` với URL frontend thực tế

---

## 📚 Tài liệu tham khảo

- [Supabase Docs](https://supabase.com/docs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Spring Boot PostgreSQL](https://spring.io/guides/gs/accessing-data-postgresql/)
