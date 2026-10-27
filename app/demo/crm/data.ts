/* =========================================================
   Data for the ESL business-banking CRM demo (/demo/crm).
   500 fictional prospect accounts, generated deterministically (seeded PRNG) so the
   server and client render the same data on every load. A handful of accounts are
   hand-authored because the Limitless demo flow depends on them:
     - lakeshore: no CMS page yet  -> "create" mode
     - genesee:   existing v1 page -> "update" mode (needs a CMS AbmLandingPage with AccountId "genesee")
   All companies, people and numbers are fictional; only ESL products and the
   Rochester / Finger Lakes geography are real (esl.org).
   ========================================================= */

export const TODAY = "Oct 27, 2026";
const TODAY_TS = Date.UTC(2026, 9, 27);
const DAY = 86400000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n: number) => String(n).padStart(2, "0");
const shortDate = (ts: number) => {
  const d = new Date(ts);
  return `${MONTHS[d.getUTCMonth()]} ${pad(d.getUTCDate())}`;
};
const longDate = (ts: number) => `${shortDate(ts)}, ${new Date(ts).getUTCFullYear()}`;
const isoDate = (ts: number) => {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};
const monthLabel = (ts: number) => `${MONTHS[new Date(ts).getUTCMonth()]} ${new Date(ts).getUTCFullYear()}`;
const parseLong = (s: string) => {
  const [mon, day, year] = s.replace(",", "").split(" ");
  return Date.UTC(Number(year), MONTHS.indexOf(mon), Number(day));
};
const agoText = (ago: number) => (ago < 1 ? "today" : ago < 7 ? `${ago}d ago` : ago < 30 ? `${Math.round(ago / 7)}w ago` : `${Math.round(ago / 30)}mo ago`);

export const kFmt = (k: number) => (k >= 1000 ? `$${Math.round(k / 10) / 100}M` : `$${k}K`);

/* ---------- seeded PRNG ---------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261027);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const int = (a: number, b: number) => a + Math.floor(rand() * (b - a + 1));
const chance = (p: number) => rand() < p;
const weighted = <T,>(pairs: readonly (readonly [T, number])[]): T => {
  const total = pairs.reduce((s, p) => s + p[1], 0);
  let x = rand() * total;
  for (const [v, w] of pairs) {
    x -= w;
    if (x <= 0) return v;
  }
  return pairs[pairs.length - 1][0];
};
const shuffle = <T,>(arr: readonly T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "");

/* ---------- types ---------- */

export type Stage = "Prospecting" | "Discovery" | "Proposal" | "Underwriting" | "Funded";
export type ActivityType = "call" | "email" | "meeting" | "web" | "event" | "stage" | "task";
export type Contact = { name: string; title: string; role: string; isNew?: boolean };
export type ActivityItem = { date: string; ago: number; type: ActivityType; text: string; by: string };
export type Signal = { date: string; type: string; text: string };
export type OdpMeta = { intentScore: number; band: "High" | "Medium" | "Low"; sessions: number; lastSeenDays: number | null; source: string; device: string };
export type Details = {
  contacts: Contact[];
  activity: string[]; // "Oct 25 · text" (shape sent to the Opal trigger)
  activityItems: ActivityItem[];
  signals: Signal[];
  odp: string[];
  odpMeta: OdpMeta;
  crm: string[];
};
export type Account = {
  id: string;
  name: string;
  industry: string;
  employees: string;
  employeesN: number;
  revenue: string;
  hq: string;
  county: string;
  stage: Stage;
  pipeline: string;
  pipelineK: number;
  owner: string;
  lastActivity: string;
  lastActivityAgo: number;
  tier: 1 | 2 | 3;
  domain: string;
};
export type Opp = { id: string; name: string; acct: string | null; account: string; stage: Stage; amount: number; close: string; closeTs: number; closeMonth: string; owner: string; product: string };
export type CrmContact = Contact & { accountId: string; account: string; industry: string; owner: string; email: string; engaged: string; engagedDays: number };

export const STAGES: Stage[] = ["Prospecting", "Discovery", "Proposal", "Underwriting", "Funded"];
export const STAGE_COLOR: Record<Stage, string> = { Prospecting: "slate", Discovery: "blue", Proposal: "violet", Underwriting: "amber", Funded: "green" };
export const STAGE_PROB: Record<Stage, number> = { Prospecting: 15, Discovery: 30, Proposal: 55, Underwriting: 80, Funded: 100 };

/* ---------- ESL team, geography, products ---------- */

export const OWNERS = [
  { name: "Jordan Hayes", team: "Business Banking" },
  { name: "Priya Raman", team: "Commercial Lending" },
  { name: "Sam Okafor", team: "Wealth & Trust" },
  { name: "Alicia Brooks", team: "Business Banking" },
  { name: "Marcus Webb", team: "Business Banking" },
  { name: "Tessa Lindqvist", team: "Business Banking" },
  { name: "Rosa Mendel", team: "Business Banking" },
  { name: "Hector Salinas", team: "Commercial Lending" },
  { name: "Naomi Fischer", team: "Commercial Lending" },
  { name: "Derek Osei", team: "Commercial Lending" },
  { name: "Grace Tanaka", team: "Wealth & Trust" },
  { name: "Ethan Caldwell", team: "Wealth & Trust" },
];
export const OWNER_NAMES = OWNERS.map((o) => o.name);
const ownersOf = (team: string) => OWNERS.filter((o) => o.team === team).map((o) => o.name);

