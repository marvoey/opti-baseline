import { LayerView } from '../_components/LayerView';
import { LAYERS } from '../_data/layers';

export const metadata = { title: `Layer 2 · ${LAYERS[1].title}` };

export default function Layer2Page() {
  return <LayerView index={1} />;
}
