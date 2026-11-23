import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Link-preview card (og:image) for the whole site: Teams, Slack, LinkedIn etc. unfurl shared
 * links with it. Next serves it at /opengraph-image and adds the og:image tags to every route
 * that doesn't set its own. 1200x630 is the size those clients expect.
 *
 * Colours are the Optimizely brand tokens from app/globals.css (Dark Fir, LFGreen).
 */

export const alt = 'Setup guide: your laptop, demo-ready in about an hour';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const DARK_FIR = '#08251a';
const LFGREEN = '#abff44';

const dataUri = async (file: string, mime: string) =>
  `data:${mime};base64,${(await readFile(join(process.cwd(), 'public', file))).toString('base64')}`;

export default async function Image() {
  const [logo, illustration] = await Promise.all([
    // The PNG logo (green on transparent): the SVG one doesn't render its letters in this renderer.
    dataUri('Optimizely_Primary-Logo_Medium_Green_RGB.png', 'image/png'),
    dataUri('setup-guide/guide.svg', 'image/svg+xml'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: DARK_FIR,
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={222} height={76} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: LFGREEN, letterSpacing: 1 }}>
              OPTI-BASELINE · SETUP GUIDE
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                flexDirection: 'column',
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1.05,
                color: '#ffffff',
              }}
            >
              <div style={{ display: 'flex' }}>Your laptop,</div>
              <div style={{ display: 'flex' }}>demo-ready in</div>
              <div style={{ display: 'flex' }}>about an hour.</div>
            </div>
            <div style={{ display: 'flex', marginTop: 24, fontSize: 28, lineHeight: 1.3, color: '#d8e4cb' }}>
              Step-by-step Optimizely CMS demo site setup. No coding needed.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            width: 300,
            height: 300,
            marginLeft: 48,
            borderRadius: 48,
            background: LFGREEN,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={illustration} alt="" width={260} height={260} />
        </div>
      </div>
    ),
    { ...size },
  );
}
