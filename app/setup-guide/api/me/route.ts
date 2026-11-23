import { currentUser, isFacilitator } from '@/lib/guide/session';

/**
 * GET /setup-guide/api/me — whether the signed-in account is a facilitator. Used by the quick-links
 * menu (app/_components/DevQuickLinksMenu.tsx) to show the Team progress link only to facilitators.
 * Says nothing about who you are; signed-out or misconfigured both answer `false`. The cookie is
 * scoped to /setup-guide, which is why this lives under it.
 */
export async function GET() {
  const user = await currentUser().catch(() => null);
  return Response.json({ facilitator: user ? isFacilitator(user) : false }, { headers: { 'Cache-Control': 'no-store' } });
}
