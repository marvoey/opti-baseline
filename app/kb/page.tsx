import Link from 'next/link';
import FilterForm from './_components/FilterForm';
import {
  Search, FileText, ChevronLeft, FileDown, Clock, AlertTriangle,
  Car, Truck, Home, Heart, Anchor, Zap, Phone, Mail, Users,
  Building2, MapPin, Globe, BookOpen, MonitorSmartphone,
  ShieldCheck, FileWarning, BadgeCheck, ArrowRight, ChevronRight,
  SlidersHorizontal, ChevronDown, Table2,
} from 'lucide-react';

type SP = {
  q?: string; doc?: string; browse?: string;
  ftype?: string | string[]; fstatus?: string | string[];
  fstate?: string | string[]; fyear?: string | string[]; fdept?: string | string[];
};
type Props = { searchParams: Promise<SP> };

function toArr(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// ── Static data ───────────────────────────────────────────────────────────────

const DOCS = [
  {
    id: '1',
    title: 'Commercial_Auto_Master_Policy_v8_FINAL.pdf',
    date: 'Oct 12, 2025',
    excerpt: '…applicable to all states unless otherwise noted in the state-specific addendums. For hail and windstorm deductibles, refer to Section 4B…',
    type: 'PDF - 142 pages',
  },
  {
    id: '2',
    title: 'FL_State_Exceptions_Commercial_Auto_2024.docx',
    date: 'Jan 04, 2024',
    excerpt: '…Florida regulations require specific disclosures for comprehensive coverage including hail. The deductible for Florida commercial auto policies is…',
    type: 'Word Doc - 14 pages',
  },
  {
    id: '3',
    title: 'GA_State_Exceptions_Commercial_Auto_2025.pdf',
    date: 'Mar 15, 2025',
    excerpt: '…Georgia state limits for commercial auto physical damage. Hail deductibles are outlined in the attached matrix. See page 8…',
    type: 'PDF - 18 pages',
  },
  {
    id: '4',
    title: 'INTERNAL_MEMO_Hail_Deductible_Changes_Southeast.msg',
    date: 'Aug 22, 2023',
    excerpt: '…Please note that as of Q4 2023, we are adjusting the baseline hail deductibles for FL, GA, and AL. Do not use the old 2022 guidelines…',
    type: 'Email Archive',
  },
];

// Extended results shown in the search results page.
// doc ref points to one of the 4 real DOCS for click-through.
const ALL_RESULTS = [
  { title: 'CommAuto_092_A_v8_FINAL.pdf',                                   date: 'Oct 12, 2025', type: 'PDF',   pages: '142 pp', dept: 'Underwriting',        status: 'active',     lob: 'Commercial Auto',  docRef: '1', excerpt: '…applicable to all states unless otherwise noted in state-specific addendums. For hail and windstorm deductibles, refer to Section 4B, subsection ii…' },
  { title: 'CommAuto_MasterPolicy_v7_FINAL_USE_THIS_2024.pdf',              date: 'Feb 03, 2024', type: 'PDF',   pages: '138 pp', dept: 'Underwriting',        status: 'superseded', lob: 'Commercial Auto',  docRef: '1', excerpt: '…superseded by v8 as of October 2025. Do not use for new policy quotes. Retained for historical reference only. See CommAuto_092_A_v8…' },
  { title: 'CommAuto_MasterPolicy_v7_REVISED_MAY2024_DO_NOT_USE.pdf',       date: 'May 15, 2024', type: 'PDF',   pages: '139 pp', dept: 'Underwriting',        status: 'superseded', lob: 'Commercial Auto',  docRef: '1', excerpt: '…interim revision to v7. Note: this version contains an error in Section 4B (hail deductible table for SE states). Superseded. Use v8 final…' },
  { title: 'CommAuto_092_A_v8_TRACKED_CHANGES_FOR_REVIEW.docx',             date: 'Sep 28, 2025', type: 'Word',  pages: '142 pp', dept: 'Legal',               status: 'draft',      lob: 'Commercial Auto',  docRef: '1', excerpt: '…tracked-changes working document used during legal review cycle prior to v8 ratification. Not for distribution. Final version supersedes this…' },
  { title: 'FL_State_Exceptions_Commercial_Auto_2024.docx',                 date: 'Jan 04, 2024', type: 'Word',  pages: '14 pp',  dept: 'Underwriting / FL',   status: 'active',     lob: 'Commercial Auto',  docRef: '2', excerpt: '…Florida regulations require specific disclosures for comprehensive coverage including hail. The deductible for Florida commercial auto policies is…' },
  { title: 'FL_State_Exceptions_Commercial_Auto_2024_REVISED_v2.docx',      date: 'Mar 22, 2024', type: 'Word',  pages: '15 pp',  dept: 'Underwriting / FL',   status: 'superseded', lob: 'Commercial Auto',  docRef: '2', excerpt: '…revised to reflect OIR bulletin 2024-03. Superseded by Jan 2024 original after rollback. Do not distribute. Contact FL underwriting desk…' },
  { title: 'FL_CommAuto_Exceptions_2023_v3_FINAL.docx',                     date: 'Dec 01, 2023', type: 'Word',  pages: '13 pp',  dept: 'Underwriting / FL',   status: 'superseded', lob: 'Commercial Auto',  docRef: '2', excerpt: '…2023 Florida exceptions, superseded by the January 2024 update. Retained for audit trail purposes. Section 3 (hail) deductible values are no longer current…' },
  { title: 'Copy_of_FL_Exceptions_2022_OLD_ARCHIVE.docx',                   date: 'Nov 14, 2022', type: 'Word',  pages: '11 pp',  dept: 'Unknown',             status: 'archived',   lob: 'Commercial Auto',  docRef: '2', excerpt: '…2022 Florida exception document. Hail deductible values in this document are incorrect per Q4 2023 memo. Do not use. See current state addendum…' },
  { title: 'FL_Hail_Deductible_OIR_Bulletin_2024_03.pdf',                   date: 'Mar 08, 2024', type: 'PDF',   pages: '4 pp',   dept: 'Legal & Compliance',  status: 'active',     lob: 'Commercial Auto',  docRef: '2', excerpt: '…Office of Insurance Regulation bulletin regarding mandatory minimum hail deductibles for commercial auto policies effective April 1, 2024…' },
  { title: 'GA_State_Exceptions_Commercial_Auto_2025.pdf',                  date: 'Mar 15, 2025', type: 'PDF',   pages: '18 pp',  dept: 'Underwriting / GA',   status: 'active',     lob: 'Commercial Auto',  docRef: '3', excerpt: '…Georgia state limits for commercial auto physical damage. Hail deductibles are outlined in the attached matrix. See page 8 for current values…' },
  { title: 'GA_Addendum_CommAuto_2024_v2_SUPERSEDED.pdf',                   date: 'Apr 12, 2024', type: 'PDF',   pages: '16 pp',  dept: 'Underwriting / GA',   status: 'superseded', lob: 'Commercial Auto',  docRef: '3', excerpt: '…superseded March 2025. Georgia hail deductible updated from $500 to $750 in the current version. This document reflects the old $500 limit…' },
  { title: 'GA_Addendum_CommAuto_2024_v1_DRAFT.pdf',                        date: 'Jan 08, 2024', type: 'PDF',   pages: '14 pp',  dept: 'Underwriting / GA',   status: 'archived',   lob: 'Commercial Auto',  docRef: '3', excerpt: '…draft version, never ratified. Values in this document were not approved by the GA Commissioner of Insurance. See 2025 final addendum…' },
  { title: 'INTERNAL_MEMO_Hail_Deductible_Changes_Southeast.msg',           date: 'Aug 22, 2023', type: 'Email', pages: '2 pp',   dept: 'Product',             status: 'active',     lob: 'Commercial Auto',  docRef: '4', excerpt: '…as of Q4 2023, adjusting baseline hail deductibles for FL, GA, and AL. Do not use the old 2022 guidelines. See attached matrix for new values…' },
  { title: 'FWD_RE_RE_Hail_Deductible_Southeast_Discussion_Aug2023.msg',    date: 'Aug 23, 2023', type: 'Email', pages: '6 pp',   dept: 'Product',             status: 'archived',   lob: 'Commercial Auto',  docRef: '4', excerpt: '…forwarded thread re: SE deductible changes. Contains earlier draft values that were not ratified. Final values in the Aug 22 memo supersede this thread…' },
  { title: 'HAIL_DEDUCTIBLE_MATRIX_SE_States_2023_Q4_v2.xlsx',              date: 'Nov 01, 2023', type: 'Excel', pages: '1 tab',  dept: 'Product',             status: 'active',     lob: 'Commercial Auto',  docRef: '1', excerpt: '…state-by-state deductible matrix for FL, GA, AL, MS, SC, TN. Values effective Q4 2023. Tab 2 contains pre-2023 historical values for reference…' },
  { title: 'HAIL_DEDUCTIBLE_MATRIX_SE_States_2023_Q4_v1_DRAFT.xlsx',        date: 'Oct 15, 2023', type: 'Excel', pages: '1 tab',  dept: 'Product',             status: 'archived',   lob: 'Commercial Auto',  docRef: '1', excerpt: '…draft matrix, some values were revised before ratification. v2 is the approved version. FL deductible shown here ($750) was revised upward to $1,000…' },
  { title: 'State_Exception_Summary_ALL_STATES_CommAuto_2024.xlsx',          date: 'Feb 28, 2024', type: 'Excel', pages: '4 tabs', dept: 'Underwriting',        status: 'active',     lob: 'Commercial Auto',  docRef: '1', excerpt: '…consolidated exception summary across all 50 states plus DC. Hail and windstorm deductibles are on Tab 3 (Physical Damage Exceptions). Last updated Feb 2024…' },
  { title: 'CommAuto_Hail_Guidelines_Pre2022_ARCHIVED.pdf',                  date: 'Dec 15, 2021', type: 'PDF',   pages: '9 pp',   dept: 'Underwriting',        status: 'archived',   lob: 'Commercial Auto',  docRef: '1', excerpt: '…pre-2022 hail guidelines, archived. Values are no longer valid per Q4 2023 deductible adjustment memo. Retained for historical audit purposes only…' },
  { title: 'Commercial_Auto_Overview_Training_Deck_2024.pptx',              date: 'Jan 15, 2024', type: 'PPT',   pages: '42 sl',  dept: 'Training',            status: 'active',     lob: 'Commercial Auto',  docRef: '1', excerpt: '…agent training overview for Commercial Auto LOB. Slide 18 covers physical damage deductibles. Note: deductible values on slide 18 reflect pre-Q4 2023 figures…' },
  { title: 'Legal_Disclaimer_Commercial_2024_REPLACED_BY_2026_VERSION.pdf', date: 'Jan 02, 2024', type: 'PDF',   pages: '3 pp',   dept: 'Legal & Compliance',  status: 'superseded', lob: 'Commercial Auto',  docRef: '1', excerpt: '…2024 commercial legal disclaimer. Replaced by mandatory 2026 disclaimer effective May 2025. Do not attach to new policies. Retained for auditing purposes only…' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  active:     { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Active' },
  superseded: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Superseded' },
  draft:      { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Draft' },
  archived:   { bg: 'bg-slate-100', text: 'text-slate-500',  label: 'Archived' },
};

const FILE_COLORS: Record<string, string> = {
  PDF: 'text-red-500', Word: 'text-blue-500', Email: 'text-slate-500',
  Excel: 'text-green-600', PPT: 'text-orange-500',
};

const SIDEBAR_FACETS = [
  {
    label: 'Document Type',
    options: [
      { label: 'PDF', count: 9 }, { label: 'Word Doc', count: 5 },
      { label: 'Excel / Spreadsheet', count: 3 }, { label: 'Email / .msg Archive', count: 2 },
      { label: 'PowerPoint', count: 1 },
    ],
  },
  {
    label: 'Status',
    options: [
      { label: 'Active', count: 7 }, { label: 'Superseded', count: 7 },
      { label: 'Archived', count: 5 }, { label: 'Draft', count: 1 },
    ],
  },
  {
    label: 'State / Region',
    options: [
      { label: 'National / All States', count: 7 }, { label: 'Florida (FL)', count: 5 },
      { label: 'Georgia (GA)', count: 4 }, { label: 'Southeast Multi-State', count: 3 },
      { label: 'Alabama (AL)', count: 1 },
    ],
  },
  {
    label: 'Year Modified',
    options: [
      { label: '2025–2026', count: 3 }, { label: '2024', count: 9 },
      { label: '2023', count: 6 }, { label: '2022 or earlier', count: 2 },
    ],
  },
  {
    label: 'Owning Department',
    options: [
      { label: 'Underwriting', count: 7 }, { label: 'Legal & Compliance', count: 3 },
      { label: 'Product', count: 4 }, { label: 'Training', count: 1 },
      { label: 'Unknown', count: 1 },
    ],
  },
];

const LOBS = [
  {
    id: 'personal-auto',
    title: 'Personal Auto',
    description: 'Standard personal vehicle coverage for cars, SUVs, and trucks. Includes Progressive-exclusive tools like Snapshot® and Name Your Price®.',
    coverages: ['Liability', 'Comp & Collision', 'Roadside Assistance', 'Snapshot®', 'Name Your Price®', 'Vehicle Protection Plan'],
    docCount: 48,
    updated: 'Jul 1, 2026',
    icon: Car,
    accent: '#007bc4',
    bg: '#eff6ff',
  },
  {
    id: 'commercial-auto',
    title: 'Commercial Auto',
    description: '#1 commercial auto insurer in America. Trucks, vans, fleets, and specialty vehicles. A+ rated by A.M. Best. Over 1 million commercial vehicles insured.',
    coverages: ['Commercial Liability', 'Physical Damage', 'Motor Truck Cargo', 'Bobtail / Non-Trucking', 'Hired & Non-Owned'],
    docCount: 62,
    updated: 'Mar 15, 2025',
    icon: Truck,
    accent: '#e85d00',
    bg: '#fff7ed',
  },
  {
    id: 'motorcycle',
    title: 'Motorcycle & Recreational',
    description: '#1 motorcycle insurer with 50+ years of claims experience. Covers all types: cruisers, sport bikes, touring, dirt bikes, ATVs, scooters, and e-bikes.',
    coverages: ['Liability', 'OEM Parts', 'Safety Apparel', 'Guest Passenger Liability', 'Custom Parts & Accessories', 'Total Loss'],
    docCount: 29,
    updated: 'May 8, 2026',
    icon: Zap,
    accent: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    id: 'home-property',
    title: 'Home & Property',
    description: 'Homeowners, condo, renters, and manufactured home coverage. Average 7% auto savings when bundled. Coverage riders available for high-value items.',
    coverages: ['Dwelling', 'Personal Property', 'Loss of Use', 'Personal Liability', 'Safety Device Discount', 'Flood (separate)'],
    docCount: 35,
    updated: 'Apr 22, 2026',
    icon: Home,
    accent: '#059669',
    bg: '#ecfdf5',
  },
  {
    id: 'life-specialty',
    title: 'Life & Specialty',
    description: 'Life insurance, pet insurance (cats & dogs, launched Jan 2026), umbrella, travel, wedding/event, jewelry, and electronics coverage through partner programs.',
    coverages: ['Term Life', 'Pet Insurance', 'Personal Umbrella', 'Travel', 'Wedding & Event', 'Electronic Device'],
    docCount: 21,
    updated: 'Jan 20, 2026',
    icon: Heart,
    accent: '#db2777',
    bg: '#fdf2f8',
  },
  {
    id: 'watercraft',
    title: 'Watercraft & Marine',
    description: 'Boat, personal watercraft, RV, trailer, snowmobile, golf cart, and classic car coverage. Seasonal and year-round policy options available.',
    coverages: ['Watercraft Liability', 'Physical Damage', 'Uninsured Watercraft', 'RV / Trailer', 'Classic Car', 'Snowmobile'],
    docCount: 18,
    updated: 'Feb 3, 2026',
    icon: Anchor,
    accent: '#0284c7',
    bg: '#f0f9ff',
  },
];

const UPDATES = [
  {
    id: 'u1',
    date: 'Jun 4, 2026',
    category: 'Partnership',
    categoryColor: '#7c3aed',
    title: 'Progressive Announces Multi-Year Partnership with Chicago Sky',
    description: 'Progressive has entered a multi-year sponsorship agreement with the Chicago Sky WNBA franchise, described as the largest deal in Chicago Sky history. Brand integration guidelines for agents in the Chicago market are being distributed separately.',
    lobs: ['Personal Auto', 'Home & Property'],
    severity: 'info',
  },
  {
    id: 'u2',
    date: 'May 4, 2026',
    category: 'Product',
    categoryColor: '#059669',
    title: 'UpPayment Down Payment Assistance Program Expanded',
    description: "Progressive's UpPayment program has been expanded to assist 200 first-time homebuyers with down payment support. Agents in participating states should review the updated eligibility matrix and referral process in the Home & Property portal.",
    lobs: ['Home & Property'],
    severity: 'info',
  },
  {
    id: 'u3',
    date: 'Jan 20, 2026',
    category: 'Product Launch',
    categoryColor: '#db2777',
    title: 'Pet Insurance Now Available — Cats & Dogs',
    description: "Progressive has launched dedicated pet insurance for cats and dogs to help pet parents manage unexpected veterinary expenses. This product is available through the Life & Specialty LOB. Review the new Pet Insurance Quick Reference Guide before quoting.",
    lobs: ['Life & Specialty'],
    severity: 'new',
  },
  {
    id: 'u4',
    date: 'Jan 14, 2026',
    category: 'Regulatory',
    categoryColor: '#e85d00',
    title: 'Florida Excess Profits Credits — Issuance Underway',
    description: 'Progressive has begun issuing credits to Florida personal auto policyholders in accordance with excess profits compliance regulations. Consultants should expect increased inbound calls regarding credit amounts. Reference the FL Credits FAQ document before handling inquiries.',
    lobs: ['Personal Auto'],
    severity: 'action',
  },
  {
    id: 'u5',
    date: 'Oct 12, 2025',
    category: 'Policy Update',
    categoryColor: '#007bc4',
    title: 'Commercial Auto Master Policy Updated to v8',
    description: 'The Commercial Auto Master Policy has been revised to v8 (Document ID: CommAuto-092-A). Key changes include updated hail deductible language for Southeast states (FL: $1,000 baseline; GA: $750), revised cargo liability limits, and clarified ADAS recalibration requirements for windshield claims.',
    lobs: ['Commercial Auto'],
    severity: 'action',
  },
  {
    id: 'u6',
    date: 'Aug 15, 2025',
    category: 'Product',
    categoryColor: '#059669',
    title: 'Snapshot® Program — Enhanced Telematics Scoring Model',
    description: 'Snapshot® has been updated with an enhanced telematics scoring model that incorporates phone distraction data. Average customer savings remain at $328/year. Updated disclosure language is required in all new Snapshot® enrollments as of September 1, 2025.',
    lobs: ['Personal Auto'],
    severity: 'info',
  },
  {
    id: 'u7',
    date: 'May 20, 2025',
    category: 'Compliance',
    categoryColor: '#d97706',
    title: '2026 Commercial Legal Disclaimer — Mandatory Attachment',
    description: 'The updated 2026 Commercial Legal Disclaimer block is now mandatory on all new commercial auto policies. The previous 2024 disclaimer is no longer compliant. Opal CMS has been updated to automatically attach the current version on policy assembly.',
    lobs: ['Commercial Auto'],
    severity: 'action',
  },
  {
    id: 'u8',
    date: 'Mar 15, 2025',
    category: 'Policy Update',
    categoryColor: '#007bc4',
    title: 'Georgia Commercial Auto State Exceptions Updated for 2025',
    description: 'The GA_State_Exceptions_Commercial_Auto document has been revised for 2025. The Georgia hail deductible for commercial auto has been updated to $750 (previously $500). Agents writing new commercial policies in Georgia must use the 2025 addendum.',
    lobs: ['Commercial Auto'],
    severity: 'action',
  },
  {
    id: 'u9',
    date: 'Jan 8, 2025',
    category: 'Product',
    categoryColor: '#059669',
    title: 'HomeQuote Explorer® — New Coverage Comparison Feature',
    description: 'HomeQuote Explorer® has been updated with a side-by-side coverage comparison feature allowing agents to show customers up to three competing homeowners quotes simultaneously. Training materials are available in the Home & Property resource library.',
    lobs: ['Home & Property'],
    severity: 'info',
  },
  {
    id: 'u10',
    date: 'Aug 22, 2023',
    category: 'Internal Memo',
    categoryColor: '#6b7280',
    title: 'Hail Deductible Baseline Adjustments — Southeast States',
    description: 'Baseline hail deductibles for FL, GA, and AL have been adjusted effective Q4 2023. Agents must not use pre-2023 guidelines for these states. The 2022 Southeast deductible matrix has been retired. See the Master Policy and state-specific addendums for current values.',
    lobs: ['Commercial Auto', 'Personal Auto'],
    severity: 'archived',
  },
];

const SUPPORT_TEAMS = [
  {
    team: 'Commercial Lines Underwriting',
    phone: '1-800-444-4487',
    email: 'comm.underwriting@progressive.com',
    hours: 'Mon–Fri 8am–6pm ET',
    specialty: 'New commercial policies, endorsements, risk assessment',
    icon: ShieldCheck,
  },
  {
    team: 'Personal Lines Underwriting',
    phone: '1-800-776-4737',
    email: 'pers.underwriting@progressive.com',
    hours: 'Mon–Fri 7am–9pm ET',
    specialty: 'Personal auto, home, motorcycle, specialty vehicles',
    icon: Car,
  },
  {
    team: 'Claims — Commercial Auto',
    phone: '1-800-274-4499',
    email: 'commercial.claims@progressive.com',
    hours: '24/7 — After-hours triage available',
    specialty: 'Commercial vehicle claims, cargo, fleet incidents',
    icon: FileWarning,
  },
  {
    team: 'Claims — Personal Lines',
    phone: '1-800-776-4737',
    email: 'claims@progressive.com',
    hours: '24/7 — Online filing available',
    specialty: 'Auto, motorcycle, watercraft, property claims',
    icon: FileWarning,
  },
  {
    team: 'Agent Support & Licensing',
    phone: '1-855-347-3939',
    email: 'agentsupport@progressive.com',
    hours: 'Mon–Fri 8am–8pm ET',
    specialty: 'Appointments, licensing, commission questions, escalations',
    icon: Users,
  },
  {
    team: 'Billing & Payments',
    phone: '1-888-671-4405',
    email: 'billing@progressive.com',
    hours: 'Mon–Fri 7am–11pm ET',
    specialty: 'Payment plans, reinstatements, billing disputes',
    icon: Building2,
  },
];

const REGIONS = [
  {
    region: 'Northeast',
    states: 'CT, DE, MA, MD, ME, NH, NJ, NY, PA, RI, VT',
    office: 'Parsippany, NJ',
    director: 'Field Sales Director: Karen Holloway',
    phone: '1-877-776-2436 ext. 1',
  },
  {
    region: 'Southeast',
    states: 'AL, FL, GA, MS, NC, SC, TN, VA, WV',
    office: 'Tampa, FL',
    director: 'Field Sales Director: Marcus Webb',
    phone: '1-877-776-2436 ext. 2',
  },
  {
    region: 'Midwest',
    states: 'IA, IL, IN, KS, KY, MI, MN, MO, ND, NE, OH, SD, WI',
    office: 'Mayfield Village, OH',
    director: 'Field Sales Director: Patricia Chen',
    phone: '1-877-776-2436 ext. 3',
  },
  {
    region: 'Southwest & Mountain',
    states: 'AZ, CO, NM, NV, OK, TX, UT, WY',
    office: 'Dallas, TX',
    director: 'Field Sales Director: James Rivera',
    phone: '1-877-776-2436 ext. 4',
  },
  {
    region: 'West & Pacific',
    states: 'AK, CA, HI, ID, MT, OR, WA',
    office: 'Sacramento, CA',
    director: 'Field Sales Director: Sandra Okeke',
    phone: '1-877-776-2436 ext. 5',
  },
];

const AGENT_RESOURCES = [
  { label: 'Progressive Agent Portal', url: 'https://www.progressiveagent.com', icon: Globe, description: 'Quotes, policy management, commissions' },
  { label: 'ForAgentsOnly Training Hub', url: 'https://aqn.foragentsonly.com', icon: BookOpen, description: 'CE credits, product training, certifications' },
  { label: 'Progressive Commercial Portal', url: 'https://www.progressivecommercial.com', icon: Truck, description: 'Commercial quoting and resources' },
  { label: 'HomeQuote Explorer®', url: 'https://www.progressiveagent.com', icon: Home, description: 'Home insurance quoting tool' },
  { label: 'AutoQuote Explorer®', url: 'https://www.progressiveagent.com', icon: Car, description: 'Cross-carrier auto rate comparison' },
  { label: 'Agent Mobile App', url: 'https://www.progressiveagent.com', icon: MonitorSmartphone, description: 'Quote and service on the go' },
];

// ── Shared components ─────────────────────────────────────────────────────────

function ProgressiveLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.svg" alt="Progressive Insurance" className="h-full w-auto object-contain" />
  );
}

function SearchBar({ query, compact = false }: { query: string; compact?: boolean }) {
  return (
    <form method="GET" action="/kb" className={compact ? 'relative flex-1' : 'w-full max-w-2xl relative'}>
      <input
        type="text"
        name="q"
        defaultValue={query}
        className={
          compact
            ? 'w-full p-2 pl-10 rounded border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            : 'w-full p-4 pl-12 rounded-lg border border-slate-300 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        }
        placeholder="e.g., Commercial auto hail deductible Florida vs Georgia"
      />
      <Search
        className={compact ? 'absolute left-3 top-2.5 text-slate-400' : 'absolute left-4 top-4 text-slate-400'}
        size={compact ? 18 : 24}
      />
      <button
        type="submit"
        className={
          compact
            ? 'absolute right-0 top-0 h-full bg-blue-600 text-white px-5 rounded-r hover:bg-blue-700 transition-colors'
            : 'absolute right-3 top-3 bg-blue-600 text-white px-6 py-1.5 rounded hover:bg-blue-700 transition-colors'
        }
      >
        Search
      </button>
    </form>
  );
}

function BrowseHeader({ crumb, subtitle }: { crumb: string; subtitle: string }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-8 pt-5 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-7">
            <ProgressiveLogo />
          </div>
          <div className="flex-1 max-w-lg">
            <SearchBar query="" compact />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Link href="/kb" className="hover:text-blue-600 hover:underline">Knowledge Portal</Link>
          <ChevronRight size={12} />
          <span className="text-slate-700 font-medium">{crumb}</span>
        </div>
        <p className="text-slate-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Browse: Line of Business ──────────────────────────────────────────────────

function LobView() {
  return (
    <div className="min-h-screen bg-white">
      <BrowseHeader
        crumb="Browse by Line of Business"
        subtitle="Select a line of business to view policies, guidelines, and rate documents."
      />
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {LOBS.map(lob => {
            const Icon = lob.icon;
            return (
              <Link
                key={lob.id}
                href={`/kb?q=${encodeURIComponent(lob.title)}`}
                className="group block rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: lob.bg }}
                  >
                    <Icon size={22} style={{ color: lob.accent }} />
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-1" />
                </div>

                <h2 className="text-base font-bold text-slate-800 mb-1">{lob.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{lob.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lob.coverages.map(c => (
                    <span
                      key={c}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium"
                      style={{ color: lob.accent, borderColor: lob.accent + '40', background: lob.bg }}
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><FileText size={12} /> {lob.docCount} documents</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> Updated {lob.updated}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Can&rsquo;t find what you need?</p>
            <p className="text-sm text-slate-500">Search across all 263 documents in the knowledge base.</p>
          </div>
          <form method="GET" action="/kb" className="flex gap-2">
            <input
              name="q"
              placeholder="Full-text search…"
              className="border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
            <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Browse: Recent Updates ────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  new:      { bg: 'bg-green-100',  text: 'text-green-800',  label: 'NEW' },
  action:   { bg: 'bg-red-100',    text: 'text-red-800',    label: 'ACTION REQUIRED' },
  info:     { bg: 'bg-blue-100',   text: 'text-blue-800',   label: 'FYI' },
  archived: { bg: 'bg-slate-100',  text: 'text-slate-600',  label: 'ARCHIVED' },
};

function RecentView() {
  return (
    <div className="min-h-screen bg-white">
      <BrowseHeader
        crumb="Recent Updates"
        subtitle="Policy changes, product launches, regulatory notices, and internal bulletins — newest first."
      />
      <div className="max-w-4xl mx-auto px-8 py-8">

        <div className="flex items-center gap-3 mb-6 text-xs font-semibold">
          <span className="text-slate-500 mr-1">Filter:</span>
          {['All', 'Action Required', 'Product', 'Policy Update', 'Regulatory', 'Compliance'].map((f, i) => (
            <span
              key={f}
              className={`px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                i === 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
              }`}
            >
              {f}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {UPDATES.map(update => {
            const sev = SEVERITY_STYLES[update.severity];
            return (
              <div
                key={update.id}
                className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock size={12} /> {update.date}
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ background: update.categoryColor + '18', color: update.categoryColor }}
                      >
                        {update.category.toUpperCase()}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${sev.bg} ${sev.text}`}>
                        {sev.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 mb-1.5">{update.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{update.description}</p>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400">Affects:</span>
                      {update.lobs.map(lob => (
                        <span key={lob} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          {lob}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/kb?q=${encodeURIComponent(update.title)}`}
                    className="shrink-0 text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 whitespace-nowrap"
                  >
                    View docs <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 text-center mt-8">
          Showing 10 most recent updates · <Link href="/kb?q=all+updates" className="text-blue-500 hover:underline">Search full archive</Link>
        </p>
      </div>
    </div>
  );
}

// ── Browse: Agent Directory ───────────────────────────────────────────────────

function DirectoryView() {
  return (
    <div className="min-h-screen bg-white">
      <BrowseHeader
        crumb="Agent Directory"
        subtitle="Internal support contacts, regional field offices, and agent tools. For external agent enquiries call 1-855-347-3939."
      />
      <div className="max-w-6xl mx-auto px-8 py-8 space-y-10">

        {/* Support Teams */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={16} className="text-blue-500" /> Internal Support Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SUPPORT_TEAMS.map(t => {
              const Icon = t.icon;
              return (
                <div key={t.team} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">{t.team}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">{t.specialty}</p>
                  <div className="space-y-1.5 text-xs">
                    <a href={`tel:${t.phone.replace(/\D/g,'')}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Phone size={12} /> {t.phone}
                    </a>
                    <a href={`mailto:${t.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Mail size={12} /> {t.email}
                    </a>
                    <span className="flex items-center gap-2 text-slate-400">
                      <Clock size={12} /> {t.hours}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Regional Offices */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-blue-500" /> Regional Field Offices
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Region</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">States Served</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Office</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Field Director</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Direct Line</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REGIONS.map(r => (
                  <tr key={r.region} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{r.region}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{r.states}</td>
                    <td className="px-5 py-3.5 text-slate-600 flex items-center gap-1">
                      <Building2 size={13} className="text-slate-400 shrink-0" /> {r.office}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{r.director}</td>
                    <td className="px-5 py-3.5">
                      <a href={`tel:${r.phone.replace(/\D/g,'')}`} className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                        <Phone size={12} /> {r.phone}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Agent Tools & Resources */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MonitorSmartphone size={16} className="text-blue-500" /> Agent Tools &amp; Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {AGENT_RESOURCES.map(r => {
              const Icon = r.icon;
              return (
                <a
                  key={r.label}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                    <Icon size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{r.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.description}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl bg-blue-50 border border-blue-100 p-5 flex items-start gap-4">
            <BadgeCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800">New to Progressive? Become an Appointed Agent</p>
              <p className="text-sm text-blue-700 mt-0.5">
                Progressive is the #1 writer of auto insurance through independent agents. Over 40,000 agents nationwide.{' '}
                <a href="https://aqn.foragentsonly.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900">
                  Apply for appointment →
                </a>
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Existing views ────────────────────────────────────────────────────────────

function HomeView() {
  return (
    <div className="flex flex-col items-center justify-center h-[600px] bg-slate-50">
      <div className="h-12 mb-8">
        <ProgressiveLogo />
      </div>
      <h1 className="text-3xl font-light text-slate-800 mb-2">Enterprise Knowledge Portal</h1>
      <p className="text-slate-500 mb-8">Search policies, guidelines, and internal memos</p>
      <SearchBar query="" />
      <div className="mt-12 flex gap-8 text-sm text-blue-600 underline">
        <Link href="/kb?browse=lob">Browse by Line of Business</Link>
        <Link href="/kb?browse=recent">View Recent Updates</Link>
        <Link href="/kb?browse=directory">Agent Directory</Link>
      </div>
    </div>
  );
}

function FacetSection({ label, options }: { label: string; options: { label: string; count: number }[] }) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <button className="flex items-center justify-between w-full text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
        {label}
        <ChevronDown size={13} className="text-slate-400" />
      </button>
      <div className="space-y-2">
        {options.map(o => (
          <label key={o.label} className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 cursor-pointer" />
            <span className="text-xs text-slate-600 group-hover:text-slate-900 flex-1">{o.label}</span>
            <span className="text-xs text-slate-400">({o.count})</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ResultsView({ query }: { query: string }) {
  return (
    <div className="min-h-screen bg-white">
      <BrowseHeader
        crumb={`Search: "${query}"`}
        subtitle={`1,248 documents matched your query across all lines of business.`}
      />

      {/* Sort / count bar */}
      <div className="border-b border-slate-100 bg-slate-50 px-8 py-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-700">1–20</strong> of <strong className="text-slate-700">1,248</strong> results
          {' '}— did you mean: <Link href={`/kb?q=${encodeURIComponent(query + ' deductible')}`} className="text-blue-500 hover:underline">{query} deductible</Link>?
        </span>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Sort by:</span>
          <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400">
            <option>Relevance</option>
            <option>Date Modified (Newest)</option>
            <option>Date Modified (Oldest)</option>
            <option>File Name A–Z</option>
            <option>File Size</option>
          </select>
          <button className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
            <Table2 size={14} /> List
          </button>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">

        {/* ── Sidebar ── */}
        <aside className="w-64 shrink-0 border-r border-slate-100 px-5 py-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
            <SlidersHorizontal size={13} /> Filter Results
          </div>
          {SIDEBAR_FACETS.map(f => <FacetSection key={f.label} label={f.label} options={f.options} />)}
          <button className="w-full text-xs text-blue-500 hover:underline text-left pt-1">
            Clear all filters
          </button>
        </aside>

        {/* ── Results ── */}
        <main className="flex-1 px-8 py-6">
          <div className="space-y-0 divide-y divide-slate-100">
            {ALL_RESULTS.map((r, i) => {
              const st = STATUS_STYLES[r.status];
              const fc = FILE_COLORS[r.type] ?? 'text-slate-500';
              return (
                <div key={i} className="py-4 group">
                  <div className="flex items-start gap-3">
                    <FileText size={15} className={`${fc} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/kb?q=${encodeURIComponent(query)}&doc=${r.docRef}`}
                        className="text-sm font-semibold text-blue-600 hover:underline break-all leading-snug"
                      >
                        {r.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-1 mb-1.5 text-xs text-slate-400">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${st.bg} ${st.text}`}>{st.label}</span>
                        <span>{r.type} · {r.pages}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {r.date}</span>
                        <span>{r.dept}</span>
                        <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{r.lob}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{r.excerpt}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page 1 of 63</span>
            <div className="flex gap-1">
              {[1,2,3,'…',62,63].map((p, i) => (
                <button
                  key={i}
                  className={`w-7 h-7 rounded text-xs font-medium ${
                    p === 1 ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:border-blue-400 text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <span>Showing 20 of 1,248 documents</span>
          </div>
        </main>
      </div>
    </div>
  );
}

function DocumentView({ doc, query }: { doc: (typeof DOCS)[number]; query: string }) {
  const displayTitle = doc.title.replace(/_/g, ' ').replace('.pdf', '').replace('.docx', '');
  return (
    <div className="min-h-[600px] bg-slate-100 flex flex-col">
      <div className="bg-slate-800 text-white p-3 flex justify-between items-center shadow-md z-10">
        <Link
          href={`/kb?q=${encodeURIComponent(query)}`}
          className="flex items-center gap-2 hover:bg-slate-700 px-3 py-1 rounded transition-colors"
        >
          <ChevronLeft size={18} /> Back to Search Results
        </Link>
        <span className="font-mono text-sm">{doc.title}</span>
        <div className="flex gap-4">
          <FileDown size={18} className="cursor-pointer hover:text-blue-300" />
        </div>
      </div>

      <div className="flex-1 p-8 flex justify-center overflow-auto">
        <div className="bg-white w-full max-w-3xl shadow-xl p-12 min-h-[800px]">
          <div className="border-b-2 border-black pb-4 mb-8">
            <h1 className="text-2xl font-bold text-center uppercase tracking-widest">{displayTitle}</h1>
            <p className="text-center text-sm mt-2 font-bold">CONFIDENTIAL AND PROPRIETARY</p>
          </div>

          <div className="space-y-6 text-justify text-sm leading-loose">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 flex gap-3">
              <AlertTriangle className="text-yellow-600 shrink-0" />
              <p className="text-xs text-yellow-800">
                You are viewing page 1. Use Ctrl+F to find specific terms within this 14-page document.
              </p>
            </div>

            <p><strong>SECTION 1: GENERAL PROVISIONS.</strong> Subject to the limitations, exclusions, and conditions contained herein, the Company agrees to indemnify the Insured for direct and accidental loss to the covered auto…</p>

            <p><strong>SECTION 2: DEFINITIONS.</strong> &ldquo;Covered Auto&rdquo; means any vehicle specifically described on the Declarations Page. &ldquo;Comprehensive&rdquo; means coverage against loss from any cause except collision, subject to exclusions in Section 4…</p>

            <p><strong>SECTION 3: STATE EXCEPTIONS.</strong> This policy is governed by the state in which the vehicle is principally garaged. If this document is a state-specific addendum, the provisions herein supersede the Master Commercial Auto Policy (Document ID: CommAuto-092-A). If a conflict exists between the Master Policy and this Addendum, the Addendum shall govern. It is the responsibility of the Agent to verify the garaging state prior to quoting deductibles.</p>

            <p><strong>SECTION 4: DEDUCTIBLES.</strong></p>
            <p className="pl-8">
              A. Collision Deductible: Applicable to each covered auto as stated in the Declarations.<br />
              B. Comprehensive Deductible: Applicable to each covered auto.<br />
              &nbsp;&nbsp;&nbsp;&nbsp;i. Glass Breakage: No deductible applies unless stated.<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="bg-blue-100 font-bold">ii. Hail and Windstorm: In the state of Florida, a mandatory baseline deductible of $1,000 applies to all commercial auto policies for perils classified under Hail or Windstorm, unless a higher deductible is selected by the Insured. For policies in Georgia, refer to the GA Addendum for the $750 limit.</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;iii. Theft: Standard comprehensive deductible applies.
            </p>

            <p><strong>SECTION 5: EXCLUSIONS.</strong> The Company will not pay for: 1. Wear and tear, freezing, mechanical or electrical breakdown. 2. Blowouts, punctures or other road damage to tires. 3. Loss to any custom equipment not originally installed by the manufacturer…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function KbPage({ searchParams }: Props) {
  const { q, doc: docId, browse } = await searchParams;

  if (browse === 'lob') return <LobView />;
  if (browse === 'recent') return <RecentView />;
  if (browse === 'directory') return <DirectoryView />;

  if (q && docId) {
    const doc = DOCS.find(d => d.id === docId);
    if (doc) return (
      <div className="w-full font-sans border rounded-xl overflow-hidden shadow-2xl">
        <DocumentView doc={doc} query={q} />
      </div>
    );
  }

  if (q) return (
    <div className="w-full font-sans border rounded-xl overflow-hidden shadow-2xl">
      <ResultsView query={q} />
    </div>
  );

  return (
    <div className="w-full font-sans border rounded-xl overflow-hidden shadow-2xl">
      <HomeView />
    </div>
  );
}
