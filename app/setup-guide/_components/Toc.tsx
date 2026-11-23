import type { ReactNode } from 'react';
import s from '../setup-guide.module.css';
import { Only } from './ui';

/** A label that differs by computer / Windows terminal. */
const by = (mac: ReactNode, native: ReactNode, wsl: ReactNode = mac) => (
  <>
    <Only os="mac" as="span">{mac}</Only>
    <Only os="win" mode="native" as="span">{native}</Only>
    <Only os="win" mode="wsl" as="span">{wsl}</Only>
  </>
);

const ITEMS: { href: string; n?: number; label: ReactNode }[] = [
  { href: '#start', label: 'Before you start' },
  { href: '#basics', label: 'Terminal basics' },
  { href: '#vscode', label: 'Find the terminal in VS Code' },
  { href: '#s1', n: 1, label: by('Check your shell', 'Set up PowerShell', 'Install Ubuntu (WSL)') },
  { href: '#s2', n: 2, label: by('Install VS Code', 'Install the tools', 'Install VS Code') },
  { href: '#s3', n: 3, label: by('Install Git', 'Check Git', 'Install Git') },
  { href: '#s4', n: 4, label: by('Install Node.js', 'Check Node.js', 'Install Node.js') },
  { href: '#s5', n: 5, label: 'Install Yarn' },
  { href: '#s6', n: 6, label: 'Final check' },
  { href: '#s7', n: 7, label: 'Download the project' },
  { href: '#s8', n: 8, label: 'Install packages' },
  { href: '#session', label: 'Live session: stop here' },
  { href: '#s9', n: 9, label: 'Add your .env file' },
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