const TOWNS: [string, string][] = [
  ["Rochester", "Monroe"], ["Rochester", "Monroe"], ["Rochester", "Monroe"], ["Henrietta", "Monroe"], ["Greece", "Monroe"], ["Pittsford", "Monroe"],
  ["Webster", "Monroe"], ["Brockport", "Monroe"], ["Fairport", "Monroe"], ["Penfield", "Monroe"], ["Irondequoit", "Monroe"],
  ["Canandaigua", "Ontario"], ["Geneva", "Ontario"], ["Victor", "Ontario"], ["Farmington", "Ontario"],
  ["Medina", "Orleans"], ["Albion", "Orleans"], ["Holley", "Orleans"],
  ["Seneca Falls", "Seneca"], ["Waterloo", "Seneca"],
  ["Auburn", "Cayuga"], ["Moravia", "Cayuga"],
  ["Batavia", "Genesee"], ["Le Roy", "Genesee"],
  ["Newark", "Wayne"], ["Lyons", "Wayne"], ["Palmyra", "Wayne"],
  ["Geneseo", "Livingston"], ["Avon", "Livingston"], ["Dansville", "Livingston"],
  ["Warsaw", "Wyoming"], ["Perry", "Wyoming"],
  ["Penn Yan", "Yates"], ["Dundee", "Yates"],
];
export const COUNTIES = Array.from(new Set(TOWNS.map((t) => t[1]))).sort();

export const PRODUCT_LINES = ["Cash management", "Commercial lending", "Business checking", "Retirement & benefits", "Trust & investments"] as const;
const OPP_NAMES: Record<string, string[]> = {
  "Cash management": ["Treasury & cash management", "Fraud prevention & positive pay", "Payables & receivables automation"],
  "Commercial lending": ["Working capital line of credit", "Commercial real estate loan", "Equipment financing"],
  "Business checking": ["Business checking & payroll services", "Merchant services", "Operating account consolidation"],
  "Retirement & benefits": ["Employer retirement plan", "Executive benefits program", "Succession planning"],
  "Trust & investments": ["Foundation investment management", "Trust services", "Endowment management"],
};
const PRODUCT_PAGES: Record<string, string[]> = {
  "Cash management": ["Cash Management", "Fraud Prevention", "Payables & Receivables"],
  "Commercial lending": ["Commercial Lending", "Equipment Financing", "Commercial Real Estate"],
  "Business checking": ["Business Checking", "Merchant Services", "Rochester Business Resources"],
  "Retirement & benefits": ["Employer Retirement Plans", "Executive Benefits", "Succession Planning"],
  "Trust & investments": ["Trust Services", "Investment Services", "Foundations & Non-profits"],
};

/* ---------- segment definitions (names, products, signals, intent topics) ---------- */

type Segment = {
  a: string[];
  b: string[];
  products: string[];
  topics: string[];
  expansion: string[];
  hiring: string[];
  pain: string[];
};

