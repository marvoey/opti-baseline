import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.OPAL_WEBHOOK_URL;
  const webhookToken = process.env.OPAL_WEBHOOK_TOKEN;

  if (!webhookUrl || !webhookToken) {
    console.error('[opal/trigger] OPAL_WEBHOOK_URL or OPAL_WEBHOOK_TOKEN env var is not set');
    return Response.json({ error: 'Opal webhook is not configured' }, { status: 500 });
  }

  const { question } = (await request.json()) as { question: string };
  console.log('[opal/trigger] sending question to Opal webhook:', question);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookToken}`,
      },
      body: JSON.stringify({ question }),
    });
    console.log('[opal/trigger] webhook response status:', res.status);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[opal/trigger] webhook returned error:', res.status, body);
      return Response.json({ error: `Opal webhook error (${res.status})` }, { status: 502 });
    }
  } catch (err) {
    console.error('[opal/trigger] fetch to Opal webhook failed:', err);
    return Response.json({ error: 'Could not reach Opal webhook' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
