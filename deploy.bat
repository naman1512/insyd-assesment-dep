@echo off
REM Production Deployment Script for Windows
echo 🚀 Starting production deployment...

REM Set environment
set NODE_ENV=production

REM Stop any running containers
echo 📦 Stopping existing containers...
docker-compose -f docker-compose.prod.yml down

REM Build and start services
echo 🔨 Building and starting services...
docker-compose -f docker-compose.prod.yml up --build -d

REM Setup database
echo 🗄️ Setting up database...
docker-compose -f docker-compose.prod.yml exec backend npx prisma generate
docker-compose -f docker-compose.prod.yml exec backend npx prisma db push
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed

echo ✅ Deployment complete!
echo 🌐 Frontend: http://localhost
echo 🔧 Backend API: http://localhost/api

REM Show logs
echo 📋 Container logs:
docker-compose -f docker-compose.prod.yml logs --tail=50

pause
