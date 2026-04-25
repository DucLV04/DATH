#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   DATH & MarketPlace - Quick Start Script${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  File .env không tồn tại!${NC}"
    echo -e "${BLUE}📋 Tạo file .env từ .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Đã tạo file .env${NC}"
    echo -e "${YELLOW}⚠️  Vui lòng chỉnh sửa file .env với thông tin của bạn!${NC}"
    echo ""
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker chưa được cài đặt!${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose chưa được cài đặt!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker và Docker Compose đã sẵn sàng${NC}"
echo ""

# Stop existing containers
echo -e "${BLUE}🛑 Dừng các container đang chạy...${NC}"
docker-compose down
echo ""

# Build images
echo -e "${BLUE}🔨 Build Docker images...${NC}"
docker-compose build
echo ""

# Start services
echo -e "${BLUE}🚀 Khởi động services...${NC}"
docker-compose up -d
echo ""

# Wait for services to be ready
echo -e "${BLUE}⏳ Đợi services khởi động...${NC}"
sleep 5

# Check service status
echo -e "${BLUE}📊 Kiểm tra trạng thái services...${NC}"
docker-compose ps
echo ""

# Display access URLs
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   🎉 Services đã sẵn sàng!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}📱 Frontend (MarketPlace):${NC}  http://localhost:3000"
echo -e "${BLUE}🔧 Backend API (DATH):${NC}     http://localhost:8080"
echo -e "${BLUE}📧 MailDev UI:${NC}             http://localhost:1080"
echo -e "${BLUE}🗄️  PostgreSQL:${NC}            localhost:5432"
echo ""
echo -e "${YELLOW}📝 Xem logs:${NC}               docker-compose logs -f"
echo -e "${YELLOW}🛑 Dừng services:${NC}          docker-compose down"
echo ""
echo -e "${GREEN}================================================${NC}"
