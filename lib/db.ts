import { Pool, PoolClient } from 'pg';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

// Remove channel_binding which causes issues with pg
const sanitizedConnectionString = connectionString
  .replace('?channel_binding=require&sslmode=require', '?sslmode=require')
  .replace('channel_binding=require&', '')
  .replace('&channel_binding=require', '');

const mockCourses = [
  {
    id: 1,
    title: 'Learn React Basics',
    category: 'Frontend',
    status: 'active',
    description: 'Master the fundamentals of React',
  },
  {
    id: 2,
    title: 'Master PostgreSQL',
    category: 'Database',
    status: 'active',
    description: 'Advanced SQL and database design',
  },
  {
    id: 3,
    title: 'Build REST APIs',
    category: 'Backend',
    status: 'draft',
    description: 'Design and build scalable APIs',
  },
  {
    id: 4,
    title: 'Deploy with Vercel',
    category: 'DevOps',
    status: 'active',
    description: 'Continuous deployment and hosting',
  },
  {
    id: 5,
    title: 'Next.js Full Stack',
    category: 'Full Stack',
    status: 'active',
    description: 'Build complete applications with Next.js',
  },
];

export async function getPortalData() {
  if (!sanitizedConnectionString) {
    console.warn('⚠️ No database connection string configured');
    return {
      ok: true,
      source: 'fallback-no-config',
      data: mockCourses,
      message:
        'Database not configured. Add POSTGRES_URL or DATABASE_URL to environment variables.',
      timestamp: new Date().toISOString(),
    };
  }

  const pool = new Pool({
    connectionString: sanitizedConnectionString,
    ssl: sanitizedConnectionString.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : undefined,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  let client: PoolClient | null = null;

  try {
    client = await pool.connect();
    console.log('✅ Database connection established');

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      ) AS table_exists
    `);

    const tableExists = tableCheck.rows[0]?.table_exists;

    if (!tableExists) {
      console.warn('⚠️ Users table does not exist. Using fallback data.');
      return {
        ok: true,
        source: 'fallback-no-table',
        data: mockCourses,
        message: 'Database connected but users table not found. Using fallback data.',
        timestamp: new Date().toISOString(),
      };
    }

    // Query users table
    const result = await client.query(
      'SELECT * FROM users ORDER BY id DESC LIMIT 50'
    );
    console.log(`✅ Retrieved ${result.rowCount} records from database`);

    return {
      ok: true,
      source: 'postgres',
      data: result.rows.length > 0 ? result.rows : mockCourses,
      recordCount: result.rowCount,
      message: 'Successfully connected to PostgreSQL database.',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown database error';
    console.error(`❌ Database error: ${errorMessage}`);

    return {
      ok: true,
      source: 'fallback-error',
      data: mockCourses,
      message: `Database temporarily unavailable. Using safe fallback data. Error: ${errorMessage}`,
      timestamp: new Date().toISOString(),
      errorCode: error instanceof Error && 'code' in error ? (error as any).code : 'UNKNOWN',
    };
  } finally {
    if (client) {
      client.release();
      console.log('✅ Database connection released');
    }
    await pool.end();
  }
}

export async function createUsersTable() {
  if (!sanitizedConnectionString) {
    throw new Error('Database connection string not configured');
  }

  const pool = new Pool({
    connectionString: sanitizedConnectionString,
    ssl: sanitizedConnectionString.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created or already exists');
  } finally {
    await pool.end();
  }
}
