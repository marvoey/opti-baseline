'use client';

import { useState } from 'react';
import { Icons } from './icons';

// =========================================================================
// DEMO REQUEST MODAL
// =========================================================================
function DemoModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    program: 'Executive Protection',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <Icons.Close />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#E96822]"></span>
              <span className="text-xs uppercase font-bold text-[#E96822] tracking-wider">Experience Ontic</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Request a Customized Product Demo</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              Connect with an Ontic protective intelligence architect to evaluate our platform against your security requirements.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E96822]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E96822]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Company or Agency</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Global"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E96822]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary Security Program Focus</label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#E96822]"
                >
                  <option>Executive Protection</option>
                  <option>Incident Management and Dispatch</option>
                  <option>Threat Intelligence and OSINT</option>
                  <option>Corporate Investigations</option>
                  <option>GSOC Operations</option>
                  <option>FedRAMP Federal Solution</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#E96822] hover:bg-[#D15A16] text-white font-bold py-3 rounded-lg text-sm transition-all shadow-lg shadow-orange-600/20"
                >
                  Schedule Demo Session
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Icons.Check />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Demo Request Received</h4>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
              Thank you, <span className="text-slate-900 font-semibold">{formData.name}</span>. An Ontic Security Operations Specialist will contact you at <span className="text-slate-900 font-semibold">{formData.email}</span> to confirm your session.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-slate-100 text-slate-900 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-200"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// REQUEST A DEMO TRIGGER (self-contained button + modal)
// =========================================================================
export function RequestDemoButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>
      {isOpen && <DemoModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
