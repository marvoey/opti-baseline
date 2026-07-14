import type { OpalPayload, PolicyContentWithDebug } from "../_hooks/useOpalChat";

export function NoContentCard({
  payload,
  policyContent,
}: {
  payload: OpalPayload;
  policyContent: PolicyContentWithDebug | null;
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-bold text-gray-900">
        {payload.lob ?? "Response"}
        {payload.topic && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            · {String(payload.topic)}
          </span>
        )}
      </h4>
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
        No policy content found for this LOB / topic combination.
      </p>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Opal payload
        </p>
        <pre className="text-xs text-gray-500 bg-gray-50 rounded p-3 overflow-x-auto">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
      {policyContent?._debug && (
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Resolution debug
          </p>
          <pre className="text-xs text-gray-500 bg-gray-50 rounded p-3 overflow-x-auto">
            {JSON.stringify(policyContent._debug, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
