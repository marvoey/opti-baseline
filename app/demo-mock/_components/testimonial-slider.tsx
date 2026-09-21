'use client';

import { useState } from 'react';

const TESTIMONIALS = [
  {
    quote: "You can’t compare what Ontic does with a regular case management system. Having geo-monitoring, POI records, and automated threat signals in one unified place changed our entire investigative speed.",
    author: 'Lou Silvestris',
    role: 'Risk Intelligence and Investigations Manager',
    company: 'Fortune 500 Insurance Leader',
    metric: '85% reduction in manual intake time',
  },
  {
    quote: "It's everything that we used to do — but now we can do it quicker, we can do it with more accuracy, and we can involve more data that we previously didn't have.",
    author: 'Ryan Schilling',
    role: 'Program Leader of Protective Operations and Intelligence',
    company: 'Goodyear',
    metric: 'Unified 25+ siloed risk feeds',
  },
  {
    quote: 'By automating a lot of what we do and streamlining our threat management program, we’ve been able to do a lot more with less people because of the technology Ontic offers.',
    author: 'Heather S.',
    role: 'Senior Manager of Global Intelligence',
    company: 'Fortune 100 Technology Enterprise',
    metric: 'Scalable across 180+ global sites',
  },
  {
    quote: 'Ontic gives our GSOC real-time situational awareness. The ability to coordinate executive itineraries with live geopolitical threat layers allows our field agents to make defensible decisions fast.',
    author: 'Niall Herlehy',
    role: 'Senior Manager, Intelligence and GSOC',
    company: 'Visa',
    metric: '$2M+ in cost avoidance and risk mitigation',
  },
];

// Client Testimonial Slider — the only stateful piece of this section.
export function TestimonialSlider() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonial = TESTIMONIALS[activeTestimonial];

  return (
    <div className="bg-white border border-slate-200 shadow-sm p-8 sm:p-12 rounded-3xl relative overflow-hidden">
      <div className="max-w-3xl">
        <div className="text-[#E96822] text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Enterprise Proven Results</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">{testimonial.metric}</span>
        </div>
        <blockquote className="text-xl sm:text-2xl font-medium text-slate-900 leading-relaxed mb-6">
          "{testimonial.quote}"
        </blockquote>
        <div>
          <div className="font-bold text-slate-900 text-base">{testimonial.author}</div>
          <div className="text-sm text-slate-500">{testimonial.role} · <span className="text-slate-700">{testimonial.company}</span></div>
        </div>
      </div>

      {/* Testimonial Selectors */}
      <div className="flex gap-2 mt-8">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTestimonial(idx)}
            className={`h-2 rounded-full transition-all ${
              activeTestimonial === idx ? 'w-8 bg-[#E96822]' : 'w-2 bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`Testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
