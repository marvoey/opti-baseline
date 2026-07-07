'use server';

import { revalidatePath } from 'next/cache';
import {
  deleteCmsDisplayTemplate,
  fetchCmsDisplayTemplate,
  type DeleteDisplayTemplateResult,
} from '@/lib/cms/displayTemplates';

/**
 * Server actions for the /admin/display-templates page. Both are thin wrappers
 * over the CMS Management API helpers; the delete action revalidates the list so
 * the removed template disappears without a manual refresh.
 */

export async function deleteDisplayTemplateAction(
  key: string,
): Promise<DeleteDisplayTemplateResult> {
  const res = await deleteCmsDisplayTemplate(key);
  if (res.ok) revalidatePath('/admin/display-templates');
  return res;
}

export type ExportResult =
  | { ok: true; filename: string; json: string }
  | { ok: false; message: string };

/**
 * Fetch a template's full definition as pretty JSON so the client can download a
 * re-importable copy before deleting.
 */
export async function exportDisplayTemplateAction(key: string): Promise<ExportResult> {
  const res = await fetchCmsDisplayTemplate(key);
  if (!res.ok) return { ok: false, message: res.message };
  return {
    ok: true,
    filename: `${key}.displaytemplate.json`,
    json: JSON.stringify(res.displayTemplate, null, 2),
  };
}
