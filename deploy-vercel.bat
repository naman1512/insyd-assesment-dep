@echo off
echo Starting Vercel deployment with PostgreSQL...

REM Backup current schema
copy prisma\schema.prisma prisma\schema.dev.prisma

REM Use production schema
copy prisma\schema.prod.prisma prisma\schema.prisma

REM Generate Prisma client for PostgreSQL
call npx prisma generate

REM Deploy to Vercel
echo Deploying to Vercel...
call vercel --prod

REM Restore development schema
copy prisma\schema.dev.prisma prisma\schema.prisma

REM Regenerate client for development
call npx prisma generate

echo Deployment complete!
echo.
echo Next steps:
echo 1. Set up PostgreSQL database in Vercel dashboard
echo 2. Add DATABASE_URL environment variable
echo 3. Run: npx prisma db push --schema=prisma/schema.prod.prisma
