/**
 * Link groups (demo pages + public .html files) for the pages widget.
 *
 *   GET /api/dev/pages
 *
 * Consumed by public/pages-widget.js so the static .html pages in public/ can
 * show the same widget as the Next.js pages.
 */
import { getLinkGroups } from '@/app/_components/PageLinksWidget';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(getLinkGroups());
}
