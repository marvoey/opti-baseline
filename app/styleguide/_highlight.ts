import { createHighlighter, type BundledLanguage, type Highlighter } from 'shiki';

/**
 * Server-side syntax highlighting via Shiki (the VS Code engine).
 *
 * Runs at build/request time on the server, so highlighted markup is baked into
 * the static HTML — the browser ships ZERO highlighting JS. The highlighter is
 * created once and memoised across renders; we only load the grammars/theme the
 * styleguide actually uses.
 */

export const CODE_THEME = 'github-dark';
const LANGS: BundledLanguage[] = ['tsx', 'json'];

let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({ themes: [CODE_THEME], langs: LANGS });
  }
  return highlighterPromise;
}

/** Highlight `code` to a `<pre class="shiki">…</pre>` HTML string. */
export async function highlight(code: string, lang: BundledLanguage): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, { lang, theme: CODE_THEME });
}
