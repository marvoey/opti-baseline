'use server';

import { redirect } from 'next/navigation';
import { deleteCmsDisplayTemplate } from '@/lib/cms/displayTemplates';

export async function deleteDisplayTemplate(key: string): Promise<{ error: string } | void> {
  const result = await deleteCmsDisplayTemplate(key);
  if (!result.ok) return { error: result.message };
  redirect('/admin/display-templates');
}
