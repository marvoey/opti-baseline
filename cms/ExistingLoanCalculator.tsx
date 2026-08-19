import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import ExistingLoanCalculatorWidget from '@/app/_components/custom/ExistingLoanCalculator';

export const ExistingLoanCalculatorContentType = contentType({
  key: 'ExistingLoanCalculator',
  baseType: '_component',
  displayName: 'Existing Loan Calculator',
  description: 'Interactive calculator for analyzing an existing loan balance, payments, and amortization schedule.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

export const ExistingLoanCalculatorDisplayTemplate = displayTemplate({
  key: 'ExistingLoanCalculatorDefault',
  isDefault: true,
  displayName: 'Existing Loan Calculator',
  contentType: 'ExistingLoanCalculator',
  settings: {},
});

type Props = {
  content: ContentProps<typeof ExistingLoanCalculatorContentType>;
};

export default function ExistingLoanCalculator({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)} className="w-full">
      <ExistingLoanCalculatorWidget />
    </div>
  );
}
