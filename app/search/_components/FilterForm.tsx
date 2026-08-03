'use client';

export default function FilterForm({ children }: { children: React.ReactNode }) {
  return (
    <form
      method="GET"
      action="/search"
      onChange={e => (e.currentTarget as HTMLFormElement).requestSubmit()}
    >
      {children}
    </form>
  );
}
