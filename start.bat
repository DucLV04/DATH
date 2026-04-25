@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ================================================
echo    DATH ^& MarketPlace - Quick Start Script
echo ================================================
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] File .env không tồn tại!
    echo [INFO] Tạo file .env từ .env.example...
    copy .env.example .env >nul
    echo [SUCCESS] Đã tạo file .env
    echo [WARNING] Vui lòng chỉnh sửa file .env với thông tin của bạn!
    echo.
)

REM Check Docker
where docker >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker chưa được cài đặt!
    pause
    exit /b 1
)

where docker-compose >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose chưa được cài đặt!
    pause
    exit /b 1
)

echo [SUCCESS] Docker và Docker Compose đã sẵn sàng
echo.

REM Stop existing containers
echo [INFO] Dừng các container đang chạy...
docker-compose down
echo.

REM Build images
echo [INFO] Build Docker images...
docker-compose build
echo.

REM Start services
echo [INFO] Khởi động services...
docker-compose up -d
echo.

REM Wait for services to be ready
echo [INFO] Đợi services khởi động...
timeout /t 5 /nobreak >nul
echo.

REM Check service status
echo [INFO] Kiểm tra trạng thái services...
docker-compose ps
echo.

REM Display access URLs
echo ================================================
echo    Services đã sẵn sàng!
echo ================================================
echo.
echo Frontend (MarketPlace):  http://localhost:3000
echo Backend API (DATH):      http://localhost:8080
echo MailDev UI:              http://localhost:1080
echo PostgreSQL:              localhost:5432
echo.
echo Xem logs:                docker-compose logs -f
echo Dừng services:           docker-compose down
echo.
echo ================================================
echo.
pause
