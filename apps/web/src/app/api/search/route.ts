import { NextResponse, type NextRequest } from 'next/server';
import { searchAll } from '@/lib/search-server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  try {
    const data = await searchAll(q);
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/search] falha na busca:', err);
    return NextResponse.json({ error: 'search_failed' }, { status: 500 });
  }
}
