"use client";

import { useState, type FormEvent } from "react";
import { ControlBar } from "./_components/ControlBar";
import { PresenterBanner } from "./_components/PresenterBanner";
import { TeaserControls } from "./_components/TeaserControls";
import { SimulatedViewport } from "./_components/SimulatedViewport";
import { IngestionForm } from "./_components/IngestionForm";
import { PluginLedger } from "./_components/PluginLedger";
import { localizedStrings, personaData, retiredPlugins } from "./_components/data";
import type { FormData, LocaleKey, PluginFilter, TeaserStep, TelemetryLog, VisitorProfile } from "./_components/types";

export default function NIQMicroFulfillmentDemo() {
  const [activeTeaser, setActiveTeaser] = useState<TeaserStep>(1);
  const [presenterMode, setPresenterMode] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile>("cpg");
  const [isResolvingProfile, setIsResolvingProfile] = useState(false);

  const [selectedLang, setSelectedLang] = useState<LocaleKey>("de");
  const [isLocalizing, setIsLocalizing] = useState(false);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "Patrick Kühn",
    email: "patrick.kuhn@nielseniq.com",
    company: "Unilever Strategy Unit",
    category: "FMCG Omnichannel Velocity",
  });
  const [selectedPluginFilter, setSelectedPluginFilter] = useState<PluginFilter>("all");

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([
    { ts: "10:24:01", type: "INIT", msg: "Optimizely Edge Mesh initialized across 120 global PoPs" },
    { ts: "10:24:02", type: "ODP", msg: "Bi-directional MS Dynamics CRM connector handshake verified [OK]" },
  ]);

  const addLog = (type: string, msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTelemetryLogs((prev) => [{ ts: time, type, msg }, ...prev.slice(0, 15)]);
  };

  const handlePersonaChange = (profile: VisitorProfile) => {
    setIsResolvingProfile(true);
    setVisitorProfile(profile);
    addLog("ODP_SYNC", `Querying Graph edge for persona: ${profile.toUpperCase()}`);
    setTimeout(() => {
      setIsResolvingProfile(false);
      addLog("GRAPH_RESOLVE", "Payload reconstituted in 14ms (Cache: HIT, Dynamics Lead Score: 94)");
    }, 280);
  };

  const handleLangChange = (lang: LocaleKey) => {
    setIsLocalizing(true);
    setSelectedLang(lang);
    addLog("GRAPH_I18N", `Edge query dispatched for locale: ${lang.toUpperCase()}`);
    setTimeout(() => {
      setIsLocalizing(false);
      addLog("EDGE_RENDER", "Localized AST delivered in 16ms across 10-market CDN");
    }, 220);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    addLog("DYNAMICS_POST", "Webhook dispatched: MS Dynamics Marketing API (HTTP 201 Created)");
    addLog("CAMPAIGN_TRIGGER", "Optimizely Campaign: Automated 1:1 Executive Brief sequence queued");
  };

  const currentPersona = personaData[visitorProfile];
  const currentLocale = localizedStrings[selectedLang];

  return (
    <div className="min-h-screen bg-[#E4F0DA] text-[#102412] font-sans antialiased selection:bg-[#ABFF44] selection:text-[#102412]">
      <ControlBar
        activeTeaser={activeTeaser}
        onTeaserChange={setActiveTeaser}
        presenterMode={presenterMode}
        onPresenterModeChange={setPresenterMode}
        showConsole={showConsole}
        onShowConsoleChange={setShowConsole}
        telemetryLogs={telemetryLogs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {presenterMode && <PresenterBanner activeTeaser={activeTeaser} />}

        <TeaserControls
          activeTeaser={activeTeaser}
          visitorProfile={visitorProfile}
          onPersonaChange={handlePersonaChange}
          selectedLang={selectedLang}
          onLangChange={handleLangChange}
          selectedPluginFilter={selectedPluginFilter}
          onPluginFilterChange={setSelectedPluginFilter}
        />

        <div>
          <SimulatedViewport
            visitorProfile={visitorProfile}
            selectedLang={selectedLang}
            currentPersona={currentPersona}
            currentLocale={currentLocale}
            isResolvingProfile={isResolvingProfile}
            isLocalizing={isLocalizing}
          />
          <IngestionForm
            formData={formData}
            onFormDataChange={setFormData}
            formSubmitted={formSubmitted}
            onSubmit={handleFormSubmit}
            onReset={() => setFormSubmitted(false)}
            currentPersona={currentPersona}
            currentLocale={currentLocale}
          />
        </div>

        <PluginLedger plugins={retiredPlugins} filter={selectedPluginFilter} />
      </div>
    </div>
  );
}
