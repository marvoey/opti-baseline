/* Link between the audience window (the demo, screen-shared) and the presenter window
   (notes, scene navigation, reference material). Same-origin tabs, so BroadcastChannel is enough.
   Same protocol as app/demo/prototype/_sync.js, on its own channel so the demos can be open at once.

   demo -> presenter : { type: 'state', payload }   payload = JSON of { idx, resetKey, eventCount }
   presenter -> demo : { type: 'hello' }            ask for the current state
                       { type: 'step', delta }      previous / next scene
                       { type: 'goto', idx }        jump to a scene
                       { type: 'reset' }            reset the demo */

export const CHANNEL = 'hrb-demo-odp-mark';
export const PRESENTER_URL = '/demo/odp-mark/presenter';
export const PRESENTER_WINDOW = 'hrb-demo-odp-mark-presenter';

export function openChannel() {
  return typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL);
}
