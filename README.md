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
**Cách 2: Triển khai trên cloud (Render + Supabase + Cloudflare R2)**

```bash
docker-compose -f docker-compose.cloud.yml --env-file .env.cloud up -d --build
```
