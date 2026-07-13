// Generates 5 realistic customer records per US state + DC → _data/customers.json
import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

faker.seed(42); // reproducible output

const STATES = [
  'AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','HI',
  'IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN',
  'MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH',
  'OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY',
];

const STATE_NAMES = {
  AK:'Alaska',AL:'Alabama',AR:'Arkansas',AZ:'Arizona',CA:'California',
  CO:'Colorado',CT:'Connecticut',DC:'District of Columbia',DE:'Delaware',
  FL:'Florida',GA:'Georgia',HI:'Hawaii',IA:'Iowa',ID:'Idaho',IL:'Illinois',
  IN:'Indiana',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',MA:'Massachusetts',
  MD:'Maryland',ME:'Maine',MI:'Michigan',MN:'Minnesota',MO:'Missouri',
  MS:'Mississippi',MT:'Montana',NC:'North Carolina',ND:'North Dakota',
  NE:'Nebraska',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',
  NV:'Nevada',NY:'New York',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',
  PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',
  TN:'Tennessee',TX:'Texas',UT:'Utah',VA:'Virginia',VT:'Vermont',
  WA:'Washington',WI:'Wisconsin',WV:'West Virginia',WY:'Wyoming',
};

const LOBS = ['Personal Auto', 'Homeowners', 'Commercial Auto'];
const TIERS = ['Platinum', 'Gold', 'Silver', 'Bronze'];
const STATUSES = ['Active', 'Active', 'Active', 'Lapsed', 'Pending']; // weighted toward Active

const CALL_INTENTS = [
  { topic: 'Liability', text: 'Customer recently involved in a reported accident. Likely inquiring about liability coverage and claim next steps.' },
  { topic: 'Glass Claim', text: 'Recent windshield damage reported. Customer may be seeking glass repair/replacement guidance.' },
  { topic: 'Hail/Storm Damage', text: 'Severe weather event in customer\'s area. Likely calling about hail or storm damage claim.' },
  { topic: 'Roadside Assistance', text: 'Vehicle breakdown flag on account. Customer may need roadside towing or lockout help.' },
  { topic: 'Rideshare Coverage', text: 'TNC activity detected on policy. Customer may be asking about rideshare coverage gaps.' },
  { topic: 'Water Damage', text: 'Recent heavy rainfall in customer\'s zip code. Likely inquiring about water or flood-related coverage.' },
];

const customers = STATES.flatMap((state) =>
  Array.from({ length: 5 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const lob = faker.helpers.arrayElement(LOBS);
    const intent = faker.helpers.arrayElement(CALL_INTENTS);
    return {
      id: `${state}-${i + 1}`,
      firstName,
      lastName,
      initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
      city: faker.location.city(),
      state,
      stateName: STATE_NAMES[state],
      phone: faker.phone.number({ style: 'national' }),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      policyNumber: `PGR-${faker.string.alphanumeric(8).toUpperCase()}`,
      lob,
      policyTier: faker.helpers.arrayElement(TIERS),
      status: faker.helpers.arrayElement(STATUSES),
      vehicle: {
        year: faker.number.int({ min: 2012, max: 2024 }),
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
      },
      callIntent: {
        topic: intent.topic,
        text: intent.text,
      },
    };
  })
);

const outPath = path.resolve(__dirname, '../app/[locale]/kb-workspace/_data/customers.json');
writeFileSync(outPath, JSON.stringify(customers, null, 2));
console.log(`✓ Generated ${customers.length} customers (${STATES.length} states × 5) → ${outPath}`);
