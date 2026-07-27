export function HeroSectionWarning({ rowCount, isPreview }: { rowCount: number; isPreview?: boolean }) {
  if (rowCount <= 1 || !isPreview) return null;

  return (
    <>
      <style>{`
        @keyframes hero-warning-out {
          0%, 70% { opacity: 1; }
          100%     { opacity: 0; }
        }
      `}</style>
      <p
        className="absolute top-2 left-2 z-20 w-64 rounded-md bg-white/90 p-3 text-xs leading-relaxed text-gray-800 shadow-lg"
        style={{ animation: 'hero-warning-out 5s ease-in-out forwards' }}
      >
        Only the first row is rendered in a Hero Section. Additional rows are ignored.
      </p>
    </>
  );
}
