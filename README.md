# Circle13 Campus Sync

> 100% Free Serverless Stack - Vercel + GitHub + Vercel KV + Vercel Postgres

A real-time co-founder coordination app for campus teams. Track status, manage tasks, schedule meetings, and stay synchronized.

## 🎯 Tech Stack

### Frontend & Hosting
- **Next.js 14** (App Router)
- **Vercel** (Free tier hosting)
- **Tailwind CSS**
- **React** + **TypeScript**

### Backend & Database
- **Local JSON Storage** (No external database needed!)
- **Next.js API Routes** (serverless functions)

### Authentication
- **NextAuth.js** with credentials provider

### Real-time Updates
- **Server-Sent Events (SSE)**
- **Polling** as fallback
- **Vercel KV Pub/Sub**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set a secret:
```
NEXTAUTH_SECRET=any-random-secret-string-here
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
circle13-sync/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── signup/route.ts
│   │   ├── status/route.ts
│   │   ├── tasks/route.ts
│   │   ├── sync/route.ts
│   │   └── events/route.ts
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── components/
│   ├── StatusCard.tsx
│   ├── TaskList.tsx
│   └── QuickSync.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── store.ts
├── hooks/
│   └── useRealtime.ts
└── schema.sql
```

## 💰 Cost: $0/month

- ✅ Vercel Free Tier: Unlimited deployments
- ✅ Local JSON Storage: No database costs!
- ✅ GitHub: Free code hosting
- ✅ No external services required!

## 🔄 Deploy

Push to GitHub and Vercel auto-deploys:

```bash
git push origin main
```

## 📝 License

MIT
