import { INTENT, PERSONA, GEO, SERVICE } from '@/lib/cms/taxonomy';
import type { TaxonomyFilters } from '@/lib/cms/fetchByTaxonomy';

function toOpts(map: Record<string, { displayName: string }>) {
  return Object.entries(map).map(([value, { displayName }]) => ({ value, displayName }));
}

function SelectField({
  name,
  label,
  current,
  options,
}: {
  name: string;
  label: string;
  current: string | undefined;
  options: { value: string; displayName: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={current ?? ''}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
      >
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}

type Props = {
  filters: TaxonomyFilters;
  /** Target URL for the form action. Defaults to current page (empty string). */
  action?: string;
  /** Path used in "Clear filters" link. */
  clearHref: string;
};

export function FilterForm({ filters, action = '', clearHref }: Props) {
  const hasFilter = Object.values(filters).some(Boolean);
  return (
    <form method="GET" action={action}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField name="intent"  label="Intent"  current={filters.intent}  options={toOpts(INTENT)}  />
        <SelectField name="persona" label="Persona" current={filters.persona} options={toOpts(PERSONA)} />
        <SelectField name="geo"     label="Geo"     current={filters.geo}     options={toOpts(GEO)}     />
        <SelectField name="service" label="Service" current={filters.service} options={toOpts(SERVICE)} />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
        {hasFilter && (
          <a
            href={clearHref}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Clear filters
          </a>
        )}
      </div>
    </form>
  );
}