const SEGMENTS: Record<string, Segment> = {
  "Agriculture & Food": {
    a: ["Lakeshore", "Orleans", "Seneca", "Cayuga", "Genesee", "Hilltop", "Sunrise", "Greenfield", "Maple Ridge", "Orchard Row", "Willow Creek", "Heritage", "Clover Valley", "Erie Canal", "Ridgeview", "Wayne Valley"],
    b: ["Farms", "Orchards", "Growers Cooperative", "Produce Co.", "Creamery", "Dairy", "Vineyards", "Packing Co.", "Greenhouses", "Apple Growers"],
    products: ["Commercial lending", "Cash management"],
    topics: ["agricultural lending", "seasonal line of credit", "payables automation", "equipment financing", "fraud prevention"],
    expansion: ["Announced a second packing and cold-storage facility", "Opened a farm market and tasting room", "Acquired 400 acres of neighboring farmland"],
    hiring: ["seasonal operations staff", "a Treasury Analyst", "plant supervisors"],
    pain: ["seasonal cash-flow gaps", "slow check-run reconciliation", "fragmented banking relationships"],
  },
  Healthcare: {
    a: ["Genesee", "Monroe", "Lakeview", "Irondequoit", "Finger Lakes", "Pittsford", "Crossroads", "Highland", "Cobbs Hill", "Lakeshore", "Brighton", "Wayne"],
    b: ["Family Medicine", "Pediatrics Group", "Dental Partners", "Orthopedic Associates", "Home Care", "Urgent Care", "Physical Therapy", "Senior Living", "Behavioral Health", "Radiology Group"],
    products: ["Retirement & benefits", "Cash management"],
    topics: ["401(k) for employers", "executive benefits", "treasury services", "practice acquisition financing", "payroll consolidation"],
    expansion: ["Opened two new satellite clinics", "Announced a new outpatient imaging center", "Acquired a neighboring physician practice"],
    hiring: ["clinical staff", "a Revenue Cycle Manager", "front-office and billing staff"],
    pain: ["rising benefit administration costs", "fragmented payer receivables", "retaining clinical talent"],
  },
  "Advanced Manufacturing": {
    a: ["Monroe", "Flower City", "Erie Canal", "Lake Ontario", "Precision", "Summit", "Ironbridge", "Genesee", "Northfield", "Apex Ridge", "Canal Street", "Brockport"],
    b: ["Precision Manufacturing", "Optics", "Tool & Die", "Plastics", "Fabrication", "Machining", "Controls", "Packaging", "Components", "Industrial Supply"],
    products: ["Commercial lending", "Retirement & benefits"],
    topics: ["equipment financing", "commercial real estate loan", "401(k) for employers", "positive pay", "working capital"],
    expansion: ["Announced a plant expansion and new CNC line", "Won a multi-year supply contract", "Opened a second production shift"],
    hiring: ["machinists and technicians", "a Plant Controller", "quality engineers"],
    pain: ["equipment financing lead times", "supplier payment delays", "retaining skilled trades"],
  },
  Hospitality: {
    a: ["Canandaigua", "Seneca Lake", "Keuka", "Finger Lakes", "Lakeside", "Harborview", "Vineyard", "Genesee", "Pittsford Village", "Webster", "Wine Trail"],
    b: ["Inn & Suites", "Resort", "Bistro Group", "Brewing Co.", "Catering", "Hotels", "Event Venues", "Tours", "Hospitality Group", "Restaurants"],
    products: ["Commercial lending", "Business checking"],
    topics: ["commercial real estate loan", "merchant services", "succession planning", "seasonal working capital", "business checking"],
    expansion: ["Announced a new lakeside event venue", "Opened a second restaurant location", "Began a 40-room expansion"],
    hiring: ["seasonal front-of-house staff", "a General Manager", "event coordinators"],
    pain: ["seasonal revenue swings", "high card-processing fees", "owner succession planning"],
  },
  "Non-profit & Foundations": {
    a: ["Cayuga", "Rochester", "Finger Lakes", "Genesee", "Seneca", "Wayne County", "Livingston", "Monroe", "Community", "Neighbors"],
    b: ["Community Foundation", "Food Bank", "Arts Council", "Youth Alliance", "Housing Trust", "Land Trust", "Library Foundation", "Education Fund", "Health Foundation", "Heritage Society"],
    products: ["Trust & investments", "Cash management"],
    topics: ["foundation investment management", "endowment spending policy", "grant disbursement workflows", "trust services", "donor-advised funds"],
    expansion: ["Launched a capital campaign for a new community center", "Announced a regional grant program", "Opened a second service office"],
    hiring: ["a Development Director", "program staff", "a Finance Manager"],
    pain: ["endowment return targets", "manual grant disbursement", "board reporting burden"],
  },
  Retail: {
    a: ["Park Avenue", "Main Street", "Village", "Lakeview", "Corn Hill", "Mapleton", "Brighton", "Eastview", "Marketplace", "Harbor"],
    b: ["Hardware", "Outfitters", "Grocers", "Home & Garden", "Market", "Furniture", "Pharmacy", "Bike Shop", "Books & Gifts", "Apparel"],
    products: ["Business checking", "Commercial lending"],
    topics: ["merchant services", "inventory line of credit", "business checking", "payroll services", "cash handling"],
    expansion: ["Opened a second storefront", "Launched online ordering and curbside pickup", "Signed a lease on a larger location"],
    hiring: ["store associates", "an Operations Manager", "seasonal holiday staff"],
    pain: ["card-processing fees", "holiday inventory financing", "cash deposit logistics"],
  },
  "Professional Services": {
    a: ["Lakeshore", "Monroe", "Brighton", "Exchange Street", "Clinton Avenue", "Penfield", "Summit", "Cornerstone", "Liberty Pole", "Highland"],
    b: ["Accounting Group", "Law Partners", "Engineering Associates", "Insurance Agency", "Architects", "Consulting Group", "Staffing", "Marketing Studio", "Title & Escrow", "Benefits Consulting"],
    products: ["Retirement & benefits", "Business checking"],
    topics: ["succession planning", "401(k) for employers", "business checking", "executive benefits", "payroll services"],
    expansion: ["Opened a second office", "Announced a merger with a regional firm", "Added a new practice area"],
    hiring: ["senior associates", "an Office Manager", "a Business Development Director"],
    pain: ["partner succession", "retirement plan administration", "operating account sprawl"],
  },
  "Construction & Real Estate": {
    a: ["Cobblestone", "Erie Canal", "Genesee", "Summit", "Ironwood", "Brookside", "Fairport", "Highland", "Lakeshore", "Keystone"],
    b: ["Builders", "Contractors", "Development Group", "Property Management", "Realty", "Excavating", "Electric", "Mechanical", "Roofing", "Homes"],
    products: ["Commercial lending", "Cash management"],
    topics: ["commercial real estate loan", "construction line of credit", "payables automation", "equipment financing", "fraud prevention"],
    expansion: ["Broke ground on a mixed-use development", "Won a municipal construction contract", "Added a property management division"],
    hiring: ["project managers", "a Controller", "skilled-trades crews"],
    pain: ["draw-schedule cash timing", "subcontractor payment fraud", "bonding and credit capacity"],
  },
  Education: {
    a: ["Finger Lakes", "Genesee Valley", "Monroe", "Irondequoit", "Brighton", "Cayuga", "Pittsford", "Seneca", "Lakeside", "Wayne"],
    b: ["College Foundation", "Charter Schools", "School Cooperative", "Montessori Network", "Technical Institute", "Learning Center", "Early Childhood Centers", "Academy", "Language Institute", "Tutoring Network"],
    products: ["Retirement & benefits", "Cash management"],
    topics: ["403(b) plans", "tuition payment processing", "endowment management", "treasury services", "payroll consolidation"],
    expansion: ["Announced a new campus building", "Launched a workforce training program", "Opened a second learning center"],
    hiring: ["instructors", "a Business Manager", "student services staff"],
    pain: ["tuition collection friction", "retirement plan fees", "grant fund tracking"],
  },
  "Auto & Transportation": {
    a: ["Greece", "Henrietta", "Lake Ontario", "Thruway", "Flower City", "Monroe", "Mapleview", "Crossroads", "Canal", "Brockport"],
    b: ["Auto Group", "Motors", "Collision Centers", "Freight", "Logistics", "Bus Lines", "Tire & Service", "Fleet Services", "Trucking", "Towing"],
    products: ["Commercial lending", "Business checking"],
    topics: ["fleet financing", "floor plan line of credit", "merchant services", "equipment financing", "payroll services"],
    expansion: ["Added a second dealership location", "Expanded the delivery fleet by 20 vehicles", "Opened a new service center"],
    hiring: ["technicians", "drivers", "a Fleet Manager"],
    pain: ["fleet financing costs", "floor plan interest", "fuel and maintenance cash timing"],
  },
  Technology: {
    a: ["Flower City", "Lake Effect", "Genesee", "Monroe", "Corn Hill", "Frontier", "Brightpath", "Northfield", "Optic", "Pixel"],
    b: ["Software", "Labs", "Systems", "Analytics", "Photonics", "IT Services", "Cyber", "Data", "Robotics", "Cloud"],
    products: ["Business checking", "Retirement & benefits"],
    topics: ["business checking", "executive benefits", "401(k) for employers", "venture debt alternatives", "treasury services"],
    expansion: ["Closed a growth funding round", "Opened a second office downtown", "Launched a new product line"],
    hiring: ["software engineers", "a Controller", "customer success staff"],
    pain: ["scaling payroll and benefits", "multi-bank operating accounts", "equity-based compensation planning"],
  },
  "Municipal & Public": {
    a: ["Penfield Regional", "Lakeshore", "Genesee Valley", "Finger Lakes", "Orleans Area", "Wayne Valley", "Seneca Basin", "Monroe Metro", "Canal Corridor", "Cobblestone"],
    b: ["Water Authority", "Fire District", "Transit Authority", "Library System", "Recreation District", "Housing Authority", "Sewer District", "Economic Development Agency", "Port District", "Emergency Services"],
    products: ["Cash management", "Business checking"],
    topics: ["treasury services", "collateralized deposits", "payables automation", "payroll services", "positive pay"],
    expansion: ["Approved a capital improvement plan", "Announced a facility renovation bond", "Launched a regional service partnership"],
    hiring: ["a Finance Director", "operations staff", "an Accounts Payable Clerk"],
    pain: ["collateralized deposit requirements", "manual payables approval", "public funds reporting"],
  },
};
export const INDUSTRIES = Object.keys(SEGMENTS).sort();

