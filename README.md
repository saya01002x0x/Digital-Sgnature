# Digital Signature Web Application

Hệ thống chữ ký số được xây dựng với Spring Boot (Backend) và React/Vite (Frontend), sử dụng Docker Compose để triển khai.

## 👥 Team

- **Hà Ngọc Huy:** FE
- **Dương Đăng Quang:** FE
- **Hoàng Chí Thanh:** FE
- **Trần Hoàng Dũng:** BE
- **Hoàng Nhật Minh:** BE
- **Nguyễn Chiêu Văn:** BE (Leader)

## 📋 Yêu cầu hệ thống

### Về Docker Compose
- Docker Desktop

### Về Development riêng lẻ
- Java 17+
- Node.js 20+
- Maven 3.6+
- PostgreSQL 14+ (chạy trên docker)

## ⚙️ Cấu hình

### Ports
- **Backend API:** `5555`
- **Frontend:** `5556`
- **Database:** `5432`
- **Frontend API base URL:** `http://localhost:5555` (`VITE_API_URL`)

## 🚀 Hướng dẫn nhanh (Docker Compose)

### Build và Chạy Docker Compose

**Cách 1: Sử dụng file .bat (khuyến nghị)**

```batch
run.bat
```

**Cách 2: Chạy trực tiếp**

```bash
# Build và chạy
docker-compose up --build -d
```

## 🔍 Kiểm tra và Truy cập

Sau khi build thành công, truy cập ứng dụng tại:
- **Frontend:** http://localhost:5556
- **Backend API:** http://localhost:5555/api
- **Health Check:** http://localhost:5555/actuator/health
- **Swagger UI:** http://localhost:5555/swagger-ui.html
- **Database:** localhost:5432

## 💻 Hướng dẫn Development (Build/Chạy riêng lẻ)

### Build + Run Backend

```bash
cd digital-signature
mvn clean package -DskipTests
java -jar target/digital-signature-0.0.1-SNAPSHOT.jar
```

### Build + Run Frontend

```bash
cd digital-signature-front-end
npm install
npm run build
npm run dev
```

### Auto-Update Database
- **Hibernate DDL Auto:** `update` - Tự động tạo/cập nhật bảng khi có thay đổi entity
- Backend chờ database healthy trước khi start
- Schema tự động cập nhật mỗi lần backend restart

### Đảm bảo hoạt động ổn định
- ✅ Docker Compose quản lý dependencies và thứ tự khởi động
- ✅ Health checks đảm bảo services sẵn sàng
- ✅ Restart policy: `unless-stopped` - Tự động restart khi máy khởi động lại
- ✅ Volume persistence: Database data được lưu trong Docker volume

## ⚠️ Lưu ý quan trọng

- **Docker:** Đảm bảo Docker Desktop đang chạy trước khi build
- **Code quality:** Chỉ build Docker Compose khi code không có lỗi và được chỉ định
