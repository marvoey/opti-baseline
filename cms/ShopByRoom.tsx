import { contentType } from '@optimizely/cms-sdk';
import ShopByRoomComponent from '@/app/_components/custom/ShopByRoom';

export const ShopByRoomContentType = contentType({
  key: 'ShopByRoom',
  baseType: '_component',
  displayName: 'Shop by Room',
  description: 'Six-tile room category grid with hover overlay.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

const LS = 'https://www.livingspaces.com/globalassets';
const NAV = `${LS}/lp_blocks/2026/06/summern-nav-2026`;

const ROOM_TILES = [
  { label: 'Living Room', href: '#', img: `${NAV}/d_01_living_room.jpg` },
  { label: 'Bedroom',     href: '#', img: `${NAV}/d_02_bedroom.jpg` },
  { label: 'Dining',      href: '#', img: `${NAV}/d_04_dining_room.jpg` },
  { label: 'Home Office', href: '/departments/furniture/home-office', img: `${NAV}/d_05_office.jpg` },
  { label: 'Outdoor',     href: '#', img: `${NAV}/d_07_outdoor.jpg` },
  { label: 'Kids + Teens',href: '#', img: `${NAV}/d_06_kids_teens.jpg` },
];

export default function ShopByRoom() {
  return <ShopByRoomComponent tiles={ROOM_TILES} />;
}
