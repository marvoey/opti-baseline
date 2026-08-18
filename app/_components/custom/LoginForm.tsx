'use client';

import { useState } from 'react';
import { ChevronRight, Square } from 'lucide-react';

type Tab = 'personal' | 'business' | 'investment' | 'trust';

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'personal', label: 'Personal' },
    { id: 'business', label: 'Business' },
    { id: 'investment', label: 'Investment' },
    { id: 'trust', label: 'Trust' },
  ];

  return (
    <div className="w-72 bg-white border border-gray-200 shadow-lg text-sm">

      {/* Header */}
      <div className="bg-red-700 text-white px-4 py-2 flex items-center gap-2">
        <Square size={14} strokeWidth={1.5} />
        <span className="font-bold tracking-wide uppercase text-xs">Sign In to Online Banking</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-800 text-blue-900 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="p-3 space-y-2">

        {(activeTab === 'personal' || activeTab === 'business') && (
          <>
            {/* Username */}
            <input
              type="text"
              placeholder={activeTab === 'personal' ? 'Member # / User ID' : 'User ID'}
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-800"
              autoComplete="username"
            />

            {/* Password + Login */}
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Password"
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-800"
                autoComplete="current-password"
              />
              <button className="bg-blue-800 hover:bg-blue-900 text-white font-semibold text-sm px-4 py-2 transition-colors">
                Login
              </button>
            </div>

            {/* Helper links */}
            <div className="pt-1 text-xs text-blue-700 space-x-1">
              <a
                href={
                  activeTab === 'personal'
                    ? 'https://eslpersonalbanking.esl.org/dbank/live/app/authUpdate'
                    : 'https://www.esl.org/'
                }
                className="hover:underline"
              >
                Forgotten Password
              </a>
              <span className="text-gray-400">|</span>
              <a
                href={
                  activeTab === 'personal'
                    ? 'https://www.esl.org/personal/online-banking-services/online-banking?tab=2'
                    : 'https://www.esl.org/business/first-time-log-in'
                }
                className="hover:underline"
              >
                {activeTab === 'personal' ? 'First Time Users' : 'First-Time Users'}
              </a>
            </div>
          </>
        )}

        {activeTab === 'investment' && (
          <>
            <p className="text-gray-700 text-xs">Welcome to Account View</p>
            <a
              href="https://myaccountviewonline.com/AccountView/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 transition-colors"
            >
              Sign in to Account View ↗
            </a>
            <div className="pt-1 text-xs text-blue-700 space-x-1">
              <a href="https://www.esl.org/wealth/investment-services/online-services-account-view" className="hover:underline">
                First Time Users
              </a>
              <span className="text-gray-400">|</span>
              <a href="https://lpl.vids.io/videos/ac9adbb11a18e3c725/getting-started-with-the-new-account-view" className="hover:underline">
                Demo
              </a>
            </div>
          </>
        )}

        {activeTab === 'trust' && (
          <>
            <p className="text-gray-700 text-xs">Welcome to ESL Trust Services, LLC</p>
            <a
              href="https://www.rt-wms.com/ESL"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 transition-colors"
            >
              Sign in to Weblink ↗
            </a>
            <div className="pt-1 text-xs text-blue-700">
              <a href="https://www.esl.org/wealth/trust-services/online-services-weblink" className="hover:underline">
                First Time Users – Sign Up for Account Access
              </a>
            </div>
          </>
        )}

        {/* Become a Member CTA */}
        <a
          href="https://www.esl.org/about-us/esl-membership"
          className="mt-2 flex items-center justify-between w-full bg-gray-700 hover:bg-gray-800 text-white uppercase text-xs font-bold tracking-wide px-4 py-3 transition-colors"
        >
          <span>Become an ESL Member Today</span>
          <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
}
