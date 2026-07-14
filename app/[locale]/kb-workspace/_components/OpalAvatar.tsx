export const LightningIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

export const OpalAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
    <LightningIcon className="w-4 h-4 text-purple-600" />
  </div>
);