const TITLES: Record<string, [string, string, string]> = {
  default: ["Owner & President", "Controller", "Director of Operations"],
  "Non-profit & Foundations": ["Executive Director", "Director of Finance & Investments", "Development Director"],
  "Municipal & Public": ["Commissioner", "Treasurer / Comptroller", "Operations Director"],
  Healthcare: ["Chief Financial Officer", "Director of Finance", "HR & Benefits Manager"],
  "Advanced Manufacturing": ["Chief Financial Officer", "Plant Controller", "HR & Benefits Manager"],
  Education: ["Head of School / President", "Business Manager", "Director of Operations"],
  Technology: ["Chief Executive Officer", "VP Finance", "Head of People"],
};
const ROLES = ["Economic Buyer", "Technical Evaluator", "Champion"];

const FIRST = ["Marcus", "Elena", "Raj", "Claire", "Hannah", "Diego", "Nina", "Grant", "Sofia", "Ben", "Olivia", "Kenji", "Maya", "Daniel", "Rachel", "Victor", "Amara", "Luis", "Priyanka", "Tobias", "Imani", "Gavin", "Leah", "Mateo", "Yuki", "Fiona", "Omar", "Beatrice", "Caleb", "Dana", "Nolan", "Sienna", "Andre", "Talia", "Wesley", "Noor", "Callum", "Greta", "Samir", "Joanna"];
const LAST = ["Lee", "Natarajan", "Becker", "Owens", "Hale", "Voss", "Patel", "Duval", "Brooks", "Alvarez", "Okafor", "Whitfield", "Marin", "Hartley", "Grant", "Watanabe", "Rossi", "Park", "Nguyen", "Kowalski", "Bianchi", "Mitchell", "Oyelaran", "Fitzgerald", "Sandoval", "Lindgren", "Haddad", "Thornton", "Iyer", "Calloway", "Reyes", "Abbott", "Moreau", "Zhang", "Delaney", "Petrov", "Ashworth", "Medina", "Sorensen", "Quinn", "Bell", "Castellano", "Yoder", "Frazier"];

const SOURCES = ["Organic search", "Email campaign: Q4 Business Growth ABM", "Paid search", "Direct", "LinkedIn", "Referral: Greater Rochester Chamber", "ESL event follow-up"];
const DEVICES = ["62% desktop · 38% mobile", "81% desktop · 19% mobile", "45% desktop · 55% mobile", "70% desktop · 30% mobile"];
const ASSETS = ["Fraud Prevention Checklist", "Small Business Cash Flow Guide", "Succession Planning Workbook", "Equipment Financing Guide", "Employer Retirement Plan Comparison"];
const OBJECTIONS = ["switching cost from incumbent regional bank", "pricing vs. M&T Bank treasury package", "KeyBank relationship manager already assigned", "concern about onboarding time", "wants a local decision-maker on credit", "Canandaigua National Bank trust relationship"];
const EVENTS = ["ESL Rochester Business Resources webinar", "ESL Treasury & fraud prevention workshop", "Greater Rochester Chamber mixer", "ESL Commercial Lending open house", "ESL small business roundtable"];
const DOCS = ["rate sheet", "treasury services overview", "credit application checklist", "retirement plan proposal", "fee schedule"];

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  call: "Call logged",
  email: "Email opened",
  meeting: "Meeting held",
  web: "Website visit",
  event: "Event attended",
  stage: "Stage changed",
  task: "Proposal sent",
};

/* ---------- builders ---------- */

const finishActivity = (items: ActivityItem[]) => items.map((i) => `${shortDate(TODAY_TS - i.ago * DAY)} · ${i.text}`);
const bandOf = (score: number): "High" | "Medium" | "Low" => (score >= 70 ? "High" : score >= 40 ? "Medium" : "Low");
const money = (m: number, suffix = "") => (m >= 1000 ? `$${(m / 1000).toFixed(1)}B${suffix}` : `$${m}M${suffix}`);
const num = (n: number) => n.toLocaleString("en-US");

type Seed = Pick<Account, "id" | "name" | "industry" | "hq" | "county" | "stage" | "pipelineK" | "owner" | "tier" | "domain" | "employeesN"> & { revenue: string };

function makeContacts(seed: Seed, override?: Contact[]): Contact[] {
  if (override) return override;
  const titles = TITLES[seed.industry] || TITLES.default;
  const used = new Set<string>();
  return ROLES.map((role, i) => {
    let name = "";
    do name = `${pick(FIRST)} ${pick(LAST)}`;
    while (used.has(name));
    used.add(name);
    return { name, title: titles[i], role };
  });
}

