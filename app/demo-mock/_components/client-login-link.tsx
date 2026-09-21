'use client';

// The only interactive piece of the utility bar — kept as a tiny client
// island so the rest of the bar can stay server-rendered.
export function ClientLoginLink() {
  return (
    <a
      href="#login"
      onClick={(e) => {
        e.preventDefault();
        alert('Redirecting to Ontic Client Portal: https://app.ontic.ai');
      }}
      className="text-[#E96822] hover:text-[#F1854C] font-medium transition-colors"
    >
      Client Login →
    </a>
  );
}
