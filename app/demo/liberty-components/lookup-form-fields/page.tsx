import LookupFormFields from '@/app/_components_liberty/LookupFormFields';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('lookup-form-fields');

export default function Page() {
  return (
    <Showcase
      slug="lookup-form-fields"
      props={[
        { name: 'claimNumberLabel', type: 'string', defaultValue: '"Claim number"', note: 'Placeholder and accessible name' },
        { name: 'lastNameLabel', type: 'string', defaultValue: '"Last name"' },
        { name: 'zipLabel', type: 'string', defaultValue: '"ZIP code"' },
        { name: 'className', type: 'string', defaultValue: "'mt-5'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Custom text',
          node: (
            <div className="max-w-md">
              <LookupFormFields
                className="mt-0"
                claimNumberLabel="Policy number"
                lastNameLabel="Surname"
                zipLabel="Postcode"
              />
            </div>
          ),
        },
      ]}
    >
      <div className="max-w-md">
        <LookupFormFields className="mt-0" />
      </div>
    </Showcase>
  );
}
