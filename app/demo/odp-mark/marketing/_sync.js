/* Link between the audience window (the demo, screen-shared) and the presenter window
   (notes, scene navigation, controls). Same-origin tabs, so BroadcastChannel is enough.
   Same protocol as app/demo/prototype/_sync.js, on its own channel so the demos can be open at once.

   demo -> presenter : { type: 'state', payload }   payload = JSON of { idx, stamps, answer, resetKey }
   presenter -> demo : { type: 'hello' }            ask for the current state
                       { type: 'step', delta }      previous / next scene
                       { type: 'goto', idx }        jump to a scene
                       { type: 'answer', value }    the visitor's answer to the Monday question (typed by the presenter)
                       { type: 'reset' }            reset the demo */

export const CHANNEL = 'hrb-demo-odp-mark-marketing';
export const PRESENTER_URL = '/demo/odp-mark/marketing/presenter';
export const PRESENTER_WINDOW = 'hrb-demo-odp-mark-marketing-presenter';

export function openChannel() {
  return typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL);
}
