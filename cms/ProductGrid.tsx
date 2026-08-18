import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import ProductGridComponent from '@/app/_components/custom/ProductGrid';

export const ProductGridContentType = contentType({
  key: 'ProductGrid',
  baseType: '_component',
  displayName: 'Product Grid',
  description: 'Office desks product grid with filters and product cards.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

type Props = { content: ContentProps<typeof ProductGridContentType> };

const PRODUCTS = [
  { name: 'Voyage Natural 60" Writing Desk', brand: 'Nate + Jeremiah', price: '$695',   img: 'https://www.livingspaces.com/globalassets/productassets/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk_signature_01.jpg',   route: '/voyage-natural-60-writing-desk' },
  { name: 'Idris L-Shaped Executive Desk',   brand: 'Essential',       price: '$1,095', img: 'https://www.livingspaces.com/globalassets/productassets/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk_signature_01.jpg',    route: null },
  { name: 'Mikkel 60" Executive Desk',       brand: 'Essential',       price: '$549',   img: 'https://www.livingspaces.com/globalassets/productassets/300000-399999/340000-349999/344000-344999/344100-344199/344109/344109_brown_wood_desk_signature_01.jpg',   route: null },
  { name: 'Aberdeen 66" Writing Desk',       brand: 'Essential',       price: '$399',   img: 'https://www.livingspaces.com/globalassets/productassets/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk_signature_01.jpg', route: null },
  { name: 'Modern Workspace 5',              brand: 'Essential',       price: '$349',   img: 'https://www.livingspaces.com/globalassets/productassets/300000-399999/340000-349999/344000-344999/344100-344199/344109/344109_brown_wood_desk_signature_01.jpg',   route: null },
  { name: 'Modern Workspace 6',              brand: 'Essential',       price: '$449',   img: 'https://www.livingspaces.com/globalassets/productassets/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk_signature_01.jpg',    route: null },
];

export default function ProductGrid({ content: _content }: Props) {
  return <ProductGridComponent products={PRODUCTS} />;
}
