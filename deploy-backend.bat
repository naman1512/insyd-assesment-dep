@echo off
echo Deploying Backend to Vercel...

REM Create temporary backend directory
mkdir temp-backend 2>nul
xcopy /s /e api temp-backend\api\ >nul
xcopy /s /e prisma temp-backend\prisma\ >nul
copy backend-package.json temp-backend\package.json >nul
copy backend-vercel.json temp-backend\vercel.json >nul

REM Deploy backend
cd temp-backend
call vercel --prod

REM Return to root
cd ..

REM Clean up
rmdir /s /q temp-backend

echo Backend deployment complete!
echo Next, run deploy-frontend.bat to deploy the frontend
