# Nginx Configuration Guide

This project has **two nginx configurations** to support both local and cloud deployments:

## Files

1. **`nginx.local.conf`** - For Docker Compose (local development)
   - Proxies `/api` requests to `backend:5555`
   - Used when running with `docker-compose`

2. **`nginx.cloud.conf`** - For Cloud deployment (Render, Azure, etc.)
   - No proxy - frontend calls backend directly via `VITE_API_URL`
   - Used when deploying to cloud platforms

## Usage

### Local Development (Docker Compose)

```bash
# Uses nginx.local.conf automatically
docker-compose -f docker-compose.cloud.yml up -d --build
```

The `docker-compose.cloud.yml` sets `NGINX_CONFIG=local` build arg.

### Cloud Deployment (Render)

Render uses `nginx.cloud.conf` by default (Dockerfile has `ARG NGINX_CONFIG=cloud`).

No changes needed - just push to GitHub and Render will build correctly.

### Manual Build

If you need to build manually:

```bash
# For local
docker build --build-arg NGINX_CONFIG=local -t frontend .

# For cloud
docker build --build-arg NGINX_CONFIG=cloud -t frontend .
```

## Why Two Configs?

- **Local**: Backend and frontend are in same Docker network → can use `backend:5555` hostname
- **Cloud**: Services are on different domains → frontend must call backend via public URL

## Troubleshooting

If you see `host not found in upstream "backend"`:
- You're using `nginx.local.conf` in cloud deployment
- Make sure Dockerfile uses `NGINX_CONFIG=cloud` for cloud builds
