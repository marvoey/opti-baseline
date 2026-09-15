import { ArrowRight, CheckCircle2, Send } from "lucide-react";
import type { FormEvent } from "react";
import type { FormData, LocaleInfo, PersonaInfo } from "./types";

interface IngestionFormProps {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  formSubmitted: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  currentPersona: PersonaInfo;
  currentLocale: LocaleInfo;
}

export function IngestionForm({
  formData,
  onFormDataChange,
  formSubmitted,
  onSubmit,
  onReset,
  currentPersona,
  currentLocale,
}: IngestionFormProps) {
  return (
    <div className="rounded-b-3xl border-2 border-t-0 border-[#102412] bg-[#F8FAFC] text-slate-900 p-8 sm:p-10 space-y-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3AB533] block">
            Closed-Loop Dynamics Bridge
          </span>
          <h3 className="text-2xl font-extrabold text-[#102412]">Live Executive Ingestion Form</h3>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Replaces Ninja Forms CSV lag &bull; Instant Dynamics Marketing Routing
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#102412]">Request Category Growth Assessment</h4>
            <p className="text-xs text-slate-500">
              Direct integration into Microsoft Dynamics CRM with zero batch delays.
            </p>
          </div>

          {!formSubmitted ? (
            <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Executive Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3AB533]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3AB533]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Account / Organization</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => onFormDataChange({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3AB533]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category Focus</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => onFormDataChange({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3AB533]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#3AB533] hover:bg-[#329e2c] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Submit &amp; Trigger Real-Time Dynamics Ingestion</span>
              </button>
            </form>
          ) : (
            <div className="p-5 rounded-xl bg-[#E4F0DA] border-2 border-[#3AB533] text-[#102412] space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3AB533]" />
                <h5 className="font-extrabold text-sm">Lead Successfully Ingested in MS Dynamics!</h5>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Lead record for <strong>{formData.name}</strong> ({formData.company}) created in{" "}
                <strong>Microsoft Dynamics Marketing</strong>. Automated 1:1 briefing sequence triggered via{" "}
                <strong>Optimizely Campaign</strong> without manual CSV handling.
              </p>
              <button
                onClick={onReset}
                className="text-xs text-[#3AB533] font-bold underline hover:text-[#102412] pt-1 block"
              >
                Reset Ingestion Simulation
              </button>
            </div>
          )}
        </div>

        {/* Right: Connected Report Showcase */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-[#E4F0DA] text-[#3AB533] font-bold">
                {currentLocale.badge}
              </span>
              <span className="text-sm font-extrabold text-[#102412]">{currentPersona.price}</span>
            </div>

            <h4 className="text-lg font-bold text-[#102412] leading-snug">{currentPersona.featuredReport}</h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              Syndicated category dataset powered by scanner logs from 21M+ stores with localized regional
              breakdowns in {currentLocale.name}.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#3AB533] font-bold">
            <span>Included with Optiq Platform Access</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
