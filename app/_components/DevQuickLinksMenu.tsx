'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type QuickLink = {
  label: string;
  href: string;
  group?: string;
  /** A file served from public/ (e.g. an .html page): plain link, opens in a new tab. */
  isStatic?: boolean;
};

// A folder in the tree. A node can be a folder, a page, or both (e.g. /demo has
// its own page and also sub-pages).
type TreeNode = {
  key: string;
  label: string;
  link?: QuickLink;
  children: TreeNode[];
};

const ROW_CLASS =
  'flex w-full items-center gap-1 rounded-md py-1.5 pr-3 text-left text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors';
const INDENT_PX = 12;

const toLabel = (segment: string) =>
  segment.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Turns the flat list into a tree by splitting each href into path segments.
// With more than one group (e.g. Pages / Static pages) each group becomes a top-level folder.
function buildTree(links: QuickLink[]): TreeNode[] {
  const groups = new Map<string, TreeNode>();

  for (const link of links) {
    const groupName = link.group ?? 'Pages';
    let group = groups.get(groupName);
    if (!group) {
      group = { key: `g:${groupName}`, label: groupName, children: [] };
      groups.set(groupName, group);
    }

    let parent = group;
    const segments = link.href.split('/').filter(Boolean);
    segments.forEach((raw, i) => {
      let segment = raw;
      try {
        segment = decodeURIComponent(raw);
      } catch {
        // keep the raw segment if it isn't valid percent-encoding
      }
      const key = `${parent.key}/${segment}`;
      let node = parent.children.find((c) => c.key === key);
      if (!node) {
        node = { key, label: toLabel(segment.replace(/\.html?$/i, '')), children: [] };
        parent.children.push(node);
      }
      if (i === segments.length - 1) {
        node.link = link;
        node.label = link.label;
      }
      parent = node;
    });
  }

  const all = [...groups.values()];
  return all.length > 1 ? all : all.flatMap((g) => g.children);
}

const containsPath = (node: TreeNode, pathname: string): boolean =>
  node.link?.href === pathname || node.children.some((c) => containsPath(c, pathname));

// Folders to open at first so the page you are on is visible without hunting for it.
function initialExpanded(nodes: TreeNode[], pathname: string, acc = new Set<string>()) {
  for (const node of nodes) {
    if (node.children.length && containsPath(node, pathname)) {
      acc.add(node.key);
      initialExpanded(node.children, pathname, acc);
    }
  }
  return acc;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`h-3 w-3 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
    >
      <path d="M4 2.5 8 6 4 9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-gray-400">
      <path d="M1.5 6 6 2l4.5 4M2.75 5.25V10h2.5V7.5h1.5V10h2.5V5.25" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type NodeProps = {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  toggle: (key: string) => void;
  pathname: string;
  close: () => void;
};

function TreeItem({ node, depth, expanded, toggle, pathname, close }: NodeProps) {
  const { link, children, label, key } = node;
  const hasChildren = children.length > 0;
  const isOpen = expanded.has(key);
  const paddingLeft = 8 + depth * INDENT_PX;
  const isActive = link?.href === pathname;
  const linkClass = `${ROW_CLASS} ${isActive ? 'bg-gray-100 font-semibold' : ''}`;

  let row: ReactNode;
  if (!link) {
    // Folder only: the whole row toggles it.
    row = (
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => toggle(key)}
        className={`${ROW_CLASS} text-gray-500`}
        style={{ paddingLeft }}
      >
        <Chevron open={isOpen} />
        {label}
      </button>
    );
  } else {
    const anchor = link.isStatic ? (
      <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={close} className="min-w-0 flex-1 truncate">
        {label}
      </a>
    ) : (
      <Link href={link.href} onClick={close} className="min-w-0 flex-1 truncate">
        {label}
      </Link>
    );
    // A page that also has sub-pages: chevron toggles, label navigates.
    row = (
      <div className={`${linkClass} !py-0`} style={{ paddingLeft }}>
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${label}`}
            onClick={() => toggle(key)}
            className="flex h-6 w-4 shrink-0 items-center justify-center"
          >
            <Chevron open={isOpen} />
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <span className="flex min-w-0 flex-1 py-1.5 [&>*]:block">{anchor}</span>
      </div>
    );
  }

  return (
    <li>
      {row}
      {hasChildren && isOpen && (
        <ul>
          {children.map((child) => (
            <TreeItem
              key={child.key}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              pathname={pathname}
              close={close}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function DevQuickLinksMenu({ links }: { links: QuickLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const tree = useMemo(() => buildTree(links), [links]);
  const [expanded, setExpanded] = useState(() => initialExpanded(tree, pathname));

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  return (
    <div className="fixed bottom-3 left-16 z-[9998] flex flex-col items-start">
      {open && (
        <div className="mb-2 max-h-[70vh] min-w-[180px] max-w-[280px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`${ROW_CLASS} ${pathname === '/' ? 'bg-gray-100 font-semibold' : ''}`}
            style={{ paddingLeft: 8 }}
          >
            <HomeIcon />
            Home
          </Link>
          <div className="mx-2 my-1 border-t border-gray-100" />
          <ul>
            {tree.map((node) => (
              <TreeItem
                key={node.key}
                node={node}
                depth={0}
                expanded={expanded}
                toggle={toggle}
                pathname={pathname}
                close={() => setOpen(false)}
              />
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Quick links"
        className="w-7 h-7 rounded-full overflow-hidden shadow-md hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.ffycdn.net/eu/episerver/YKPBoHJ87Gba79trvfkP.png?width=28"
          alt="Optimizely quick links"
          width={28}
          height={28}
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
