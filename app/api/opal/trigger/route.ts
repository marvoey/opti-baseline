import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.OPAL_WEBHOOK_URL;
  const webhookToken = process.env.OPAL_WEBHOOK_TOKEN;

  const FILE = 'api/opal/trigger/route.ts';
  const HL  = '\x1b[1m\x1b[36m'; // bold cyan
  const RST = '\x1b[0m';

  if (!webhookUrl || !webhookToken) {
    console.error(`[${FILE}:9] OPAL_WEBHOOK_URL or OPAL_WEBHOOK_TOKEN env var is not set`);
    return Response.json({ error: 'Opal webhook is not configured' }, { status: 500 });
  }

  const { question, clientId, correlationId } = (await request.json()) as {
    question: string;
    clientId: string;
    correlationId: string;
  };
  console.log(`${HL}[${FILE}:22] ► sending question to Opal webhook: "${question}" | client-${clientId} | correlation-${correlationId}${RST}`);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookToken}`,
      },
      body: JSON.stringify({ question, clientId, correlationId }),
    });
    console.log(`[${FILE}:30] webhook response status:`, res.status);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[${FILE}:34] webhook returned error:`, res.status, body);
      return Response.json({ error: `Opal webhook error (${res.status})` }, { status: 502 });
    }
  } catch (err) {
    console.error(`[${FILE}:38] fetch to Opal webhook failed:`, err);
    return Response.json({ error: 'Could not reach Opal webhook' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