function makeActivity(seed: Seed, contacts: Contact[], product: string): ActivityItem[] {
  const n = seed.tier === 1 ? int(5, 8) : seed.tier === 2 ? int(4, 6) : int(3, 5);
  const agos = Array.from({ length: n }, () => int(1, 60)).sort((a, b) => a - b);
  agos[0] = int(0, seed.stage === "Prospecting" ? 30 : 14);
  const seg = SEGMENTS[seed.industry];
  const stageIdx = STAGES.indexOf(seed.stage);
  const page = pick(PRODUCT_PAGES[product]);
  const items: ActivityItem[] = agos.map((ago, i) => {
    const c = pick(contacts);
    const type = weighted<ActivityType>([["call", 3], ["email", 3], ["meeting", 2], ["web", 3], ["event", 1], ["task", 1], ["stage", i === 0 || stageIdx === 0 ? 0.1 : 1]]);
    const topic = pick(seg.topics);
    let text = "";
    let by = seed.owner;
    switch (type) {
      case "call":
        text = pick([`Call with ${c.name}: ${topic} raised`, `Follow-up call with ${c.name} on ${product.toLowerCase()}`, `Left voicemail for ${c.name} re: ${topic}`]);
        break;
      case "email":
        text = pick([`${c.name} opened “${pick(ASSETS)}”`, `${c.name} replied about ${topic}`, `Sent ${pick(DOCS)} to ${c.name}`]);
        by = pick([seed.owner, "Marketing automation"]);
        break;
      case "meeting":
        text = pick([`Met ${c.name} in ${seed.hq.split(",")[0]} to review ${product.toLowerCase()}`, `Video call with ${c.name} and team: ${topic}`]);
        break;
      case "web":
        text = `Visited esl.org ${page} page (${int(1, 6)}×)`;
        by = "ODP";
        break;
      case "event":
        text = `${c.name} attended “${pick(EVENTS)}”`;
        by = "Events";
        break;
      case "stage": {
        const to = STAGES[Math.max(1, Math.min(stageIdx, STAGES.length - 1))];
        text = `Moved to ${to} stage`;
        break;
      }
      default:
        text = `Sent ${pick(DOCS)} for ${product.toLowerCase()}`;
    }
    return { date: isoDate(TODAY_TS - ago * DAY), ago, type, text, by };
  });
  return items.sort((x, y) => x.ago - y.ago);
}

function makeOdp(seed: Seed, product: string): { odp: string[]; odpMeta: OdpMeta } {
  const seg = SEGMENTS[seed.industry];
  const silent = chance(0.06);
  const base = ({ Prospecting: 25, Discovery: 45, Proposal: 62, Underwriting: 72, Funded: 50 } as Record<Stage, number>)[seed.stage];
  const score = silent ? int(0, 9) : Math.max(3, Math.min(98, base + int(-22, 28)));
  if (silent) return { odp: [], odpMeta: { intentScore: score, band: "Low", sessions: 0, lastSeenDays: null, source: "—", device: "—" } };
  const sessions = Math.max(1, Math.round((score / 100) * 30) + int(0, 3));
  const lastSeen = int(0, score >= 70 ? 6 : score >= 40 ? 16 : 40);
  const source = pick(SOURCES);
  const device = pick(DEVICES);
  const topics = shuffle(seg.topics).slice(0, 2);
  const pages = shuffle(PRODUCT_PAGES[product]);
  const odp = [`${sessions} sessions from ${seed.domain} in last 30 days`];
  if (score >= 25) odp.push(`Viewed ${pages[0]} page ${int(2, 9)}×${score >= 55 ? ` and ${pages[1]} page ${int(1, 5)}×` : ""}`);
  odp.push(`Top intent topics: ${topics.join(", ")}`);
  if (chance(0.6)) odp.push(`Primary source: ${source} · ${device}`);
  if (chance(0.3)) odp.push(`Downloaded “${pick(ASSETS)}”`);
  if (score >= 60 && chance(0.4)) odp.push("Started a business account application, not completed");
  if (score < 25) odp.push("Low recent engagement; nurture sequence recommended");
  return { odp, odpMeta: { intentScore: score, band: bandOf(score), sessions, lastSeenDays: lastSeen, source, device } };
}

function makeSignals(seed: Seed, contacts: Contact[]): { signals: Signal[]; contacts: Contact[] } {
  const seg = SEGMENTS[seed.industry];
  const count = seed.tier === 1 ? weighted([[1, 2], [2, 4], [3, 3]]) : seed.tier === 2 ? weighted([[0, 2], [1, 4], [2, 2]]) : weighted([[0, 5], [1, 3], [2, 1]]);
  const types = shuffle(["expansion", "hiring", "earnings_call", "c_suite_hire", "buying_stage_shift"]).filter((t) => t !== "buying_stage_shift" || seed.stage !== "Prospecting").slice(0, count);
  const signals: Signal[] = [];
  let out = contacts;
  for (const type of types) {
    const ts = TODAY_TS - int(2, 56) * DAY;
    let text = "";
    if (type === "expansion") text = pick(seg.expansion);
    else if (type === "hiring") text = `Hiring ${int(5, 40)}+ ${pick(seg.hiring)}`;
    else if (type === "earnings_call") {
      const big = seed.tier < 3 && ["Healthcare", "Advanced Manufacturing", "Technology", "Retail", "Auto & Transportation"].includes(seed.industry);
      text = `${big ? "Q3 earnings call" : "Annual meeting"}: ${out[1].title.split(" /")[0]} cites ${pick(seg.pain)}`;
    } else if (type === "c_suite_hire") {
      const newName = `${pick(FIRST)} ${pick(LAST)}`;
      const title = pick(["Chief Financial Officer", "Controller", "Director of Finance", "Chief Operating Officer", "Treasurer"]);
      text = `Named ${newName} as ${title}`;
      out = out.map((c, i) => (i === 1 ? { ...c, name: newName, title, isNew: true } : c));
    } else {
      const prev = STAGES[Math.max(0, STAGES.indexOf(seed.stage) - 1)];
      text = `Opportunity moved ${prev} → ${seed.stage}`;
    }
    signals.push({ date: isoDate(ts), type, text });
  }
  signals.sort((a, b) => (a.date < b.date ? 1 : -1));
  return { signals, contacts: out };
}

