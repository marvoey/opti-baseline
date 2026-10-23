'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { label: 'Home',            href: '/' },
  { label: 'Assemble',        href: '/assemble' },
  { label: 'Content Library', href: '/content-library' },
  { label: 'Admin',           href: '/admin' },
  { label: 'CMS',             href: '/cms-admin' },
];

export default function DevQuickLinks() {
  const links = ROUTE_ROOTS.flatMap((root) =>
    collectLinks(path.join(process.cwd(), 'app', root), root, []),
  );
  if (links.length === 0) return null;
  return <DevQuickLinksMenu links={links} />;
}
