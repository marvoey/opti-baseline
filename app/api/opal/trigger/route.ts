import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const WEBHOOK_URL = process.env.OPAL_WEBHOOK_URL!;
const WEBHOOK_TOKEN = process.env.OPAL_WEBHOOK_TOKEN!;

export async function POST(request: NextRequest) {
  const { question } = (await request.json()) as { question: string };
  console.log('[opal/trigger] sending question to Opal webhook:', question);

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${WEBHOOK_TOKEN}`,
    },
    body: JSON.stringify({ question }),
  });

  console.log('[opal/trigger] webhook response status:', res.status);
  return Response.json({ ok: true });
}