function makeDetails(seed: Seed, product: string, contactsOverride?: Contact[]): Details {
  const baseContacts = makeContacts(seed, contactsOverride);
  const { signals, contacts } = makeSignals(seed, baseContacts);
  const activityItems = makeActivity(seed, contacts, product);
  const { odp, odpMeta } = makeOdp(seed, product);
  const opp = OPP_NAMES[product][0];
  const crm = [
    `Opportunity: ${opp} · ${kFmt(seed.pipelineK)} · ${seed.stage}`,
    `${contacts.length} known contacts mapped to buying roles`,
    chance(0.7) ? `Objection logged: ${pick(OBJECTIONS)}` : `Next step: ${pick(["schedule discovery call", "send proposal", "intro to commercial lending team", "invite to Rochester Business Resources event"])}`,
  ];
  return { contacts, activity: finishActivity(activityItems), activityItems, signals, odp, odpMeta, crm };
}

/* ---------- hand-authored accounts (Limitless create / update demo) ---------- */

type HandAccount = Seed & { product: string };

const HAND: HandAccount[] = [
  { id: "lakeshore", name: "Lakeshore Dairy Cooperative", industry: "Agriculture & Food", employeesN: 420, revenue: "$180M", hq: "Medina, NY", county: "Orleans", stage: "Discovery", pipelineK: 480, owner: "Jordan Hayes", tier: 1, domain: "lakeshoredairy.example", product: "Cash management" },
  { id: "genesee", name: "Genesee Valley Health Partners", industry: "Healthcare", employeesN: 3200, revenue: "$610M", hq: "Rochester, NY", county: "Monroe", stage: "Proposal", pipelineK: 1200, owner: "Jordan Hayes", tier: 1, domain: "geneseevalleyhealth.example", product: "Retirement & benefits" },
  { id: "fingerlakes", name: "Finger Lakes Vintners Group", industry: "Hospitality", employeesN: 260, revenue: "$54M", hq: "Geneva, NY", county: "Ontario", stage: "Prospecting", pipelineK: 650, owner: "Priya Raman", tier: 2, domain: "fingerlakesvintners.example", product: "Commercial lending" },
  { id: "monroe", name: "Monroe Precision Manufacturing", industry: "Advanced Manufacturing", employeesN: 1150, revenue: "$240M", hq: "Rochester, NY", county: "Monroe", stage: "Discovery", pipelineK: 390, owner: "Priya Raman", tier: 1, domain: "monroeprecision.example", product: "Commercial lending" },
  { id: "cayuga", name: "Cayuga Community Foundation", industry: "Non-profit & Foundations", employeesN: 45, revenue: "$95M AUM", hq: "Auburn, NY", county: "Cayuga", stage: "Prospecting", pipelineK: 900, owner: "Sam Okafor", tier: 2, domain: "cayugafoundation.example", product: "Trust & investments" },
  { id: "canandaigua", name: "Canandaigua Lakeside Hospitality", industry: "Hospitality", employeesN: 680, revenue: "$88M", hq: "Canandaigua, NY", county: "Ontario", stage: "Proposal", pipelineK: 1500, owner: "Sam Okafor", tier: 1, domain: "canandaigualakeside.example", product: "Commercial lending" },
];

const item = (ago: number, type: ActivityType, text: string, by: string): ActivityItem => ({ date: isoDate(TODAY_TS - ago * DAY), ago, type, text, by });

const HAND_DETAILS: Record<string, (a: HandAccount) => Details> = {
  lakeshore: () => {
    const activityItems = [
      item(2, "web", "Visited ESL cash management and fraud prevention pages", "ODP"),
      item(13, "call", "Discovery call: payment fraud and slow check-run reconciliation raised", "Jordan Hayes"),
      item(24, "event", "Attended “Rochester Business Resources” agriculture roundtable", "Events"),
    ];
    return {
      contacts: [
        { name: "Marcus Lee", title: "Chief Financial Officer", role: "Economic Buyer" },
        { name: "Priya Natarajan", title: "Controller & Treasury Lead", role: "Technical Evaluator" },
        { name: "Tom Becker", title: "Director, Farm & Plant Operations", role: "Champion" },
      ],
      activity: finishActivity(activityItems),
      activityItems,
      signals: [
        { date: "2026-10-16", type: "hiring", text: "Hiring a Treasury Analyst and 25+ plant staff" },
        { date: "2026-10-08", type: "expansion", text: "Announced a second processing plant serving Orleans and Genesee County farms" },
        { date: "2026-09-12", type: "earnings_call", text: "Annual member meeting: CFO cites fragmented banking relationships and slow payables as margin pressure" },
      ],
      odp: ["11 sessions from lakeshoredairy.example in last 30 days", "Viewed Cash Management page 6×", "Top intent topics: payables automation, fraud prevention, agricultural lending"],
      odpMeta: { intentScore: 74, band: "High", sessions: 11, lastSeenDays: 2, source: "Email campaign: Q4 Business Growth ABM", device: "70% desktop · 30% mobile" },
      crm: ["Opportunity: Treasury & cash management · $480K · Discovery", "3 known contacts mapped to buying roles", "Objection logged: switching cost from incumbent regional bank"],
    };
  },
  genesee: () => {
    const activityItems = [
      item(9, "stage", "Moved to Proposal stage", "Jordan Hayes"),
      item(21, "task", "Requested employer retirement plan and executive benefits overview", "Jordan Hayes"),
      item(35, "call", "Initial discovery call completed", "Jordan Hayes"),
    ];
    return {
      contacts: [
        { name: "Rachel Owens", title: "SVP Finance", role: "Economic Buyer" },
        { name: "Daniel Park", title: "Chief Financial Officer", role: "Technical Evaluator", isNew: true },
        { name: "Victor Hale", title: "Director, Employee Benefits", role: "Champion" },
      ],
      activity: finishActivity(activityItems),
      activityItems,
      // Both signals post-date the v1 page (Jul 2), so the Updater treats them as material.
      signals: [
        { date: "2026-10-18", type: "buying_stage_shift", text: "Opportunity moved Discovery → Proposal" },
        { date: "2026-10-12", type: "c_suite_hire", text: "Named Daniel Park as Chief Financial Officer" },
      ],
      odp: ["9 sessions from geneseevalleyhealth.example in last 30 days", "Viewed Employer Retirement Plans page 4×", "Top intent topics: 401(k) for employers, executive benefits, treasury services"],
      odpMeta: { intentScore: 68, band: "Medium", sessions: 9, lastSeenDays: 4, source: "Direct", device: "81% desktop · 19% mobile" },
      crm: ["Opportunity: Treasury, retirement plan & executive benefits · $1.2M · Proposal", "New contact: Daniel Park (CFO)", "Requested employer retirement plan and executive benefits overview"],
    };
  },
};

