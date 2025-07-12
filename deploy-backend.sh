#!/bin/bash

# Deploy Backend to Vercel
echo "Deploying Backend to Vercel..."

# Create temporary backend directory
mkdir -p temp-backend
cp -r api temp-backend/
cp -r prisma temp-backend/
cp backend-package.json temp-backend/package.json
cp backend-vercel.json temp-backend/vercel.json

# Deploy backend
cd temp-backend
vercel --prod

# Get backend URL
BACKEND_URL=$(vercel --scope your-team-name --prod 2>&1 | grep -o 'https://[^[:space:]]*')
echo "Backend deployed to: $BACKEND_URL"

# Return to root
cd ..

# Clean up
rm -rf temp-backend

echo "Backend deployment complete!"
echo "Next, deploy the frontend with: npm run deploy:frontend"
