import { Pool } from 'pg';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl:
        connectionString.includes('neon.tech') ||
        connectionString.includes('render.com')
          ? { rejectUnauthorized: false }
          : undefined,
    })
  : null;

const mockCourses = [
  { id: 1, title: 'Learn React', category: 'Frontend', status: 'active' },
  { id: 2, title: 'Master SQL', category: 'Data', status: 'active' },
  { id: 3, title: 'Build APIs', category: 'Backend', status: 'draft' },
  { id: 4, title: 'Deploy on Vercel', category: 'DevOps', status: 'active' },
];

export async function getPortalData() {
  if (!pool) {
    return {
      ok: true,
      source: 'fallback',
      data: mockCourses,
      message: 'No database connected yet. Using safe local fallback data.',
    };
  }

  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    const dbResult = await pool.query('SELECT * FROM users LIMIT 10');

    return {
      ok: true,
      source: 'postgres',
      data: dbResult.rows.length > 0 ? dbResult.rows : mockCourses,
      serverTime: result.rows[0]?.current_time,
      message: 'Connected to PostgreSQL successfully.',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';

    return {
      ok: true,
      source: 'fallback',
      data: mockCourses,
      message: `Database unavailable; using fallback data. ${message}`,
    };
  }
}

export default pool;
