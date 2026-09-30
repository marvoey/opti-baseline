import { LayerView } from '../_components/LayerView';
import { LAYERS } from '../_data/layers';

export const metadata = { title: `Layer 3 · ${LAYERS[2].title}` };

export default function Layer3Page() {
  return <LayerView index={2} />;
}
