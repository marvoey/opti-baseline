import type { ReactNode } from 'react';
import s from '../setup-guide.module.css';
import { Callout, Card, Example, Help, cx } from '../_components/ui';

/**
 * "Why the main .env matters most": the .env in the main folder is the parent of every demo site.
 * scripts/site-new.mjs reads it (from the folder it is run in), uses it to create the new site's CMS
 * start page, asset folder and application, and then writes the new site's own .env.
 *
 * Keep in step with site-new.mjs: SITE_SPECIFIC_KEYS (never copied), the `site` map (written fresh),
 * the application it creates (hosts, preview, never default) and the plan that --dry prints.
 */

const TAKES: { line: ReactNode; does: ReactNode }[] = [
  {
    line: (
      <>
        <code>OPTIMIZELY_CMS_CLIENT_ID</code> and <code>OPTIMIZELY_CMS_CLIENT_SECRET</code>
      </>
    ),
    does: (
      <>
        Sign in to the CMS. This decides <b>which CMS</b> your new site is created in. Also copied into the new site’s{' '}
        <code>.env</code>.
      </>
    ),
  },
  {
    line: <code>HOME_PAGE_CONTENT_ID</code>,
    does: <>The top of the CMS’s page tree. Your new site’s start page is created inside it.</>,
  },
  {
    line: <code>ASSET_BASE_FOLDER_ID</code>,
    does: <>The top of the CMS’s shared assets (blocks and media). Your new site’s asset folder is created inside it.</>,
  },
  {
    line: <code>DEPLOYED_URL</code>,
    does: (
      <>
        Not used to work out your new site’s address. Each site you create gets its own address on your laptop, such as{' '}
        <code>http://localhost:3035</code>. Keep <code>http://localhost:3034</code> here: it’s the address of the main
        project. (The other command, <code>yarn site:new</code>, builds a public address from this line. This guide doesn’t
        use it.)
      </>
    ),
  },
  {
    line: <code>OPTIMIZELY_GRAPH_SINGLE_KEY</code>,
    does: (
      <>The key for reading published content. Used to check the CMS filed your new start page under the new address. Also copied.</>
    ),
  },
  {
    line: <>Every other line</>,
    does: <>Copied across unchanged: the language, the CMS’s own address and any optional settings.</>,
  },
];

const WRONG: { has: ReactNode; happens: ReactNode }[] = [
  {
    has: <>Wrong or out-of-date CMS passwords</>,
    happens: (
      <>
        <code>site:new</code> stops before it creates anything. The error mentions <code>401</code>, <code>403</code> or{' '}
        <i>unauthorized</i>.
      </>
    ),
  },
  {
    has: (
      <>
        A wrong <code>HOME_PAGE_CONTENT_ID</code> or <code>ASSET_BASE_FOLDER_ID</code>
      </>
    ),
    happens: (
      <>
        It stops with <i>“was not found in the CMS”</i>. If the ID points at a real but wrong item, your site is created in
        the wrong part of the CMS.
      </>
    ),
  },
  {
    has: (
      <>
        No <code>PORT</code> line
      </>
    ),
    happens: (
      <>
        The main site opens at <code>http://localhost:3009</code> instead of <code>3034</code>, so the links in Step 11 don’t
        work.
      </>
    ),
  },
  {
    has: (
      <>
        A wrong <code>OPTIMIZELY_CMS_URL</code>
      </>
    ),
    happens: <>Your pages still work, but the CMS’s live preview can’t load from your site.</>,
  },
];

