'use client';

import { useState } from 'react';
import type { FolderInfo } from '../actions';

type TreeNode = FolderInfo & { children: TreeNode[] };

function buildTree(folders: FolderInfo[]): TreeNode[] {
  const byKey = new Map<string, TreeNode>(
    folders.map(f => [f.key, { ...f, children: [] }]),
  );
  const roots: TreeNode[] = [];
  for (const node of byKey.values()) {
    const parent = node.parentKey ? byKey.get(node.parentKey) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => a.displayName.localeCompare(b.displayName));
    nodes.forEach(n => sort(n.children));
  };
  sort(roots);
  return roots;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-700"
    >
      {copied ? 'Copied!' : 'Copy key'}
    </button>
  );
}

function FolderNode({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children.length > 0;

  return (
    <li>
      <div
        className="flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-100 group"
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setOpen(o => !o)}
            className="shrink-0 w-3 text-slate-400 text-xs"
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="shrink-0 w-3" />
        )}
        <span className="text-sm mr-1">📁</span>
        <span className="text-sm text-slate-800 truncate">{node.displayName}</span>
        <code className="ml-2 text-[10px] text-slate-400 font-mono hidden group-hover:inline truncate">
          {node.key}
        </code>
        <CopyButton value={node.key} />
      </div>
      {open && hasChildren && (
        <ul>
          {node.children.map(child => (
            <FolderNode key={child.key} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FolderBrowser({ folders }: { folders: FolderInfo[] }) {
  const tree = buildTree(folders);

  if (folders.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">
        Could not load folders — check CMS credentials.
      </p>
    );
  }

  return (
    <ul className="max-h-72 overflow-y-auto -mx-2">
      {tree.map(node => (
        <FolderNode key={node.key} node={node} depth={0} />
      ))}
    </ul>
  );
}
