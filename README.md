# 📚 Learning Portal

A complete, error-free learning platform built with **Next.js 14**, **TypeScript**, **PostgreSQL (Neon)**, and deployed on **Vercel**.

## ✨ Features

- ✅ **Full-stack Next.js application** with API routes
- ✅ **PostgreSQL database** with Neon (cloud-hosted)
- ✅ **TypeScript** for type safety
- ✅ **Error handling** at every step
- ✅ **Safe fallback system** - app always works, even if database is down
- ✅ **Health check endpoint** to monitor database status
- ✅ **Beautiful UI** with responsive design
- ✅ **Automatic deployment** on Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (or use `nvm use`)
- npm or yarn
- A Neon PostgreSQL account (free tier available)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd portal-app-fixed
npm install
```

### 2. Set Up Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy your connection string
4. **Important**: Remove `channel_binding=require` from the URL
5. Use only: `?sslmode=require`

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
POSTGRES_URL=postgresql://user:password@ep-....neon.tech/dbname?sslmode=require
PORTAL_SESSION_SECRET=your-random-secret-key-here
NODE_ENV=development
```

### 4. Create Database Table (Optional)

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### GET `/api/portal/data`
Returns list of courses. Falls back to mock data if database is unavailable.

**Response:**
```json
{
  "ok": true,
  "source": "postgres",
  "data": [...],
  "message": "Successfully connected to PostgreSQL database."
}
```

### POST `/api/portal/session`
Creates a new session token.

**Response:**
```json
{
  "ok": true,
  "session": {
    "id": "uuid",
    "token": "uuid",
    "secret": "secret",
    "createdAt": "2024-09-29T..."
  }
}
```

### GET `/api/health`
Healthcheck endpoint to monitor database status.

**Response:**
```json
{
  "ok": true,
  "status": "healthy",
  "database": "connected",
  "serverTime": "2024-09-29T..."
}
```

## 🌍 Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Complete portal app with error handling"
git push origin main
```

### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"

### 3. Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add the same variables from `.env.local`:
   - `POSTGRES_URL`
   - `PORTAL_SESSION_SECRET`
   - `NODE_ENV=production`

3. Click "Deploy"

## 🛡️ Error Handling

The app is designed to **never crash** due to database issues:

- ❌ Database down? → Returns mock data ✅
- ❌ Table doesn't exist? → Returns mock data ✅
- ❌ Connection timeout? → Returns mock data ✅
- ❌ Invalid credentials? → Returns mock data ✅

All errors are logged to console for debugging.

## 📝 Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── portal/
│   │   │   ├── data/route.ts        # Main endpoint
│   │   │   └── session/route.ts     # Session creation
│   │   └── health/route.ts          # Health check
│   ├── page.tsx                      # Home page
│   ├── page.module.css               # Styles
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── lib/
│   └── db.ts                         # Database logic
├── package.json
├── tsconfig.json
├── next.config.mjs
└── .env.example
```

## 🔧 Troubleshooting

### Issue: 500 Error on `/api/portal/data`

**Cause:** Usually `channel_binding=require` in the URL or missing `DATABASE_URL`

**Fix:**
1. Check Vercel environment variables
2. Remove `channel_binding=require`
3. Use only `?sslmode=require`
4. Redeploy

### Issue: Database Connection Timeout

**Cause:** Network or firewall issues

**Fix:**
1. Verify Neon connection string
2. Check if Neon IP access is allowed
3. Try from different network
4. Check Neon console logs

### Issue: Table Not Found

**Cause:** Users table doesn't exist in database

**Fix:**
1. Run the SQL to create table (see above)
2. Or insert data: `INSERT INTO users (name, email) VALUES ('Test', 'test@example.com')`

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 📄 License

MIT

## 👤 Author

Created with ❤️ by **Copilot**

---

**Questions?** Check the troubleshooting section or review the API endpoints documentation.
