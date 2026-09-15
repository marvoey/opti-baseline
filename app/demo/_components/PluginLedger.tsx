import type { PluginFilter, RetiredPlugin } from "./types";

interface PluginLedgerProps {
  plugins: RetiredPlugin[];
  filter: PluginFilter;
}

export function PluginLedger({ plugins, filter }: PluginLedgerProps) {
  const visiblePlugins = filter === "all" ? plugins : plugins.filter((plugin) => plugin.category === filter);

  return (
    <div className="rounded-3xl border border-[#7DDD3D]/40 bg-white p-6 sm:p-8 space-y-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4F0DA] pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#3AB533] block">
            WordPress VIP Operational De-Risking
          </span>
          <h3 className="text-xl font-extrabold text-[#102412]">
            9 WordPress Plugins Replaced by Optimizely SaaS CMS
          </h3>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[#ABFF44] text-[#102412] text-xs font-extrabold border border-[#7DDD3D]">
          Total Hard Savings: $84,000+ / year
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E4F0DA] bg-[#E4F0DA] text-[#102412] uppercase tracking-wider font-extrabold">
              <th className="py-3 px-4">Current WP Plugin / Tool</th>
              <th className="py-3 px-4">Current Purpose &amp; Friction</th>
              <th className="py-3 px-4">Optimizely SaaS CMS Replacement</th>
              <th className="py-3 px-4 text-right">Estimated Annual Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {visiblePlugins.map((plugin) => (
              <tr key={plugin.name} className="hover:bg-[#E4F0DA]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#102412] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3AB533]" />
                  {plugin.name}
                </td>
                <td className="py-3.5 px-4 text-slate-600">{plugin.role}</td>
                <td className="py-3.5 px-4 font-semibold text-[#3AB533]">{plugin.replacement}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-right text-[#102412]">{plugin.saving}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
