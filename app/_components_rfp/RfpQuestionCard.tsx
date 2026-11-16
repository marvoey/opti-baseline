import React from 'react';

/**
 * Server-rendered copy of the question card in app/demo/rfp-followups/page.jsx
 * (`renderCard`), used to preview an LmRfpQuestion item from the CMS. It mirrors
 * that card's markup, colors and text rendering (bullets, numbered steps, labels,
 * code blocks, [CONFIRM] notes, `code`, markdown links, OP-xx references).
 *
 * Differences, because the viewer keeps client state and this does not: no "Copy
 * response" button, no "mark [CONFIRM] done", and cross-references are styled but
 * not clickable. If the viewer's card or text rules change, change this too.
 */

const FORMAT_LABELS: Record<string, string> = {
  written: 'Written follow-up',
  visual: 'Visual demonstration follow-up',
  'written-visual': 'Written and visual demonstration follow-up',
};

const CONFIRM_SRC = '\\[CONFIRM[^\\]]*\\]';
const TOKEN_SRC =
  '(OP-14 Data Flow|OP-14 ERD|OP-16 Sample Query)|(OP-\\d{2})|(' +
  CONFIRM_SRC +
  ')|(`[^`]+`)|\\[([^\\]\\n]+)\\]\\(((?:https?:\\/\\/|\\/)[^\\s)]+)\\)';

const countConfirms = (t: string) => (t.match(new RegExp(CONFIRM_SRC, 'g')) || []).length;

const CSS = `
.lmv details > summary { list-style: none; cursor: pointer; }
.lmv details > summary::-webkit-details-marker { display: none; }
.lmv details[open] > summary .chev { transform: rotate(90deg); }
.lmv .chev { transition: transform .15s ease; }
.lmv pre.code { font-family: "Roboto Mono", ui-monospace, monospace; font-size: 12.5px; line-height: 1.55; background: #1A1446; color: #FFFFFF; border-radius: 12px; padding: 16px; overflow: auto; white-space: pre; margin: 8px 0; }
.lmv .confirm { background: #FFEAA9; color: #1A1446; border-left: 3px solid #FFD000; padding: 1px 6px; border-radius: 4px; font-weight: 500; }
.lmv code.ic { font-family: "Roboto Mono", ui-monospace, monospace; font-size: .85em; background: #F5F5F5; border: 1px solid #E6E6E6; border-radius: 4px; padding: 0 4px; color: #1A1446; }
.lmv .xref { color: #06748C; font-weight: 500; text-decoration: underline; text-underline-offset: 2px; }
`;

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap';

