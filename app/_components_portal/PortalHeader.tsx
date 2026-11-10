import Link from 'next/link';
import { Search } from 'lucide-react';
import LibertyLogo from '@/app/_components/LibertyLogo';
import MobileMenu from '@/app/_components/MobileMenu';
import { getAgent, demoSwitchEnabled } from '@/lib/agent/getAgent';
import { AGENTS, AGENT_KEYS } from '@/lib/agent/personas';
import { portalConfig, portalHomeFor } from '@/lib/agent/portalConfig';
import AgentIdentity from './AgentIdentity';
import AgentSwitch from './AgentSwitch';
import PortalNavLinks from './PortalNavLinks';

/**
 * Independent Agent Portal header: the utility row (portal name, support links
 * and the demo "view as" switch) above the same floating header as LM.com, with
 * the portal navigation and the signed-in agent. Header CSS is the shared
 * `.lmig-FloatingHeader*` set in app/globals.css.
 *
 * Shown instead of TopNav + MainNav on /agent/* (see ChromeSwitch).
 */
export default async function PortalHeader() {
  const agent = await getAgent();
  // "Home" and the logo lead to this agent's own dashboard; /agent is the sign-in page.
  const home = portalHomeFor(agent.key);
  const navLinks = portalConfig.navLinks.map((l) => (l.label === 'Home' ? { ...l, href: home } : l));
  const options = AGENT_KEYS.map((key) => ({
    key,
    label: `${AGENTS[key].name} · ${AGENTS[key].role} · ${AGENTS[key].state}`,
  }));

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 pt-3 text-xs text-gray-500 sm:px-6">
        <span className="font-medium tracking-wide text-navy">{portalConfig.name}</span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {portalConfig.utilityLinks.map((l) => (
            <a key={l.label} href={l.href} className="py-1 transition-colors hover:text-navy">
              {l.label}
            </a>
          ))}
          {demoSwitchEnabled() && <AgentSwitch current={agent.key} options={options} />}
        </span>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="lmig-FloatingHeader lmig-FloatingHeader--liberty lmig-FloatingHeader--isSticky">
          <div className="lm-Row lm-Row--main lm-Row--start lm-Row--stretch">
            <div className="lm-Col lm-Col--base-12">
              <div className="lmig-FloatingHeader-inner lmig-FloatingHeader-inner--liberty">
                <Link
                  href={home}
                  title="Go to the portal home page"
                  className="lmig-FloatingHeader-brand lmig-FloatingHeader-brand--liberty"
                >
                  <LibertyLogo className="lmig-FloatingHeader-brand-logo lmig-FloatingHeader-brand-logo--liberty" />
                </Link>

                <nav className="lmig-FloatingHeader-nav" aria-label="Portal navigation">
                  <div className="lmig-FloatingHeader-nav-menu text-[14px]">
                    <PortalNavLinks links={navLinks} />
                  </div>
                </nav>

                <div className="lmig-FloatingHeader-actions">
                  <button type="button" aria-label="Search">
                    <Search size={16} aria-hidden="true" />
                    <span className="lmig-FloatingHeader-label">Search</span>
                  </button>
                  <AgentIdentity agent={agent} />
                </div>

                <MobileMenu links={navLinks} />
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
