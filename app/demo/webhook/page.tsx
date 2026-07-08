'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

type NodeState = 'none' | 'active' | 'active-opal';
type LineState = 'none' | 'active' | 'active-opal';

interface TerminalEntry {
  id: number;
  title: string;
  json: string;
  colorClass: string;
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function formatJson(json: string) {
  return json
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>')
    .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
    .replace(/: ([0-9]+)/g, ': <span class="json-number">$1</span>');
}

export default function WebhookArchitecturePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [stepLabel, setStepLabel] = useState('Step 0: Idle');
  const [nodes, setNodes] = useState<Record<string, NodeState>>({
    frontend: 'none', webhook: 'none', llm: 'none', cms: 'none', tool: 'none',
  });
  const [lines, setLines] = useState<Record<string, LineState>>({
    l1: 'none', l2: 'none', l3: 'none', l4: 'none', l5: 'none',
  });
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const entryId = useRef(0);

  const addEntry = useCallback((title: string, json: string, colorClass: string) => {
    setEntries(prev => [...prev, { id: entryId.current++, title, json, colorClass }]);
    setTimeout(() => {
      if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, 50);
  }, []);

  const nc = (id: string) => {
    const s = nodes[id];
    return `arch-node ${s === 'active' ? 'active' : s === 'active-opal' ? 'active-opal' : ''}`;
  };

  const lc = (id: string) => {
    const s = lines[id];
    return `arch-line ${s === 'active' ? 'active' : s === 'active-opal' ? 'active-opal' : ''}`;
  };

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setStepLabel('Step 0: Idle');
    setEntries([]);
    setNodes({ frontend: 'none', webhook: 'none', llm: 'none', cms: 'none', tool: 'none' });
    setLines({ l1: 'none', l2: 'none', l3: 'none', l4: 'none', l5: 'none' });

    await sleep(100);

    // Step 1: Frontend triggers webhook
    setStepLabel('Step 1: Frontend triggers Opal Webhook');
    setNodes(n => ({ ...n, frontend: 'active' }));
    setLines(l => ({ ...l, l1: 'active' }));
    setTimeout(() => setNodes(n => ({ ...n, webhook: 'active-opal' })), 300);
    addEntry('POST /api/opal/v1/workflows/trigger', `{
  "agent_id": "prog-insurance-ops-agent",
  "payload": {
    "user_prompt": "What is the FL hail deductible?",
    "crm_context": {
      "user": "SarahO",
      "customer_state": "FL",
      "active_policy": "Auto-Platinum"
    },
    "thread_id": "cx-99382"
  }
}`, 'text-blue-400');

    await sleep(3000);

    // Step 2: Graph retrieval
    setStepLabel('Step 2: Agent queries Optimizely Graph');
    setNodes(n => ({ ...n, frontend: 'none', llm: 'active-opal' }));
    setLines(l => ({ ...l, l1: 'none', l2: 'active-opal', l3: 'active-opal' }));
    setTimeout(() => setNodes(n => ({ ...n, cms: 'active' })), 300);
    addEntry('GRAPHQL QUERY: Optimizely Graph', `{
  "query": "query GetPolicy { CoverageComponent(where: { state_applicability: { eq: \\"Florida\\" }, peril: { eq: \\"Hail\\" } }) { deductible_rules exceptions } }"
}`, 'text-purple-400');

    await sleep(2000);

    addEntry('GRAPHQL RESPONSE', `{
  "data": {
    "CoverageComponent": [
      {
        "deductible_rules": "$500 minimum",
        "exceptions": "Statute 627.7288: Zero deductible for windshields."
      }
    ]
  }
}`, 'text-green-400');

    await sleep(2500);

    // Step 3: Output tool
    setStepLabel('Step 3: Agent invokes Custom API Tool');
    setNodes(n => ({ ...n, cms: 'none', llm: 'none' }));
    setLines(l => ({ ...l, l2: 'none', l3: 'none', l4: 'active-opal' }));
    setTimeout(() => setNodes(n => ({ ...n, tool: 'active-opal' })), 300);
    addEntry('TOOL EXECUTION: push_to_crm_ui', `{
  "tool_name": "push_to_crm_ui",
  "parameters": {
    "thread_id": "cx-99382",
    "response_text": "Because the customer is in FL, the statutory deductible is $500. However, if the windshield is shattered, the deductible is waived.",
    "citations": ["FL Statute 627.7288"],
    "suggested_action": "start_glass_claim"
  }
}`, 'text-purple-400');

    await sleep(3500);

    // Step 4: Frontend callback
    setStepLabel('Step 4: Frontend receives async payload');
    setNodes(n => ({ ...n, webhook: 'none' }));
    setLines(l => ({ ...l, l4: 'none', l5: 'active' }));
    setTimeout(() => setNodes(n => ({ ...n, frontend: 'active' })), 300);
    addEntry('FRONTEND EVENT: Render UI', `{
  "status": "success",
  "ui_state": "render_agent_response",
  "render_workflow_button": true
}`, 'text-blue-400');

    await sleep(2000);

    setStepLabel('✓ Simulation Complete');
    setIsRunning(false);
  };

