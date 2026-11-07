import AccountActionCard from '@/app/_components_liberty/AccountActionCard';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('account-action-card');

export default function Page() {
  return (
    <Showcase
      slug="account-action-card"
      props={[
        { name: 'variant', type: "'login' | 'lookup'", defaultValue: "'login'", note: 'login = text + button + sign-up link · lookup = look-up fields + button' },
        { name: 'icon', type: 'IconName', defaultValue: "'user' (login) · 'search' (lookup)" },
        { name: 'title', type: 'string', defaultValue: 'per variant' },
        { name: 'description', type: 'string', defaultValue: 'login only', note: 'Paragraph under the title' },
        { name: 'buttonLabel', type: 'string', defaultValue: '"Log in" · "Find my claim"' },
        { name: 'buttonHref', type: 'string', defaultValue: '"#"' },
        { name: 'secondaryLabel', type: 'string', defaultValue: '"Create an account" (login)', note: 'Small link under the button' },
        { name: 'secondaryHref', type: 'string', defaultValue: '"#"' },
        { name: 'className', type: 'string' },
      ]}
      variants={[
        {
          label: 'Both variants side by side (claim status page)',
          node: (
            <div className="grid md:grid-cols-2 gap-6">
              <AccountActionCard variant="login" />
              <AccountActionCard variant="lookup" />
            </div>
          ),
        },
        {
          label: 'Custom text',
          node: (
            <div className="max-w-md">
              <AccountActionCard
                title="Sign in to manage your policy"
                description="Pay a bill, update your coverage or download your documents."
                buttonLabel="Sign in"
                secondaryLabel="New here? Register"
              />
            </div>
          ),
        },
      ]}
    >
      <div className="max-w-md">
        <AccountActionCard />
      </div>
    </Showcase>
  );
}
