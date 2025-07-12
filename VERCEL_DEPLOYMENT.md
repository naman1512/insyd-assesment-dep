# Vercel Deployment Guide

## Prerequisites

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Set up a Database** (Choose one):
   - **Option A: Vercel Postgres** (Recommended)
   - **Option B: PlanetScale**
   - **Option C: Supabase**
   - **Option D: Railway**

## Step-by-Step Deployment

### Step 1: Set up Database (Vercel Postgres Example)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database" → "Postgres"
3. Choose a database name (e.g., `insyd-db`)
4. Copy the connection string (starts with `postgresql://`)

### Step 2: Update Database Configuration

1. Update `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

### Step 3: Deploy Backend

1. **Run the backend deployment script:**

   ```bash
   npm run deploy:backend
   ```

   Or manually:

   ```bash
   deploy-backend.bat
   ```

2. **Set Environment Variables in Vercel Dashboard:**

   - Go to your backend project settings
   - Add environment variable:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `FRONTEND_URL`: `https://your-frontend.vercel.app` (you'll get this after frontend deployment)

3. **Run database migration:**
   ```bash
   npx prisma migrate deploy
   ```
   Note: You might need to run this locally with your production DATABASE_URL

### Step 4: Deploy Frontend

1. **Update the API URL in your environment:**

   - Copy the backend URL from Vercel (e.g., `https://your-backend.vercel.app`)

2. **Run the frontend deployment script:**

   ```bash
   npm run deploy:frontend
   ```

   Or manually:

   ```bash
   deploy-frontend.bat
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to your frontend project settings
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://your-backend.vercel.app`)
     - `DATABASE_URL`: Your PostgreSQL connection string (needed for API routes)

### Step 5: Update CORS Configuration

1. After getting your frontend URL, update the backend's CORS configuration
2. In Vercel dashboard, go to your backend project
3. Add environment variable:
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)

### Step 6: Seed the Database (Optional)

```bash
npx prisma db seed
```

## Environment Variables Summary

### Backend Project (.env)

```
DATABASE_URL="postgresql://username:password@host:port/database"
FRONTEND_URL="https://your-frontend.vercel.app"
NODE_ENV="production"
```

### Frontend Project (.env)

```
NEXT_PUBLIC_API_URL="https://your-backend.vercel.app"
DATABASE_URL="postgresql://username:password@host:port/database"
```

## Alternative: Single Project Deployment

If you prefer to deploy everything as a single Next.js project:

### Step 1: Remove Standalone Server

1. Delete `server.ts`
2. Keep only the Next.js API routes in `src/app/api/`

### Step 2: Update API Routes

Make sure all your API functionality is properly implemented in:

- `src/app/api/users/route.ts`
- `src/app/api/follow/route.ts`
- Add other endpoints as needed

### Step 3: Deploy Single Project

```bash
vercel --prod
```

## Troubleshooting

### Common Issues:

1. **Database Connection Issues:**

   - Ensure DATABASE_URL is correctly set
   - Check if database is accessible from Vercel

2. **CORS Errors:**

   - Verify FRONTEND_URL is set correctly in backend
   - Check CORS configuration in `api/index.ts`

3. **Build Failures:**

   - Ensure all dependencies are in package.json
   - Check TypeScript errors

4. **Real-time Features (Socket.IO):**
   - Note: Socket.IO doesn't work well with Vercel serverless functions
   - Consider using Vercel's real-time features or deploy backend to Railway/Render

## Post-Deployment Steps

1. **Test all endpoints:**

   - User creation
   - Follow/Unfollow
   - Post creation
   - Notifications

2. **Monitor performance:**

   - Check Vercel analytics
   - Monitor database performance

3. **Set up custom domains (optional):**
   - Configure custom domains in Vercel dashboard

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deploying-to-vercel)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
