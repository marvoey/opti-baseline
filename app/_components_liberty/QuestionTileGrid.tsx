import Anchor from './Anchor';
import { cx, LINK_CLASS } from './utils';

export type QuestionTile = {
  /** Small uppercase label, e.g. "Car". */
  category: string;
  question: string;
  /** Text of the fake link at the bottom of the tile. */
  linkLabel?: string;
  href?: string;
};

export type QuestionTileGridProps = {
  heading?: string;
  tiles?: QuestionTile[];
  /** Vertical padding classes. Replaces the default `py-14`. */
  className?: string;
};

const DEFAULT_TILES: QuestionTile[] = [
  { category: 'Car', question: 'Does my car insurance cover a rental car?' },
  { category: 'Home', question: 'Is water damage from a burst pipe covered?' },
  { category: 'Bundles', question: 'Can I bundle my home and auto insurance?' },
  { category: 'Car', question: 'What car insurance am I required to have?' },
  { category: 'Claims', question: 'How do I check the status of my claim?' },
  { category: 'Claims', question: 'What should I do after a car accident?' },
];

/** C08 — grey band with a heading and a 3-column grid of popular-question tiles. */
export default function QuestionTileGrid({
  heading = 'Questions people are asking',
  tiles = DEFAULT_TILES,
  className = 'py-14',
}: QuestionTileGridProps) {
  return (
    <div className={cx('bg-[#F5F5F5]', className)}>
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-light text-navy text-center">{heading}</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {tiles.map((tile, i) => (
            <Anchor
              key={`${tile.question}-${i}`}
              href={tile.href}
              className="block text-left bg-white rounded-xl p-6 shadow-sm hover:shadow-md"
            >
              <div className="text-xs font-bold tracking-wider text-lmt uppercase">{tile.category}</div>
              <div className="mt-2 text-lg text-navy font-medium">{tile.question}</div>
              <div className={cx(LINK_CLASS, 'mt-3 text-sm')}>{tile.linkLabel ?? 'Get the answer ›'}</div>
            </Anchor>
          ))}
        </div>
      </div>
    </div>
  );
}
