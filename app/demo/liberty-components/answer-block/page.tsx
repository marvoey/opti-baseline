import AnswerBlock from '@/app/_components_liberty/AnswerBlock';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('answer-block');

export default function Page() {
  return (
    <Showcase
      slug="answer-block"
      props={[
        { name: 'headingBold', type: 'string', defaultValue: '"Your coverage usually comes with you,"' },
        { name: 'headingLight', type: 'string', defaultValue: '"when you rent a car."' },
        { name: 'paragraphs', type: 'string[]', defaultValue: '2 rental-car paragraphs', note: 'Any number of paragraphs' },
        { name: 'className', type: 'string' },
      ]}
      variants={[
        {
          label: 'Texas answer (custom text)',
          node: (
            <AnswerBlock
              headingBold="Also good to know,"
              headingLight="if you drive in Texas."
              paragraphs={[
                'Insurance companies in Texas must offer you personal injury protection (PIP) and uninsured/underinsured motorist coverage. Both are included in your policy unless you reject them in writing.',
                "You'll need to show proof of insurance when you register your vehicle and if you're stopped by law enforcement. You can show your ID card right from the Liberty Mutual app.",
              ]}
            />
          ),
        },
        {
          label: 'Single paragraph',
          node: (
            <AnswerBlock
              headingBold="Is the state minimum enough?"
              headingLight="It's a starting point."
              paragraphs={[
                'State minimums set the least coverage you can legally carry. If you cause an accident, costs above your limits could be your responsibility, so many drivers choose higher limits and add coverages like collision and comprehensive.',
              ]}
            />
          ),
        },
      ]}
    >
      <AnswerBlock />
    </Showcase>
  );
}