  return (
    <div className="bg-gray-100 text-gray-800 h-screen flex flex-col font-sans overflow-hidden">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="text-[#007BC7] font-bold text-xl tracking-tight">ARCHITECTURE VISUALIZER</div>
          <span className="text-gray-400 font-light text-xl">|</span>
          <span className="text-gray-600 font-medium">Asynchronous Webhook &amp; Tool Flow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-sm text-gray-500 hover:text-gray-800 transition font-medium">
            ← Back to Demo
          </Link>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`bg-[#007BC7] hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition flex items-center gap-2 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden w-full">

        {/* LEFT: Diagram */}
        {/*
          Fixed 600×640 coordinate space so SVG paths and node positions
          always align regardless of panel width. Outer div scrolls if the
          panel is shorter than 640px (e.g. small screens).

          Node layout (all absolute, px):
            frontend : left=140, top=40,  w=320, h=100  → center (300, 90)
            webhook  : left=140, top=200, w=320, h=100  → center (300, 250)
            llm      : left=10,  top=360, w=256, h=100  → center (138, 410)
            cms      : left=334, top=360, w=256, h=100  → center (462, 410)
            tool     : left=140, top=520, w=320, h=100  → center (300, 570)

          SVG paths (connect node edges, not centres):
            l1: frontend bottom (300,140) → webhook top (300,200)
            l2: webhook bottom (300,300) → cms top-left (462,360)
            l3: webhook bottom (300,300) → llm top-right (138,360)
            l4: middle-row bottom (300,460) → tool top (300,520)
            l5: tool left-bottom (140,620) curves left → frontend left-top (140,40)
        */}
        <div className="w-3/5 bg-white overflow-auto flex items-start justify-center">
          <div className="relative shrink-0 mx-auto" style={{ width: 600, height: 660 }}>

            {/* Step label */}
            <div className="absolute top-4 left-4 text-base font-bold text-gray-400">{stepLabel}</div>

            {/* SVG connecting lines */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={600}
              height={660}
              viewBox="0 0 600 660"
              fill="none"
            >
              <path className={lc('l1')} d="M 300 140 L 300 200" />
              <path className={lc('l2')} d="M 300 300 C 300 330 462 330 462 360" />
              <path className={lc('l3')} d="M 300 300 C 300 330 138 330 138 360" />
              <path className={lc('l4')} d="M 300 460 L 300 520" />
              <path className={lc('l5')} d="M 140 620 C 20 620 20 40 140 40" />
            </svg>

            {/* Node 1: Frontend — left=140 top=40 w=320 */}
            <div className={`${nc('frontend')} absolute bg-gray-50 border-gray-200 rounded-xl p-4 text-center shadow-sm`}
              style={{ left: 140, top: 40, width: 320 }}>
              <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded inline-block mb-2">Next.js / CRM</div>
              <h3 className="font-bold text-gray-800">Consultant UI</h3>
              <p className="text-xs text-gray-500 mt-1">Sarah asks: &ldquo;What is the FL hail deductible?&rdquo;</p>
            </div>

            {/* Node 2: Webhook — left=140 top=200 w=320 */}
            <div className={`${nc('webhook')} absolute bg-purple-50 border-purple-200 rounded-xl p-4 text-center shadow-sm`}
              style={{ left: 140, top: 200, width: 320 }}>
              <div className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded inline-block mb-2">Opal Workflow Agent</div>
              <h3 className="font-bold text-gray-800">Webhook Trigger</h3>
              <p className="text-xs text-gray-500 mt-1">Listens for POST request to start agent workflow</p>
            </div>

            {/* Node 3: LLM — left=10 top=360 w=256 */}
            <div className={`${nc('llm')} absolute bg-purple-50 border-purple-200 rounded-xl p-4 text-center shadow-sm`}
              style={{ left: 10, top: 360, width: 256 }}>
              <div className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded inline-block mb-2">Opal Logic</div>
              <h3 className="font-bold text-gray-800">Agent Reasoning</h3>
              <p className="text-xs text-gray-500 mt-1">Plans execution &amp; synthesizes response</p>
            </div>

            {/* Node 4: CMS — left=334 top=360 w=256 */}
            <div className={`${nc('cms')} absolute bg-gray-900 border-gray-800 rounded-xl p-4 text-center shadow-sm`}
              style={{ left: 334, top: 360, width: 256 }}>
              <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded inline-block mb-2">Optimizely Graph</div>
              <h3 className="font-bold text-white">CMS SaaS Content</h3>
              <p className="text-xs text-gray-400 mt-1">Returns structured FL variation rules</p>
            </div>

            {/* Node 5: Tool — left=140 top=520 w=320 */}
            <div className={`${nc('tool')} absolute bg-purple-50 border-purple-200 rounded-xl p-4 text-center shadow-sm`}
              style={{ left: 140, top: 520, width: 320 }}>
              <div className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded inline-block mb-2">Custom Tool</div>
              <h3 className="font-bold text-gray-800">Push to CRM Frontend</h3>
              <p className="text-xs text-gray-500 mt-1">Tool executes REST call back to Next.js API</p>
            </div>

          </div>
        </div>

        {/* RIGHT: Terminal */}
        <div className="w-2/5 bg-[#0F172A] text-gray-300 p-6 flex flex-col border-l border-gray-700 font-mono text-sm overflow-hidden shadow-inner">
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2 shrink-0">
            <span className="font-bold text-white tracking-widest text-xs">API PAYLOAD INSPECTOR</span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>

          <div ref={terminalRef} className="flex-1 overflow-y-auto space-y-4 pb-10">
            {entries.length === 0 ? (
              <div className="text-gray-500 italic">Waiting for simulation to start...</div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="fade-in">
                  <div className={`${entry.colorClass} font-bold mb-1`}>&gt;&gt; {entry.title}</div>
                  <div className="bg-black/30 p-3 rounded border border-gray-700">
                    <pre
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatJson(entry.json) }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
