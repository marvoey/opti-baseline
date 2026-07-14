import type { PolicyContent } from "../_lib/twoPassResolve";

export function PolicyCard({ policy }: { policy: PolicyContent }) {
  return (
    <div className="space-y-4">
      <h4 className="font-bold text-gray-900">
        Coverage Found: {policy.lob}
        <span className="ml-2 text-sm font-normal text-gray-500">
          · {policy.topic}
        </span>
      </h4>

      {/* 1 — Core Principle */}
      {policy.corePrinciple && (
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 mb-2">
            National Policy
          </span>
          <div
            className="text-gray-700 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.corePrinciple }}
          />
        </div>
      )}

      {/* 2 — Jurisdictional Override */}
      {policy.override && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#004A8F] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {policy.jurisdictionName} Override
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-semibold ${
                policy.pass === 1
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-yellow-100 text-yellow-700 border border-yellow-200"
              }`}
            >
              {policy.pass === 1
                ? `Pass 1 · ${policy.jurisdiction}`
                : "Pass 2 · National"}
            </span>
          </div>
          <div
            className="text-gray-700 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.override }}
          />
        </div>
      )}

      {/* 3 — Procedural Safeguard */}
      {policy.proceduralSafeguard && (
        <div className="border-t border-gray-100 pt-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-2">
            Consultant Action
          </span>
          <div
            className="text-gray-700 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.proceduralSafeguard }}
          />
        </div>
      )}

      {/* 4 — Statutory Disclosure */}
      {policy.disclosure && (
        <div className="border-t border-gray-100 pt-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200 mb-2">
            Required Disclosure
          </span>
          <div
            className="text-gray-700 text-sm prose prose-sm max-w-none bg-red-50 border border-red-100 rounded p-3"
            dangerouslySetInnerHTML={{ __html: policy.disclosure }}
          />
        </div>
      )}

      {/* Source badge */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
          Sources
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
            <svg
              className="w-3 h-3 text-[#007BC7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {policy.overrideLabel}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-semibold ${
              policy.pass === 1
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
            }`}
          >
            {policy.pass === 1
              ? `Pass 1 · ${policy.jurisdiction}`
              : "Pass 2 · National"}
          </span>
        </div>
      </div>
    </div>
  );
}
