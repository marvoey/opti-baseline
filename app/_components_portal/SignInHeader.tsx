import Link from 'next/link';
import LibertyLogo from '@/app/_components/LibertyLogo';
import { getAgent } from '@/lib/agent/getAgent';
import { PORTAL_HOME, portalConfig } from '@/lib/agent/portalConfig';
import AgentIdentity from './AgentIdentity';

/**
 * The simple Independent Agent Portal header, with no navigation and no agent
 * switch (the mockup's "signin" header). Used in place of PortalHeader (see
 * `chromeFor`):
 *  - 'signin', the sign-in page (/agent): the logo, Help and Español;
 *  - 'agent', the agents' own dashboards and the product page: the logo, the
 *    notification bell and the agent's initials, name and agency;
 *  - 'plain', the priorities page: the logo only.
 * The logo leads to the sign-in page, which is also how a presenter switches to
 * another agent.
 */
export default async function SignInHeader({ variant = 'signin' }: { variant?: 'signin' | 'agent' | 'plain' }) {
  const agent = variant === 'agent' ? await getAgent() : null;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <header className="lmig-FloatingHeader lmig-FloatingHeader--liberty">
        <div className="lm-Row lm-Row--main lm-Row--start lm-Row--stretch">
          <div className="lm-Col lm-Col--base-12">
            <div className="lmig-FloatingHeader-inner lmig-FloatingHeader-inner--liberty">
              <Link
                href={PORTAL_HOME}
                title="Go to the portal home page"
                className="lmig-FloatingHeader-brand lmig-FloatingHeader-brand--liberty"
              >
                <LibertyLogo className="lmig-FloatingHeader-brand-logo lmig-FloatingHeader-brand-logo--liberty" />
              </Link>
              <div className="lmig-FloatingHeader-actions ml-auto">
                {/* Help and Español only on the sign-in page; 'agent' shows the bell and the agent; 'plain' just the logo. */}
                {variant === 'signin' &&
                  portalConfig.signInLinks.map((l) => (
                    <a key={l.label} href={l.href}>
                      {l.label}
                    </a>
                  ))}
                {agent && <AgentIdentity agent={agent} />}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
