## Vai trò

- Hà Ngọc Huy: FE
- Dương Đăng Quang: FE
- Hoàng Chí Thanh: FE
- Trần Hoàng Dũng: BE
- Hoàng Nhật Minh: BE
- Nguyễn Chiêu Văn: BE (leader)

## Thông tin Ports

- **Backend:** `5555` - API Server
- **Frontend:** `5556` - Web Application
- **Database:** `5432` - PostgreSQL

## Yêu cầu hệ thống

- Java 17+
- Node.js 20+
- Maven 3.6+
- PostgreSQL (chạy qua Docker)

## Hướng dẫn Build

### Build Backend

```bash
cd digital-signature
mvn clean package -DskipTests
```

JAR file sẽ được tạo tại: `target/digital-signature-0.0.1-SNAPSHOT.jar`

### Build Frontend

```bash
cd digital-signature-front-end
npm install
npm run build
```

Build files sẽ được tạo tại: `dist/`

### Build cả Backend và Frontend

```bash
# Build Backend
cd digital-signature
mvn clean package -DskipTests

# Build Frontend
cd ../digital-signature-front-end
npm install
npm run build
```

## Hướng dẫn Chạy

### Chạy Backend

```bash
cd digital-signature
java -jar target/digital-signature-0.0.1-SNAPSHOT.jar
```

Backend sẽ chạy tại: `http://localhost:5555`

### Chạy Frontend (Development)

```bash
cd digital-signature-front-end
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5556`

### Chạy Frontend (Production)

Sử dụng web server để serve files trong thư mục `dist/`, hoặc sử dụng Docker với Nginx như đã cấu hình trong `docker-compose.yml`

Frontend sẽ chạy tại: `http://localhost:5556`

## Hướng dẫn Build go-live với Docker Compose (chỉ được phép build khi code không lỗi)

### Yêu cầu

- Docker (tải docker là đủ)
- Docker Compose

### Chạy Docker Compose

```bash
docker-compose up --build -d
```

Lệnh này sẽ build và start tất cả services (backend, frontend, database) ở chế độ background.

### Cơ chế Auto-Update Database

Hệ thống đã được cấu hình để **tự động cập nhật database schema** mỗi khi backend khởi động:

- **Hibernate DDL Auto:** `update` - Tự động tạo/cập nhật bảng khi có thay đổi entity
- **Backend sẽ chờ database healthy** trước khi start
- **Mỗi lần backend restart**, Hibernate sẽ kiểm tra và cập nhật schema nếu có thay đổi

### Đảm bảo hoạt động trên mọi máy

- **Docker Compose** tự động quản lý dependencies và thứ tự khởi động
- **Health checks** đảm bảo services sẵn sàng trước khi service khác start
- **Restart policy:** `unless-stopped` - Tự động restart khi máy khởi động lại
- **Volume persistence:** Database data được lưu trong Docker volume, không mất khi container restart

### Kiểm tra Services

Sau khi chạy, các services sẽ có sẵn tại:

- **Frontend:** `http://localhost:5556` (link trang chủ)
- **Backend API:** `http://localhost:5555/api`
- **Backend Health Check:** `http://localhost:5555/actuator/health`
- **Swagger UI:** `http://localhost:5555/swagger-ui.html`
- **Database:** `localhost:5432`
