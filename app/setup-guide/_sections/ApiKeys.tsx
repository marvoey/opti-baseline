import s from '../setup-guide.module.css';
import { Check } from '../_components/controls';
import { Figure, FigureRow, Pin } from '../_components/Figure';
import { Callout, Example, ModKey, Step } from '../_components/ui';

/**
 * Step 10: where to get the three private values that go into the main .env, and how. Nothing else is typed here:
 * PORT and the two CMS root IDs (HOME_PAGE_CONTENT_ID, ASSET_BASE_FOLDER_ID, the same in every CMS (SaaS)) already come
 * filled in from .env.example, which Step 9 copies.
 *
 *   OPTIMIZELY_GRAPH_SINGLE_KEY      CMS > Settings > API Keys > Delivery Keys > Render Content > Single key
 *   OPTIMIZELY_CMS_CLIENT_ID         CMS > Settings > API Keys > Manage Content > Create API Key
 *   OPTIMIZELY_CMS_CLIENT_SECRET     shown once, in the same window as the Client ID
 *
 * The "Manage Graph" app key and secret, and the Address, are NOT used by this project (nothing reads
 * them); OPTIMIZELY_GRAPH_GATEWAY has a built-in default and the address on that page is not the full
 * one the code uses. Keep that in step with lib/env.ts and scripts/lib/cms-api.mjs.
 *
 * Screenshots: public/setup-guide/cms/*.png. Every key, secret and ID in them is covered. Never add a
 * screenshot that shows a real one.
 */

const SHOTS = '/setup-guide/cms';

