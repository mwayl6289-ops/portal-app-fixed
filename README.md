# Portal app

This project is a safe starter for a learning platform hosted on Vercel with Neon PostgreSQL.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example file and add your database values:
   ```bash
   cp .env.example .env.local
   ```
3. Start the app:
   ```bash
   npm run dev
   ```

## Environment variables

Use either `POSTGRES_URL` or `DATABASE_URL` in Vercel:

```env
POSTGRES_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
# or
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
PORTAL_SESSION_SECRET=your-secret-token
NODE_ENV=production
```

## API routes

- `GET /api/portal/data` — returns portal data and uses a safe fallback if the database is unavailable.
- `POST /api/portal/session` — creates a mock session token using the configured secret.

## Notes

This starter avoids crashing the whole app when the database is temporarily unavailable. It falls back to safe mock data so the site keeps working.
