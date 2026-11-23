import type { ElementType, ReactNode } from 'react';
import s from '../setup-guide.module.css';
import { CopyButton } from './controls';

/** Server-rendered building blocks for the guide. Only CopyButton runs in the browser. */

export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ');

type Os = 'mac' | 'win';
type Shell = 'zsh' | 'bash';
type Mode = 'native' | 'wsl';

/**
 * Content that only shows for one computer, Windows terminal (`mode`) and/or shell. `unix` means
 * macOS or WSL (everything except PowerShell). Hidden with CSS, so all variants still print.
 */
export function Only({
  os,
  shell,
  mode,
  unix,
  as: Tag = 'div',
  className,
  children,
}: {
  os?: Os;
  shell?: Shell;
  mode?: Mode;
  unix?: boolean;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cx(os && s[os], shell && s[shell], mode && s[mode], unix && s.unix, className)}>{children}</Tag>;
}

/** Cmd on a Mac, Ctrl on Windows. */
export function ModKey() {
  return (
    <>
      <Only os="mac" as="span"><kbd>Cmd ⌘</kbd></Only>
      <Only os="win" as="span"><kbd>Ctrl</kbd></Only>
    </>
  );
}

/** The key that stops a running command: Control on a Mac (not Cmd), Ctrl on Windows. */
export function StopKey() {
  return (
    <>
      <Only os="mac" as="span"><kbd>Control ⌃</kbd></Only>
      <Only os="win" as="span"><kbd>Ctrl</kbd></Only>
    </>
  );
}

export function Card({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cx(s.card, className)}>
      {children}
    </section>
  );
}

export function Step({
  n,
  title,
  meta,
  children,
}: {
  n: number;
  title: ReactNode;
  meta: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card id={`s${n}`}>
      <div className={s.stepHead}>
        <div className={s.num} aria-hidden="true">{n}</div>
        <div>
          <h2>
            <span className={s.srOnly}>Step {n}: </span>
            {title}
          </h2>
          <div className={s.meta}>{meta}</div>
        </div>
      </div>
      {children}
    </Card>
  );
}

export type CmdItem = { c: string; what?: ReactNode };

/** One command to copy, with an optional plain-English note underneath. */
export function Cmd({
  c,
  what,
  where = 'VS Code terminal',
  n,
  total,
}: CmdItem & { where?: string; n?: number; total?: number }) {
  return (
    <>
      <div className={s.code}>
        <div className={s.codeLabel}>
          Type in: {where}
          {total && total > 1 ? ` · command ${n} of ${total}` : ''}
        </div>
        <CopyButton text={c} />
        <pre>
          <code>{c}</code>
        </pre>
      </div>
      {what && <p className={s.what}>{what}</p>}
    </>
  );
}

/** Several commands, one box each, numbered "command 1 of 3". */
export function Cmds({ items, where }: { items: CmdItem[]; where?: string }) {
  return (
    <>
      {items.map((item, i) => (
        <Cmd key={item.c} {...item} where={where} n={i + 1} total={items.length} />
      ))}
    </>
  );
}

/** What the reader should see. Dashed and without a Copy button so nobody runs it. */
export function Example({
  lines,
  label = 'Example of what you should see. Don’t type this.',
}: {
  lines: string[];
  label?: string;
}) {
  return (
    <div className={s.example}>
      <div className={s.exampleHead}>{label}</div>
      <pre>
        <code>{lines.join('\n')}</code>
      </pre>
    </div>
  );
}

export function Callout({
  kind,
  title,
  className,
  children,
}: {
  kind: 'tip' | 'ok' | 'warn';
  title: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx(s.callout, s[kind], className)}>
      <strong className={s.calloutTitle}>{title}</strong>
      {children}
    </div>
  );
}

/** A collapsible troubleshooting item. */
export function Help({ q, className, children }: { q: ReactNode; className?: string; children: ReactNode }) {
  return (
    <details className={className}>
      <summary>{q}</summary>
      <div className={s.detailsBody}>{children}</div>
    </details>
  );
}
