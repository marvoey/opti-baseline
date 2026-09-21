import DevNav from './_components/DevNav';

/**
 * Chrome for everything under /dev — an internal, non-CMS-rendered section of
 * developer/admin tools. DevNav lists each dev page as more get added.
 */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DevNav />
      {children}
    </>
  );
}
