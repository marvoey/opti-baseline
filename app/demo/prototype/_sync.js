/* Link between the audience window (the demo, screen-shared) and the presenter window
   (notes, scene navigation, controls). Both are same-origin tabs, so BroadcastChannel is enough.

   demo -> presenter : { type: 'state', payload }   payload = JSON of { idx, stamps, answer, overlay, resetKey }
   presenter -> demo : { type: 'hello' }            ask for the current state
                       { type: 'step', delta }      previous / next scene
                       { type: 'goto', idx }        jump to a scene
                       { type: 'answer', value }    the visitor's Test 47 answer (typed by the presenter)
                       { type: 'overlay', value }   decision overlay in Scene 8
                       { type: 'reset' }            reset the demo */

export const CHANNEL = 'hrb-demo-prototype';
export const PRESENTER_URL = '/demo/prototype/presenter';
export const PRESENTER_WINDOW = 'hrb-demo-presenter';

export function openChannel() {
  return typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL);
}
