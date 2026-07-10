import OpenInNewTabButton from './_components/OpenInNewTabButton';

export default function KbPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 shadow-sm">
        <div className="text-[#007BC7] font-bold text-xl tracking-tight italic shrink-0">PROGRESSIVE</div>
        <span className="text-gray-300 text-xl font-light">|</span>
        <span className="text-sm font-medium text-gray-500">CMS Preview</span>
        <div className="ml-auto">
          <OpenInNewTabButton />
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        {children}
      </main>
    </div>
  );
}
