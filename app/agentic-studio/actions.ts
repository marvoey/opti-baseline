'use server';

import {
  createExperience,
  publishExperience,
  type CreateExperienceResult,
  type FinalCompositionAst,
} from '@/lib/cms/experiences';

export type PublishGeneratedExperienceResult =
  | { ok: true; key: string; placed: boolean; published: boolean; publishMessage?: string }
  | { ok: false; reason: 'missing-credentials' | 'error'; message: string };

/**
 * Server Action boundary between the client-side Agentic Studio demo
 * (app/_components/agentic-intent-composition.jsx) and the CMA write client
 * (lib/cms/experiences.ts). OPTIMIZELY_CMS_CLIENT_ID/_SECRET are only ever
 * read here, server-side — never in code reachable from the browser bundle.
 */
export async function publishGeneratedExperience(
  ast: FinalCompositionAst,
  meta: { displayName: string; routeSegment: string; publish: boolean },
): Promise<PublishGeneratedExperienceResult> {
  const result: CreateExperienceResult = await createExperience({
    displayName: meta.displayName,
    routeSegment: meta.routeSegment,
    ast,
  });

  if (!result.ok) {
    return { ok: false, reason: result.reason, message: result.message };
  }

  if (!meta.publish) {
    return { ok: true, key: result.key, placed: result.placed, published: false };
  }

  const publishResult = await publishExperience(result.key);
  return {
    ok: true,
    key: result.key,
    placed: result.placed,
    published: publishResult.ok,
    publishMessage: publishResult.message,
  };
}
