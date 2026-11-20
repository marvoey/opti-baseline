'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { checkBasicAuth } from '@/lib/basicAuth';
import { deleteCmsContentType } from '@/lib/cms/contentTypes';

export async function deleteContentTypesAction(
  keys: string[],
): Promise<{ ok: boolean; failedKeys: string[]; message?: string }> {
  // Defence in depth: proxy.ts already gates /admin, but a server action can be POSTed
  // from elsewhere, so check the password here too before deleting anything.
  const authorization = (await headers()).get('authorization');
  if (!checkBasicAuth(authorization, process.env.ADMIN_PASSWORD ?? '')) {
    return { ok: false, failedKeys: keys, message: 'Not authorized.' };
  }

  if (keys.length === 0) return { ok: true, failedKeys: [] };

  const results = await Promise.all(
    keys.map(async (key) => ({ key, ...(await deleteCmsContentType(key)) })),
  );

  const failedKeys = results.filter((r) => !r.ok).map((r) => r.key);
  if (failedKeys.length < keys.length) revalidatePath('/admin');

  return {
    ok: failedKeys.length === 0,
    failedKeys,
    message: failedKeys.length > 0 ? `Failed to delete: ${failedKeys.join(', ')}` : undefined,
  };
}
