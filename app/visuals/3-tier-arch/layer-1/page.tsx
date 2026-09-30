import { LayerView } from '../_components/LayerView';
import { LAYERS } from '../_data/layers';

export const metadata = { title: `Layer 1 · ${LAYERS[0].title}` };

export default function Layer1Page() {
  return <LayerView index={0} />;
}
