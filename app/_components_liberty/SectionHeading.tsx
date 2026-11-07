import { cx } from './utils';

export type SectionHeadingProps = {
  title?: string;
  /** Optional grey supporting paragraph under the heading. */
  description?: string;
  /** Heading level to render. */
  as?: 'h2' | 'h3';
  /** Spacing classes. Replaces the default `mt-16` (pass `mt-0` for none). */
  className?: string;
};

/** C04 — centred light H2 that introduces a block of content. */
export default function SectionHeading({
  title = 'How your coverages apply to a rental car',
  description = "Here's how the most common car insurance coverages typically work when you're behind the wheel of a rental.",
  as: Tag = 'h2',
  className = 'mt-16',
}: SectionHeadingProps) {
  return (
    <div className={cx('text-center', className)} data-reveal="card">
      <Tag className="text-[30px] font-light text-navy">{title}</Tag>
      {description && <p className="mt-3 text-gray-600 max-w-3xl mx-auto">{description}</p>}
    </div>
  );
}
