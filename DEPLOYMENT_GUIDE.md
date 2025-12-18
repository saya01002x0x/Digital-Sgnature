# 🚀 Hướng Dẫn Triển Khai (Deployment Guide)

Dự án này hỗ trợ 3 kịch bản chính để chạy local và deploy cloud.

## 1. Chạy 100% Local (PostgreSQL & Local Storage)
Đây là cách nhanh nhất để dev mà không cần tài khoản Cloud.

- **Dữ liệu**: PostgreSQL chạy trong Docker container.
- **File**: Lưu tại thư mục `./uploads` ở máy tính của bạn.
- **Lệnh chạy**:
  ```bash
  docker-compose up -d --build
  ```
- **Truy cập**:
  - Frontend: [http://localhost:5556](http://localhost:5556)
  - Backend API: [http://localhost:5555](http://localhost:5555)

---

## 2. Chạy Hybrid (Supabase + Cloudflare R2)
Chạy code ở máy local nhưng kết nối tới DB và Storage thực tế trên Cloud.

- **Dữ liệu**: Kết nối tới Supabase.
- **File**: Upload trực tiếp lên Cloudflare R2.
- **Yêu cầu**: Cấu hình đầy đủ các biến môi trường trong file `.env`.
- **Lệnh chạy**:
  ```bash
  docker-compose -f docker-compose.cloud.yml up -d --build
  ```

---

## 3. Deploy lên Cloud (Render.com)
Dùng để chạy production.

- **Cách hoạt động**: Render sẽ đọc file `render.yaml` ở gốc thư mục.
- **Frontend**: Sử dụng `nginx.cloud.conf` (không dùng proxy, gọi trực tiếp API qua URL public).
- **Backend**: Kết nối tới Supabase và R2.
- **Lưu ý**: Đảm bảo đã thiết lập các Secret Group trên Render tương ứng với file `.env.cloud`.

---

## 🛠️ Giải thích về Nginx Config

Chúng ta có 2 file cấu hình Nginx trong thư mục `digital-signature-front-end/`:

1.  **`nginx.local.conf`**:
    - Được sử dụng khi chạy Docker Compose (cả bản Local và Hybrid).
    - Có chức năng **Proxy API**: Chuyển hướng các request `/api` sang container `backend:5555`.
    - Điều này giúp tránh lỗi CORS khi dev.

2.  **`nginx.cloud.conf`**:
    - Được sử dụng khi deploy lên các dịch vụ như Render, Azure.
    - **Không có proxy**: Frontend gọi trực tiếp tới URL của Backend (ví dụ `https://api.myapp.com`).

> [!TIP]
> Dockerfile frontend sẽ tự động chọn đúng cấu hình dựa trên biến build `NGINX_CONFIG` truyền vào từ file docker-compose.

## 📝 Danh sách các file quan trọng
- [docker-compose.yml](file:///e:/0_Learn/0_hust/docker-compose.yml) - Bản Local mặc định.
- [docker-compose.cloud.yml](file:///e:/0_Learn/0_hust/docker-compose.cloud.yml) - Bản Hybrid dùng Cloud services.
- [.env-example](file:///e:/0_Learn/0_hust/.env-example) - Mẫu file môi trường.
- [render.yaml](file:///e:/0_Learn/0_hust/render.yaml) - Cấu hình deploy Render.
