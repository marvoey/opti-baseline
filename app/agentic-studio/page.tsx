import type { Metadata } from 'next';
import AgenticWorkflowStudio from '@/app/_components/agentic-intent-composition';

export const metadata: Metadata = {
  title: 'Agentic Intent & Composition Studio',
  description: 'Demo of a multi-agent pipeline that turns a natural language brief into an Optimizely Composition AST.',
};

export default function AgenticStudioPage() {
  return (
    <main className="min-h-full bg-slate-50 dark:bg-slate-950 py-8">
      <AgenticWorkflowStudio />
    </main>
  );
}
