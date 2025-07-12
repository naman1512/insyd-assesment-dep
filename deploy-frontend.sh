#!/bin/bash

# Deploy Frontend to Vercel
echo "Deploying Frontend to Vercel..."

# Deploy frontend
vercel --prod

echo "Frontend deployment complete!"
echo "Don't forget to set your environment variables in Vercel dashboard:"
echo "- NEXT_PUBLIC_API_URL: Your backend URL"
echo "- DATABASE_URL: Your database connection string"
