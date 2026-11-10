import { NextResponse } from 'next/server';
import { getDevQuickLinks } from '@/lib/devQuickLinks';

export const dynamic = 'force-dynamic';

/**
 * The page list behind the quick-links menu, for the static .html pages in
 * public/ (public/dev-quick-links.js). Page names and paths only; read-only.
 */
export function GET() {
  return NextResponse.json(getDevQuickLinks());
}
