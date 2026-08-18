import { contentType } from '@optimizely/cms-sdk';
import ShopByCategoryComponent from '@/app/_components/custom/ShopByCategory';

export const ShopByCategoryContentType = contentType({
  key: 'ShopByCategory',
  baseType: '_component',
  displayName: 'Shop by Category',
  description: 'Three-tile category grid with uppercase label and border hover treatment.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

const LS = 'https://www.livingspaces.com/globalassets';
const PROD = `${LS}/productassets`;

const VOYAGE_BASE = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;
const IDRIS_BASE = `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk`;
const ABERDEEN_BASE = `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk`;

const CATEGORY_TILES = [
  { label: 'Desks',   img: `${VOYAGE_BASE}_signature_01.jpg`,   href: '/departments/furniture/home-office/office-desks' },
  { label: 'Chairs',  img: `${IDRIS_BASE}_signature_01.jpg`,    href: null },
  { label: 'Storage', img: `${ABERDEEN_BASE}_signature_01.jpg`, href: null },
];

export default function ShopByCategory() {
  return <ShopByCategoryComponent tiles={CATEGORY_TILES} />;
}