const EXTRA_CONTACTS: Record<string, Contact[]> = {
  fingerlakes: [
    { name: "Elena Voss", title: "Owner & Managing Partner", role: "Economic Buyer" },
    { name: "Raj Patel", title: "Finance & Operations Manager", role: "Technical Evaluator" },
    { name: "Claire Duval", title: "Director, Hospitality & Events", role: "Champion" },
  ],
  monroe: [
    { name: "Hannah Brooks", title: "Chief Financial Officer", role: "Economic Buyer" },
    { name: "Diego Alvarez", title: "Plant Controller", role: "Technical Evaluator" },
    { name: "Nina Okafor", title: "HR & Benefits Manager", role: "Champion" },
  ],
  cayuga: [
    { name: "Grant Whitfield", title: "Executive Director", role: "Economic Buyer" },
    { name: "Sofia Marin", title: "Director of Finance & Investments", role: "Technical Evaluator" },
    { name: "Ben Hartley", title: "Manager, Donor & Grant Programs", role: "Champion" },
  ],
  canandaigua: [
    { name: "Olivia Grant", title: "Owner & President", role: "Economic Buyer" },
    { name: "Kenji Watanabe", title: "Chief Financial Officer", role: "Technical Evaluator" },
    { name: "Maya Rossi", title: "General Manager, Lakeside Resort", role: "Champion" },
  ],
};

const HAND_OPPS: Opp[] = [
  ["o1", "Treasury & cash management", "lakeshore", "Discovery", 480, "Dec 12, 2026", "Jordan Hayes", "Cash management"],
  ["o2", "Treasury, retirement plan & executive benefits", "genesee", "Proposal", 1200, "Nov 30, 2026", "Jordan Hayes", "Retirement & benefits"],
  ["o3", "Vineyard expansion loan & business checking", "fingerlakes", "Prospecting", 650, "Feb 20, 2027", "Priya Raman", "Commercial lending"],
  ["o4", "Equipment financing", "monroe", "Discovery", 390, "Jan 15, 2027", "Priya Raman", "Commercial lending"],
  ["o5", "Foundation investment & trust services", "cayuga", "Prospecting", 900, "Mar 31, 2027", "Sam Okafor", "Trust & investments"],
  ["o6", "Commercial real estate loan & succession planning", "canandaigua", "Proposal", 1500, "Dec 05, 2026", "Sam Okafor", "Commercial lending"],
].map(([id, name, acct, stage, amount, close, owner, product]) => {
  const closeTs = parseLong(close as string);
  const a = HAND.find((h) => h.id === acct)!;
  return { id, name, acct, account: a.name, stage, amount, close, closeTs, closeMonth: monthLabel(closeTs), owner, product } as Opp;
});

/* ---------- generation ---------- */

export const ACCOUNTS: Account[] = [];
export const DETAILS: Record<string, Details> = {};
export const OPPS: Opp[] = [];
const usedNames = new Set<string>();

function commit(seed: Seed, det: Details) {
  const top = det.activityItems.length ? det.activityItems[0] : null;
  const ago = top ? top.ago : 30;
  ACCOUNTS.push({
    ...seed,
    employees: num(seed.employeesN),
    pipeline: kFmt(seed.pipelineK),
    lastActivity: top ? `${ACTIVITY_LABEL[top.type]} · ${agoText(ago)}` : "No activity logged",
    lastActivityAgo: ago,
  });
  DETAILS[seed.id] = det;
  usedNames.add(seed.name);
}

HAND.forEach((h) => {
  const det = HAND_DETAILS[h.id] ? HAND_DETAILS[h.id](h) : makeDetails(h, h.product, EXTRA_CONTACTS[h.id]);
  commit(h, det);
});

const closeFor = (stage: Stage) => {
  if (stage === "Funded") return TODAY_TS - int(2, 60) * DAY;
  const [lo, hi] = ({ Prospecting: [110, 220], Discovery: [70, 150], Proposal: [28, 95], Underwriting: [10, 45] } as Record<string, number[]>)[stage];
  return TODAY_TS + int(lo, hi) * DAY;
};

const mkOpp = (id: string, name: string, acct: string | null, account: string, stage: Stage, amount: number, owner: string, product: string): Opp => {
  const closeTs = closeFor(stage);
  return { id, name, acct, account, stage, amount, close: longDate(closeTs), closeTs, closeMonth: monthLabel(closeTs), owner, product };
};

let oppN = 10;
OPPS.push(...HAND_OPPS);

function generateName(seg: Segment): string {
  for (let i = 0; i < 40; i++) {
    const n = `${pick(seg.a)} ${pick(seg.b)}`;
    if (!usedNames.has(n)) return n;
  }
  return `${pick(seg.a)} ${pick(seg.b)} ${int(2, 9)}`;
}

