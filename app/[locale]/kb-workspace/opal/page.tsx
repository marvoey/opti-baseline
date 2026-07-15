"use client";

import { useRef, useEffect, useState } from "react";
import { useOpalChat } from "../_hooks/useOpalChat";
import { LightningIcon, OpalAvatar } from "../_components/OpalAvatar";
import { PolicyCard } from "../_components/PolicyCard";
import { NoContentCard } from "../_components/NoContentCard";
import { Combobox } from "../_components/Combobox";
import { DevPanel } from "../_components/DevPanel";

export default function OpalPage() {
  const { messages, isLoading, submit, logs, clearLogs } = useOpalChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [devPanelOpen, setDevPanelOpen] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-gray-50 h-screen flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 shrink-0 shadow-sm gap-3">
        <span className="text-[#007BC7] font-bold text-lg tracking-tight italic">
          PROGRESSIVE
        </span>
        <span className="text-gray-300">|</span>
        <LightningIcon className="w-4 h-4 text-purple-600" />
        <span className="text-gray-600 font-medium text-sm">
          Opal Knowledge Assistant
        </span>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Dev console */}
        <div className={`shrink-0 flex overflow-hidden transition-all duration-200 ${devPanelOpen ? "w-80" : "w-0"}`}>
          <div className="w-80 shrink-0">
            <DevPanel logs={logs} onClear={clearLogs} />
          </div>
        </div>

        {/* Dev panel toggle tab */}
        <button
          onClick={() => setDevPanelOpen((o) => !o)}
          className="shrink-0 flex items-center justify-center w-5 bg-gray-900 hover:bg-gray-700 border-r border-gray-700 transition-colors"
          title={devPanelOpen ? "Hide dev console" : "Show dev console"}
        >
          <svg
            className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${devPanelOpen ? "" : "rotate-180"}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Chat */}
        <main className="flex-1 overflow-y-auto pt-8 px-4 pb-10">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-3">
              {/* User question */}
              <div className="flex justify-end">
                <div className="bg-[#007BC7] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-lg shadow-sm">
                  {msg.question}
                </div>
              </div>

              {/* Opal response */}
              {msg.loading || msg.contentLoading ? (
                <div className="flex items-center gap-3">
                  <OpalAvatar />
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-4 shadow-sm text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin text-[#007BC7] shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {msg.loading ? "Waiting for Opal…" : "Fetching policy content…"}
                  </div>
                </div>
              ) : msg.error ? (
                <div className="flex items-center gap-3">
                  <OpalAvatar />
                  <div className="bg-white border border-red-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm text-red-600 flex items-center gap-3">
                    <span>{msg.error}</span>
                    <button
                      onClick={() => submit(msg.question)}
                      className="shrink-0 text-xs font-semibold text-[#007BC7] hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : msg.opalPayload != null ? (
                <div className="flex items-start gap-3">
                  <OpalAvatar />
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-5 shadow-sm flex-1 space-y-4">
                    {msg.opalPayload.reasoning && (
                      <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-1">
                          Opal Reasoning
                        </p>
                        <p className="text-sm text-purple-900 leading-relaxed">
                          {msg.opalPayload.reasoning}
                        </p>
                      </div>
                    )}
                    {msg.policyContent?._debug?.found ? (
                      <PolicyCard policy={msg.policyContent} />
                    ) : (
                      <NoContentCard
                        payload={msg.opalPayload}
                        policyContent={msg.policyContent}
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          {!isLoading && <Combobox onSubmit={submit} />}

          <div ref={bottomRef} />
        </div>
        </main>
      </div>
    </div>
  );
}
