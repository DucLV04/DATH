# 🚀 DATH & MarketPlace - Docker Compose Setup

Dự án bao gồm **Backend API (DATH)** và **Frontend (MarketPlace)** được containerize bằng Docker Compose.

## 📋 Yêu cầu hệ thống

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

Kiểm tra phiên bản:
```bash
docker --version
docker-compose --version
```

## 🏗️ Cấu trúc dự án

```
Service/
├── docker-compose.yml          # Main orchestration file
├── .env.example               # Environment variables template
├── DATH/                      # Backend API
│   ├── Dockerfile
│   ├── server.js
│   ├── database.sql
│   └── src/
└── MarketPlace/               # Frontend React App
    ├── Dockerfile
    ├── package.json
    └── src/
```

## ⚙️ Cài đặt

### 1️⃣ Clone repository

```bash
git clone <repository-url>
cd Service
```

### 2️⃣ Tạo file .env

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin của bạn:
```env
DB_PASSWORD=your_strong_password
JWT_SECRET=your_jwt_secret_minimum_32_characters
# ... các biến khác
```

### 3️⃣ Build và khởi động services

```bash
# Build tất cả services
docker-compose build

# Khởi động tất cả services
docker-compose up -d
```

## 🌐 Truy cập ứng dụng

| Service | URL | Mô tả |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | MarketPlace React App |
| **Backend API** | http://localhost:8080 | DATH REST API |
| **MailDev UI** | http://localhost:1080 | Email testing interface |
| **PostgreSQL** | localhost:5432 | Database |

## 📊 Quản lý Docker Compose

### Xem logs
```bash
# Tất cả services
docker-compose logs -f

# Service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Kiểm tra trạng thái
```bash
docker-compose ps
```

### Dừng services
```bash
# Dừng tất cả
docker-compose stop

# Dừng service cụ thể
docker-compose stop backend
```

### Khởi động lại
```bash
# Khởi động lại tất cả
docker-compose restart

# Khởi động lại service cụ thể
docker-compose restart backend
```

### Xóa containers và volumes
```bash
# Xóa containers
docker-compose down

# Xóa containers và volumes (mất data!)
docker-compose down -v
```

## 🔧 Development workflow

### Rebuild khi thay đổi code

```bash
# Rebuild và restart service cụ thể
docker-compose up -d --build backend

# Rebuild tất cả
docker-compose up -d --build
```

### Truy cập container shell

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# Database
docker-compose exec db psql -U postgres -d DATH
```

## 🗄️ Database Management

### Khởi tạo database

Database sẽ tự động được khởi tạo từ file `DATH/database.sql` khi container được tạo lần đầu.

### Backup database

```bash
docker-compose exec db pg_dump -U postgres DATH > backup.sql
```

### Restore database

```bash
cat backup.sql | docker-compose exec -T db psql -U postgres DATH
```

### Kết nối trực tiếp

```bash
docker-compose exec db psql -U postgres -d DATH
```

## 📧 Email Testing với MailDev

MailDev sẽ capture tất cả email được gửi từ backend:
- Web UI: http://localhost:1080
- SMTP Server: maildev:1025 (internal)

## 🐛 Troubleshooting

### Port đã được sử dụng

Nếu gặp lỗi port conflict:
```bash
# Kiểm tra port đang sử dụng
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# Thay đổi port trong docker-compose.yml
ports:
  - "3001:3000"  # Frontend
  - "8081:8080"  # Backend
```

### Database connection failed

```bash
# Kiểm tra logs
docker-compose logs db

# Restart database
docker-compose restart db

# Kiểm tra health status
docker-compose ps
```

### Frontend không kết nối được Backend

1. Kiểm tra biến môi trường `REACT_APP_API_URL` trong `.env`
2. Rebuild frontend: `docker-compose up -d --build frontend`
3. Kiểm tra backend đang chạy: `docker-compose ps backend`

### Reset toàn bộ

```bash
# Xóa tất cả containers, networks, và volumes
docker-compose down -v

# Xóa images
docker-compose down --rmi all

# Build lại từ đầu
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 Production Deployment

Khi deploy production:

1. **Thay đổi biến môi trường**:
   ```env
   NODE_ENV=production
   EMAIL_HOST=smtp.gmail.com
   SERVER_URL=https://your-domain.com
   FRONTEND_URL=https://your-domain.com
   ```

2. **Sử dụng volumes cho uploads**:
   ```yaml
   volumes:
     - ./DATH/uploads:/app/uploads
   ```

3. **Thêm reverse proxy (nginx)**:
   - Cấu hình SSL/TLS
   - Rate limiting
   - CORS headers

4. **Backup định kỳ**:
   - Database backups
   - Uploads backups

## 📝 Notes

- **Data persistence**: PostgreSQL data được lưu trong volume `postgres_data`
- **Uploads**: Files được lưu trong `./DATH/uploads` và mount vào container
- **Health checks**: Services có health checks để đảm bảo khởi động đúng thứ tự
- **Network**: Tất cả services trong cùng network `app-network`

## 🆘 Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker-compose logs -f`
2. Verify environment variables trong `.env`
3. Ensure ports không bị conflict
4. Check Docker resources (RAM, CPU, disk space)

---

✅ **Khởi động đầy đủ**: `docker-compose up -d`
🔍 **Xem logs**: `docker-compose logs -f`
🛑 **Dừng tất cả**: `docker-compose down`
