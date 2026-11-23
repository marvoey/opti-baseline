import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthShell from '../_components/AuthShell';
import { LoginForm } from '../_components/AuthForms';
import { currentUser } from '@/lib/guide/session';

export const metadata: Metadata = { title: 'Sign in · Setup guide' };

export default async function LoginPage() {
  if (await currentUser()) redirect('/setup-guide');
  return (
    <AuthShell title="Welcome back." intro={<p>Sign in to pick up where you left off. Your ticks are saved to your account.</p>}>
      <LoginForm />
    </AuthShell>
  );
}
