# Vercel Deployment Guide

## Required Environment Variables

Set these in your Vercel project settings:

### 1. NEXTAUTH_SECRET (REQUIRED)
Generate a secure secret:
```bash
openssl rand -base64 32
```

Add to Vercel:
- Go to Project Settings → Environment Variables
- Add: `NEXTAUTH_SECRET` = (paste the generated secret)
- Apply to: Production, Preview, Development

### 2. NEXTAUTH_URL (Optional)
Vercel auto-detects this, but you can set it manually:
- Production: `https://your-app.vercel.app`
- Development: `http://localhost:3000`

## Demo Accounts

The app includes two demo accounts for testing:

- **Bharath**: `bharath@circle13.com` / `demo123`
- **Akhil**: `akhil@circle13.com` / `demo123`

## Data Persistence

⚠️ **Important**: This app uses in-memory storage that resets on each deployment and cold start.

For production, you should integrate:
- PostgreSQL (via Vercel Postgres or Supabase)
- MongoDB (via MongoDB Atlas)
- Or another persistent database

## Troubleshooting

### "Application error: a server-side exception has occurred"

1. **Missing NEXTAUTH_SECRET**: Set the environment variable in Vercel
2. **Redeploy**: After adding env vars, trigger a new deployment
3. **Check logs**: View Function Logs in Vercel Dashboard

### Cold Starts Reset Data

This is expected behavior with in-memory storage. Each serverless function invocation may have fresh data.

## Local Development

```bash
# 1. Copy environment file
cp .env.local.example .env.local

# 2. Add your NEXTAUTH_SECRET
# Edit .env.local and set NEXTAUTH_SECRET

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev
```

Visit `http://localhost:3000`
