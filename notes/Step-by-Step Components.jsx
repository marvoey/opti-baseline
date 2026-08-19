import React, { useState } from 'react';
import { Check, Circle, ArrowRight } from 'lucide-react';

const HorizontalStepper = () => {
  const steps = ['Account Details', 'Personal Info', 'Payment', 'Confirmation'];
  const currentStep = 2;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-8">Horizontal Stepper</h3>
      <div className="flex items-center justify-between relative mb-8">
        {/* Background line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full" />
        {/* Active line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-300" style={{ width: '33%' }} />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1;
          const isActive = index === currentStep - 1;
          const isUpcoming = index > currentStep - 1;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300
                ${isCompleted ? 'border-blue-600 bg-blue-600 text-white' : ''}
                ${isActive ? 'border-blue-600 text-blue-600' : ''}
                ${isUpcoming ? 'border-slate-300 text-slate-400' : ''}
              `}>
                {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
              </div>
              <span className={`mt-3 text-sm font-medium absolute -bottom-7 w-32 text-center
                ${isActive ? 'text-blue-600' : 'text-slate-500'}
              `}>{step}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-12 flex justify-end gap-3 pt-4 border-t border-slate-50">
        <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">Back</button>
        <button className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">Next <ArrowRight className="w-4 h-4"/></button>
      </div>
    </div>
  );
};

const VerticalStepper = () => {
  const steps = [
    { title: 'Project Initialization', description: 'Set up repository and basic structure.', date: 'Oct 24, 2024' },
    { title: 'Design System', description: 'Create core UI components and tokens.', date: 'Oct 26, 2024' },
    { title: 'API Integration', description: 'Connect frontend with backend services.', date: 'In Progress' },
    { title: 'Deployment', description: 'Deploy to production environment.', date: 'Pending' }
  ];
  const currentStep = 3;

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100 mt-8 mb-8 relative">
      <h3 className="text-lg font-semibold text-slate-800 mb-8">Vertical Timeline Stepper</h3>
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1;
          const isActive = index === currentStep - 1;

          return (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10
                ${isCompleted ? 'bg-emerald-500' : isActive ? 'bg-blue-500 ring-4 ring-blue-50' : 'bg-slate-300'}
              `}>
                {isCompleted ? <Check className="w-4 h-4 text-white" /> : <Circle className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} fill="currentColor" />}
              </div>
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border shadow-sm transition-all duration-300
                ${isActive ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-slate-50/50'}
              `}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>{step.title}</h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md border 
                    ${isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'}`}>{step.date}</span>
                </div>
                <p className="text-sm text-slate-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProgressBarStepper = () => {
  const steps = ['Cart', 'Shipping', 'Payment', 'Review'];
  const currentStep = 3;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100 mt-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Progress Bar Stepper</h3>
      <div className="mb-6">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Step {currentStep} of {steps.length}</span>
          <span className="text-sm font-medium text-slate-500">{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${progress}%` }}
          >
             <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center text-sm font-medium">
        {steps.map((step, index) => (
          <div key={step} className={`transition-colors duration-300 ${index < currentStep ? 'text-slate-800' : 'text-slate-400'}`}>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Step-by-Step UI Components</h1>
          <p className="text-slate-600 max-w-xl mx-auto">A collection of beautiful, responsive stepper components built with React and Tailwind CSS. Perfect for forms, onboarding flows, and timelines.</p>
        </div>
        
        <div className="space-y-10">
          <HorizontalStepper />
          <VerticalStepper />
          <ProgressBarStepper />
        </div>
      </div>
    </div>
  );
}