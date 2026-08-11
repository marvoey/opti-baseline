import { createApiClient } from '@optimizely/cms-cli/dist/service/cmsRestClient.js';
import type { components } from '@optimizely/cms-cli/dist/service/apiSchema/openapi-schema-types.js';

type Application = components['schemas']['Application'];
type ApplicationHost = components['schemas']['ApplicationHost'];

async function getApplications(): Promise<Application[]> {
  // No host arg — lets the client default to the SaaS API gateway
  // (api.cms.optimizely.com). OPTIMIZELY_CMS_URL is the editor app URL
  // (app-xxx.cms.optimizely.com) which fails the isSaasApiGateway check
  // and causes token fetching to hit the wrong endpoint.
  const client = await createApiClient();
  const { data, error } = await client.GET('/applications', {
    params: { query: { pageIndex: 0, pageSize: 100 } },
  });
  if (error) throw new Error(`Failed to fetch applications: ${JSON.stringify(error)}`);
  return data?.items ?? [];
}

function HostRow({ host }: { host: ApplicationHost }) {
  return (
    <tr className="border-t border-gray-100">
      <td className="py-1.5 pr-4 font-mono text-sm">{host.authority}</td>
      <td className="py-1.5 pr-4 text-sm text-gray-500">{host.type ?? '—'}</td>
      <td className="py-1.5 pr-4 text-sm text-gray-500">{host.locale ?? '—'}</td>
      <td className="py-1.5 text-sm text-gray-500">{host.preferredUrlScheme ?? '—'}</td>
    </tr>
  );
}

function ApplicationCard({ app }: { app: Application }) {
  const previewFormats = app.previewUrlFormats
    ? Object.entries(app.previewUrlFormats)
    : [];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{app.displayName}</h2>
          <p className="text-sm text-gray-400 font-mono mt-0.5">{app.key}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {app.type}
          </span>
          {app.isDefault && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              default
            </span>
          )}
        </div>
      </div>

      {/* Core settings */}
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-gray-500 font-medium">Entry point</dt>
        <dd className="font-mono text-gray-800 break-all">{app.entryPoint}</dd>

        {app.usePreviewTokens !== undefined && (
          <>
            <dt className="text-gray-500 font-medium">Preview tokens</dt>
            <dd className="text-gray-800">{app.usePreviewTokens ? 'Yes' : 'No'}</dd>
          </>
        )}

        {app.useApplicationSpecificAssets !== undefined && (
          <>
            <dt className="text-gray-500 font-medium">App-specific assets</dt>
            <dd className="text-gray-800">{app.useApplicationSpecificAssets ? 'Yes' : 'No'}</dd>
          </>
        )}

        {app.assetsRoot && (
          <>
            <dt className="text-gray-500 font-medium">Assets root</dt>
            <dd className="font-mono text-gray-800 break-all">{app.assetsRoot}</dd>
          </>
        )}

        {app.lastModified && (
          <>
            <dt className="text-gray-500 font-medium">Last modified</dt>
            <dd className="text-gray-800">
              {new Date(app.lastModified).toLocaleString()} by {app.lastModifiedBy ?? '—'}
            </dd>
          </>
        )}

        {app.created && (
          <>
            <dt className="text-gray-500 font-medium">Created</dt>
            <dd className="text-gray-800">
              {new Date(app.created).toLocaleString()} by {app.createdBy ?? '—'}
            </dd>
          </>
        )}
      </dl>

      {/* Hosts */}
      {app.hosts && app.hosts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Hosts</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                <th className="pb-1.5 pr-4">Authority</th>
                <th className="pb-1.5 pr-4">Type</th>
                <th className="pb-1.5 pr-4">Locale</th>
                <th className="pb-1.5">Scheme</th>
              </tr>
            </thead>
            <tbody>
              {app.hosts.map((h, i) => (
                <HostRow key={i} host={h} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview URL formats */}
      {previewFormats.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview URL formats</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                <th className="pb-1.5 pr-4">Content type</th>
                <th className="pb-1.5">URL format</th>
              </tr>
            </thead>
            <tbody>
              {previewFormats.map(([type, format]) => (
                <tr key={type} className="border-t border-gray-100">
                  <td className="py-1.5 pr-4 font-mono text-sm">{type}</td>
                  <td className="py-1.5 font-mono text-sm text-gray-600 break-all">{format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">CMS Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {applications.length} application{applications.length !== 1 ? 's' : ''} registered
          </p>
        </div>

        {applications.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app.key} app={app} />
          ))
        )}
      </div>
    </main>
  );
}
