import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthShell from '../_components/AuthShell';
import { SignupForm } from '../_components/AuthForms';
import { guideConfig } from '@/lib/guide/config';
import { currentUser } from '@/lib/guide/session';

export const metadata: Metadata = { title: 'Create your account · Setup guide' };

export default async function SignupPage() {
  if (await currentUser()) redirect('/setup-guide');
  const { allowedDomain } = guideConfig();
  return (
    <AuthShell
      title="Create your account."
      intro={
        <>
          <p>You’ll use it to follow the setup guide and keep track of your progress, on any computer.</p>
          <p>Your password is never stored as text. It’s scrambled one way before it’s saved, so nobody can read it.</p>
        </>
      }
    >
      <SignupForm domain={allowedDomain} />
    </AuthShell>
  );
}
