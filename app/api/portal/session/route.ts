import { randomUUID } from 'crypto';

export async function POST() {
  try {
    const secret = process.env.PORTAL_SESSION_SECRET || 'dev-secret-key';
    const token = randomUUID();
    const sessionId = randomUUID();

    return Response.json(
      {
        ok: true,
        session: {
          id: sessionId,
          token,
          secret,
          createdAt: new Date().toISOString(),
          expiresIn: 3600,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
