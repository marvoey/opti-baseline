import type { TeaserStep } from "./types";

interface PresenterBannerProps {
  activeTeaser: TeaserStep;
}

const TALK_TRACKS: Record<TeaserStep, { script: string; action: string }> = {
  1: {
    script:
      "Patrick, you mentioned earlier that the CMS has zero awareness of Microsoft Dynamics CRM data—so every visitor looks like an anonymous stranger. Watch what happens in real time. Today, when Unilever visits NIQ.com, WordPress sees an anonymous IP. But when ODP is connected to your Dynamics CRM, the moment they hit the page, Optimizely Graph dynamically restructures the entire experience to FMCG category intelligence in under 18 milliseconds—with zero manual editor work.",
    action: "Click the persona buttons below to trigger live re-hydration of the hero headline and featured report.",
  },
  2: {
    script:
      "You flagged that manual translation across your 10 core markets is creating major release bottlenecks, leaving local sites with dated or substandard analysis. Watch this: instead of waiting three weeks for agencies and WPML plugin syncs, Optimizely Graph serves localized, on-brand analysis to Germany, France, or Japan instantaneously at the edge.",
    action: "Toggle between the German, French, and Japanese flags. Stop talking and let him observe the instantaneous translation.",
  },
  3: {
    script:
      "Today, Ninja Forms submissions sit in WordPress until someone manually exports a CSV and uploads it to Microsoft Dynamics. Watch what happens when an enterprise buyer requests a brief here: it streams into Dynamics in real time, creates the lead record, and triggers an automated 1:1 welcome in Optimizely Campaign under one unified domain reputation. And as you can see in the table below, that immediately retires 9 commercial plugins and custom code upkeep.",
    action: "Click 'Submit Brief' on the live form, then highlight the 9-plugin retirement ledger.",
  },
};

export function PresenterBanner({ activeTeaser }: PresenterBannerProps) {
  const track = TALK_TRACKS[activeTeaser];

  return (
    <div className="rounded-2xl border-2 border-[#3AB533] bg-white p-5 shadow-sm space-y-3 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4F0DA] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#ABFF44] text-[#102412] text-[11px] font-extrabold uppercase tracking-wider">
            Sandler Teaser {activeTeaser} Execution Cue
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Timing: 3 to 4 Minutes • Goal: Micro-proof without over-pitching
          </span>
        </div>
        <span className="text-xs font-bold text-[#3AB533]">Role: Marvin Oey (SA)</span>
      </div>

      <div className="space-y-1.5 text-xs text-slate-700">
        <p className="font-bold text-[#102412]">Talk Track Script:</p>
        <p className="italic bg-[#E4F0DA]/60 p-3 rounded-xl border border-[#7DDD3D]/30 leading-relaxed text-slate-900">
          &ldquo;{track.script}&rdquo;
        </p>
        <p className="text-[11px] text-slate-600 pt-1">
          &rarr; <strong>Action:</strong> {track.action}
        </p>
      </div>
    </div>
  );
}
