import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import PayoffCalculatorWidget from '@/app/_components/custom/PayoffCalculator';

export const PayoffCalculatorContentType = contentType({
  key: 'PayoffCalculator',
  baseType: '_component',
  displayName: 'Payoff Calculator',
  description: 'Interactive calculator for estimating loan payoff scenarios.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

export const PayoffCalculatorDisplayTemplate = displayTemplate({
  key: 'PayoffCalculatorDefault',
  isDefault: true,
  displayName: 'Payoff Calculator',
  contentType: 'PayoffCalculator',
  settings: {},
});

type Props = {
  content: ContentProps<typeof PayoffCalculatorContentType>;
};

export default function PayoffCalculator({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)} className="w-full">
      <PayoffCalculatorWidget />
    </div>
  );
}
