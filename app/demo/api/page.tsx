'use client';

import React, { useState, useMemo, useEffect } from "react";

import { INITIAL_CMS_DATABASE, executeCmsEndpoint, type CmsQuery } from "@/lib/cmsDelivery";

// --- Main Application Component ---
export default function OptimizelyCms12MockApp() {
  const [database, setDatabase] = useState<Record<string, any>>(INITIAL_CMS_DATABASE);
  const [activeTab, setActiveTab] = useState("explorer"); // 'explorer' | 'renderer' | 'editor' | 'snippets'
  
  // API Explorer State
  const [method, setMethod] = useState("GET");
  const [endpointUrl, setEndpointUrl] = useState("/api/episerver/v3.0/content/5");
  const [expandParam, setExpandParam] = useState("*");
  const [matchUrlParam, setMatchUrlParam] = useState("");
  const [langParam, setLangParam] = useState("en");
  const [simulatedLatency, setSimulatedLatency] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any>(null);
  const [selectedPreset, setSelectedPreset] = useState("startpage-expanded");
  const [copySuccess, setCopySuccess] = useState(false);

  // Preset queries
  const presets = [
    {
      id: "startpage-expanded",
      label: "Start Page (?expand=*)",
      path: "/api/episerver/v3.0/content/5",
      expand: "*",
      matchUrl: "",
      desc: "Fetches startpage with fully serialized nested content area blocks."
    },
    {
      id: "startpage-unexpanded",
      label: "Start Page (Unexpanded)",
      path: "/api/episerver/v3.0/content/5",
      expand: "",
      matchUrl: "",
      desc: "Simulates initial lightweight payload returning only content references."
    },
    {
      id: "friendly-url",
      label: "Friendly URL Routing (?matchUrl)",
      path: "/api/episerver/v3.0/content/",
      expand: "*",
      matchUrl: "/en/products/cloud-engine/",
      desc: "Resolves route segments dynamically for SPA / Next.js catch-all routes."
    },
    {
      id: "children",
      label: "Start Page Children (/children)",
      path: "/api/episerver/v3.0/content/5/children",
      expand: "*",
      matchUrl: "",
      desc: "Retrieves immediate child pages of StartPage for navigation generation."
    },
    {
      id: "ancestors",
      label: "Ancestors Breadcrumb (/ancestors)",
      path: "/api/episerver/v3.0/content/6/ancestors",
      expand: "",
      matchUrl: "",
      desc: "Traverses tree upwards to generate hierarchical breadcrumbs."
    },
    {
      id: "site-definition",
      label: "Site Definition (/site)",
      path: "/api/episerver/v3.0/site/",
      expand: "",
      matchUrl: "",
      desc: "Discovers active site hostname, startpage ID, and supported languages."
    }
  ];

  // Execute request
  const runRequest = (overridePath?: string, overrideExpand?: string, overrideMatchUrl?: string) => {
    setIsLoading(true);
    const p = overridePath !== undefined ? overridePath : endpointUrl;
    const exp = overrideExpand !== undefined ? overrideExpand : expandParam;
    const match = overrideMatchUrl !== undefined ? overrideMatchUrl : matchUrlParam;

    setTimeout(() => {
      const startTime = performance.now();
      const queryObj: CmsQuery = {};
      if (exp) queryObj.expand = exp;
      if (match) queryObj.matchUrl = match;
      if (langParam) queryObj.language = langParam;

      const res = executeCmsEndpoint(p, queryObj, database);
      const endTime = performance.now();

      setResponseResult({
        ...res,
        executionTime: Math.round(endTime - startTime + simulatedLatency),
        timestamp: new Date().toISOString()
      });
      setIsLoading(false);
    }, simulatedLatency);
  };

  // Run initial request on mount
  useEffect(() => {
    runRequest("/api/episerver/v3.0/content/5", "*", "");
  }, [database]);

  // Handle Preset Selection
  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setEndpointUrl(preset.path);
      setExpandParam(preset.expand);
      setMatchUrlParam(preset.matchUrl);
      runRequest(preset.path, preset.expand, preset.matchUrl);
    }
  };

  // Copy JSON to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Compute Full Request URI for display
  const fullConstructedUrl = useMemo(() => {
    const params = [];
    if (expandParam) params.push(`expand=${encodeURIComponent(expandParam)}`);
    if (matchUrlParam) params.push(`matchUrl=${encodeURIComponent(matchUrlParam)}`);
    if (langParam) params.push(`language=${encodeURIComponent(langParam)}`);
    const q = params.length > 0 ? `?${params.join("&")}` : "";
    return `${endpointUrl}${q}`;
  }, [endpointUrl, expandParam, matchUrlParam, langParam]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-lg text-white">
            O
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-sm tracking-wide">Optimizely CMS 12</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Content Delivery API v3.0 Mock
              </span>
            </div>
            <p className="text-xs text-slate-400">Headless REST Mock Service and React Client Simulator</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === "explorer"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            API Explorer
          </button>
          <button
            onClick={() => setActiveTab("renderer")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === "renderer"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Live Component Renderer
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === "editor"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Payload Repository ({Object.keys(database).length})
          </button>
          <button
            onClick={() => setActiveTab("snippets")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === "snippets"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            React / MSW Snippets
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Preset Selector Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap mr-1">Endpoints:</span>
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition border ${
                  selectedPreset === p.id
                    ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-medium"
                    : "bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <label className="flex items-center gap-1.5">
              <span>Latency:</span>
              <select
                value={simulatedLatency}
                onChange={e => setSimulatedLatency(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value={0}>0ms (Instant)</option>
                <option value={80}>80ms (Fast CDN)</option>
                <option value={200}>200ms (Real DXP)</option>
                <option value={500}>500ms (High Load)</option>
              </select>
            </label>
          </div>
        </div>

        {/* TAB 1: REST API EXPLORER */}
        {activeTab === "explorer" && (
          <div className="space-y-6">
            {/* Request Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-1">
                  <span className="bg-blue-600/20 text-blue-400 font-mono text-xs px-3.5 flex items-center font-bold border-r border-slate-700 select-none">
                    {method}
                  </span>
                  <input
                    type="text"
                    value={endpointUrl}
                    onChange={e => setEndpointUrl(e.target.value)}
                    placeholder="/api/episerver/v3.0/content/5"
                    className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => runRequest()}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {isLoading ? (
                    <span className="animate-spin text-xs">↻</span>
                  ) : (
                    <span>▶ Send Request</span>
                  )}
                </button>
              </div>

              {/* Query Parameter Configuration Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">
                    Expand Parameter (<code className="text-blue-400">expand</code>)
                  </label>
                  <select
                    value={expandParam}
                    onChange={e => {
                      setExpandParam(e.target.value);
                      runRequest(endpointUrl, e.target.value, matchUrlParam);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="*">* (Expand all content areas and blocks)</option>
                    <option value="mainContentArea">mainContentArea (Only main area)</option>
                    <option value="">None (Content references only)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    Friendly Route (<code className="text-blue-400">matchUrl</code>)
                  </label>
                  <input
                    type="text"
                    value={matchUrlParam}
                    onChange={e => setMatchUrlParam(e.target.value)}
                    placeholder="e.g. /en/about-us/"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    Language Filter (<code className="text-blue-400">language</code>)
                  </label>
                  <select
                    value={langParam}
                    onChange={e => setLangParam(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="en">en (English)</option>
                    <option value="sv">sv (Svenska)</option>
                    <option value="de">de (Deutsch)</option>
                  </select>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between truncate bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                <span className="truncate">Simulated Request: <strong className="text-slate-300">GET {fullConstructedUrl}</strong></span>
                <span className="text-slate-400 shrink-0 ml-2">Host: https://demo.optimizely.com</span>
              </div>
            </div>

            {/* Response Section */}
            {responseResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {/* Status Bar */}
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-md font-mono ${
                        responseResult.status === 200
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {responseResult.status} {responseResult.statusText}
                    </span>
                    <span className="text-xs text-slate-400">
                      Time: <strong className="text-slate-200 font-mono">{responseResult.executionTime}ms</strong>
                    </span>
                    <span className="text-xs text-slate-400">
                      Size:{" "}
                      <strong className="text-slate-200 font-mono">
                        {(JSON.stringify(responseResult.data).length / 1024).toFixed(2)} KB
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(JSON.stringify(responseResult.data, null, 2))}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition border border-slate-700/80 flex items-center gap-1.5"
                    >
                      {copySuccess ? "✓ Copied JSON" : "Copy Payload"}
                    </button>
                    <button
                      onClick={() => setActiveTab("renderer")}
                      className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 text-xs rounded-lg transition border border-indigo-500/30"
                    >
                      View Live Visuals →
                    </button>
                  </div>
                </div>

                {/* Headers Bar */}
                <div className="px-5 py-2 bg-slate-950/20 border-b border-slate-800/60 text-[11px] font-mono text-slate-400 flex flex-wrap gap-x-6 gap-y-1">
                  {responseResult.headers &&
                    Object.entries(responseResult.headers).map(([k, v]) => (
                      <span key={k}>
                        <span className="text-slate-500">{k}:</span> {String(v)}
                      </span>
                    ))}
                </div>

                {/* Raw JSON Viewer */}
                <div className="p-4 bg-slate-950 overflow-x-auto max-h-[600px] text-xs font-mono">
                  <pre className="text-emerald-400">
                    {JSON.stringify(responseResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE HEADLESS COMPONENT RENDERER */}
        {activeTab === "renderer" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Headless React Consumer Demo</span>
                    <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Live Rendered from Content Delivery JSON
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Demonstrating how a React or Next.js application consumes Optimizely CMS 12 models.
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  Rendering: <span className="text-blue-400 font-mono font-medium">{responseResult?.data?.name || "No payload loaded"}</span>
                </div>
              </div>

              {responseResult && responseResult.data && !Array.isArray(responseResult.data) && responseResult.status === 200 ? (
                <div className="space-y-8">
                  {/* Page Hero / Heading */}
                  <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="max-w-2xl relative z-10 space-y-4">
                      {responseResult.data.contentType && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {responseResult.data.contentType.join(" > ")}
                          </span>
                          {responseResult.data.category?.value && (
                            <span className="text-xs text-slate-400">
                              Tags: {responseResult.data.category.value.join(", ")}
                            </span>
                          )}
                        </div>
                      )}

                      <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        {responseResult.data.heroHeading?.value || responseResult.data.heading?.value || responseResult.data.name}
                      </h1>

                      {(responseResult.data.heroLead?.value || responseResult.data.mainIntro?.value) && (
                        <p className="text-base text-slate-300 leading-relaxed">
                          {responseResult.data.heroLead?.value || responseResult.data.mainIntro?.value}
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                        <span>Route: <code className="text-indigo-300">{responseResult.data.url}</code></span>
                        <span>•</span>
                        <span>ID: <code className="text-indigo-300">{responseResult.data.contentLink?.id}</code></span>
                        <span>•</span>
                        <span>Language: <code className="text-indigo-300">{responseResult.data.language?.name}</code></span>
                      </div>
                    </div>
                  </div>

                  {/* Main Body (XhtmlString Property) */}
                  {responseResult.data.mainBody?.value && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6">
                      <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-2">
                        <span>XHTML Rich Text Property</span>
                        <code className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">PropertyXhtmlString</code>
                      </div>
                      <div
                        className="prose prose-invert prose-indigo max-w-none text-slate-300 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: responseResult.data.mainBody.value }}
                      />
                    </div>
                  )}

                  {/* Content Area Rendering (Blocks) */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Main Content Area</span>
                          <span className="text-xs font-normal text-slate-400 font-mono">
                            ({responseResult.data.mainContentArea?.value?.length || 0} Blocks)
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Decoupled rendering of dynamically placed EPiServer blocks
                        </p>
                      </div>
                      <code className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                        PropertyContentArea
                      </code>
                    </div>

                    {responseResult.data.mainContentArea?.value?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {responseResult.data.mainContentArea.value.map((blockItem: any, idx: number) => {
                          const block = blockItem.expanded;
                          if (!block) {
                            return (
                              <div
                                key={idx}
                                className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-5 flex flex-col justify-between"
                              >
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    Unexpanded ContentReference
                                  </span>
                                  <p className="text-sm font-semibold text-slate-200 mt-2">
                                    Content ID: {blockItem.contentLink?.id}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    Add <code className="text-blue-400">?expand=*</code> to deserialize this block's properties.
                                  </p>
                                </div>
                                <span className="text-[11px] font-mono text-slate-500 mt-4">
                                  Display: {blockItem.displayOption || "default"}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={idx}
                              className={`bg-slate-950 border border-slate-800/90 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition shadow-lg ${
                                blockItem.displayOption === "full" ? "md:col-span-2" : ""
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    {block.contentType ? block.contentType[1] : "Block"}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    ID: {blockItem.contentLink?.id}
                                  </span>
                                </div>

                                <h4 className="text-base font-bold text-white">
                                  {block.heading?.value || block.name}
                                </h4>

                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {block.description?.value || "No description provided."}
                                </p>
                              </div>

                              <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between">
                                {block.callToActionText?.value && (
                                  <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                    {block.callToActionText.value} <span>→</span>
                                  </button>
                                )}
                                <span className="text-[10px] text-slate-500 font-mono ml-auto">
                                  Display: {blockItem.displayOption || "default"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
                        Content area is empty.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-sm font-medium">Please send a request for a Page item (e.g. ID: 5 or ID: 6) to render visual components.</p>
                  <button
                    onClick={() => applyPreset("startpage-expanded")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-500"
                  >
                    Load Start Page
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PAYLOAD REPOSITORY & EDITOR */}
        {activeTab === "editor" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">CMS Content Repository (Mock Database)</h2>
                  <p className="text-xs text-slate-400">
                    Directly modify or inspect the underlying CMS 12 JSON documents returned by the mock server.
                  </p>
                </div>
                <button
                  onClick={() => setDatabase(INITIAL_CMS_DATABASE)}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
                >
                  Reset to Default Payloads
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Content Tree Navigation */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Available Items ({Object.keys(database).length})
                  </span>
                  <div className="space-y-2">
                    {Object.entries(database).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setEndpointUrl(`/api/episerver/v3.0/content/${key}`);
                          runRequest(`/api/episerver/v3.0/content/${key}`, "*", "");
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition ${
                          endpointUrl === `/api/episerver/v3.0/content/${key}`
                            ? "bg-blue-600/20 border-blue-500/50 text-white shadow-sm"
                            : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm truncate">{item.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            ID: {key}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <span className="text-indigo-400">{item.contentType?.[1]}</span>
                          <span>•</span>
                          <span className="truncate">{item.url}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* JSON Document Viewer */}
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="text-xs font-mono text-slate-300">
                      Raw Data Object for Endpoint: <strong className="text-blue-400">{endpointUrl}</strong>
                    </span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(database, null, 2))}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Export Full Repository JSON
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 overflow-auto max-h-[500px]">
                    {JSON.stringify(responseResult?.data || database["5"], null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CODE SNIPPETS & MSW INTEGRATION */}
        {activeTab === "snippets" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Integration Guides and Mock Handlers</h2>
                <p className="text-xs text-slate-400">
                  Ready-to-use React hooks and Mock Service Worker (MSW) handlers using the exact CMS 12 Content Delivery API specification.
                </p>
              </div>

              {/* Snippet 1: MSW v2 Handlers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-400 font-mono">
                    1. Mock Service Worker (MSW v2) Handler (handlers.js)
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(`import { http, HttpResponse } from 'msw';

// CMS 12 Content Delivery API Mock Handlers
export const handlers = [
  // 1. Get Content by ID or GUID
  http.get('/api/episerver/v3.0/content/:id', ({ params, request }) => {
    const url = new URL(request.url);
    const expand = url.searchParams.get('expand');
    const { id } = params;

    return HttpResponse.json({
      contentLink: { id: Number(id) || 5, guidValue: "e7b0a70f-155e-4efb-86ce-b119cb497bf4", url: "/en/" },
      name: "Mocked Page from MSW",
      contentType: ["Page", "StandardPage"],
      language: { name: "en" },
      mainBody: { value: "<p>Loaded from MSW</p>", propertyDataType: "PropertyXhtmlString" },
      mainContentArea: { value: [], propertyDataType: "PropertyContentArea" }
    });
  }),

  // 2. Resolve friendly URL
  http.get('/api/episerver/v3.0/content/', ({ request }) => {
    const url = new URL(request.url);
    const matchUrl = url.searchParams.get('matchUrl');
    return HttpResponse.json({
      contentLink: { id: 5, url: matchUrl },
      name: "Matched Route Page",
      contentType: ["Page", "StartPage"]
    });
  })
];`)
                    }
                    className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                  >
                    Copy MSW Handler
                  </button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
{`import { http, HttpResponse } from 'msw';

// CMS 12 Content Delivery API Mock Handlers
export const handlers = [
  // 1. Get Content by ID or GUID
  http.get('/api/episerver/v3.0/content/:id', ({ params, request }) => {
    const url = new URL(request.url);
    const expand = url.searchParams.get('expand');
    const { id } = params;

    return HttpResponse.json({
      contentLink: { id: Number(id) || 5, guidValue: "e7b0a70f-155e-4efb-86ce-b119cb497bf4", url: "/en/" },
      name: "Mocked Page from MSW",
      contentType: ["Page", "StandardPage"],
      language: { name: "en" },
      mainBody: { value: "<p>Loaded from MSW</p>", propertyDataType: "PropertyXhtmlString" },
      mainContentArea: { value: [], propertyDataType: "PropertyContentArea" }
    });
  }),

  // 2. Resolve friendly URL
  http.get('/api/episerver/v3.0/content/', ({ request }) => {
    const url = new URL(request.url);
    const matchUrl = url.searchParams.get('matchUrl');
    return HttpResponse.json({
      contentLink: { id: 5, url: matchUrl },
      name: "Matched Route Page",
      contentType: ["Page", "StartPage"]
    });
  })
];`}
                </pre>
              </div>

              {/* Snippet 2: React Hook */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 font-mono">
                    2. React Client Hook (useCmsContent.js)
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(`import { useState, useEffect } from 'react';

export function useCmsContent({ contentId, matchUrl, expand = '*' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const baseUrl = matchUrl
          ? \`/api/episerver/v3.0/content/?matchUrl=\${encodeURIComponent(matchUrl)}&expand=\${expand}\`
          : \`/api/episerver/v3.0/content/\${contentId}?expand=\${expand}\`;

        const res = await fetch(baseUrl, {
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en'
          }
        });

        if (!res.ok) throw new Error(\`CMS API Error: \${res.status}\`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [contentId, matchUrl, expand]);

  return { data, loading, error };
}`)
                    }
                    className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                  >
                    Copy React Hook
                  </button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
{`import { useState, useEffect } from 'react';

export function useCmsContent({ contentId, matchUrl, expand = '*' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const baseUrl = matchUrl
          ? \`/api/episerver/v3.0/content/?matchUrl=\${encodeURIComponent(matchUrl)}&expand=\${expand}\`
          : \`/api/episerver/v3.0/content/\${contentId}?expand=\${expand}\`;

        const res = await fetch(baseUrl, {
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en'
          }
        });

        if (!res.ok) throw new Error(\`CMS API Error: \${res.status}\`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [contentId, matchUrl, expand]);

  return { data, loading, error };
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        Optimizely CMS 12 Content Delivery API Mock • Compliant with REST API v3.0 Specification
      </footer>
    </div>
  );
}
