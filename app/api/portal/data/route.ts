import { getPortalData } from '@/lib/db';

export async function GET() {
  try {
    const payload = await getPortalData();import { getPortalData } from '@/lib/db';

export async function GET() {
  const payload = await getPortalData();

  return Response.json({
    ok: true,
    ...payload,
  });
}

    return Response.json({
      ok: true,
      ...payload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return Response.json(
      {
        ok: true,
        source: 'fallback',
        data: [
          { id: 1, title: 'Learn React', category: 'Frontend', status: 'active' },
          { id: 2, title: 'Master SQL', category: 'Data', status: 'active' },
          { id: 3, title: 'Build APIs', category: 'Backend', status: 'draft' },
        ],
        message: `Database connection failed, safe fallback used: ${message}`,
      },
      { status: 200 }
    );
  }
}
