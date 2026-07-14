"use client";

import { useRef, useEffect } from "react";
import { useOpalChat } from "../_hooks/useOpalChat";
import { LightningIcon, OpalAvatar } from "../_components/OpalAvatar";
import { PolicyCard } from "../_components/PolicyCard";
import { NoContentCard } from "../_components/NoContentCard";
import { Combobox } from "../_components/Combobox";

export default function OpalPage() {
  const { messages, isLoading, submit } = useOpalChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
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

      <main className="flex-1 flex flex-col items-center pt-8 px-4 pb-10">
        <div className="w-full max-w-2xl flex flex-col gap-6">
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
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-5 shadow-sm flex-1">
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
  );
}
