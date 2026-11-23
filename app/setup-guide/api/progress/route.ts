import { currentUser } from '@/lib/guide/session';
import { updateUser } from '@/lib/guide/users';
import { CHECK_IDS, computeProgress, isCheckId, isOs, isShell, isWinMode } from '../../_lib/checks';
import { isFolders, sameFolders } from '../../_lib/folders';

/**
 * POST /setup-guide/api/progress — saves the signed-in colleague's ticks and computer/terminal/shell
 * choices to their GuideUser record. Called in batches by GuideProvider (also with keepalive on tab close).
 * Body: { checks: string[], os: "mac" | "win", shell?: "zsh" | "bash", winMode?: "native" | "wsl",
 *         folders?: { container: string, main: string } }  (kebab-case names; omitted for the suggested ones)
 */

const MAX_BODY = 8_000;

function sameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') return false;
  const origin = request.headers.get('origin');
  if (!origin) return true; // same-origin requests from older browsers; the SameSite=Lax cookie still applies
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const user = await currentUser();
  if (!user) return Response.json({ error: 'Signed out' }, { status: 401 });

  const text = await request.text();
  if (text.length > MAX_BODY) return Response.json({ error: 'Too large' }, { status: 413 });
  let body: { checks?: unknown; os?: unknown; shell?: unknown; winMode?: unknown; folders?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (
    !Array.isArray(body.checks) ||
    !isOs(body.os) ||
    (body.shell !== undefined && !isShell(body.shell)) ||
    (body.winMode !== undefined && !isWinMode(body.winMode)) ||
    (body.folders !== undefined && !isFolders(body.folders))
  ) {
    return Response.json({ error: 'Invalid progress' }, { status: 400 });
  }

  const ticked = new Set(body.checks.filter(isCheckId));
  const checks = CHECK_IDS.filter((id) => ticked.has(id)); // page order, no duplicates
  const os = body.os;
  const shell = body.shell;
  const winMode = body.winMode;
  const folders = body.folders; // undefined, or validated kebab-case names

  const stored = user.progress;
  const unchanged =
    stored.os === os &&
    stored.shell === shell &&
    stored.winMode === winMode &&
    sameFolders(stored.folders, folders) &&
    stored.checks.length === checks.length &&
    checks.every((c, i) => stored.checks[i] === c);
  if (unchanged) return Response.json({ ok: true, changed: false });

  const now = new Date().toISOString();
  await updateUser(user, {
    Progress: JSON.stringify({ checks, os, shell, winMode, folders, updatedAt: now }),
    ProgressPercent: computeProgress(checks, os, winMode).percent,
    LastSeenAt: now,
  });
  return Response.json({ ok: true, changed: true });
}
