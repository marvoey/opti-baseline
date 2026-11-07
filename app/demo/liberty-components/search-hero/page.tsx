import SearchHero from '@/app/_components_liberty/SearchHero';
import SuggestedChips from '@/app/_components_liberty/SuggestedChips';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('search-hero');

export default function Page() {
  return (
    <Showcase
      slug="search-hero"
      flush
      props={[
        { name: 'title', type: 'string', defaultValue: '"Get clear answers about your insurance"' },
        { name: 'subtitle', type: 'string', defaultValue: '"Ask in your own words. We\'ll answer with information from Liberty Mutual…"' },
        { name: 'placeholder', type: 'string', defaultValue: '"Ask a question about car, home or renters insurance"' },
        { name: 'buttonLabel', type: 'string', defaultValue: '"Ask"' },
        { name: 'inputLabel', type: 'string', defaultValue: '"Ask a question"' },
        { name: 'action', type: 'string', defaultValue: 'current page', note: 'GET form target' },
        { name: 'name', type: 'string', defaultValue: '"q"' },
        { name: 'children', type: 'ReactNode', note: 'Shown under the search box, e.g. <SuggestedChips />' },
        { name: 'className', type: 'string', defaultValue: "'pt-14 pb-8'", note: 'Vertical padding; replaces the default' },
      ]}
      variants={[
        {
          label: 'With suggested chips (as on the home page)',
          flush: true,
          node: (
            <SearchHero>
              <SuggestedChips />
            </SearchHero>
          ),
        },
        {
          label: 'Custom text',
          flush: true,
          node: (
            <SearchHero
              title="Find answers about your claim"
              subtitle="Ask a question and we'll point you to the right place."
              placeholder="Ask about a claim"
              buttonLabel="Search"
            />
          ),
        },
      ]}
    >
      <SearchHero />
    </Showcase>
  );
}
