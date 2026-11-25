'use client';

import { useEffect, useId, useState } from 'react';
import s from '../setup-guide.module.css';
import { MAX_FOLDER_NAME } from '../_lib/folders';
import {
  MAX_SHORT_NAME,
  MAX_SITE_NAME,
  PREFIX_LENGTH,
  resolveSite,
  siteCommand,
  typeKeyPrefix,
  type SiteInput,
} from '../_lib/site';
import { useGuide } from './GuideProvider';
import { Callout, Cmd } from './ui';

/**
 * "You're ready": the reader types a site name and an opportunity (both required). The short site name
 * and a three-letter prefix are worked out from them, and can be replaced in two optional boxes. The two
 * `yarn site:new:local` commands (a preview with --dry, and the real one) are built from the result.
 * Rules live in _lib/site.ts.
 */

type Field = { which: keyof SiteInput; label: string; hint: string; placeholder: string; max: number };

const REQUIRED: Field[] = [
  {
    which: 'name',
    label: 'Site name',
    hint: 'What your demo site is called, for example Acme Corp.',
    placeholder: 'Acme Corp',
    max: MAX_SITE_NAME,
  },
  {
    which: 'opportunity',
    label: 'Opportunity',
    hint: 'The customer or deal it’s for, for example acme. It becomes a folder next to your main project folder.',
    placeholder: 'acme',
    max: MAX_FOLDER_NAME,
  },
];

export function SiteInputs() {
  const { typedSite, site, folders, setSiteField, finishSiteField } = useGuide();
  const result = resolveSite(site, folders.main);
  const errors = result.ok ? {} : result.errors;
  const { auto } = result;
  const id = useId();

  // The optional boxes start closed, unless the reader already has their own values or one of them has a problem.
  const [open, setOpen] = useState(Boolean(site.shortName || site.prefix));
  const optionalProblem = Boolean(errors.shortName || errors.prefix);
  useEffect(() => {
    if (optionalProblem) setOpen(true);
  }, [optionalProblem]);

  const optional: Field[] = [
    {
      which: 'shortName',
      label: 'Short name (optional)',
      hint: 'Lower-case letters, numbers and dashes. Used in your site’s branch and folder names. Leave empty to use the one we worked out.',
      placeholder: auto.shortName || 'acme-corp',
      max: MAX_SHORT_NAME,
    },
    {
      which: 'prefix',
      label: 'Prefix (optional)',
      hint: `Exactly ${PREFIX_LENGTH} letters, in lower case. It starts the names of your content types, like AcmHeroBlock for acm. Leave empty to use the one we worked out.`,
      placeholder: auto.prefix || 'acm',
      max: PREFIX_LENGTH,
    },
  ];

  const input = ({ which, label, hint, placeholder, max }: Field, required: boolean) => (
    <label key={which} className={s.field}>
      <span>
        {label} {required && <span aria-hidden="true">*</span>}
      </span>
      <input
        type="text"
        value={typedSite[which]}
        placeholder={placeholder}
        maxLength={max}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(errors[which])}
        aria-describedby={`${id}-${which}`}
        onChange={(e) => setSiteField(which, e.target.value)}
        onBlur={() => finishSiteField(which)}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
      <small id={`${id}-${which}`}>{hint}</small>
      {errors[which] && (
        <small className={s.fieldError} role="alert">
          {errors[which]}
        </small>
      )}
    </label>
  );

  return (
    <>
      <div className={s.folderForm}>
        {REQUIRED.map((f) => input(f, true))}
        <small className={s.folderRule}>
          Both boxes are required. The site name can use letters, numbers, spaces and . , &amp; ’ ( ) - only. The
          opportunity uses lower-case letters, numbers and dashes, and spaces turn into dashes.
        </small>
      </div>
      <details className={s.optionalBox} open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary>Change the short name or prefix (optional)</summary>
        <p>
          We work these out from your site name for you. Only change them if you want something different, or if the
          preview says the prefix is already used.
        </p>
        <div className={s.folderForm}>{optional.map((f) => input(f, false))}</div>
      </details>
    </>
  );
}

/** The preview and the real command, or a note asking for the missing boxes. */
export function SiteCommands() {
  const { site, folders } = useGuide();
  const result = resolveSite(site, folders.main);
  if (!result.ok) {
    return (
      <Callout kind="tip" title="Fill in both boxes">
        Your two commands appear here as soon as the <b>Site name</b> and the <b>Opportunity</b> are filled in.
      </Callout>
    );
  }
  const { name, shortName, prefix, opportunity } = result;
  return (
    <>
      <p className={s.what} data-testid="site-summary">
        Your site is called <b>{name}</b>. Its short name is <code>{shortName}</code> and its prefix is{' '}
        <code>{prefix}</code>
        {site.shortName || site.prefix ? ' (the ones you typed are used)' : ''}. Your content types will be named like{' '}
        <code>{typeKeyPrefix(prefix)}HeroBlock</code>, and the site is created in{' '}
        <code>
          {folders.container}/{opportunity}/opti-baseline-{shortName}
        </code>
        .
      </p>
      <Cmd
        c={siteCommand(result, true)}
        n={1}
        total={2}
        what={
          <>
            <b>Preview.</b> Checks everything and prints what it would do. It changes nothing, so run this one first. If
            it says the prefix is already used, type a different three letters under “Change the short name or prefix”.
          </>
        }
      />
      <Cmd
        c={siteCommand(result, false)}
        n={2}
        total={2}
        what={
          <>
            <b>Create your site.</b> The same command without <code>--dry</code>. It changes your CMS, so only run it
            once the preview above looks right.
          </>
        }
      />
      <p>
        Run both in the terminal inside your main project, the one whose prompt includes <code>opti-baseline-main</code>.
      </p>
    </>
  );
}
