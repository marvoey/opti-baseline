import { FACILITATOR } from '../_lib/contact';
import { Callout } from './ui';

/** Shown on the sign-in, sign-up and guide pages: the guide is never "finished". */
export default function ImprovementNotice() {
  return (
    <Callout kind="tip" title="This guide is always being improved">
      Steps, screenshots and wording change as we learn what works. If something doesn’t match what you see on your
      screen, or a step is unclear, tell {FACILITATOR}. It helps us fix it for the next person.
    </Callout>
  );
}
