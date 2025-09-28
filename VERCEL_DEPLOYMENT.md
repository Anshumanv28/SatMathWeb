# Vercel Deployment Guide

This guide will help you deploy your SAT Math Web application to Vercel.

## Prerequisites

- GitHub repository with your code
- Vercel account (free tier available)
- Supabase project with configured auth and storage

## Step 1: Push to GitHub

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Frontend-only SAT Math Web app"
   git branch -M main
   git remote add origin https://github.com/Anshumanv28/SatMathWeb.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: Leave empty (vercel.json handles this)
   - **Output Directory**: Leave empty (vercel.json handles this)

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

### Required Variables:
```
REACT_APP_SUPABASE_URL=https://glppwlmcgyrwzqwukryw.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscHB3bG1jZ3lyd3pxd3Vrcnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTE3NjAsImV4cCI6MjA2ODY4Nzc2MH0.30lgB48oqd7QaITJZjKHXCmBUnpGv0e6PHdbCbOBq5Q
REACT_APP_S3_ACCESS_KEY_ID=93868a0e23d1f0a9b2005dc1d87c5a9f
REACT_APP_S3_SECRET_ACCESS_KEY=1fee47206e06558c13531573e87605a7c70d6cfb9f0706318e160ebb3577e9d8
REACT_APP_S3_ENDPOINT=https://glppwlmcgyrwzqwukryw.storage.supabase.co/storage/v1/s3
REACT_APP_S3_REGION=ap-south-1
REACT_APP_S3_BUCKET_NAME=sattopicwisedata
```

### How to get these values:

1. **Supabase URL & Anon Key**:
   - Go to your Supabase project dashboard
   - Settings > API
   - Copy the URL and anon/public key

2. **S3 Credentials**:
   - Go to your Supabase project dashboard
   - Storage > Settings
   - Generate new S3 credentials
   - Copy Access Key ID and Secret Access Key

3. **S3 Endpoint & Region**:
   - Endpoint: `https://your-project-ref.storage.supabase.co/storage/v1/s3`
   - Region: Usually `project_region`

## Step 4: Configure Supabase for Production

### Update Site URL:
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Vercel domain to **Site URL**:
   ```
   https://your-app-name.vercel.app
   ```
3. Add to **Redirect URLs**:
   ```
   https://your-app-name.vercel.app/auth/callback
   ```

### OAuth Providers (Google/Facebook):
1. Go to Authentication > Providers
2. For each OAuth provider, update the **Redirect URL** to:
   ```
   https://your-app-name.vercel.app/auth/callback
   ```

## Step 5: Verify Deployment

1. **Check Build Logs**: In Vercel dashboard, check that the build completed successfully
2. **Test Authentication**: Try logging in with email/password and OAuth
3. **Test File Loading**: Verify that topics and files load from your S3 bucket
4. **Check Console**: Open browser dev tools and check for any errors

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings > Domains**
2. Add your custom domain
3. Update Supabase settings with the new domain
4. Configure DNS records as instructed by Vercel

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check that all environment variables are set
   - Verify Node.js version (should be 18+)
   - Check build logs for specific errors

2. **Authentication Not Working**:
   - Verify Supabase URL and keys are correct
   - Check that redirect URLs are properly configured
   - Ensure Site URL matches your Vercel domain

3. **Files Not Loading**:
   - Verify S3 credentials are correct
   - Check bucket name and permissions
   - Ensure files are organized in topic folders

4. **CORS Issues**:
   - Supabase should handle CORS automatically
   - Check that your domain is in the allowed origins

### Environment Variable Security:
- Never commit `.env` files to git
- Use Vercel's environment variable system
- Keep your Supabase keys secure

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Edge functions
- ✅ Image optimization
- ✅ Automatic deployments on git push

## Monitoring

- Use Vercel Analytics (available in dashboard)
- Monitor Supabase usage in your project dashboard
- Set up error tracking if needed

## Cost

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Supabase**: Free tier includes 500MB database + 1GB storage
- **Total**: Completely free for small to medium usage!

Your SAT Math Web application is now live and ready for students! 🎉