export default function MainEnv() {
  return (
    <Card id="mainenv">
      <div className={s.eyebrow}>Read before Step 9</div>
      <h2>Why the main .env matters most</h2>
      <p>
        The <code>.env</code> you add in Step 9 isn’t only for the main project. It’s the{' '}
        <b>parent of every demo site you create later</b>. When you run <code>yarn site:new:local</code>, the command reads this
        file, uses it to set up your new site in the CMS, and then writes your new site’s own <code>.env</code> for you.
      </p>
      <p>
        So if the main <code>.env</code> is right, every new site starts right. If it’s wrong, every new site starts wrong.
      </p>
      <p>
        In this guide you run the local version of the command, <code>yarn site:new:local</code>. It does the same job as{' '}
        <code>yarn site:new</code>, but your site gets an address on your laptop instead of a public one. Below, “the site
        command” means that one.
      </p>

      <div className={s.flow}>
        <div className={cx(s.flowBox, s.flowStart)}>
          <b>1 · The main .env</b>
          CMS passwords, where the CMS content lives, and the main site’s address.
        </div>
        <span className={s.flowArrow} aria-hidden="true">
          →
        </span>
        <div className={s.flowBox}>
          <b>2 · yarn site:new:local</b>
          Reads that file. Always run it from the main folder.
        </div>
        <span className={s.flowArrow} aria-hidden="true">
          →
        </span>
        <div className={s.flowOut}>
          <div className={s.flowBox}>
            <b>3 · In the CMS</b>A start page, an asset folder and an application with its web address.
          </div>
          <div className={s.flowBox}>
            <b>4 · On your laptop</b>A folder for your site, with its own .env.
          </div>
        </div>
      </div>
      <p>
        “The main folder” is the VS Code window whose terminal prompt includes <code>opti-baseline-main</code>. That’s
        where the parent <code>.env</code> lives, so that’s where the command has to run.
      </p>

      <h3>What site:new takes from the main .env</h3>
      <table>
        <thead>
          <tr>
            <th>Line in the main .env</th>
            <th>What site:new does with it</th>
          </tr>
        </thead>
        <tbody>
          {TAKES.map(({ line, does }, i) => (
            <tr key={i}>
              <td>{line}</td>
              <td>{does}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>What it sets up in the CMS</h3>
      <p>
        In the CMS, an <b>application</b> is the record of one website: its name, its web addresses and its start page. For
        your site, the site command creates three things:
      </p>
      <ul>
        <li>
          A <b>start page</b>: an empty page, published, inside the page tree from <code>HOME_PAGE_CONTENT_ID</code>.
        </li>
        <li>
          An <b>asset folder</b> for your site’s shared blocks, inside the assets from <code>ASSET_BASE_FOLDER_ID</code>.
        </li>
        <li>
          An <b>application</b> with one address: <code>http://localhost:</code> and your site’s own port number (the first
          free one from 3035, such as <code>http://localhost:3035</code>). It’s an address on your own laptop, so the CMS
          can show your pages from your computer.
        </li>
      </ul>
      <p>
        It never makes your application the CMS’s default one. It also publishes the start page only <i>after</i> the
        application exists, so the CMS files the page under the right address.
      </p>
      <Callout kind="tip" title="Nothing goes live">
        The only address registered in the CMS is on your own laptop, so nothing is published to the internet. Putting a
        site online is a separate step that this guide doesn’t cover.
      </Callout>

      <h3>What ends up in your new site’s .env</h3>
      <p>
        The new file is built from three sources. The first line of the new file says so: <i>“Written by yarn site:new:local”</i>.
      </p>
      <div className={s.grid}>
        <div>
          <b>Copied from the main .env</b>The same in every site: the CMS passwords, the key for reading published content,
          the CMS’s own address, the language, and any optional settings.
        </div>
        <div>
          <b>Worked out from the main .env</b>
          <code>DEPLOYED_URL</code> becomes the new site’s own address on your laptop. <code>HOME_PAGE_CONTENT_ID</code> and{' '}
          <code>ASSET_BASE_FOLDER_ID</code> now point at the new site’s own start page and asset folder, not at the top.
        </div>
        <div>
          <b>Set by the command</b>
          <code>SITE_BRANCH</code>, <code>SITE_PREFIX</code> and <code>SITE_NAME</code> come from what you type in{' '}
          <a href="#ready">You’re ready</a>.{' '}
          <code>PORT</code> is the first free number from 3035. <code>MARK_TOOLS_TOKEN</code> is a new random value for
          each site.
        </div>
      </div>
      <Example
        label="Simplified example of a new site’s .env. Don’t type this."
        lines={[
          '# Written by `yarn site:new:local`: this file belongs to ONE site replica (gitignored).',
          'SITE_BRANCH=acme',
          'SITE_PREFIX=Acme',
          'SITE_NAME="Acme Corp"',
          'PORT=3035',
          'DEPLOYED_URL=http://localhost:3035',
          'HOME_PAGE_CONTENT_ID=<the new site’s start page>',
          'ASSET_BASE_FOLDER_ID=<the new site’s asset folder>',
          'OPTIMIZELY_CMS_CLIENT_ID=<copied from the main .env>',
          'OPTIMIZELY_CMS_CLIENT_SECRET=<copied from the main .env>',
          'OPTIMIZELY_GRAPH_SINGLE_KEY=<copied from the main .env>',
        ]}
      />

      <h3>Read the plan before anything is created</h3>
      <p>
        The preview command at the end of this page ends with <code>--dry</code>. A dry run prints a plan and changes
        nothing, so it’s where you check that your main <code>.env</code> did its job:
      </p>
      <Example
        label="Simplified example of a plan. Don’t type this."
        lines={[
          'branch        acme  (from main)',
          'site name     Acme Corp',
          'port          3035  (http://localhost:3035)',
          'DEPLOYED_URL  http://localhost:3035',
          'start page    …  BlankExperience "Acme Corp" under <HOME_PAGE_CONTENT_ID>',
          'asset folder  …  "Acme Corp" under <ASSET_BASE_FOLDER_ID>',
          'application   acme  host http://localhost:3035 (primary, en, https disabled)',
        ]}
      />
      <ul>
        <li>
          The <b>DEPLOYED_URL</b> line should show <code>http://localhost:</code> and a port number from 3035 up.
        </li>
        <li>
          The <b>start page</b> and <b>asset folder</b> lines say what they’re created <i>under</i>. Those are the two IDs
          from the main <code>.env</code>.
        </li>
        <li>
          The <b>application</b> line shows that same address.
        </li>
      </ul>
      <p>
        If any of these look wrong, stop and fix your main <code>.env</code> first. Nothing has been created yet. If the
        preview says an ID <i>“was not found in the CMS”</i>, see <a href="#help">Troubleshooting</a>.
      </p>

      <Callout kind="warn" title="It’s a copy, not a link">
        <code>site:new</code> writes the new site’s <code>.env</code> once. If the main <code>.env</code> changes later,
        sites you’ve already created don’t change, and neither do the CMS items already created for them. Fixing the main
        file only helps the sites you create afterwards. To change an existing site, edit that site’s own{' '}
        <code>.env</code> file, and the matching item in the CMS if you need to.
      </Callout>

      <Help q="What goes wrong if the main .env is wrong?">
        <table>
          <thead>
            <tr>
              <th>If the main .env has…</th>
              <th>What happens</th>
            </tr>
          </thead>
          <tbody>
            {WRONG.map(({ has, happens }, i) => (
              <tr key={i}>
                <td>{has}</td>
                <td>{happens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Help>

      <Callout kind="ok" title="You build this file yourself, in two steps">
        Step 9 copies the project’s template into your own <code>.env</code>. <a href="#s10">Step 10</a> adds your private
        keys from the CMS and gives you the other lines to type. Every value is on this page or in your own CMS. Please
        don’t change a line that Step 10 doesn’t mention.
      </Callout>
    </Card>
  );
}
