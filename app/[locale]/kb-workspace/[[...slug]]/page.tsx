export const dynamic = 'force-dynamic';

import { twoPassResolve } from '../_lib/twoPassResolve';
import KbWorkspaceShell from './_KbWorkspaceShell';

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  const resolvedContent = twoPassResolve(slug[0]);
  return <KbWorkspaceShell resolvedContent={resolvedContent} />;
}
