# 🚀 GitHub + Cloud Deployment Guide

## Quick Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Insyd Notification System"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/insyd-notification-system.git
git branch -M main
git push -u origin main
```

### Step 2A: Frontend on Vercel (Recommended)

1. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

2. **Environment Variables in Vercel:**

   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
   ```

3. **Deploy automatically!** ✅

### Step 2B: Backend on Railway

1. **Deploy to Railway:**

   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add `Dockerfile.backend` as build file

2. **Environment Variables in Railway:**

   ```
   DATABASE_URL=file:./data/production.db
   NODE_ENV=production
   PORT=3001
   ```

3. **Backend deploys automatically!** ✅

---

## Alternative: Vercel Full-Stack (Advanced)

If you want everything on Vercel, here's how to adapt:

### Convert Backend to Serverless Functions

Create `api/` routes in your Next.js app that work with Vercel's serverless architecture.

---

## Production URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Database**: Persistent SQLite on Railway

## Need Help?

Choose your deployment method:

- **Easy**: Vercel + Railway (recommended)
- **Advanced**: Full Vercel with serverless adaptations
- **Local**: Keep developing locally until ready

Want me to help set up either option?