export default function ApiKeys() {
  return (
    <Step n={10} title="Get your API keys from the CMS" meta="About 10 min">
      <p>
        The <code>.env</code> file from Step 9 still has empty spots for the private keys. This step fills them. An{' '}
        <b>API key</b> works like a password: it proves to the CMS that a program (your website, or a command) is allowed
        to talk to it. You need three values from the CMS, and each one goes on its own line in your <code>.env</code>.
      </p>

      <table>
        <thead>
          <tr>
            <th>Value</th>
            <th>Where to find it in the CMS</th>
            <th>Goes on this line of your .env</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <b>Single key</b>
            </td>
            <td>
              Settings → API Keys → Delivery Keys → Render Content → <b>Single key</b>. It’s already there: you only copy it.
            </td>
            <td>
              <code>OPTIMIZELY_GRAPH_SINGLE_KEY</code>
            </td>
          </tr>
          <tr>
            <td>
              <b>Client ID</b>
            </td>
            <td>
              Settings → API Keys → Manage Content → <b>Create API Key</b>. You create it yourself.
            </td>
            <td>
              <code>OPTIMIZELY_CMS_CLIENT_ID</code>
            </td>
          </tr>
          <tr>
            <td>
              <b>Secret</b>
            </td>
            <td>Shown once, in the same window as the Client ID.</td>
            <td>
              <code>OPTIMIZELY_CMS_CLIENT_SECRET</code>
            </td>
          </tr>
        </tbody>
      </table>

      <div className={s.grid}>
        <div>
          <b>The Single key</b>Lets your website <i>read</i> the content that’s published in the CMS. The website won’t
          start without it.
        </div>
        <div>
          <b>The Client ID and Secret</b>A username and password for the tools. Commands such as{' '}
          <code>yarn cms:align</code> and <code>yarn site:new</code> use them to sign in to the CMS.
        </div>
      </div>

      <Callout kind="tip" title="You’ll switch between two windows">
        The CMS is in your web browser, and your <code>.env</code> file is in VS Code. Copy in one window, then paste in the
        other.
      </Callout>
      <Callout kind="tip" title="Can’t see the gear icon, or API Keys in the menu?">
        Creating API keys needs administrator access to your CMS. If you can’t find them below, ask the administrator of
        your CMS to give you that access, then come back to this step.
      </Callout>

      <h3>a. Open the API Keys page</h3>
      <ol>
        <li>
          Open your CMS in your web browser and sign in with your Optimizely account. Its address starts with{' '}
          <code>https://app-</code> and ends with <code>.cms.optimizely.com</code>. Don’t have it? Sign in at{' '}
          <a href="https://home.optimizely.com/" target="_blank" rel="noopener noreferrer">
            home.optimizely.com
          </a>{' '}
          and open your Content Management System from there.
        </li>
        <li>
          Look at the narrow bar of icons on the far left. Click the <b>gear icon</b> (Settings).
        </li>
        <li>
          In the Settings menu, find <b>ACCESS RIGHTS</b> and click <b>API Keys</b>.
        </li>
      </ol>
      <FigureRow>
        <Figure
          src={`${SHOTS}/cms-settings-gear.png`}
          width={345}
          height={430}
          narrow
          alt="The CMS with its narrow icon bar on the left. A blue arrow points at the gear icon, which opens Settings."
        >
          <b>2.</b> Click the gear icon. The blue arrow points at it.
        </Figure>
        <Figure
          src={`${SHOTS}/cms-settings-api-keys.png`}
          width={345}
          height={440}
          narrow
          alt="The Settings menu. A blue arrow points at API Keys, under the ACCESS RIGHTS heading."
        >
          <b>3.</b> Click <b>API Keys</b>, under ACCESS RIGHTS.
        </Figure>
      </FigureRow>
      <p>
        The page that opens is the <b>API Keys</b> page. You’ll use two parts of it. They’re marked <Pin n={1} /> and{' '}
        <Pin n={2} /> in the picture. Your page will also show a few other keys and values. Ignore them.
      </p>
      <Figure
        src={`${SHOTS}/cms-api-keys-page.png`}
        width={1600}
        height={765}
        enlarge
        alt="The API Keys page. Marker 1 is on the SINGLE KEY row under Delivery Keys, Render Content. Marker 2 is on the green Create API Key button under Manage Content. The Manage Graph section is outlined with a dashed line and labelled You don’t need these."
      >
        <Pin n={1} /> the <b>Single key</b> row. <Pin n={2} /> the green <b>Create API Key</b> button. The dashed box (Manage
        Graph) is not needed. The green boxes hide the real values here. Yours shows them.
      </Figure>

      <h3>b. Copy your Single key into .env</h3>
      <ol start={4}>
        <li>
          On the API Keys page, find <b>Delivery Keys</b>, then <b>Render Content</b>, then the row called{' '}
          <b>SINGLE KEY</b> (marker <Pin n={1} />). Double-click the long string of letters and numbers next to it to
          select it all. Then copy it (<ModKey /> <kbd>C</kbd>).
        </li>
        <li>
          Switch to VS Code and click the <code>.env</code> tab. Find the line that starts with{' '}
          <code>OPTIMIZELY_GRAPH_SINGLE_KEY=</code>. Click right after the <code>=</code> and paste (<ModKey /> <kbd>V</kbd>
          ). Then save with <ModKey /> <kbd>S</kbd>.
        </li>
      </ol>
      <ul>
        <li>
          If there’s already some text after the <code>=</code> (a placeholder), select it and replace it. Only your key
          should be there.
        </li>
        <li>
          Can’t find the line? Add it on a new line at the bottom of the file.
        </li>
      </ul>

      <h3>c. Create your own API key (the Client ID and Secret)</h3>
      <ol start={6}>
        <li>
          Back in the CMS, scroll to <b>Manage Content</b> and click the green <b>Create API Key</b> button (marker{' '}
          <Pin n={2} />).
        </li>
        <li>
          A small window opens with a <b>Name</b> box. Type a name you’ll recognise later, for example your name and{' '}
          <code>setup-guide</code>, like <code>jsmith-setup-guide</code>. Use only letters, numbers, hyphens (<code>-</code>)
          and underscores (<code>_</code>). Then click <b>Create API Key</b>.
        </li>
      </ol>
      <Figure
        src={`${SHOTS}/cms-create-api-key.png`}
        width={620}
        height={235}
        small
        alt="The Create API Key window with a Name box, and Cancel and Create API Key buttons."
      >
        <b>7.</b> Type a name in the <b>Name</b> box, then click <b>Create API Key</b>. The green box is only an example of
        the kind of name to type.
      </Figure>
      <ol start={8}>
        <li>
          A <b>Save your Secret</b> window opens. It shows your new <b>Client ID</b> and <b>Secret</b>, each with a small{' '}
          <b>copy icon</b> (two overlapping squares) at its right end.
        </li>
      </ol>
      <Figure
        src={`${SHOTS}/cms-save-secret.png`}
        width={620}
        height={406}
        small
        alt="The Save your Secret window. It shows a Client ID box and a Secret box, each with a copy icon, a note that the Secret is shown only once, and a Done button."
      >
        <b>8.</b> The <b>Save your Secret</b> window. The green boxes hide the real values here. Yours shows them.
      </Figure>
      <Callout kind="warn" title="The Secret is shown only once">
        Don’t click <b>Done</b> until both values are pasted into <code>.env</code> and saved. Once you close this window,
        the CMS can’t show the Secret again. If that happens, just create a new key (see{' '}
        <a href="#help">Troubleshooting</a>).
      </Callout>
      <ol start={9}>
        <li>
          Click the copy icon next to <b>Client ID</b>. Switch to VS Code and paste it right after{' '}
          <code>OPTIMIZELY_CMS_CLIENT_ID=</code> in your <code>.env</code>.
        </li>
        <li>
          Go back to the CMS window, click the copy icon next to <b>Secret</b>, switch to VS Code and paste it right after{' '}
          <code>OPTIMIZELY_CMS_CLIENT_SECRET=</code>. Save with <ModKey /> <kbd>S</kbd>.
        </li>
        <li>
          Only now, go back to the CMS and click <b>Done</b>. Your new key appears in the list under Manage Content, with
          the name you chose.
        </li>
      </ol>

      <p>
        <b>Give your new key full access.</b> A new key starts with no access rights, so it can’t do anything yet. Without this part, later steps fail with a{' '}
        <code>403</code> error. You give the key rights on the <b>Root</b> of the CMS, the very top of everything.
      </p>
      <ol start={12}>
        <li>
          In the CMS, click the gear icon (Settings) again. In the Settings menu, under <b>ACCESS RIGHTS</b>, click{' '}
          <b>Set Access Rights</b>. It’s the entry just below <b>API Keys</b>.
        </li>
      </ol>
      <Figure
        src={`${SHOTS}/cms-set-access-rights.png`}
        width={345}
        height={480}
        narrow
        alt="The Settings menu. The hand cursor is on Set Access Rights, under the ACCESS RIGHTS heading, just below API Keys."
      >
        <b>12.</b> Click <b>Set Access Rights</b>, just below API Keys.
      </Figure>
      <ol start={13}>
        <li>
          The page is called <b>Set Access Rights for “…”</b>. Make sure the name in the title is <b>Root</b>. If it
          isn’t, click <b>Root</b> at the top of the tree. It’s the top item, with a folder icon.
        </li>
      </ol>
      <Figure
        src={`${SHOTS}/cms-access-rights-root.png`}
        width={1280}
        height={560}
        enlarge
        alt="The Set Access Rights for Root page. Root is highlighted at the top of the tree. The Add User/Group button is at the bottom right. Some site names in the tree are hidden behind green boxes."
      >
        <b>13.</b> The title says <b>Root</b>, and <b>Root</b> is highlighted at the top of the tree. The green boxes hide
        site names here. Your tree shows its own.
      </Figure>
      <ol start={14}>
        <li>
          Click the <b>Add User/Group</b> button at the right, above the table of rights. A list opens with a search box
          at the top. Under <b>API KEYS</b> it lists every key by its <b>Client ID</b> (a long string of letters and
          numbers), not by the name you chose.
        </li>
        <li>
          Find <b>your</b> key: type or paste the start of your Client ID in the search box (it’s on the{' '}
          <code>OPTIMIZELY_CMS_CLIENT_ID=</code> line of your <code>.env</code>), then click your key in the list. It
          now appears as a new row in the table.
        </li>
        <li>
          In your key’s row, tick <b>all six boxes</b>: <b>READ</b>, <b>CREATE</b>, <b>CHANGE</b>, <b>DELETE</b>,{' '}
          <b>PUBLISH</b> and <b>ADMINISTER</b>. Each one should show a green tick. If the page shows a{' '}
          <b>Save Access Rights</b> button, click it.
        </li>
      </ol>
      <Figure
        src={`${SHOTS}/cms-access-rights-add-key.png`}
        width={1310}
        height={804}
        enlarge
        alt="The Set Access Rights for Root page with the Add User/Group list open. Blue arrows point at Root in the tree, at the list of API keys, and at the six column headings READ, CREATE, CHANGE, DELETE, PUBLISH and ADMINISTER. Every box in the rows below is ticked. Key IDs and site names are hidden behind green boxes."
      >
        <b>14–16.</b> The blue arrows show the order: <b>Root</b> is selected, <b>Add User/Group</b> opens the list of API
        keys, and all six columns are ticked in your key’s row. The green boxes hide real Client IDs and site names here.
        Yours shows them.
      </Figure>
      <Check id="s10-access" />

      <h3>d. Check your .env</h3>
      <Example
        label="How the three lines should look. The real values replace the words in < >. Don’t type this."
        lines={[
          'OPTIMIZELY_GRAPH_SINGLE_KEY=<your Single key>',
          'OPTIMIZELY_CMS_CLIENT_ID=<your Client ID>',
          'OPTIMIZELY_CMS_CLIENT_SECRET=<your Secret>',
        ]}
      />
      <ul>
        <li>
          Each value sits right after the <code>=</code>: no space before or after it, and no quote marks.
        </li>
        <li>Nothing from the template is left after your value.</li>
        <li>
          Each value is on its own line, and the <code>.env</code> tab has no white dot (so it’s saved).
        </li>
      </ul>
      <Check id="s10-single" />
      <Check id="s10-client" />

      <Callout kind="tip" title="What about the other lines in .env?">
        You only need these three values. The other lines came with the template in Step 9. The port number and the two
        content IDs are already filled in, and the rest can stay as they are.
      </Callout>
      <Callout kind="tip" title="Things on the API Keys page you don’t need">
        The <b>Manage Graph</b> app key and secret, and the <b>Address</b> next to the Single key. Leave the{' '}
        <code>OPTIMIZELY_GRAPH_GATEWAY</code> line alone: the project already knows the right address, and the one on this
        page isn’t the full address it uses.
      </Callout>
      <Callout kind="warn" title="Treat your keys like passwords">
        Never paste them into chat or email, and blur them in any screenshot you share. If you share one by accident,
        create a new key (part c), put its Client ID and Secret in <code>.env</code>, then remove the old key: on the API
        Keys page, open the ⋯ menu at the end of the old key’s row.
      </Callout>
      <Callout kind="tip" title="A new key may need permission">
        A key with no access rights can’t do anything. If a later step says <code>403</code> or <i>forbidden</i>, go back to
        “Give your new key full access” in part c and check that <b>Root</b> is selected and all six boxes are ticked in
        your key’s row.
      </Callout>
    </Step>
  );
}
