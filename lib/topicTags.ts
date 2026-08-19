const TOPIC_TAG_LABELS: Record<string, string> = {
  '1':  'Mortgage',
  '2':  'Home Equity',
  '3':  'Auto Loans',
  '4':  'Personal Loans',
  '5':  'Checking',
  '6':  'Savings',
  '7':  'Credit Cards',
  '8':  'Wealth & Investments',
  '9':  'Retirement',
  '10': 'Trust Services',
  '11': 'Business Banking',
  '12': 'Financial Wellness',
};

export function getTopicTagLabel(value: string): string {
  return TOPIC_TAG_LABELS[value] ?? value;
}
