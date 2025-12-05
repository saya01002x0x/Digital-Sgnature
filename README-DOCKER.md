# Docker Compose Setup

## Cách sử dụng

```bash
# Chạy toàn bộ hệ thống (frontend + backend + database) ở chế độ background
docker-compose up -d

# Dừng và xóa tất cả containers (hướng dẫn thôi chứ nghiêm cấm chạy)
docker-compose down

# Rebuild images và chạy lại (dùng khi có thay đổi code)
docker-compose up -d --build
```

## Services

- **Frontend:** http://localhost:${FRONTEND_PORT} - React app với Nginx, tự động proxy `/api` đến backend
- **Backend:** http://localhost:${BACKEND_PORT}/api - Spring Boot API, Swagger UI tại `/swagger-ui.html`
- **Database:** localhost:${POSTGRES_PORT} - PostgreSQL (cấu hình trong .env)

