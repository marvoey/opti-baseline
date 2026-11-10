import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { safeHref } from '@/app/_components_liberty/utils';
import { getAgent } from '@/lib/agent/getAgent';
import { applyTokens } from '@/lib/agent/tokens';
import { ComponentWrapper } from '../wrappers';
import { lines, parts, str, strList } from '../liberty/shared';

/**
 * Agent Product Page (`_experience`): a product or bundle page of the
 * Independent Agent Portal (screen 2 of public/use-case-2-agent-portal.html, the
 * Home + Auto bundle). The breadcrumb, the centred heading and lead and the two
 * buttons are part of the page type; everything below is a normal Visual Builder
 * canvas. The page is for whoever is viewing it: {state}, {agency} and so on in
 * the text and the "More ways to bundle" cards follow that agent.
 */
export const AgentProductExperienceContentType = contentType({
  key: 'AgentProductExperience',
  baseType: '_experience',
  displayName: 'Agent Product Page',
  description: 'Portal product page: breadcrumb, centred heading and lead, two buttons, then a canvas of blocks.',
  mayContainTypes: ['*'],
  properties: {
    MetaTitle: str('Meta Title', 5, 'Browser tab / SEO title. Falls back to the page name.'),
    MetaDescription: str('Meta Description', 6),
    Breadcrumb: strList(
      'Breadcrumb',
      10,
      'One step per line: Label | URL. The last step is the current page (no URL). Tokens work, e.g. /agent/{key} is the agent\'s own dashboard.',
      6,
    ),
    Heading: str('Heading', 20),
    Lead: str('Lead', 30, 'You can use {first}, {state}, {agency} and {role}.'),
    PrimaryButtonLabel: str('Primary button text', 40),
    PrimaryButtonUrl: str('Primary button URL', 50),
    SecondaryButtonLabel: str('Secondary button text', 60),
    SecondaryButtonUrl: str('Secondary button URL', 70),
  },
});

type Props = { content: ContentProps<typeof AgentProductExperienceContentType> };

export default async function AgentProductExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const agent = await getAgent();
  const t = (s: string | null | undefined) => applyTokens(s, agent);
  const crumbs = lines(content.Breadcrumb).map(parts).filter(([label]) => label);
  const nodes = content.composition?.nodes ?? [];

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)} className="bg-white pb-4 pt-6">
      {/* The product page is a 5xl column like the Liberty blocks, so the portal blocks are squeezed to match. */}
      <div className="[&_.max-w-6xl]:max-w-5xl">
        <div className="mx-auto max-w-5xl px-6">
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
              {crumbs.map(([label, url], i) => {
                const last = i === crumbs.length - 1;
                return (
                  <span key={`${label}-${i}`}>
                    {i > 0 && ' › '}
                    {url && !last ? (
                      <a href={safeHref(t(url))} className="text-lmt underline underline-offset-2">
                        {t(label)}
                      </a>
                    ) : (
                      <span aria-current={last ? 'page' : undefined}>{t(label)}</span>
                    )}
                  </span>
                );
              })}
            </nav>
          )}
          <div className="pt-6 text-center">
            <h1 {...pa('Heading')} className="text-[32px] font-light leading-tight text-navy md:text-[40px]">
              {t(content.Heading)}
            </h1>
            <p {...pa('Lead')} className="mx-auto mt-3 max-w-3xl text-[17px] text-gray-600">
              {t(content.Lead)}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {content.PrimaryButtonLabel && (
                <a
                  href={safeHref(content.PrimaryButtonUrl)}
                  className="rounded-md bg-lmt px-7 py-3 font-medium text-white hover:bg-lmtd"
                >
                  {t(content.PrimaryButtonLabel)}
                </a>
              )}
              {content.SecondaryButtonLabel && (
                <a
                  href={safeHref(content.SecondaryButtonUrl)}
                  className="rounded-md border border-lmt bg-white px-7 py-3 font-medium text-lmt"
                >
                  {t(content.SecondaryButtonLabel)}
                </a>
              )}
            </div>
          </div>
        </div>
        {nodes.length > 0 && <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />}
      </div>
    </main>
  );
}
