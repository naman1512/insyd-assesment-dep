# 🚀 Deployment Guide - Insyd Notification System

## Quick Start (Choose Your Method)

### Method 1: Local Development (Fastest)

```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Database Setup (one time)
npx prisma generate
npx prisma db push
npm run db:seed
```

**Access:**

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

### Method 2: Docker Development (Recommended)

```bash
# One command deployment
npm run deploy:local

# OR manually
docker-compose up --build
```

**Access:**

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

### Method 3: Production Docker (Full Stack)

```bash
# Production deployment
npm run deploy:prod

# OR manually
docker-compose -f docker-compose.prod.yml up --build -d
```

**Access:**

- Application: http://localhost (with Nginx proxy)
- All APIs: http://localhost/api/\*

---

## Prerequisites

1. **Node.js 18+** installed
2. **Docker Desktop** running (for Docker methods)
3. **Git** (if cloning from repository)

## Local Development Setup

**Step 1: Install Dependencies**

```bash
npm install
```

**Step 2: Environment Setup**

```bash
# Copy environment variables
cp .env.example .env.local
```

**Step 3: Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed with sample data
npm run db:seed
```

**Step 4: Start Services**

```bash
# Backend (Terminal 1)
npm run server:dev

# Frontend (Terminal 2)
npm run dev
```

---

## Docker Development Setup

**Step 1: Build and Start**

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

**Step 2: Setup Database**

```bash
# Generate Prisma client inside container
docker-compose exec backend npx prisma generate

# Push database schema
docker-compose exec backend npx prisma db push

# Seed database
docker-compose exec backend npm run db:seed
```

---

## Cloud Deployment Options

### Option 1: Railway (Easiest)

**Frontend Deployment:**

1. Connect GitHub repository to Railway
2. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
   ```
3. Deploy automatically

**Backend Deployment:**

1. Create new Railway service
2. Set environment variables:
   ```
   DATABASE_URL=file:./data/production.db
   PORT=3001
   ```
3. Deploy with Dockerfile.backend

### Option 2: Vercel + Heroku

**Frontend (Vercel):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Backend (Heroku):**

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-backend

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

## Troubleshooting

### Common Issues

**1. Frontend can't connect to backend**

- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend is running on correct port

**2. WebSocket connection fails**

- Check CORS settings in `server.ts`
- Verify `NEXT_PUBLIC_SOCKET_URL` matches backend URL

**3. Database connection errors**

```bash
# Regenerate Prisma client
npx prisma generate

# Reset database if needed
npx prisma db push --force-reset
```

**4. Docker build issues**

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

## Ready to Deploy? 🎯

**For Development:**

```bash
npm run deploy:local
```

**For Production:**

```bash
npm run deploy:prod
```

Your real-time notification system is now live! 🚀
