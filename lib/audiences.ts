const AUDIENCE_LABELS: Record<string, string> = {
  '1':  'First-Time Homebuyers',
  '2':  'Homeowners (Refinancing)',
  '3':  'Auto Buyers',
  '4':  'Young Professionals',
  '5':  'Families',
  '6':  'Near Retirement (50+)',
  '7':  'Retirees',
  '8':  'Small Business Owners',
  '9':  'Students',
  '10': 'Military & Veterans',
  '11': 'Wealth Seekers',
  '12': 'New Members',
};

export function getAudienceLabel(value: string): string {
  return AUDIENCE_LABELS[value] ?? value;
}
