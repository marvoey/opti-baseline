import type { Metadata } from 'next';
import IllustrationBanner from '@/app/_components_liberty/IllustrationBanner';
import QuestionTileGrid from '@/app/_components_liberty/QuestionTileGrid';
import SearchHero from '@/app/_components_liberty/SearchHero';
import SuggestedChips from '@/app/_components_liberty/SuggestedChips';

const BASE = '/demo/ask-liberty';
const RENTAL_CAR = `${BASE}/rental-car`;
const REQUIRED = `${BASE}/required-coverage`;
const BURST_PIPE = `${BASE}/burst-pipe`;
const BUNDLING = `${BASE}/bundling`;
const CLAIM_STATUS = `${BASE}/claim-status`;
const LEGAL = `${BASE}/legal-question`;

export const metadata: Metadata = {
  title: 'Ask Liberty — Get clear answers about your insurance',
  description:
    "Ask in your own words. We'll answer with information from Liberty Mutual and help you take the next step.",
};

/**
 * Ask Liberty home page (page 0 of public/use-case-1-ask-liberty.html), composed
 * from the components in app/_components_liberty. Every text is the components'
 * default, so this renders the mockup as-is; pass props to change any of it.
 * The site header and footer come from ./layout.tsx (SiteChrome).
 */
export default function AskLibertyHomePage() {
  return (
    <main className="bg-white">
      <SearchHero>
        <SuggestedChips
          chips={[
            { label: 'Does my car insurance cover a rental car?', href: RENTAL_CAR },
            { label: 'Is a burst pipe covered by home insurance?', href: BURST_PIPE },
            { label: 'What car insurance am I required to have?', href: REQUIRED },
            { label: 'Can I bundle home and auto?', href: BUNDLING },
          ]}
        />
      </SearchHero>
      <div className="max-w-5xl mx-auto px-6">
        <IllustrationBanner scene="family" />
      </div>
      <QuestionTileGrid
        tiles={[
          { category: 'Car', question: 'Does my car insurance cover a rental car?', href: RENTAL_CAR },
          { category: 'Home', question: 'Is water damage from a burst pipe covered?', href: BURST_PIPE },
          { category: 'Bundles', question: 'Can I bundle my home and auto insurance?', href: BUNDLING },
          { category: 'Car', question: 'What car insurance am I required to have?', href: REQUIRED },
          { category: 'Claims', question: 'How do I check the status of my claim?', href: CLAIM_STATUS },
          { category: 'Claims', question: 'What should I do after a car accident?', href: LEGAL },
        ]}
      />
    </main>
  );
}
