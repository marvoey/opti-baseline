'use server';

import { cookies, headers } from 'next/headers';
import { hasPrivacySignal, hostnameOf, isBot, queueOdpEvents, signupEvent } from '@/lib/odpTracking';

export type SignupState = { status: 'idle' | 'success' | 'error'; message?: string; email?: string };

const VISITOR_COOKIE = 'hrb_vid'; // set by proxy.ts
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PAGE = /^\/[A-Za-z0-9/_-]{0,100}$/;

/**
 * Newsletter signup. Sends one event to ODP carrying the email AND this browser's visitor ID (as `vuid`), so ODP
 * stitches the anonymous profile built from earlier page views and clicks into the profile for that email.
 * See signupEvent() in lib/odpTracking.ts. Nothing else is stored or sent: there is no email service behind it.
 */
export async function subscribe(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return { status: 'error', message: 'Enter a valid email address, like name@example.com.', email };
  }

  // Honeypot: a person never sees or fills this hidden field. Pretend it worked, send nothing.
  if (String(formData.get('company') ?? '')) return { status: 'success', email };

  // Read request data before queueing: the event is sent after the response, where it is not available.
  const [h, jar] = await Promise.all([headers(), cookies()]);
  if (!isBot(h)) {
    const page = String(formData.get('page') ?? '');
    queueOdpEvents([
      signupEvent(
        {
          // With a Global Privacy Control / Do Not Track signal only the email is sent, so nothing is linked.
          visitorId: hasPrivacySignal(h) ? undefined : jar.get(VISITOR_COOKIE)?.value,
          hostname: hostnameOf(h),
          page: PAGE.test(page) ? page : '/newsletter',
          title: 'Newsletter',
        },
        email,
      ),
    ]);
  }
  return { status: 'success', email };
}
