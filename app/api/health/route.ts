import { Pool } from 'pg';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL;

export async function GET() {
  try {
    if (!connectionString) {
      return Response.json(
        {
          ok: true,
          status: 'warning',
          database: 'not configured',
          message: 'DATABASE_URL is not set',
        },
        { status: 200 }
      );
    }

    const pool = new Pool({
      connectionString,
      ssl: connectionString.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : undefined,
    });

    const result = await pool.query('SELECT NOW() AS server_time');
    await pool.end();

    return Response.json(
      {
        ok: true,
        status: 'healthy',
        database: 'connected',
        serverTime: result.rows[0]?.server_time,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      {
        ok: false,
        status: 'unhealthy',
        database: 'disconnected',
        error: message,
      },
      { status: 503 }
    );
  }
}
