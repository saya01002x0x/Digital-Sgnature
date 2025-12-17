# 🚀 Hướng dẫn Deploy lên Cloud

## Tổng quan

Dự án Digital Signature hỗ trợ deploy lên cloud với:
- **Database**: Supabase PostgreSQL
- **File Storage**: Cloudflare R2
- **Container**: Docker + Docker Compose

---

## 📋 Yêu cầu

### 1. Supabase Account
- Tạo project tại: https://supabase.com
- Enable Direct Database Access
- Lấy database credentials

### 2. Cloudflare R2 Account  
- Tạo R2 bucket tại: https://dash.cloudflare.com
- Tạo R2 API tokens
- Lấy endpoint và access keys

### 3. Docker Desktop
- Cài đặt Docker Desktop
- Đảm bảo Docker đang chạy

---

## 🔧 Thiết lập

### Bước 1: Cấu hình Supabase

#### 1.1. Tạo Supabase Project
1. Vào https://supabase.com/dashboard
2. Click **New Project**
3. Chọn region gần nhất (Singapore cho VN)
4. Đặt **Database Password** (lưu lại!)

#### 1.2. Lấy Database Connection Info
Vào: **Settings → Database → Connection Info**

Lấy các thông tin:
- **Host**: `db.xxxxx.supabase.co`
- **Database name**: `postgres`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: (password bạn đã đặt)

#### 1.3. Kiểm tra Connection Settings
Vào: **Settings → Database → Connection pooling**

Đảm bảo:
- ✅ **Session mode** (port 5432) được enable
- ✅ **Direct connections** được allow

#### 1.4. (Optional) Disable IPv6-only
Một số Supabase project mặc định chỉ hỗ trợ IPv6. Nếu gặp lỗi kết nối:
- Vào **Settings → Add-ons**
- Enable **IPv4 Add-on** (có thể mất phí)

### Bước 2: Cấu hình Cloudflare R2

#### 2.1. Tạo R2 Bucket
1. Vào https://dash.cloudflare.com
2. Chọn **R2** → **Create bucket**
3. Đặt tên bucket: `digital-signature-files`
4. Chọn region

#### 2.2. Tạo R2 API Token
1. Click **Manage R2 API Tokens**
2. Click **Create API Token**
3. Permissions: **Object Read & Write**
4. Lưu lại:
   - **Access Key ID**
   - **Secret Access Key**

#### 2.3. Lấy R2 Endpoint
Format: `https://[ACCOUNT_ID].r2.cloudflarestorage.com`

Lấy Account ID từ dashboard URL hoặc R2 settings.

### Bước 3: Cấu hình Environment Variables

#### 3.1. Copy template
```bash
cp .env-example-deploy .env.cloud
```

#### 3.2. Điền thông tin vào `.env.cloud`

**DATABASE (BẮT BUỘC):**
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://db.YOUR-PROJECT-REF.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-database-password
```

**STORAGE (BẮT BUỘC):**
```bash
STORAGE_TYPE=r2
R2_ENDPOINT=https://YOUR-ACCOUNT-ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=digital-signature-files
R2_REGION=auto
```

**JWT & CRYPTO (BẮT BUỘC):**
```bash
# Minimum 32 characters
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# MUST be EXACTLY 32 characters
CRYPTO_AES_KEY=YourSecure32ByteAESKeyHere12345
```

**CORS & URLs:**
```bash
# Development
CORS_ALLOWED_ORIGIN=http://localhost:5556
FRONTEND_URL=http://localhost:5556
APP_BASE_URL=http://localhost:5555

# Production - thay bằng domain thật
# CORS_ALLOWED_ORIGIN=https://yourdomain.com
# FRONTEND_URL=https://yourdomain.com
# APP_BASE_URL=https://api.yourdomain.com
```

---

## 🚀 Deploy

### Dừng local containers (nếu đang chạy)
```bash
docker-compose down
```

### Build và chạy cloud version
```bash
docker-compose -f docker-compose.cloud.yml --env-file .env.cloud up -d --build
```

### Xem logs
```bash
# Xem tất cả logs
docker-compose -f docker-compose.cloud.yml --env-file .env.cloud logs -f

# Xem logs backend
docker logs digital-signature-backend -f

