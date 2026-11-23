import type { ReactNode } from 'react';
import s from '../setup-guide.module.css';
import { Only } from './ui';

const ITEMS: { href: string; n?: number; label: ReactNode }[] = [
  { href: '#start', label: 'Before you start' },
  { href: '#basics', label: 'Terminal basics' },
  {
    href: '#s1',
    n: 1,
    label: (
      <>
        <Only os="mac" as="span">Check your shell</Only>
        <Only os="win" as="span">Install Ubuntu (WSL)</Only>
      </>
    ),
  },
  { href: '#s2', n: 2, label: 'Install VS Code' },
  { href: '#s3', n: 3, label: 'Install Git' },
  { href: '#s4', n: 4, label: 'Install Node.js' },
  { href: '#s5', n: 5, label: 'Install Yarn' },
  { href: '#s6', n: 6, label: 'Final check' },
  { href: '#s7', n: 7, label: 'Download the project' },
  { href: '#s8', n: 8, label: 'Add your .env file' },
  { href: '#s9', n: 9, label: 'Install packages' },
  { href: '#s10', n: 10, label: 'Check it works' },
  { href: '#s11', n: 11, label: 'Mark Desktop' },
  { href: '#ready', label: 'You’re ready' },
  { href: '#later', label: 'Coming back later' },
  { href: '#rules', label: 'Ground rules' },
  { href: '#help', label: 'Troubleshooting' },
  { href: '#envref', label: '.env reference' },
];

export default function Toc() {
  return (
    <nav className={s.toc} aria-label="Contents">
      <div className={s.tocTitle}>On this page</div>
      <ul className={s.tocList}>
        {ITEMS.map(({ href, n, label }) => (
          <li key={href}>
            <a href={href}>
              {n !== undefined && <span className={s.tocNum}>{n}</span>}
              {n !== undefined && ' · '}
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
