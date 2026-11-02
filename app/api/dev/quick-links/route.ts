/**
 * Link groups (app pages + public .html files) for the DevQuickLinks menu.
 *
 *   GET /api/dev/quick-links
 *
 * Consumed by public/dev-quick-links.js so the static .html pages in public/
 * can show the same quick-links menu as the Next.js pages.
 */
import { getQuickLinkGroups } from '@/app/_components/DevQuickLinks';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(getQuickLinkGroups());
}
