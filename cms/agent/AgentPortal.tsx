import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import IllustrationBanner, { type IllustrationScene } from '@/app/_components_liberty/IllustrationBanner';
import SignInForm, { type SignInAgent } from '@/app/_components_portal/SignInForm';
import { demoSwitchEnabled, getAgent } from '@/lib/agent/getAgent';
import { AGENTS, AGENT_KEYS } from '@/lib/agent/personas';
import { safeDestination } from '@/lib/agent/portalConfig';
import { choice, str } from '../liberty/shared';
import { isEditing } from './AgentBlockFrame';

/**
 * Portal (`_page`): the login page of the Independent Agent Portal (screen 0 of
 * public/use-case-2-agent-portal.html). A split card: the welcome and an
 * illustration on the left, the sign-in form on the right.
 *
 * DEMO ONLY: "Sign in" does not check a password. It chooses one of the four demo
 * agents and goes to the destination. No credentials are collected (see
 * SignInForm). A real portal signs in through the company's single sign-on.
 */
export const AgentPortalContentType = contentType({
  key: 'AgentPortal',
  baseType: '_page',
  displayName: 'Portal',
  description: 'Login page of the Independent Agent Portal: welcome panel and a demo sign-in form.',
  // Set in the CMS (not by the first push): the Portal page holds the dashboards, the priorities page and the product pages.
  mayContainTypes: ['AgentDashboardExperience', 'AgentPriorities', 'AgentProductExperience'],
  properties: {
    MetaTitle: str('Meta Title', 5, 'Browser tab / SEO title. Falls back to the page name.'),
    MetaDescription: str('Meta Description', 6),
    Eyebrow: str('Eyebrow', 10, 'Small label above the heading, e.g. "Independent Agent Portal".'),
    HeadingBold: str('Heading (bold line)', 20),
    HeadingLight: str('Heading (light line)', 30),
    Intro: str('Intro', 40),
    Scene: {
      ...choice('Illustration', 50, [
        ['family', 'Family'],
        ['road', 'Road'],
        ['house', 'House'],
      ]),
      format: 'selectOne' as const,
    },
    SignInTitle: str('Form title', 60, 'e.g. "Sign in".'),
    SignInIntro: str('Form intro', 70),
    DemoPickerLabel: str('"Sign in as" label', 75, 'Demo only: lets the presenter choose the agent. e.g. "Sign in as (demo)".'),
    EmailLabel: str('Email label', 80),
    PasswordLabel: str('Password label', 90),
    RememberLabel: str('"Keep me signed in" label', 100),
    ForgotLabel: str('"Forgot password" link text', 110),
    ForgotUrl: str('"Forgot password" URL', 120),
    ButtonLabel: str('Sign in button text', 130),
    NewUserText: str('"New to the portal" text', 140),
    RequestAccessLabel: str('"Request access" link text', 150),
    RequestAccessUrl: str('"Request access" URL', 160),
    DestinationUrl: str(
      'Where Sign in leads',
      170,
      'A path on this site, e.g. /agent/{agent}. {agent} becomes the chosen agent (dana, tyler, marcus or elena). Anything else, such as a full https:// address, is ignored and the portal home is used.',
    ),
    DemoNote: str(
      'Demo note',
      180,
      'Shown under the form. Keep it: it tells visitors that no password is checked or stored.',
    ),
  },
});

type Props = { content: ContentProps<typeof AgentPortalContentType> };

const SCENES: IllustrationScene[] = ['family', 'road', 'house'];

export default async function AgentPortal({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const current = await getAgent();
  const editing = isEditing(content);

  const agents: SignInAgent[] = AGENT_KEYS.map((key) => ({
    key,
    label: `${AGENTS[key].name} · ${AGENTS[key].role} · ${AGENTS[key].state}`,
    email: AGENTS[key].email,
  }));
  const scene = SCENES.find((s) => s === content.Scene) ?? 'family';

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)} className="bg-white pb-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-3xl border border-gray-200 shadow-[0_10px_40px_rgba(26,20,70,.10)] md:min-h-[560px] md:grid-cols-2">
          <div className="flex flex-col justify-between bg-mist p-6 sm:p-10">
            <div>
              <div {...pa('Eyebrow')} className="text-xs font-bold uppercase tracking-[.14em] text-lmt">
                {content.Eyebrow}
              </div>
              <h1 className="mt-4 text-[30px] font-light leading-tight text-navy sm:text-[36px]">
                <span {...pa('HeadingBold')} className="font-bold">
                  {content.HeadingBold}
                </span>
                <br />
                <span {...pa('HeadingLight')}>{content.HeadingLight}</span>
              </h1>
              <div className="mt-4 h-1 w-12 rounded bg-lmy" aria-hidden="true" />
              <p {...pa('Intro')} className="mt-5 max-w-md leading-7 text-gray-700">
                {content.Intro}
              </p>
            </div>
            <div className="mt-8">
              <IllustrationBanner scene={scene} />
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-12">
            <h2 {...pa('SignInTitle')} className="text-[28px] font-light text-navy">
              {content.SignInTitle}
            </h2>
            <p {...pa('SignInIntro')} className="mt-2 text-sm text-gray-600">
              {content.SignInIntro}
            </p>
            {/* Disabled in the CMS preview so a click cannot navigate the editor frame away. */}
            <fieldset disabled={editing} className="contents">
              <SignInForm
                agents={agents}
                initial={current.key}
                choose={demoSwitchEnabled()}
                destination={safeDestination(content.DestinationUrl)}
                disabled={editing}
                labels={{
                  picker: content.DemoPickerLabel ?? '',
                  email: content.EmailLabel ?? '',
                  password: content.PasswordLabel ?? '',
                  remember: content.RememberLabel ?? '',
                  forgot: content.ForgotLabel ?? '',
                  forgotHref: content.ForgotUrl ?? '',
                  button: content.ButtonLabel ?? '',
                  newUser: content.NewUserText ?? '',
                  requestAccess: content.RequestAccessLabel ?? '',
                  requestAccessHref: content.RequestAccessUrl ?? '',
                  demoNote: content.DemoNote ?? '',
                }}
              />
            </fieldset>
          </div>
        </div>
      </div>
    </main>
  );
}