const fmtDate = (v?: string | null) => {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

/* ---------- text rendering (same rules as the viewer's inline / renderText) ---------- */

function inline(text: string, srcKey: string | null): React.ReactNode[] {
  const re = new RegExp(TOKEN_SRC, 'g');
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [tok, tabName, op, cf, code, mdText, mdUrl] = m;
    if (tabName) {
      out.push(<span key={`t${k++}`} className="xref">{tabName}</span>);
    } else if (op) {
      out.push(op !== srcKey ? <span key={`o${k++}`} className="xref">{op}</span> : op);
    } else if (cf) {
      out.push(<span key={`c${k++}`} className="confirm">{cf}</span>);
    } else if (code) {
      out.push(<code key={`k${k++}`} className="ic">{code.slice(1, -1)}</code>);
    } else if (mdUrl) {
      out.push(
        <a
          key={`l${k++}`}
          className="text-[#06748C] font-medium underline underline-offset-2 hover:text-[#1A1446]"
          href={mdUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {mdText}
        </a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function labelOf(t: string): string | null {
  const body = t.replace(/^\s*(?:•\s*|\d+\.\s*|[a-z]\.\s*)/, '');
  if (body.startsWith('[')) return null;
  const ci = body.indexOf(':');
  if (ci > 0 && ci <= 48) {
    const pre = body.slice(0, ci);
    if (!/[.?!]/.test(pre) && !/http/i.test(pre) && !pre.includes('`')) return pre + ':';
  }
  return null;
}

function lineNodes(body: string, rawTrim: string, srcKey: string | null): React.ReactNode[] {
  const label = labelOf(rawTrim);
  const at = label ? body.indexOf(label) : -1;
  if (!label || at < 0) return inline(body, srcKey);
  return [
    <React.Fragment key="pre">{inline(body.slice(0, at), srcKey)}</React.Fragment>,
    <strong key="lbl" className="text-[#1A1446] font-medium">{inline(label, srcKey)}</strong>,
    <React.Fragment key="post">{inline(body.slice(at + label.length), srcKey)}</React.Fragment>,
  ];
}

function renderText(text: string, srcKey: string | null): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let code: string[] = [];
  let k = 0;
  const flush = () => {
    if (code.length) {
      out.push(<pre key={`p${k++}`} className="code">{code.join('\n')}</pre>);
      code = [];
    }
  };
  text.split('\n').forEach((raw) => {
    if (/^\{\s/.test(raw) || /^ {4}\S/.test(raw)) {
      code.push(raw);
      return;
    }
    flush();
    const t = raw.trim();
    if (!t) {
      out.push(<div key={`s${k++}`} className="h-2" />);
      return;
    }
    if (/^\s*•/.test(raw)) {
      const body = t.replace(/^•\s*/, '');
      out.push(
        <div key={`b${k++}`} className="flex gap-2 pl-1 my-1">
          <span className="text-[#06748C] font-bold leading-6">{'•'}</span>
          <div className="leading-6">{lineNodes(body, t, srcKey)}</div>
        </div>
      );
    } else if (/^\s*\d+\.\s/.test(raw)) {
      const n = (t.match(/^(\d+)\.\s/) as RegExpMatchArray)[1];
      const body = t.replace(/^\d+\.\s/, '');
      out.push(
        <div key={`n${k++}`} className="flex gap-2.5 my-1.5">
          <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1A1446] text-white text-[11px] font-medium">{n}</span>
          <div className="leading-6">
            <span className="sr-only">{n}. </span>
            {lineNodes(body, t, srcKey)}
          </div>
        </div>
      );
    } else if (/^\s+[a-z]\.\s/.test(raw)) {
      out.push(<div key={`a${k++}`} className="pl-8 my-1 leading-6">{lineNodes(t, t, srcKey)}</div>);
    } else if (/:$/.test(t) && t.length < 90) {
      out.push(<p key={`h${k++}`} className="mt-3 mb-1 font-medium text-[#1A1446] leading-6">{inline(t, srcKey)}</p>);
    } else {
      out.push(<p key={`l${k++}`} className="my-1 leading-6">{lineNodes(t, t, srcKey)}</p>);
    }
  });
  flush();
  return out;
}

/* ---------- card ---------- */

const Chev = () => (
  <svg className="chev w-4 h-4 text-[#06748C] shrink-0" width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M7 5l6 5-6 5V5z" />
  </svg>
);

function FormatBadge({ label }: { label: string }) {
  let cls = 'bg-[#C9F3F4] text-[#1A1446]';
  if (/^Visual/.test(label)) cls = 'bg-[#FFEAA9] text-[#1A1446]';
  else if (/Written and visual/.test(label)) cls = 'bg-[#1A1446] text-white';
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label || '—'}</span>;
}

export type RfpQuestion = {
  QuestionId?: string | null;
  LmRfpId?: string | null;
  Topic?: string | null;
  FollowUpQuestion?: string | null;
  ResponseFormat?: string | null;
  VendorResponse?: string | null;
  SupportingDocumentation?: (string | null)[] | null;
  _metadata?: { status?: string | null; version?: string | null; lastModified?: string | null } | null;
};

export default function RfpQuestionCard({ content }: { content: RfpQuestion }) {
  const id = String(content.QuestionId ?? '').trim();
  const rfp = String(content.LmRfpId ?? '');
  const topic = String(content.Topic ?? '');
  const question = String(content.FollowUpQuestion ?? '');
  const response = String(content.VendorResponse ?? '');
  const format = FORMAT_LABELS[String(content.ResponseFormat ?? '')] || String(content.ResponseFormat ?? '');
  const docs = (content.SupportingDocumentation ?? []).map((u) => String(u ?? '').trim()).filter(Boolean);
  const meta = content._metadata;
  const nConf = countConfirms(response);

  return (
    <div className="lmv bg-white text-[#343741] p-4 sm:p-6" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <link rel="stylesheet" href={FONTS_HREF} precedence="default" />
      <style>{CSS}</style>
      <article className="rounded-2xl border border-[#E6E6E6] bg-white overflow-hidden max-w-4xl mx-auto">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-[#E6E6E6]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-[#FFD000] text-[#1A1446] text-xs font-bold px-2 py-1">{id}</span>
            <span className="inline-flex items-center rounded-md border border-[#C0BFC0] text-[#343741] text-xs px-2 py-0.5">
              LM RFP ID: {rfp.trim() ? rfp : <span className="text-[#707070]">{'—'}</span>}
            </span>
            <FormatBadge label={format} />
            {nConf > 0 && <span className="inline-flex items-center rounded-full bg-[#FFEAA9] text-[#1A1446] text-xs font-medium px-2.5 py-0.5">{nConf} [CONFIRM]</span>}
            {!response.trim() && <span className="inline-flex items-center rounded-full border border-[#1A1446] text-[#1A1446] text-xs font-medium px-2.5 py-0.5">Awaiting response</span>}
            {meta?.status === 'Draft' && <span className="inline-flex items-center rounded-full bg-[#1A1446] text-white text-xs font-medium px-2.5 py-0.5">Draft</span>}
            {meta?.lastModified && (
              <span className="ml-auto text-xs text-[#707070]">
                Updated {fmtDate(meta.lastModified)}
                {meta.version ? ` · v${meta.version}` : ''}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#707070]">Topic</p>
          <h3 className="mt-1 text-lg font-medium text-[#1A1446] leading-snug">{inline(topic, id)}</h3>
        </div>

        <details className="border-b border-[#E6E6E6]" open>
          <summary className="flex items-center gap-2 px-5 sm:px-6 py-3 hover:bg-[#F5F5F5]">
            <Chev />
            <span className="text-sm font-bold text-[#1A1446]">Follow-up question</span>
          </summary>
          <div className="px-5 sm:px-6 pb-4 text-[15px] text-[#343741]">{renderText(question, null)}</div>
        </details>

        <details className="border-b border-[#E6E6E6]" open>
          <summary className="flex items-center gap-2 px-5 sm:px-6 py-3 hover:bg-[#F5F5F5]">
            <Chev />
            <span className="text-sm font-bold text-[#1A1446]">Vendor response</span>
          </summary>
          <div className="px-5 sm:px-6 pb-5 text-[15px] text-[#343741]">
            {response.trim() ? renderText(response, id) : <p className="italic text-[#707070]">No vendor response yet.</p>}
          </div>
        </details>

        <details open={docs.length > 0}>
          <summary className="flex items-center gap-2 px-5 sm:px-6 py-3 hover:bg-[#F5F5F5]">
            <Chev />
            <span className="text-sm font-bold text-[#1A1446]">Supporting documentation</span>
          </summary>
          <div className="px-5 sm:px-6 pb-5">
            {docs.length ? (
              <ul className="space-y-1.5">
                {docs.map((u) => (
                  <li key={u} className="flex gap-2 text-sm">
                    <span className="text-[#707070]">{'↗'}</span>
                    <a className="text-[#06748C] underline underline-offset-2 hover:text-[#1A1446] break-all" href={u} target="_blank" rel="noopener noreferrer">
                      {u}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-[#707070]">None listed.</p>
            )}
          </div>
        </details>
      </article>
    </div>
  );
}
