import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const PrgvProceduralSafeguardContentType = contentType({
  key: 'PrgvProceduralSafeguard',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Procedural Safeguard',
  description: 'What it is: Step-by-step instructions the consultant must follow to execute the resolution. Compliance role: Ensures operational compliance — prevents accidentally admitting liability on a recorded line.',
  properties: {
    InternalName: {
      type: 'string',
      displayName: 'Internal Name',
      isRequired: true,
      sortOrder: 10,
    },
    LOB: {
      type: 'string',
      displayName: 'Line of Business',
      isRequired: true,
      sortOrder: 20,
      indexingType: 'queryable',
      format: 'selectOne',
      enum: [
        { value: 'Homeowners', displayName: 'Homeowners' },
        { value: 'Personal Auto', displayName: 'Personal Auto' },
        { value: 'Commercial Auto', displayName: 'Commercial Auto' },
      ],
    },
    Topic: {
      type: 'string',
      displayName: 'Topic / Peril',
      isRequired: true,
      sortOrder: 30,
      indexingType: 'queryable',
      format: 'selectOne',
      enum: [
        { value: 'Hail/Storm Damage', displayName: 'Hail / Storm Damage' },
        { value: 'Water Damage', displayName: 'Water Damage' },
        { value: 'Roadside Assistance', displayName: 'Roadside Assistance' },
        { value: 'Glass Claim', displayName: 'Glass Claim' },
        { value: 'Liability', displayName: 'Liability' },
        { value: 'Rideshare Coverage', displayName: 'Rideshare Coverage' },
      ],
    },
    Jurisdiction: {
      type: 'string',
      displayName: 'Jurisdiction',
      description: 'Always "National" for this copy type.',
      isRequired: true,
      sortOrder: 40,
      indexingType: 'queryable',
      enum: [
        { value: 'National', displayName: 'National' },
        { value: 'AL', displayName: 'Alabama' },
        { value: 'AK', displayName: 'Alaska' },
        { value: 'AZ', displayName: 'Arizona' },
        { value: 'AR', displayName: 'Arkansas' },
        { value: 'CA', displayName: 'California' },
        { value: 'CO', displayName: 'Colorado' },
        { value: 'CT', displayName: 'Connecticut' },
        { value: 'DE', displayName: 'Delaware' },
        { value: 'FL', displayName: 'Florida' },
        { value: 'GA', displayName: 'Georgia' },
        { value: 'HI', displayName: 'Hawaii' },
        { value: 'ID', displayName: 'Idaho' },
        { value: 'IL', displayName: 'Illinois' },
        { value: 'IN', displayName: 'Indiana' },
        { value: 'IA', displayName: 'Iowa' },
        { value: 'KS', displayName: 'Kansas' },
        { value: 'KY', displayName: 'Kentucky' },
        { value: 'LA', displayName: 'Louisiana' },
        { value: 'ME', displayName: 'Maine' },
        { value: 'MD', displayName: 'Maryland' },
        { value: 'MA', displayName: 'Massachusetts' },
        { value: 'MI', displayName: 'Michigan' },
        { value: 'MN', displayName: 'Minnesota' },
        { value: 'MS', displayName: 'Mississippi' },
        { value: 'MO', displayName: 'Missouri' },
        { value: 'MT', displayName: 'Montana' },
        { value: 'NE', displayName: 'Nebraska' },
        { value: 'NV', displayName: 'Nevada' },
        { value: 'NH', displayName: 'New Hampshire' },
        { value: 'NJ', displayName: 'New Jersey' },
        { value: 'NM', displayName: 'New Mexico' },
        { value: 'NY', displayName: 'New York' },
        { value: 'NC', displayName: 'North Carolina' },
        { value: 'ND', displayName: 'North Dakota' },
        { value: 'OH', displayName: 'Ohio' },
        { value: 'OK', displayName: 'Oklahoma' },
        { value: 'OR', displayName: 'Oregon' },
        { value: 'PA', displayName: 'Pennsylvania' },
        { value: 'RI', displayName: 'Rhode Island' },
        { value: 'SC', displayName: 'South Carolina' },
        { value: 'SD', displayName: 'South Dakota' },
        { value: 'TN', displayName: 'Tennessee' },
        { value: 'TX', displayName: 'Texas' },
        { value: 'UT', displayName: 'Utah' },
        { value: 'VT', displayName: 'Vermont' },
        { value: 'VA', displayName: 'Virginia' },
        { value: 'WA', displayName: 'Washington' },
        { value: 'WV', displayName: 'West Virginia' },
        { value: 'WI', displayName: 'Wisconsin' },
        { value: 'WY', displayName: 'Wyoming' },
        { value: 'DC', displayName: 'Washington D.C.' },
      ],
    },
    RichTextValue: {
      type: 'richText',
      displayName: 'Content',
      isLocalized: true,
      isRequired: true,
      sortOrder: 50,
    },
  },
});

type Props = { content: ContentProps<typeof PrgvProceduralSafeguardContentType> };

export default function PrgvProceduralSafeguard({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <div className="space-y-3">
      <h4 {...pa('InternalName')} className="font-bold text-gray-900">
        {content.InternalName}
      </h4>
      <div {...pa('RichTextValue')} className="prose prose-sm max-w-none text-gray-700">
        <RichTextRenderer content={content.RichTextValue?.json} />
      </div>
    </div>
  );
}
