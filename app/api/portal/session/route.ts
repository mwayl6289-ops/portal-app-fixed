import { randomUUID } from 'crypto';

export async function POST() {
  const secret = process.env.PORTAL_SESSION_SECRET || 'dev-secret';
  const token = randomUUID();

  return Response.json({
    ok: true,
    session: {
      token,
      secret,
      createdAt: new Date().toISOString(),
    },
  });
}