# Xem logs frontend
docker logs digital-signature-frontend -f
```

### Kiểm tra trạng thái
```bash
docker ps
```

Bạn sẽ thấy:
```
CONTAINER ID   IMAGE              STATUS                    PORTS
xxxxx          0_hust-backend     Up X minutes (healthy)    0.0.0.0:5555->5555/tcp
xxxxx          0_hust-frontend    Up X minutes              0.0.0.0:5556->80/tcp
```

---

## 🔍 Troubleshooting

### ❌ Backend container "unhealthy"

#### Lỗi 1: Connection refused / timeout
**Nguyên nhân**: Không kết nối được Supabase

**Giải pháp**:
1. Kiểm tra Supabase project có đang **Paused** không
   - Vào Supabase Dashboard → Project Settings
   - Nếu paused, click **Resume**

2. Kiểm tra network từ container:
   ```bash
   docker exec digital-signature-backend ping -c 3 db.YOUR-REF.supabase.co
   ```

3. Kiểm tra firewall/VPN:
   - Tắt VPN thử
   - Kiểm tra firewall có block port 5432 không

#### Lỗi 2: Authentication failed
**Nguyên nhân**: Password sai

**Giải pháp**:
1. Reset database password:
   - Vào Supabase → Settings → Database
   - Click **Reset Database Password**
   - Copy password mới vào `.env.cloud`

2. Rebuild container:
   ```bash
   docker-compose -f docker-compose.cloud.yml --env-file .env.cloud down
   docker-compose -f docker-compose.cloud.yml --env-file .env.cloud up -d --build
   ```

#### Lỗi 3: SSL/TLS errors
**Nguyên nhân**: SSL configuration

**Giải pháp**: Thêm SSL mode vào URL:
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://db.xxx.supabase.co:5432/postgres?sslmode=require
```

#### Lỗi 4: URL bị cắt ngắn
**Nguyên nhân**: Xuống dòng trong `.env.cloud`

**Giải pháp**: Đảm bảo `SPRING_DATASOURCE_URL` là **1 dòng duy nhất**, không xuống dòng.

### ❌ R2 Storage errors

#### Lỗi: Access Denied
**Giải pháp**:
1. Kiểm tra R2 API Token có quyền **Read & Write**
2. Kiểm tra bucket name đúng chưa
3. Tạo lại API token nếu cần

#### Lỗi: Endpoint not found
**Giải pháp**: Kiểm tra R2_ENDPOINT format:
```bash
# Đúng
R2_ENDPOINT=https://abc123.r2.cloudflarestorage.com

# Sai
R2_ENDPOINT=https://abc123.r2.cloudflarestorage.com/bucket-name
```

### ❌ Frontend không kết nối được backend

**Giải pháp**: Kiểm tra CORS settings trong `.env.cloud`:
```bash
CORS_ALLOWED_ORIGIN=http://localhost:5556
```

Phải khớp với URL frontend đang chạy.

---

## 🧹 Dọn dẹp

### Dừng containers
```bash
docker-compose -f docker-compose.cloud.yml --env-file .env.cloud down
```

### Xóa containers và volumes
```bash
docker-compose -f docker-compose.cloud.yml --env-file .env.cloud down -v
```

### Xóa images
```bash
docker rmi 0_hust-backend 0_hust-frontend
```

### Dọn cache Docker
```bash
docker system prune -f
```

---

## 📊 Monitoring

### Health check endpoint
```bash
curl http://localhost:5555/actuator/health
```

Response khi healthy:
```json
{
  "status": "UP"
}
```

### Database connection test
```bash
docker exec digital-signature-backend sh -c 'echo "SELECT 1" | psql $SPRING_DATASOURCE_URL -U $SPRING_DATASOURCE_USERNAME'
```

---

## 🔐 Security Notes

### Production Checklist
- [ ] Thay đổi `JWT_SECRET` thành random string 32+ ký tự
- [ ] Thay đổi `CRYPTO_AES_KEY` thành random string **ĐÚNG 32 ký tự**
- [ ] Update `CORS_ALLOWED_ORIGIN` thành domain thật
- [ ] Enable HTTPS cho frontend và backend
- [ ] Không commit file `.env.cloud` vào git
- [ ] Sử dụng secrets management (GitHub Secrets, AWS Secrets Manager, etc.)
- [ ] Enable Supabase Row Level Security (RLS) nếu cần
- [ ] Restrict R2 bucket access

---

## 📝 Notes

### Khác biệt giữa local và cloud

| Feature | Local (`docker-compose.yml`) | Cloud (`docker-compose.cloud.yml`) |
|---------|------------------------------|-----------------------------------|
| Database | PostgreSQL container | Supabase (external) |
| Storage | Local volume | Cloudflare R2 |
| Network | Internal Docker network | Internet |
| Env file | `.env` | `.env.cloud` |

### Chuyển từ local sang cloud

1. Export data từ local database (nếu cần):
   ```bash
   docker exec digital-signature-db pg_dump -U miiao29_user miiao29_db > backup.sql
   ```

2. Import vào Supabase:
   - Vào Supabase SQL Editor
   - Paste nội dung `backup.sql`
   - Execute

3. Chuyển files từ local storage sang R2:
   - Sử dụng AWS CLI hoặc Rclone
   - Sync folder `uploads/` lên R2 bucket

---

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker logs digital-signature-backend -f`
2. Kiểm tra health: `docker ps`
3. Xem troubleshooting section ở trên
4. Tạo issue trên GitHub repository
