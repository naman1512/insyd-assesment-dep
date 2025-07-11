#!/bin/bash

# Production Deployment Script
echo "🚀 Starting production deployment..."

# Set environment
export NODE_ENV=production

# Stop any running containers
echo "📦 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml up --build -d

# Setup database
echo "🗄️ Setting up database..."
docker-compose -f docker-compose.prod.yml exec backend npx prisma generate
docker-compose -f docker-compose.prod.yml exec backend npx prisma db push
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost/api"

# Show logs
echo "📋 Container logs:"
docker-compose -f docker-compose.prod.yml logs --tail=50
