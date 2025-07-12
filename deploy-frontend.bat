@echo off
echo Deploying Frontend to Vercel...

REM Deploy frontend
call vercel --prod

echo Frontend deployment complete!
echo.
echo Don't forget to set your environment variables in Vercel dashboard:
echo - NEXT_PUBLIC_API_URL: Your backend URL
echo - DATABASE_URL: Your database connection string
