import type { OpalPayload, PolicyContentWithDebug } from "../_types";

export function NoContentCard({
  payload,
  policyContent,
}: {
  payload: OpalPayload;
  policyContent: PolicyContentWithDebug | null;
}) {
  const lob = payload.LOB ?? payload.lob;
  const topic = payload.Topic ?? payload.topic;
  const jurisdiction = payload.Jurisdiction ?? payload.jurisdiction;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">No policy content found</p>
          <p className="text-sm text-gray-500 mt-0.5">
            There is no knowledge base entry for this combination.
          </p>
        </div>
      </div>

      {/* What was searched */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Searched for</p>
        <div className="flex flex-wrap gap-2">
          {lob && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">
              <span className="text-gray-400">LOB</span> {String(lob)}
            </span>
          )}
          {topic && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">
              <span className="text-gray-400">Topic</span> {String(topic)}
            </span>
          )}
          {jurisdiction && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">
              <span className="text-gray-400">Jurisdiction</span> {String(jurisdiction)}
            </span>
          )}
        </div>
      </div>

      {/* Guidance */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Consultant guidance</p>
        <p className="text-sm text-blue-900">
          No specific guidance is available for this scenario. Please refer to the standard policy
          documentation or escalate to your team lead for assistance.
        </p>
      </div>
    </div>
  );
}