const SEGMENT_WEIGHTS: [string, number][] = [
  ["Agriculture & Food", 9], ["Healthcare", 12], ["Advanced Manufacturing", 11], ["Hospitality", 10], ["Non-profit & Foundations", 8], ["Retail", 10],
  ["Professional Services", 12], ["Construction & Real Estate", 10], ["Education", 5], ["Auto & Transportation", 6], ["Technology", 5], ["Municipal & Public", 4],
];
const TARGET_ACCOUNTS = 500;

for (let i = ACCOUNTS.length; i < TARGET_ACCOUNTS; i++) {
  const industry = weighted(SEGMENT_WEIGHTS);
  const seg = SEGMENTS[industry];
  const name = generateName(seg);
  const [town, county] = pick(TOWNS);
  const tier = weighted<1 | 2 | 3>([[1, 13], [2, 37], [3, 50]]);
  const employeesN = tier === 1 ? int(250, 3500) : tier === 2 ? int(60, 600) : int(8, 120);
  const revM = Math.max(2, Math.round(employeesN * (0.12 + rand() * 0.25)));
  const revenue = industry === "Non-profit & Foundations" ? money(revM, " AUM") : industry === "Municipal & Public" ? money(revM, " budget") : money(revM);
  const stage = weighted<Stage>([["Prospecting", 35], ["Discovery", 30], ["Proposal", 20], ["Underwriting", 10], ["Funded", 5]]);
  const product = pick(seg.products);
  const pipelineK = (tier === 1 ? int(120, 480) : tier === 2 ? int(50, 180) : int(12, 80)) * 5;
  const team = industry === "Non-profit & Foundations" || product === "Trust & investments" ? "Wealth & Trust" : product === "Commercial lending" ? weighted([["Commercial Lending", 6], ["Business Banking", 4]]) : "Business Banking";
  const owner = pick(ownersOf(team));
  const seed: Seed = {
    id: `acct-${String(i + 1).padStart(4, "0")}`,
    name,
    industry,
    employeesN,
    revenue,
    hq: `${town}, NY`,
    county,
    stage,
    pipelineK,
    owner,
    tier,
    domain: `${slugify(name)}.example`,
  };
  const det = makeDetails(seed, product);
  commit(seed, det);
  const productName = pick(OPP_NAMES[product]);
  OPPS.push(mkOpp(`o${oppN++}`, productName, seed.id, name, stage, pipelineK, owner, product));
  if (chance(0.3)) {
    const p2 = pick(PRODUCT_LINES.filter((p) => p !== product));
    const stage2 = STAGES[Math.max(0, STAGES.indexOf(stage) - int(0, 1))];
    OPPS.push(mkOpp(`o${oppN++}`, pick(OPP_NAMES[p2]), seed.id, name, stage2, Math.max(15, Math.round((pipelineK * (0.3 + rand() * 0.4)) / 5) * 5), owner, p2));
  }
}

// Opportunities for companies that are not (yet) CRM accounts.
OPPS.push(
  { id: "o7", name: "Business checking & payroll services", acct: null, account: "Brightwater Dental Group", stage: "Underwriting", amount: 320, close: "Nov 06, 2026", closeTs: parseLong("Nov 06, 2026"), closeMonth: "Nov 2026", owner: "Jordan Hayes", product: "Business checking" },
  { id: "o8", name: "Line of credit renewal", acct: null, account: "Orchard Row Farm Market", stage: "Funded", amount: 145, close: "Oct 08, 2026", closeTs: parseLong("Oct 08, 2026"), closeMonth: "Oct 2026", owner: "Priya Raman", product: "Commercial lending" },
  { id: "o9", name: "Merchant services add-on", acct: null, account: "Brightwater Dental Group", stage: "Funded", amount: 210, close: "Sep 17, 2026", closeTs: parseLong("Sep 17, 2026"), closeMonth: "Sep 2026", owner: "Sam Okafor", product: "Business checking" }
);
for (let k = 0; k < 40; k++) {
  const industry = weighted(SEGMENT_WEIGHTS);
  const seg = SEGMENTS[industry];
  const product = pick(seg.products);
  const stage = weighted<Stage>([["Prospecting", 20], ["Discovery", 25], ["Proposal", 25], ["Underwriting", 15], ["Funded", 15]]);
  const owner = pick(ownersOf(product === "Trust & investments" ? "Wealth & Trust" : "Business Banking"));
  OPPS.push(mkOpp(`o${oppN++}`, pick(OPP_NAMES[product]), null, generateName(seg), stage, int(10, 90) * 5, owner, product));
}

const ENGAGE_TYPES = ["Opened email", "Viewed rates page", "Attended webinar", "Replied to outreach", "Downloaded guide", "Visited cash management page"];

export const ALL_CONTACTS: CrmContact[] = ACCOUNTS.flatMap((a) =>
  DETAILS[a.id].contacts.map((c) => {
    const clean = c.name.replace("Dr. ", "").toLowerCase().split(" ");
    const engagedDays = int(1, 60);
    return { ...c, accountId: a.id, account: a.name, industry: a.industry, owner: a.owner, email: `${clean[0]}.${clean[clean.length - 1]}@${a.domain}`, engaged: `${pick(ENGAGE_TYPES)} · ${agoText(engagedDays)}`, engagedDays };
  })
);

/** Latest dated activity across every account (Home "Recent activity" feed). */
export const RECENT_FEED = ACCOUNTS.flatMap((a) =>
  DETAILS[a.id].activityItems.slice(0, 2).map((it) => ({ ...it, acct: a.id, account: a.name, owner: a.owner }))
)
  .sort((x, y) => x.ago - y.ago)
  .slice(0, 400);

export const hasNewSignals = (id: string) => DETAILS[id].signals.some((s) => s.date >= isoDate(TODAY_TS - 30 * DAY));
export const ACTIVITY_LABELS = ACTIVITY_LABEL;
