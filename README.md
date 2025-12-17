# Digital Signature Web Application

[![CI - Docker Build](https://github.com/saya01002x0x/Digital-Sgnature/actions/workflows/ci.yml/badge.svg)](https://github.com/saya01002x0x/Digital-Sgnature/actions/workflows/ci.yml)
[![CD - Deploy](https://github.com/saya01002x0x/Digital-Sgnature/actions/workflows/deploy.yml/badge.svg)](https://github.com/saya01002x0x/Digital-Sgnature/actions/workflows/deploy.yml)

Hệ thống chữ ký số được xây dựng với Spring Boot (Backend) và React/Vite (Frontend), sử dụng Docker Compose để triển khai.

## 👥 Team

- **Hà Ngọc Huy:** FE & BE
- **Hoàng Chí Thanh:** FE & BE

## 📋 Yêu cầu hệ thống

- Docker Desktop

### Build và Chạy Docker Compose

**Cách 1: Chạy trực tiếp bằng docker local (khuyến nghị)**

```bash
docker-compose up --build -d
```
**Cách 2: Triển khai trên cloud (Supabase + Cloudflare R2)**

> [!IMPORTANT]
> **Lần đầu deploy:** Đặt `SPRING_JPA_HIBERNATE_DDL_AUTO: create` trong `docker-compose.cloud.yml` để tạo database schema.
> 
> **Các lần sau:** Đổi về `SPRING_JPA_HIBERNATE_DDL_AUTO: update` để bảo toàn dữ liệu.

```bash
docker-compose -f docker-compose.cloud.yml --env-file .env.cloud up -d --build
```

Chi tiết cấu hình cloud deployment xem tại [DEPLOY-CLOUD.md](docs/DEPLOY-CLOUD.md)
