# Digital Signature Web Application

Hệ thống chữ ký số được xây dựng với Spring Boot (Backend) và React/Vite (Frontend), sử dụng Docker Compose để triển khai.

## 👥 Team

- **Hà Ngọc Huy:** FE & BE
- **Dương Đăng Quang:** FE & Slide báo cáo
- **Hoàng Chí Thanh:** FE & BE
- **Trần Hoàng Dũng:** BE & Slide báo cáo
- **Hoàng Nhật Minh:** BE & Slide báo cáo
- **Nguyễn Chiêu Văn:** BE 

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
- **Backend:** `5555`
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
# Sau đó truy cập web: http://localhost:5556
docker-compose up --build -d
```

**Cách 3: Chạy riêng lẻ Backend/Frontend để trỏ vào test code local**

```bash
# Build và chạy 
docker-compose up --build -d Backend
docker-compose up --build -d Frontend
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
cd digital-signature-Frontend
npm install
npm run build
npm run dev
```

### Auto-Update Database
- **Hibernate DDL Auto:** `update`
- Tự động tạo/cập nhật bảng khi có thay đổi entity nên nghiêm cấm Backend sửa entity nếu code đang chạy
- Backend chờ database healthy trước khi start
- Schema tự động cập nhật mỗi lần backend restart
- Nếu không chạy docker phía Backend sẽ báo lỗi không tìm thấy ip của database

### Đảm bảo hoạt động ổn định
- ✅ Docker Compose quản lý dependencies và thứ tự khởi động
- ✅ Health checks đảm bảo services sẵn sàng
- ✅ Restart policy: `unless-stopped` - Tự động restart khi máy khởi động lại
- ✅ Volume persistence: Database data được lưu trong Docker volume
- ✅ Nếu Frontend hay Backend sửa code xong chỉ cần rebuild lại docker phần tương ứng (hoặc rebuild all cho lẹ cũng được)
