'use client'; 

import React, { useState, useEffect, useRef } from "react";

/* =====================================================================
   CorelDRAW base-site recreation
   Source DOM: coreldraw.com/en/ (Home, Graphics Suite, Special offers,
   Free trials, Learning center, Support) captured 2026-11-12.
   Every section is a reusable, props-driven component so it can be
   mapped 1:1 to CMS content types / Visual Builder elements.
   ===================================================================== */

const BASE = "https://www.coreldraw.com";
/* ---------- Shared types ---------- */
type Pair = [string, string];
type Triple = [string, string, string];
type CtaLink = { label: string; href: string };
type WithClass = { children?: React.ReactNode; className?: string };
type PageKey = "home" | "product" | "offers" | "trials" | "learn" | "support";
type MenuKey = "products" | "resources";
type NavGroup = { title: string; links: Pair[] };
type NavMenu = {
  label: string;
  columns: { groups: NavGroup[] }[];
  feature?: { title: string; href: string; links: Pair[] };
};
type HeaderItem = { key: MenuKey; menu: NavMenu } | { label: string; href: string };
type Customer = { quote: string; name: string; role: string; img?: string };
type ReleaseItem = [title: string, desc: string, href?: string];
type Release = { month: string; items: ReleaseItem[] };
type AppTuple = [name: string, sub: string, desc: string, icon: string, exclusive?: boolean];
type Included = { content: string[]; credits: string[] };
type PlanKey = "annual" | "monthly" | "lifetime";
type Plan = {
  label: string; tag: string; headline: string; blurb: string; save?: string;
  price: string; unit?: string; was?: string; cta: string; href: string;
  promo?: Pair; sub?: boolean;
};
type Tier = {
  name: string; level: string; save: string; href: string; popular?: boolean;
  features: Pair[]; apps: string[];
};
type Offer = {
  name: string; desc: string; save?: string; promo?: string; was?: string;
  price: string; unit?: string; popular?: boolean; href: string; icon: string;
};
type CellValue = boolean | string;
type CompareGroup = { title: string; rows: [string, string, CellValue, CellValue][] };
type Platform = { name: string; note?: string; specs: Pair[] };
type IconCard = { title: string; desc: string; href: string; img?: string; icon?: IconName };
type ContactCard = { icon: IconName; title: string; desc: string; links?: Pair[]; phone?: boolean };

const S = (p: string) => (p.startsWith("http") ? p : BASE + p);

/* ---------- Internal routing (sandbox-safe, state based) ---------- */
const ROUTES: Record<string, PageKey> = {
  "/en/": "home",
  "/en/product/coreldraw/": "product",
  "/en/special-offers/": "offers",
  "/en/free-trials/": "trials",
  "/en/learn/": "learn",
  "/en/support/": "support",
};
const RouterCtx = React.createContext<{ go: (page: PageKey) => void }>({ go: () => {} });

type LinkProps = Omit<React.ComponentPropsWithoutRef<"a">, "href" | "onClick"> & {
  href?: string;
  onClick?: () => void;
};
function Link({ href = "#", className = "", children, onClick, ...rest }: LinkProps) {
  const { go } = React.useContext(RouterCtx);
  const clean = href.split("?")[0];
  if (ROUTES[clean]) {
    return (
      <a href={clean} className={className} onClick={(e) => { e.preventDefault(); onClick?.(); go(ROUTES[clean]); }} {...rest}>
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={(e) => {
        e.preventDefault(); onClick?.();
        const el = document.getElementById(href.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }} {...rest}>{children}</a>
    );
  }
  return (
    <a href={S(href)} target="_blank" rel="noopener noreferrer" className={className} {...rest}>{children}</a>
  );
}

/* ---------- Primitives ---------- */
const PATHS = {
  chevron: "M6 9l6 6 6-6",
  left: "M15 18l-6-6 6-6",
  right: "M9 18l6-6-6-6",
  check: "M5 13l4 4L19 7",
  close: "M6 6l12 12M18 6L6 18",
  menu: "M4 6h16M4 12h16M4 18h16",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zm-9-9h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35",
  phone: "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z",
  chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  ticket: "M4 4h16v16H4zM4 9h16M9 4v16",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  box: "M21 16V8l-9-5-9 5v8l9 5 9-5zM3.3 7L12 12l8.7-5M12 22V12",
  cog: "M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 00-2-1.2L14.5 3h-5l-.4 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 000 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 002 1.2l.4 2.6h5l.4-2.6a7 7 0 002-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM4 19.5A2.5 2.5 0 006.5 22H20v-5",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
};
type IconName = keyof typeof PATHS;
function Icon({ name, className = "w-5 h-5", fill = false }: { name: IconName; className?: string; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

const GRADS = [
  "from-emerald-400 via-teal-500 to-sky-600",
  "from-fuchsia-500 via-purple-500 to-indigo-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-lime-400 via-emerald-500 to-teal-700",
  "from-sky-400 via-blue-500 to-violet-600",
  "from-rose-400 via-pink-500 to-purple-600",
];
function Img({ src, alt = "", className = "", seed = 0 }: { src?: string; alt?: string; className?: string; seed?: number }) {
  const [err, setErr] = useState(!src);
  if (err || !src) {
    return (
      <div className={`bg-gradient-to-br ${GRADS[seed % GRADS.length]} flex items-center justify-center text-white/90 text-xs font-semibold p-3 text-center ${className}`} role="img" aria-label={alt}>
        {alt}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element -- remote mock assets with an onError fallback
  return <img src={S(src)} alt={alt} className={className} onError={() => setErr(true)} loading="lazy" />;
}

function Button({ href, children, variant = "primary", size = "md", className = "" }: {
  href?: string; children?: React.ReactNode; variant?: "primary" | "outline" | "light" | "ghostLight"; size?: "sm" | "md" | "lg"; className?: string;
}) {
  const v = {
    primary: "bg-[#00A94F] hover:bg-[#008C41] text-white border border-[#00A94F]",
    outline: "bg-transparent hover:bg-gray-900 hover:text-white text-gray-900 border border-gray-900",
    light: "bg-white hover:bg-gray-100 text-gray-900 border border-white",
    ghostLight: "bg-transparent hover:bg-white hover:text-gray-900 text-white border border-white",
  }[variant];
  const s = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" }[size];
  return <Link href={href} className={`inline-flex items-center justify-center rounded-full font-semibold transition ${v} ${s} ${className}`}>{children}</Link>;
}

function SectionHeading({ title, sub, center = true, light = false }: { title: React.ReactNode; sub?: React.ReactNode; center?: boolean; light?: boolean }) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl mb-10`}>
      <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${light ? "text-white" : "text-gray-900"}`}>{title}</h2>
      {sub && <p className={`mt-4 text-lg ${light ? "text-gray-300" : "text-gray-600"}`}>{sub}</p>}
    </div>
  );
}
const Container = ({ children, className = "" }: WithClass) => <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
const Badge = ({ children, className = "" }: WithClass) => <span className={`inline-block rounded-full bg-[#00A94F] text-white text-xs font-bold uppercase tracking-wide px-3 py-1 ${className}`}>{children}</span>;

/* ---------- Shared content ---------- */
const NAV: { products: NavMenu; resources: NavMenu; signIn: Pair[] } = {
  products: {
    label: "Products",
    columns: [
      { groups: [
        { title: "For individuals", links: [["CorelDRAW Graphics Suite", "/en/product/coreldraw/"], ["CorelDRAW Standard", "/en/product/coreldraw/standard/"], ["CorelDRAW Essentials", "/en/product/coreldraw/essentials/"], ["CorelDRAW Go", "/en/product/go/"]] },
        { title: "Other products", links: [["AI credit packs", "/en/product/credit-packs/"], ["CorelDRAW VectorPass", "https://vectorpass.coreldraw.com/"]] },
      ] },
      { groups: [
        { title: "For business", links: [["CorelDRAW Graphics Suite – Business", "/en/licensing/business/"], ["CorelDRAW Technical Suite", "/en/product/technical-suite/"]] },
        { title: "For education", links: [["CorelDRAW Graphics Suite – Education", "/en/licensing/education/"], ["CorelDRAW Technical Suite – Education", "/en/product/technical-suite-education/"], ["View all products", "/en/all-products/"]] },
      ] },
    ],
    feature: { title: "Try CorelDRAW for free", href: "/en/free-trials/", links: [["Compare CorelDRAW", "/en/product/family/"], ["Partner Program", "https://www.corel.com/en/partner-program/"], ["Get a quote", "/en/licensing/talk-to-a-specialist/"]] },
  },
  resources: {
    label: "Resources",
    columns: [
      { groups: [{ title: "Resources", links: [["Learning center", "/en/learn/"], ["Events", "/en/events/"], ["Webinars and e-books", "/en/learn/webinars/"], ["Blog", "/en/blog/"], ["CorelDRAW Community", "https://community.coreldraw.com/"], ["CorelDRAW Go Community", "https://community.go.corel.com/"], ["Submit product feedback", "https://coreldraw.ideas.aha.io/"]] }] },
      { groups: [{ title: "Guides", links: [["Guide to vector design", "/en/learn/guide-to-vector-design/"], ["Guide to AI design", "/en/learn/guide-to-ai-design/"], ["How-to guides", "/en/learn/how-to/"], ["Tutorials", "/en/learn/tutorials/"]] }] },
      { groups: [{ title: "Customer stories", links: [["Creating specialized sign-making tools", "/en/pages/customer-stories/yellotools/"], ["Designing custom vinyl graphics", "/en/pages/customer-stories/rage-designs/"], ["Illustrating for technical documentation", "/en/pages/customer-stories/hauni/"], ["Designing metal cut signs", "/en/pages/customer-stories/joe-diaz-barn-quilts/"], ["View all customer stories →", "/en/pages/customer-stories/"]] }] },
    ],
  },
  signIn: [["My account", "https://myaccount.corel.com"], ["CorelDRAW Web", "https://web.coreldraw.com/"], ["CorelDRAW Go", "https://go.coreldraw.com/"]],
};

const CUSTOMERS: Customer[] = [
  { quote: "As the world's largest supplier of specialized sign-making tools, Yellotools uses CorelDRAW to design innovative, time-saving solutions to common industry problems.", name: "Yellotools", role: "Tool manufacturer for sign makers, Germany", img: "/static/cdgs/product_content/cdgs/2026/featured-customer/yellowtools.png" },
  { quote: "Based in Stockholm, Stefan relies on Corel PHOTO-PAINT to create impressive illustrations for editorial clients, ad agencies, and publishers.", name: "Stefan Lindblad", role: "Illustrator and graphic artist, Sweden", img: "/static/cdgs/product_content/cdgs/2026/featured-customer/stefan-lindblad.png" },
  { quote: "Bitsy & Company creates graphic novels that inspire and challenge cultural roots. They bring their stories to life by using CorelDRAW for character creation and layout.", name: "Bitsy & Company", role: "Web comics and graphic novels, USA", img: "/static/cdgs/product_content/cdgs/2026/featured-customer/bitsy.png" },
  { quote: "Fahnen Eibl, a Bavaria-based company, uses their craftsmanship and CorelDRAW’s production technology to create all kinds of high-quality flags.", name: "Kunststickerei Eibl GmbH", role: "Flag production and artistic embroidery, Germany" },
  { quote: "See how TMS Inc., an industry leader in custom signage solutions, uses CorelDRAW Graphics Suite to serve the printing needs of some of the largest Fortune 100 and 200 companies in North America.", name: "TMS Print Systems", role: "Point of Purchase and Point of Sale printer, USA" },
  { quote: "Learn how Ina, aka sewingmachina, uses CorelDRAW Graphics Suite to design digital sewing patterns.", name: "Sewingmachina", role: "Apparel and textiles, Germany" },
  { quote: "See how Wunschleder uses CorelDRAW Graphics Suite to create laser-cut designs and patterns.", name: "Wunschleder", role: "Leatherwork and accessories company, Germany" },
];
const LOGOS: Pair[] = [["telefonica", "Telefonica"], ["unilever", "Unilever"], ["daimler", "Daimler"], ["pertrobras", "Petrobras"], ["abbott", "Abbott"], ["glencore", "Glencore"], ["pfizer", "Pfizer"]];
const AWARDS: Triple[] = [
  ["/static/cdgs/product_content/cdgs/2025/g2-leader-fall-2024.png", "G2 Vector Graphics – Leader", "G2 Vector Graphics"],
  ["/static/cdgs/product_content/cdgs/2025/g2-momentum-2024.png", "G2 Vector Graphics – Momentum Leader", "G2 Vector Graphics"],
  ["/static/cdgs/product_content/cdgs/2025/g2-sb-2024.png", "G2 Vector Graphics – Leader Small Business", "G2 Vector Graphics"],
  ["/static/cdgs/product_content/cdgs/2025/g2-leader-2024.png", "G2 Photo Editing – Leader", "G2 Photo Editing"],
  ["/static/cdgs/product_content/cdgs/2025/g2-high-performer-2024.png", "G2 Photo Editing – High Performer", "G2 Photo Editing"],
  ["/static/cdgs/product_content/cdgs/2024/g2-photo-editing-easiest-admin-summer-2024.png", "G2 Photo Editing – Easiest Admin", "G2 Photo Editing"],
  ["/static/cdgs/product_content/cdgs/2025/g2-leader-sb-2024.png", "G2 Photo Editing – Leader Small Business", "G2 Photo Editing"],
];
const TRY_CARDS: Pair[] = [
  ["Text-to-vector AI", "/dl/ttvpp/"], ["AI background removal", "/dl/bgmp/"], ["Text-to-image AI", "/dl/aigmp/"], ["Start with a template", "/dl/swttp/"],
  ["Turn an image into vector", "/dl/pttp/"], ["Try pixel-based brushes", "/dl/pbttp/"], ["Try Focus Mode", "/dl/fmtp/"], ["Make a sticker", "/dl/cstp/"],
  ["Create an icon", "/dl/citp/"], ["Design a greeting card", "/dl/gctp/"], ["Add a block shadow", "/dl/bstp/"],
];
const RELEASES: Release[] = [
  { month: "September 2026", items: [
    ["Text-to-vector AI", "Turn text prompts or existing artwork into editable, scalable vector graphics with generative AI.", "/dl/ttvpp/"],
    ["Enhanced PowerTRACE", "Improved object structure, better color handling, and precise AI-powered background removal deliver cleaner results with fully editable shapes.", "/dl/ptpp/"],
    ["Upload fonts in CorelDRAW Web", "Upload and use custom, brand, and system fonts in CorelDRAW Web, a subscriber exclusive."],
    ["DWG and DXF export in CorelDRAW Web", "Subscribers can export DWG and DXF files directly from the browser for production-ready output."],
    ["Enhanced stability and performance", "Work faster and more reliably with ongoing performance improvements and smoother handling of complex files."],
  ] },
  { month: "March 2026", items: [
    ["Text-to-image AI", "Create original AI-generated images from text prompts using leading AI models, styles, and color palettes.", "/dl/aigpp/"],
    ["AI image remixing", "Reimagine existing images with prompt-based photo editing and visual remixing."],
    ["AI background removal", "Remove image backgrounds in one click with clean results, even around fine details.", "/dl/bgpp/"],
    ["AI masking", "Create precise masks with intelligent subject selection and clip masking."],
    ["Quality and performance improvements", "App launch times around three times faster, plus smoother workflows and fewer interruptions."],
    ["Modernized UI", "A refreshed, more intuitive user interface with improved navigation and refined controls."],
    ["CorelDRAW Web updates", "Improved performance and usability, plus new AI tools."],
    ["More content", "Additional subscriber-exclusive brushes and templates."],
  ] },
];
const APPS: AppTuple[] = [
  ["CorelDRAW®", "Vector illustration and page layout", "Create anything and everything with this powerful, full-featured software for graphic design, including vector illustration, page layout, and more.", "/static/cdgs/product_content/cdgs/2026/icon-coreldraw.png"],
  ["Corel PHOTO-PAINT™", "Image editing and pixel-based design", "Process images in high gear with the robust AI-powered Corel PHOTO-PAINT. Enjoy an integrated workflow with CorelDRAW.", "/static/cdgs/product_content/cdgs/2026/icon-photo-paint.png"],
  ["Corel® Font Manager", "Font exploration and management", "Organize and manage your font library with the simple, yet intuitive, Corel Font Manager. Use your favorite fonts without having to install them.", "/static/cdgs/product_content/cdgs/2026/icon-font-manager.png"],
  ["CorelDRAW® Web", "Browser-based vector illustration and graphic design", "Design on the go with CorelDRAW Web. Save your projects to the cloud and access them online, from any web browser.", "/static/cdgs/product_content/cdgs/2026/icon-cdgs-web.png", true],
];
const INCLUDED: Included = {
  content: ["7,000 clipart, digital images, and vehicle wrap templates", "1,000 high-resolution digital photos", "Over 1,000 TrueType and OpenType fonts plus integrated access to over 1,700 Google Fonts families", "Over 200 professionally designed templates (plus 600+ additional templates for subscribers)", "Over 600 fountain, vector and bitmap fills", "Integrated access to Pantone® Color Libraries at no additional cost", "Over 100 Painterly brushes (plus 150 additional free brushes for subscribers)"],
  credits: ["Subscription: 2,000/month", "One-time purchase: 2,000 (one-time)"],
};
const RATINGS: Triple[] = [["Capterra", "4.5/5", "https://www.capterra.com/p/124823/CorelDRAW/"], ["G2", "4.3/5", "https://www.g2.com/products/coreldraw/reviews"], ["SourceForge", "4.5/5", "https://sourceforge.net/software/product/CorelDRAW/"]];

/* =====================================================================
   GLOBAL LAYOUT COMPONENTS
   ===================================================================== */
function PromoBar({ text = "Black Friday starts early -", highlight = "up to 30% off", cta = "See offers", href = "/en/special-offers/" }: { text?: string; highlight?: string; cta?: string; href?: string }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-black text-white text-sm">
      <Container className="flex items-center justify-center gap-3 py-2 relative">
        <Link href={href} className="hover:underline">
          {text} <span className="font-bold text-[#3DDC84]">{highlight}</span> <span className="ml-2 underline font-semibold">{cta}</span>
        </Link>
        <button onClick={() => setOpen(false)} className="absolute right-4 opacity-70 hover:opacity-100" aria-label="Dismiss"><Icon name="close" className="w-4 h-4" /></button>
      </Container>
    </div>
  );
}

function MegaMenu({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-gray-100 z-40">
      <Container className="py-8 grid gap-8 md:grid-cols-4">
        {menu.columns.map((col, i) => (
          <div key={i} className="space-y-6">
            {col.groups.map((g) => (
              <div key={g.title}>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{g.title}</div>
                <ul className="space-y-2">
                  {g.links.map(([l, h]) => (
                    <li key={l}><Link href={h} onClick={onNavigate} className="text-gray-800 hover:text-[#00A94F] text-[15px]">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
        {menu.feature && (
          <div className="md:col-span-2 lg:col-span-2 grid gap-4">
            <Link href={menu.feature.href} onClick={onNavigate} className="rounded-2xl bg-gradient-to-br from-[#00A94F] to-emerald-800 text-white p-6 flex items-end min-h-[140px] hover:opacity-95">
              <span className="text-xl font-bold">{menu.feature.title} →</span>
            </Link>
            <ul className="space-y-2">
              {menu.feature.links.map(([l, h]) => (
                <li key={l}><Link href={h} onClick={onNavigate} className="text-gray-800 hover:text-[#00A94F] font-medium">{l}</Link></li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState<MenuKey | "signin" | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSub, setMobileSub] = useState<MenuKey | null>(null);
  const close = () => { setOpen(null); setMobile(false); };
  const items: HeaderItem[] = [
    { key: "products", menu: NAV.products },
    { label: "Special offers", href: "/en/special-offers/" },
    { label: "Free trials", href: "/en/free-trials/" },
    { key: "resources", menu: NAV.resources },
    { label: "Support", href: "/en/support/" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200" onMouseLeave={() => setOpen(null)}>
      <Container className="flex items-center h-16 gap-6">
        <button className="lg:hidden" onClick={() => setMobile(!mobile)} aria-label="Toggle navigation"><Icon name={mobile ? "close" : "menu"} className="w-6 h-6" /></button>
        <Link href="/en/" onClick={close} className="flex items-center"><Img src="/static/cdgs/images/coreldraw-wordmark-color.png" alt="CorelDRAW" className="h-7 w-auto" /></Link>
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {items.map((it) => "menu" in it ? (
            <button key={it.key} onMouseEnter={() => setOpen(it.key)} onClick={() => setOpen(open === it.key ? null : it.key)} className={`flex items-center gap-1 px-3 py-5 text-[15px] font-medium ${open === it.key ? "text-[#00A94F]" : "text-gray-800"} hover:text-[#00A94F]`}>
              {it.menu.label} <Icon name="chevron" className={`w-4 h-4 transition ${open === it.key ? "rotate-180" : ""}`} />
            </button>
          ) : (
            <Link key={it.label} href={it.href} onClick={close} className="px-3 py-5 text-[15px] font-medium text-gray-800 hover:text-[#00A94F]" onMouseEnter={() => setOpen(null)}>{it.label}</Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <div className="relative" onMouseEnter={() => setOpen("signin")}>
            <button className="flex items-center gap-2 text-[15px] font-medium text-gray-800 hover:text-[#00A94F] py-5"><Icon name="user" className="w-5 h-5" /> Sign in <Icon name="chevron" className="w-4 h-4" /></button>
            {open === "signin" && (
              <div className="absolute right-0 top-full w-56 bg-white shadow-xl rounded-xl border border-gray-100 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sign in options</div>
                {NAV.signIn.map(([l, h]) => <Link key={l} href={h} className="block py-1.5 text-gray-800 hover:text-[#00A94F]">{l}</Link>)}
              </div>
            )}
          </div>
          <Button href="https://web.coreldraw.com/" size="sm">Launch CorelDRAW Web</Button>
        </div>
      </Container>
      {open && open !== "signin" && <MegaMenu menu={NAV[open]} onNavigate={close} />}
      {mobile && (
        <div className="lg:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto">
          {items.map((it) => "menu" in it ? (
            <div key={it.key} className="border-b border-gray-100">
              <button onClick={() => setMobileSub(mobileSub === it.key ? null : it.key)} className="w-full flex justify-between items-center px-5 py-4 font-medium">{it.menu.label}<Icon name="chevron" className={`w-4 h-4 ${mobileSub === it.key ? "rotate-180" : ""}`} /></button>
              {mobileSub === it.key && (
                <div className="px-5 pb-4 space-y-4">
                  {it.menu.columns.flatMap((c) => c.groups).map((g) => (
                    <div key={g.title}><div className="text-xs font-bold uppercase text-gray-500 mb-1">{g.title}</div>
                      {g.links.map(([l, h]) => <Link key={l} href={h} onClick={close} className="block py-1 text-gray-700">{l}</Link>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={it.label} href={it.href} onClick={close} className="block px-5 py-4 border-b border-gray-100 font-medium">{it.label}</Link>
          ))}
          <div className="p-5 flex flex-col gap-3">
            <Button href="https://myaccount.corel.com" variant="outline">Sign in</Button>
            <Button href="https://web.coreldraw.com/">Launch CorelDRAW Web</Button>
          </div>
        </div>
      )}
    </header>
  );
}

const FOOTER_COLS: NavGroup[] = [
  { title: "Products", links: [["CorelDRAW Graphics Suite", "/en/product/coreldraw/"], ["CorelDRAW Standard", "/en/product/coreldraw/standard/"], ["CorelDRAW Essentials", "/en/product/coreldraw/essentials/"], ["CorelDRAW Go", "/en/product/go/"], ["CorelDRAW Technical Suite", "/en/product/technical-suite/"], ["AI credit packs", "/en/product/credit-packs/"], ["CorelDRAW VectorPass", "https://vectorpass.coreldraw.com/"], ["Special offers", "/en/special-offers/"], ["All products", "/en/all-products/"]] },
  { title: "Quick links", links: [["Business", "/en/licensing/business/"], ["Free trials", "/en/free-trials/"], ["Blog", "/en/blog/"], ["Learning", "/en/learn/"], ["Guide to vector design", "/en/learn/guide-to-vector-design/"], ["Beta programs", "https://www.corel.com/beta/"], ["News", "https://www.corel.com/en/newsroom/"], ["Sitemap", "/en/sitemap/"]] },
  { title: "Support", links: [["Register your product", "https://account.corel.com/accounts/user/registerProduct"], ["Patches & updates", "/en/support/updates/"], ["Returns & refunds", "https://www.corel.com/en/support/orders/"], ["Knowledgebase", "https://support.corel.com/hc/en-us/sections/360003017033-CorelDRAW"], ["Uninstall instructions", "https://support.corel.com/hc/en-us/articles/215822078"], ["Contact", "https://www.corel.com/contact/"], ["CorelDRAW Community", "https://community.coreldraw.com/"], ["Leadership", "https://www.corel.com/leadership/"], ["Careers", "https://www.corel.com/careers/"]] },
  { title: "Legal", links: [["Terms of use", "https://www.corel.com/terms/"], ["Privacy", "https://www.corel.com/privacy/"], ["Cookies", "https://www.corel.com/cookies/"], ["EULA", "https://www.corel.com/eula/"], ["Legal", "https://www.corel.com/legal/"], ["Do not sell/share my information", "https://www.corel.com/privacy/form/"], ["Imprint", "https://www.corel.com/en/imprint/"]] },
];
const LANGS: Pair[] = [["Deutsch", "/de/"], ["English", "/en/"], ["Español", "/la/"], ["Français", "/fr/"], ["Italiano", "/it/"], ["Nederlands", "/nl/"], ["Polski", "/pl/"], ["Português do Brasil", "/br/"], ["Čeština", "/cz/"], ["日本語", "/jp/"], ["简体中文", "/cn/"], ["繁體中文", "/tw/"]];
const SOCIAL: Triple[] = [["Facebook", "https://www.facebook.com/coreldrawgraphicssuite", "f"], ["X", "https://x.com/coreldraw", "𝕏"], ["YouTube", "https://www.youtube.com/user/CorelDRAWchannel", "▶"], ["Instagram", "https://www.instagram.com/coreldrawgraphicssuite/", "◎"], ["Community", "https://community.coreldraw.com/", "✦"]];

function Footer() {
  const [lang, setLang] = useState(false);
  return (
    <footer className="bg-[#0d0f12] text-gray-300">
      <Container className="py-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3 space-y-6">
          <Link href="/en/"><Img src="/static/cdgs/images/coreldraw-wordmark-white.png" alt="CorelDRAW" className="h-7 w-auto" /></Link>
          <ul className="flex gap-3">
            {SOCIAL.map(([n, h, g]) => (
              <li key={n}><Link href={h} aria-label={n} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#00A94F] flex items-center justify-center text-white text-sm font-bold">{g}</Link></li>
            ))}
          </ul>
          <p className="text-sm text-gray-500">Copyright © 2026 Corel Corporation. All rights reserved.</p>
        </div>
        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_COLS.map((c) => (
            <div key={c.title}>
              <div className="text-white font-semibold mb-4">{c.title}</div>
              <ul className="space-y-2 text-sm">{c.links.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>)}</ul>
            </div>
          ))}
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-5 relative">
          <button onClick={() => setLang(!lang)} className="flex items-center gap-2 text-sm hover:text-white"><Icon name="globe" className="w-4 h-4" /> English <Icon name="chevron" className="w-4 h-4" /></button>
          {lang && (
            <ul className="absolute bottom-full mb-2 bg-white text-gray-800 rounded-xl shadow-xl p-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {LANGS.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-[#00A94F]">{l}</Link></li>)}
            </ul>
          )}
        </Container>
      </div>
    </footer>
  );
}

function PromoModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOpen(true), 7000); return () => clearTimeout(t); }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white" aria-label="Close"><Icon name="close" /></button>
        <div className="bg-gradient-to-br from-black via-gray-900 to-emerald-900 text-white p-8">
          <p className="text-xs font-bold tracking-widest text-[#3DDC84]">BLACK FRIDAY SAVINGS</p>
          <p className="text-2xl font-bold mt-2">CorelDRAW Graphics Suite</p>
        </div>
        <div className="p-8 text-center">
          <Badge>Save 30%</Badge>
          <p className="mt-3 text-gray-600">on your first year of the annual plan</p>
          <div className="mt-4 flex items-baseline justify-center gap-3">
            <span className="text-gray-400 line-through">$269.00</span><span className="text-4xl font-bold">$185.00</span><span className="text-gray-500">/year</span>
          </div>
          <Button href="/en/product/coreldraw/" className="mt-6 w-full">Apply discount</Button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   CONTENT BLOCK COMPONENTS (CMS-mappable)
   ===================================================================== */

/* HeroSplit — home hero */
function HeroSplit({ eyebrow, title, body, promo, ctas = [], note, image, credit }: {
  eyebrow?: string; title: string; body: string; promo?: Pair; ctas?: CtaLink[]; note?: string; image?: string; credit?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      <Container className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
        <div>
          {eyebrow && <Badge className="mb-5">{eyebrow}</Badge>}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05]">{title}</h1>
          <p className="mt-5 text-xl text-gray-600 max-w-xl">{body}</p>
          {promo && (
            <div className="mt-6 inline-flex flex-col rounded-xl bg-black text-white px-5 py-3">
              <span className="text-xs font-bold tracking-widest text-[#3DDC84]">{promo[0]}</span><span className="font-semibold">{promo[1]}</span>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            {ctas.map((c, i) => <Button key={c.label} href={c.href} variant={i === 0 ? "primary" : "outline"} size="lg">{c.label}</Button>)}
          </div>
          {note && <p className="mt-4 text-sm text-gray-500">{note}</p>}
        </div>
        <figure className="relative">
          <Img src={image} alt={eyebrow} className="w-full h-auto rounded-2xl min-h-[320px]" seed={1} />
          {credit && <figcaption className="absolute bottom-3 right-3 text-xs bg-black/60 text-white rounded-full px-3 py-1">Artwork: {credit}</figcaption>}
        </figure>
      </Container>
    </section>
  );
}

/* ProductTierCards — "Graphic design options for all skill levels" */
function ProductTierCards({ title, tiers, cta }: { title: string; tiers: Tier[]; cta?: CtaLink }) {
  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeading title={title} />
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <Link key={t.name} href={t.href} className={`group relative flex flex-col rounded-3xl border-2 p-8 transition hover:shadow-xl ${t.popular ? "border-[#00A94F] shadow-lg" : "border-gray-200"}`}>
              {t.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00A94F] text-white text-xs font-bold uppercase px-4 py-1 rounded-full">Most popular</span>}
              <span className="self-start bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md mb-5">{t.save}</span>
              <span className="text-xs font-bold tracking-widest text-gray-500">{t.level}</span>
              <h3 className="text-2xl font-bold mt-1 mb-6 group-hover:text-[#00A94F]">{t.name}</h3>
              <ul className="space-y-3 mb-6">
                {t.features.map(([f, ic]) => (
                  <li key={f} className="flex gap-3 items-start text-gray-700"><Img src={`/static/cdgs/images/icons/${ic}.svg`} alt="" className="w-5 h-5 mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Apps included</p>
              <ul className="text-sm text-gray-700 space-y-1 mb-8 flex-1">
                {t.apps.map((a) => <li key={a}>• {a}{a === "CorelDRAW Web" && <span className="ml-2 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded px-1.5 py-0.5">Subscriber exclusive</span>}</li>)}
              </ul>
              <span className="font-semibold text-[#00A94F] flex items-center gap-1">Learn more <Icon name="right" className="w-4 h-4" /></span>
            </Link>
          ))}
        </div>
        {cta && <div className="text-center mt-10"><Button href={cta.href} variant="outline">{cta.label}</Button></div>}
      </Container>
    </section>
  );
}

/* TestimonialCarousel — "Featured customers" */
function TestimonialCarousel({ title = "Featured customers", items, cta }: { title?: string; items: Customer[]; cta?: CtaLink }) {
  const [i, setI] = useState(0);
  const n = items.length;
  const it = items[i];
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <button onClick={() => setI((i - 1 + n) % n)} className="w-11 h-11 rounded-full border border-gray-300 hover:bg-gray-900 hover:text-white flex items-center justify-center" aria-label="Previous"><Icon name="left" /></button>
            <button onClick={() => setI((i + 1) % n)} className="w-11 h-11 rounded-full border border-gray-300 hover:bg-gray-900 hover:text-white flex items-center justify-center" aria-label="Next"><Icon name="right" /></button>
          </div>
        </div>
        <div className="grid md:grid-cols-5 gap-10 items-center bg-white rounded-3xl p-8 md:p-12 shadow-sm min-h-[300px]">
          <Img src={it.img} alt={it.name} seed={i} className="md:col-span-2 w-full h-64 object-cover rounded-2xl" />
          <div className="md:col-span-3">
            <p className="text-2xl leading-relaxed text-gray-800">“{it.quote}”</p>
            <p className="mt-6 font-bold text-lg">{it.name}</p>
            <p className="text-gray-500">{it.role}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <ul className="flex gap-2">
            {items.map((_, k) => <li key={k}><button onClick={() => setI(k)} className={`h-2.5 rounded-full transition-all ${k === i ? "w-8 bg-[#00A94F]" : "w-2.5 bg-gray-300"}`} aria-label={`Slide ${k + 1}`} /></li>)}
          </ul>
          {cta && <Link href={cta.href} className="font-semibold text-[#00A94F] hover:underline">{cta.label} →</Link>}
        </div>
      </Container>
    </section>
  );
}

/* LogoMarquee — "You're in good company" */
function LogoMarquee({ title, sub, logos }: { title: string; sub?: string; logos: Pair[] }) {
  const doubled = [...logos, ...logos];
  return (
    <section className="py-20 bg-white overflow-hidden">
      <Container><SectionHeading title={title} sub={sub} /></Container>
      <style>{`@keyframes cdmarq{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div className="flex w-max gap-16 items-center" style={{ animation: "cdmarq 30s linear infinite" }}>
        {doubled.map(([f, n], k) => (
          <div key={k} className="h-12 w-36 flex items-center justify-center grayscale opacity-70 hover:opacity-100 hover:grayscale-0">
            <Img src={`/static/cdgs/images/customer-logos/${f}.png`} alt={n} seed={k} className="max-h-12 max-w-full object-contain rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* CtaBanner — full-width call to action */
function CtaBanner({ title, cta, dark = true }: { title: string; cta: CtaLink; dark?: boolean }) {
  return (
    <section className={`${dark ? "bg-gradient-to-r from-black via-gray-900 to-emerald-900" : "bg-emerald-50"} py-16`}>
      <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className={`text-2xl md:text-3xl font-bold max-w-3xl ${dark ? "text-white" : "text-gray-900"}`}>{title}</h2>
        <Button href={cta.href} variant={dark ? "primary" : "outline"} size="lg">{cta.label}</Button>
      </Container>
    </section>
  );
}

/* ProductHero + PurchaseOptions (tabbed pricing) */
const PLANS: Record<PlanKey, Plan> = {
  annual: { label: "Annual Plan", tag: "New in 2026", headline: "$15.42/mo", blurb: "Subscribe and for just $15.42/mo, get the latest version, exclusive apps and features, monthly AI credits, and more.", save: "Save 30%", price: "$185.00", unit: "/year", was: "$269.00", cta: "Subscribe now", href: "https://store.coreldraw.com/1103/purl-CDGSSUBPUREPREM2", promo: ["Black Friday Starts Early", "Save 30% on your first year of the annual plan."], sub: true },
  monthly: { label: "Monthly Plan", tag: "New in 2026", headline: "$39.00/mo", blurb: "Subscribe for $39/mo to access the latest version, exclusive cloud features, and more.", price: "$39.00", unit: "/month", cta: "Subscribe now", href: "https://store.coreldraw.com/1103/purl-CDGSSUBPUREPREM1", sub: true },
  lifetime: { label: "One-Time Purchase", tag: "2026 version", headline: "$379.00", blurb: "Buy it once, own it forever.", save: "Save 30%", price: "$379.00", was: "$549.00", cta: "Buy now", href: "https://store.coreldraw.com/1103/purl-ESDCDGS2026ML", promo: ["Black Friday Starts Early", "Save 30%."] },
};
function PurchaseOptions() {
  const [plan, setPlan] = useState<PlanKey>("annual");
  const p = PLANS[plan];
  return (
    <div id="buy" className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-gray-900">
      <div className="flex justify-between items-center mb-4"><p className="font-bold">Purchase options</p><Link href="/en/pages/upgrade/" className="text-sm text-[#00A94F] hover:underline">Looking to upgrade?</Link></div>
      <ul className="grid grid-cols-3 gap-2 mb-6" role="tablist">
        {(Object.entries(PLANS) as [PlanKey, Plan][]).map(([k, v]) => (
          <li key={k}>
            <button role="tab" aria-selected={plan === k} onClick={() => setPlan(k)} className={`w-full h-full text-left rounded-xl border-2 p-3 transition ${plan === k ? "border-[#00A94F] bg-emerald-50" : "border-gray-200 hover:border-gray-400"}`}>
              <span className="text-[10px] font-bold uppercase text-[#00A94F]">{v.tag}</span>
              <h4 className="font-bold text-sm">{v.label}</h4>
              <p className="text-sm text-gray-600">{v.headline}</p>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-gray-600 mb-4">{p.blurb}</p>
      <div className="flex items-end gap-3 mb-1">
        {p.save && <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">{p.save}</span>}
        <span className="text-4xl font-extrabold">{p.price}</span>{p.unit && <span className="text-gray-500 mb-1">{p.unit}</span>}
        {p.was && <span className="text-gray-400 line-through mb-1">{p.was}</span>}
      </div>
      <p className="text-xs text-gray-400 mb-5">(incl. VAT)</p>
      <Button href={p.href} className="w-full" size="lg">{p.cta}</Button>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm">
        {p.sub && <Link href="#compare" className="text-[#00A94F] hover:underline">Subscription-exclusive features</Link>}
        {p.sub && <Link href="https://account.corel.com/accounts/user/accountSubscriptions" className="text-[#00A94F] hover:underline">Renew subscription</Link>}
        <Link href="/en/licensing/business/" className="text-[#00A94F] hover:underline">Buy for business</Link>
      </div>
      {p.promo && (
        <div className="mt-6 rounded-xl bg-black text-white p-4">
          <span className="text-[10px] font-bold uppercase bg-rose-600 rounded px-2 py-0.5">Ends soon!</span>
          <h4 className="font-bold mt-2">{p.promo[0]}</h4><p className="text-sm text-gray-300">{p.promo[1]}</p>
        </div>
      )}
    </div>
  );
}
function ProductHero() {
  return (
    <section id="prod-hero" className="bg-gradient-to-br from-black via-gray-900 to-emerald-950 text-white">
      <Container className="grid lg:grid-cols-2 gap-12 py-16 lg:py-20 items-start">
        <div>
          <h1>
            <Badge>New</Badge>
            <span className="block text-4xl md:text-5xl font-extrabold mt-4">CorelDRAW Graphics Suite 2026</span>
            <span className="block text-xl md:text-2xl font-medium text-gray-300 mt-3">Professional graphic design software for Windows, Mac, and Web</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300">Fuel your creative fire with professional graphics software—designed to get the job done.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button href="https://web.coreldraw.com/?content=trial" size="lg">Try free for 15 days</Button>
            <Link href="#faq" className="flex items-center gap-1 text-sm text-gray-300">
              {[0, 1, 2, 3].map((k) => <Icon key={k} name="star" fill className="w-4 h-4 text-yellow-400" />)}<Icon name="star" className="w-4 h-4 text-yellow-400" /> <span className="ml-1">(1020)</span>
            </Link>
          </div>
          <div className="mt-10 rounded-2xl border border-white/15 bg-white/5 p-5 max-w-md">
            <div className="text-xs font-bold tracking-widest text-[#3DDC84]">NEW THIS YEAR</div>
            <p className="mt-1 font-semibold">Includes generative AI with Text-to-vector</p>
            <p className="text-sm text-gray-400">Powered by Artist Intelligence™</p>
          </div>
        </div>
        <PurchaseOptions />
      </Container>
    </section>
  );
}

/* StickySubNav — in-page anchor nav */
function StickySubNav({ title, links, cta }: { title: string; links: Pair[]; cta?: CtaLink }) {
  return (
    <nav className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <Container className="flex items-center gap-6 h-14 overflow-x-auto">
        <span className="font-bold whitespace-nowrap">{title}</span>
        <ul className="flex gap-5 text-sm flex-1">
          {links.map(([l, h]) => <li key={l}><Link href={h} className="text-gray-600 hover:text-[#00A94F] whitespace-nowrap">{l}</Link></li>)}
        </ul>
        {cta && <Button href={cta.href} size="sm">{cta.label}</Button>}
      </Container>
    </nav>
  );
}

/* IntroSplit — text + image */
function IntroSplit({ id, title, paragraphs, image, reverse }: { id?: string; title: string; paragraphs: string[]; image?: string; reverse?: boolean }) {
  return (
    <section id={id} className="py-20">
      <Container className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          {paragraphs.map((p, k) => <p key={k} className="text-lg text-gray-600 mb-4">{p}</p>)}
        </div>
        <Img src={image} alt={title} seed={2} className="w-full rounded-2xl shadow-xl min-h-[300px] object-cover" />
      </Container>
    </section>
  );
}

/* AwardsStrip */
function AwardsStrip({ title = "Multi award-winning solution", awards }: { title?: string; awards: Triple[] }) {
  return (
    <section className="py-14 bg-gray-50">
      <Container>
        <h2 className="text-center text-2xl font-bold mb-8">{title}</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {awards.map(([src, alt, cap], k) => (
            <div key={k} className="w-24 text-center">
              <Img src={src} alt={alt} seed={k} className="w-24 h-28 object-contain mx-auto rounded" />
              <p className="text-[11px] text-gray-500 mt-2">{cap}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* AppGrid + IncludedContent collapsible */
function AppGrid({ id = "tools", title, apps, included }: { id?: string; title: string; apps: AppTuple[]; included?: Included }) {
  const [more, setMore] = useState(false);
  return (
    <section id={id} className="py-20">
      <Container>
        <SectionHeading title={title} />
        <div className="grid md:grid-cols-2 gap-6">
          {apps.map(([n, sub, d, icon, exclusive], k) => (
            <div key={n} className="flex gap-5 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
              <Img src={icon} alt={n} seed={k} className="w-16 h-16 rounded-xl shrink-0 object-contain" />
              <div>
                <h4 className="text-xl font-bold">{n}</h4>
                <p className="text-sm font-semibold text-[#00A94F] mb-2">{sub}</p>
                <p className="text-gray-600">{d} {exclusive && <span className="font-semibold text-gray-900">Subscriber exclusive!</span>}</p>
              </div>
            </div>
          ))}
        </div>
        {included && (
          <div className="mt-8 text-center">
            <button onClick={() => setMore(!more)} className="inline-flex items-center gap-2 font-semibold text-[#00A94F]">What else is included <Icon name={more ? "minus" : "plus"} className="w-4 h-4" /></button>
            {more && (
              <div className="mt-6 grid md:grid-cols-3 gap-8 text-left bg-gray-50 rounded-2xl p-8">
                <div className="md:col-span-2"><h4 className="font-bold mb-3">Content</h4><ul className="grid sm:grid-cols-2 gap-2 text-gray-700 text-sm">{included.content.map((c) => <li key={c} className="flex gap-2"><Icon name="check" className="w-4 h-4 text-[#00A94F] mt-0.5 shrink-0" />{c}</li>)}</ul></div>
                <div><h4 className="font-bold mb-3">AI credits</h4><ul className="space-y-2 text-sm text-gray-700">{included.credits.map((c) => <li key={c} className="flex gap-2"><Icon name="check" className="w-4 h-4 text-[#00A94F] mt-0.5" />{c}</li>)}</ul></div>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

/* IndustryGrid — "The sky is the limit!" */
function IndustryGrid({ title, items }: { title: string; items: Pair[] }) {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionHeading title={title} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(([t, d], k) => (
            <div key={t} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
              <Img alt={t} seed={k} className="h-40 w-full" />
              <div className="p-6"><h4 className="font-bold text-lg mb-2">{t}</h4><p className="text-gray-600 text-sm">{d}</p></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* HScroller — generic horizontal carousel with prev/next */
function HScroller({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current && ref.current.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [scrollbar-width:none]">{children}</div>
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-900 hover:text-white flex items-center justify-center" aria-label="Previous"><Icon name="left" /></button>
        <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-900 hover:text-white flex items-center justify-center" aria-label="Next"><Icon name="right" /></button>
      </div>
    </div>
  );
}

/* ReleaseCarousel — "What's new" by release month */
function ReleaseCarousel({ id = "whats-new", title, sub, releases, cta }: { id?: string; title: string; sub?: string; releases: Release[]; cta?: CtaLink }) {
  return (
    <section id={id} className="py-20">
      <Container>
        <SectionHeading title={title} sub={sub} />
        {releases.map((r, ri) => (
          <div key={r.month} className={ri ? "mt-12 pt-12 border-t border-gray-200" : ""}>
            <h3 className="text-xl font-bold mb-6">{r.month}</h3>
            <HScroller>
              {r.items.map(([t, d, h], k) => (
                <div key={t} className="snap-start shrink-0 w-[280px] rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
                  <Img alt={t} seed={k + ri} className="h-40 w-full" />
                  <div className="p-5 flex-1 flex flex-col"><div className="font-bold mb-2">{t}</div><div className="text-sm text-gray-600 flex-1">{d}</div>
                    {h && <Link href={h} className="mt-4 text-sm font-semibold text-[#00A94F]">Try now →</Link>}</div>
                </div>
              ))}
            </HScroller>
          </div>
        ))}
        {cta && <div className="text-center mt-10"><Button href={cta.href} variant="outline">{cta.label}</Button></div>}
      </Container>
    </section>
  );
}

/* FeatureSpotlight — big feature + supporting grid */
function FeatureSpotlight({ title, lead, items }: { title: string; lead: { title: string; body: string }; items: Pair[] }) {
  return (
    <section className="py-20 bg-[#0d0f12] text-white">
      <Container>
        <SectionHeading title={title} light />
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-14">
          <Img alt={lead.title} seed={1} className="w-full h-72 rounded-2xl" />
          <div><h3 className="text-3xl font-bold mb-4">{lead.title}</h3><p className="text-gray-300 text-lg">{lead.body}</p></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(([t, d], k) => (
            <div key={t} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <Img alt={t} seed={k + 2} className="h-36 w-full" />
              <div className="p-5"><div className="font-bold mb-2">{t}</div><div className="text-sm text-gray-400">{d}</div></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* TryCardCarousel — "Start designing with CorelDRAW" */
function TryCardCarousel({ title, cards }: { title: string; cards: Pair[] }) {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionHeading title={title} />
        <HScroller>
          {cards.map(([t, h], k) => (
            <Link key={t} href={h} className="snap-start shrink-0 w-[220px] rounded-2xl bg-white shadow-sm hover:shadow-lg transition overflow-hidden group">
              <Img alt={t} seed={k} className="h-36 w-full" />
              <div className="p-4 flex items-center justify-between"><h3 className="font-semibold group-hover:text-[#00A94F]">{t}</h3><Icon name="right" className="w-4 h-4 text-[#00A94F]" /></div>
            </Link>
          ))}
        </HScroller>
      </Container>
    </section>
  );
}

/* CapabilityGrid — icon tiles */
function CapabilityGrid({ id = "features", title, subtitle, items, slider }: { id?: string; title: string; subtitle?: string; items: Pair[]; slider?: { title: string; items: Pair[] } }) {
  return (
    <section id={id} className="py-20">
      <Container>
        <SectionHeading title={title} />
        {subtitle && <h3 className="text-xl font-bold mb-6">{subtitle}</h3>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(([t, d], k) => (
            <div key={t} className="rounded-2xl border border-gray-200 p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${GRADS[k % GRADS.length]} mb-4`} />
              <h4 className="font-bold text-lg mb-2">{t}</h4><p className="text-gray-600 text-sm">{d}</p>
            </div>
          ))}
        </div>
        {slider && (
          <>
            <h3 className="text-xl font-bold mt-16 mb-6">{slider.title}</h3>
            <HScroller>
              {slider.items.map(([t, d], k) => (
                <div key={t} className="snap-start shrink-0 w-[320px] rounded-2xl bg-gray-50 overflow-hidden">
                  <Img alt={t} seed={k + 3} className="h-44 w-full" />
                  <div className="p-5"><div className="font-bold mb-2">{t}</div><div className="text-sm text-gray-600">{d}</div></div>
                </div>
              ))}
            </HScroller>
          </>
        )}
      </Container>
    </section>
  );
}

/* ComparisonTable — subscription vs one-time */
function ComparisonTable({ id = "compare", title, sub, cols, groups, cta }: { id?: string; title: string; sub?: string; cols: string[]; groups: CompareGroup[]; cta?: CtaLink }) {
  const cell = (v: CellValue) => v === true ? <Icon name="check" className="w-6 h-6 text-[#00A94F] mx-auto" /> : v === false ? <span className="text-gray-300">—</span> : <span className="text-sm text-gray-700">{v}</span>;
  return (
    <section id={id} className="py-20 bg-gray-50">
      <Container>
        <SectionHeading title={title} sub={sub} />
        <div className="overflow-x-auto bg-white rounded-3xl shadow-sm">
          <table className="w-full text-left">
            <thead><tr className="border-b border-gray-200"><th className="p-5 w-1/2"><span className="text-sm text-gray-500">CorelDRAW Graphics Suite – Version Comparison Matrix</span></th>{cols.map((c) => <th key={c} className="p-5 text-center text-lg font-bold">{c}</th>)}</tr></thead>
            <tbody>
              {groups.map((g) => (
                <React.Fragment key={g.title}>
                  <tr className="bg-gray-100"><td colSpan={cols.length + 1} className="px-5 py-3 font-bold">{g.title}</td></tr>
                  {g.rows.map(([l, d, a, b]) => (
                    <tr key={l} className="border-b border-gray-100"><td className="p-5"><strong>{l}</strong>{d && <p className="text-sm text-gray-500">{d}</p>}</td><td className="p-5 text-center">{cell(a)}</td><td className="p-5 text-center">{cell(b)}</td></tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {cta && <div className="text-center mt-8"><Button href={cta.href} variant="outline">{cta.label}</Button></div>}
      </Container>
    </section>
  );
}

/* FaqAccordion */
function FaqAccordion({ id = "faq", title = "Frequently asked questions", items }: { id?: string; title?: string; items: [string, string[]][] }) {
  const [open, setOpen] = useState(0);
  return (
    <section id={id} className="py-20">
      <Container className="max-w-4xl">
        <SectionHeading title={title} />
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {items.map(([q, a], k) => (
            <div key={q}>
              <button onClick={() => setOpen(open === k ? -1 : k)} className="w-full flex justify-between items-center py-5 text-left" aria-expanded={open === k}>
                <h3 className="text-lg font-semibold pr-6">{q}</h3><Icon name={open === k ? "minus" : "plus"} className="w-5 h-5 text-[#00A94F] shrink-0" />
              </button>
              {open === k && <div className="pb-6 text-gray-600 space-y-3">{a.map((p, i) => <p key={i}>{p}</p>)}</div>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* TechSpecs */
function TechSpecs({ id = "tech-specs", platforms }: { id?: string; platforms: Platform[] }) {
  return (
    <section id={id} className="py-20 bg-gray-50">
      <Container>
        <SectionHeading title="Tech specs" />
        <div className="grid lg:grid-cols-3 gap-6">
          {platforms.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-1">{p.name}</h3>{p.note && <p className="text-sm text-gray-500 mb-4">{p.note}</p>}
              <ul className="space-y-4 mt-4">{p.specs.map(([h, d]) => <li key={h}><h4 className="text-sm font-bold text-gray-900">{h}</h4><p className="text-sm text-gray-600">{d}</p></li>)}</ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* GalleryGrid */
function GalleryGrid({ title, sub, artists }: { title: string; sub?: string; artists: string[] }) {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={title} sub={sub} />
        <div className="columns-2 md:columns-4 gap-4 [&>*]:mb-4">
          {artists.map((a, k) => (
            <div key={k} className="relative break-inside-avoid rounded-xl overflow-hidden group">
              <Img alt="" seed={k} className={`w-full ${["h-48", "h-64", "h-40", "h-56"][k % 4]}`} />
              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition">{a}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* RatingsBlock — competitive advantage + review scores */
function RatingsBlock({ left }: { left?: { title: string; lead: string; body: string } }) {
  return (
    <section className="py-20 bg-white">
      <Container className="grid lg:grid-cols-2 gap-12">
        {left && <div><h3 className="text-2xl font-bold mb-4">{left.title}</h3><p className="font-semibold mb-3">{left.lead}</p><p className="text-gray-600">{left.body}</p></div>}
        <div className={left ? "" : "lg:col-span-2 text-center"}>
          <h3 className="text-2xl font-bold mb-2">Top-rated by customers</h3>
          <p className="text-gray-600 mb-6">Check out reviews from satisfied graphics pros and design teams around the globe.</p>
          <div className={`grid grid-cols-3 gap-4 ${left ? "" : "max-w-2xl mx-auto"}`}>
            {RATINGS.map(([n, s, h]) => (
              <Link key={n} href={h} className="rounded-2xl border border-gray-200 p-5 text-center hover:shadow-md">
                <div className="font-bold text-gray-500 text-sm">{n}</div><div className="text-3xl font-extrabold my-1">{s.split("/")[0]}</div>
                <div className="flex justify-center">{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" fill className="w-4 h-4 text-yellow-400" />)}</div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* OfferHero + OfferCards — Special offers */
function OfferHero() {
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-emerald-950 text-white">
      <Container className="grid lg:grid-cols-2 gap-12 py-16 items-center">
        <div>
          <p className="text-[#3DDC84] font-bold uppercase tracking-widest text-sm">New</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2">CorelDRAW Graphics Suite</h1>
          <p className="mt-5 text-lg text-gray-300">A complete suite of applications for vector illustration, layout, photo editing, and more on your platform of choice.</p>
          <div className="mt-6 inline-flex flex-col rounded-xl bg-white/10 px-5 py-3"><span className="text-xs font-bold tracking-widest text-[#3DDC84]">BLACK FRIDAY STARTS EARLY</span><span className="font-semibold">Save 30%. Limited-time offer.</span></div>
          <div className="mt-8"><Button href="/en/product/coreldraw/" size="lg">Buy now</Button></div>
        </div>
        <figure className="relative"><Img src="/static/cdgs/images/home/cdgs-2026-hero.png" alt="CorelDRAW Graphics Suite artwork" seed={4} className="w-full rounded-2xl min-h-[280px]" /><figcaption className="absolute bottom-3 right-3 text-xs bg-black/60 rounded-full px-3 py-1">Artwork: Éder Minetto</figcaption></figure>
      </Container>
    </section>
  );
}
function OfferCards({ title, offers }: { title: string; offers: Offer[] }) {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={title} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((o) => (
            <Link key={o.name} href={o.href} className={`relative flex flex-col rounded-3xl border-2 p-6 hover:shadow-xl transition ${o.popular ? "border-[#00A94F]" : "border-gray-200"}`}>
              {o.popular && <span className="absolute -top-3 left-6 bg-[#00A94F] text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</span>}
              <div className="flex justify-between items-start mb-4">
                <Img src={o.icon} alt={o.name} className="w-20 h-20 object-contain rounded-xl" />
                {o.save && <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">{o.save}</span>}
              </div>
              <h4 className="text-lg font-bold">{o.name}</h4>
              <p className="text-sm text-gray-600 mt-1 flex-1">{o.desc}</p>
              {o.promo && <p className="text-sm mt-3 text-rose-700 font-semibold">{o.promo}</p>}
              <div className="mt-5">
                {o.was && <span className="text-gray-400 line-through text-sm">{o.was}</span>}
                <div className="flex items-baseline gap-1"><span className="text-3xl font-extrabold">{o.price}</span>{o.unit && <span className="text-gray-500">{o.unit}</span>}</div>
                <span className="text-xs text-gray-400">(incl. VAT)</span>
              </div>
              <span className="mt-5 inline-flex justify-center rounded-full bg-[#00A94F] text-white font-semibold py-2.5">Buy now</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* TrialSignupForm — Free trials hero */
function TrialHero() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-gradient-to-b from-emerald-50 to-white">
      <Container className="grid lg:grid-cols-2 gap-12 py-16 lg:py-24 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Try CorelDRAW free for 15 days</h1>
          <p className="mt-5 text-lg text-gray-600">Create vector illustrations, layouts, and more with our professional graphic design software. Start a 15-day free trial, including AI credits to explore artificial intelligence-powered image generation and modification.</p>
          <div className="mt-8 flex items-center gap-5"><Button href="https://web.coreldraw.com/?content=trial" size="lg">Try free</Button><span className="text-sm text-gray-500">No credit card required! <Link href="/en/product/coreldraw/" className="text-[#00A94F] font-semibold">Learn more</Link></span></div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {sent ? (
            <div className="text-center py-8"><h4 className="text-2xl font-bold">You&apos;re close!</h4><p className="text-gray-600 mt-3">We’ve emailed you the trial, so it’s all set for you to access the next time you’re on your computer.</p></div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }} className="space-y-5">
              <p className="font-semibold">Enter your email address to access your trial and get started.</p>
              <label className="block"><span className="text-sm font-medium">Email Address <span className="text-rose-600">*</span></span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A94F]" placeholder="you@example.com" /></label>
              <label className="flex gap-3 text-xs text-gray-500"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
                <span>I agree that the companies of Corel Corporation or local business partners can contact me regarding the products, services, and events provided by Corel Corporation. I can withdraw my consent at any time. By submitting this form, I agree to the Corel Corporation Privacy Statement.</span></label>
              <button type="submit" className="w-full rounded-full bg-[#00A94F] hover:bg-[#008C41] text-white font-semibold py-3 flex items-center justify-center gap-2"><Icon name="download" className="w-5 h-5" /> Download</button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}

/* IncludedApps — "What's included" (trials page) */
function IncludedApps({ title, primary, also, included }: {
  title: string;
  primary: { name: string; sub: string; desc: string; icon: string; bullets: string[] };
  also: [name: string, desc: string, icon: string, exclusive?: boolean][];
  included: Included;
}) {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionHeading title={title} />
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 flex gap-6">
            <Img src={primary.icon} alt={primary.name} className="w-20 h-20 rounded-xl shrink-0 object-contain" />
            <div><h3 className="text-2xl font-bold">{primary.name}</h3><p className="text-[#00A94F] font-semibold">{primary.sub}</p><p className="text-gray-600 mt-3">{primary.desc}</p>
              <ul className="mt-4 space-y-2">{primary.bullets.map((b) => <li key={b} className="flex gap-2 text-gray-700"><Icon name="check" className="w-5 h-5 text-[#00A94F]" />{b}</li>)}</ul></div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-3xl p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Also included</p>
            <ul className="space-y-5">{also.map(([n, d, ic, ex]) => (
              <li key={n} className="flex gap-4 items-center"><Img src={ic} alt={n} className="w-12 h-12 rounded-lg object-contain" /><div><p className="font-bold">{n} {ex && <span className="text-[10px] uppercase bg-emerald-100 text-emerald-800 rounded px-1.5 py-0.5 ml-1">Subscriber exclusive</span>}</p><p className="text-sm text-gray-600">{d}</p></div></li>
            ))}</ul>
          </div>
        </div>
        <AppGridIncluded included={included} />
      </Container>
    </section>
  );
}
function AppGridIncluded({ included }: { included: Included }) {
  const [more, setMore] = useState(false);
  return (
    <div className="mt-8 text-center">
      <button onClick={() => setMore(!more)} className="inline-flex items-center gap-2 font-semibold text-[#00A94F]">What else is included <Icon name={more ? "minus" : "plus"} className="w-4 h-4" /></button>
      {more && (
        <div className="mt-6 grid md:grid-cols-3 gap-8 text-left bg-white rounded-2xl p-8">
          <div className="md:col-span-2"><h4 className="font-bold mb-3">Content</h4><ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">{included.content.map((c) => <li key={c}>• {c}</li>)}</ul></div>
          <div><h4 className="font-bold mb-3">AI credits</h4><ul className="text-sm text-gray-700 space-y-2">{included.credits.map((c) => <li key={c}>• {c}</li>)}</ul></div>
        </div>
      )}
    </div>
  );
}

/* SplitCta — browser trial */
function SplitCta({ title, cta, note, secondary }: { title: string; cta: CtaLink; note: string; secondary: CtaLink & { lead: string } }) {
  return (
    <section className="py-20">
      <Container className="grid lg:grid-cols-2 gap-12 items-center">
        <Img alt="CorelDRAW in your browser" seed={4} className="w-full h-72 rounded-3xl" />
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="mt-6"><Button href={cta.href} size="lg">{cta.label}</Button></div>
          <p className="text-sm text-gray-500 mt-4">{note}</p>
          <hr className="my-6" />
          <p><b>{secondary.lead}</b> <Link href={secondary.href} className="text-[#00A94F] font-semibold hover:underline">{secondary.label}</Link> on Windows or Mac.</p>
        </div>
      </Container>
    </section>
  );
}

/* SectionSubNav — Learning center local nav */
function SectionSubNav({ title, href, links }: { title: string; href: string; links: Pair[] }) {
  return (
    <nav className="bg-gray-900 text-white">
      <Container className="flex items-center gap-8 h-12 overflow-x-auto text-sm">
        <Link href={href} className="font-bold whitespace-nowrap">{title}</Link>
        <ul className="flex gap-6">{links.map(([l, h]) => <li key={l}><Link href={h} className="text-gray-300 hover:text-white whitespace-nowrap">{l}</Link></li>)}</ul>
      </Container>
    </nav>
  );
}

/* PageBanner — simple centered hero */
function PageBanner({ title, body, dark = true }: { title: string; body?: string; dark?: boolean }) {
  return (
    <section className={`${dark ? "bg-gradient-to-br from-black via-gray-900 to-emerald-950 text-white" : "bg-emerald-50"} py-20`}>
      <Container className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold">{title}</h1>
        {body && <p className={`mt-5 text-lg ${dark ? "text-gray-300" : "text-gray-600"}`}>{body}</p>}
      </Container>
    </section>
  );
}

/* IconLinkCards — Learning tiles / Support tiles */
function IconLinkCards({ items, cols = 4, overlap = false }: { items: IconCard[]; cols?: 4 | 5; overlap?: boolean }) {
  return (
    <section className={overlap ? "-mt-12 relative z-10" : "py-16"}>
      <Container>
        <div className={`grid sm:grid-cols-2 ${cols === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-5`}>
          {items.map((it, k) => (
            <Link key={it.title} href={it.href} className="group bg-white rounded-2xl shadow-lg p-6 hover:-translate-y-1 transition border border-gray-100">
              {it.img ? <Img src={it.img} alt={it.title} seed={k} className="w-12 h-12 mb-4 rounded" /> : <span className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00A94F] flex items-center justify-center mb-4">{it.icon && <Icon name={it.icon} className="w-6 h-6" />}</span>}
              <h3 className="font-bold text-lg group-hover:text-[#00A94F]">{it.title}</h3><p className="text-sm text-gray-600 mt-1">{it.desc}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* InspireCards — Learning "Get inspired" */
function InspireCards({ title, items }: { title: string; items: [string, string, string, string, string][] }) {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionHeading title={title} />
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(([t, d, cta, h, ic], k) => (
            <div key={t} className="bg-white rounded-2xl p-6 flex gap-4">
              <Img src={ic} alt={t} seed={k} className="w-12 h-12 shrink-0 rounded" />
              <div><h4 className="font-bold text-lg">{t}</h4><p className="text-sm text-gray-600 my-2">{d}</p><Link href={h} className="text-sm font-semibold text-[#00A94F] hover:underline">{cta} →</Link></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* SupportSearch */
function SupportSearch() {
  const [q, setQ] = useState("");
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-emerald-950 text-white pt-20 pb-24">
      <Container className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold">Welcome to CorelDRAW support</h1>
        <p className="mt-4 text-gray-300">Click below for frequently asked questions, documentation and other helpful tools to get the answers you need.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (q) window.open(`https://support.corel.com/hc/en-us/search?query=${encodeURIComponent(q)}`, "_blank", "noopener"); }} className="mt-8 flex bg-white rounded-full p-1.5 shadow-xl">
          <span className="pl-4 flex items-center text-gray-400"><Icon name="search" /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search support articles…" className="flex-1 px-3 py-3 text-gray-900 rounded-full focus:outline-none" />
          <button className="rounded-full bg-[#00A94F] px-6 font-semibold">Search</button>
        </form>
      </Container>
    </section>
  );
}

/* Announcements */
function Announcements({ items }: { items: Pair[] }) {
  return (
    <section className="py-12">
      <Container>
        <div className="rounded-2xl border-l-4 border-[#00A94F] bg-emerald-50 p-6">
          <h3 className="font-bold text-lg mb-3">Announcements</h3>
          <ul className="space-y-2">{items.map(([l, h]) => <li key={l}><Link href={h} className="text-gray-800 hover:text-[#00A94F] hover:underline">{l}</Link></li>)}</ul>
        </div>
      </Container>
    </section>
  );
}

/* ContactOptions + PhoneDirectory */
function ContactOptions() {
  const [phones, setPhones] = useState(false);
  const regions: [string, Pair[]][] = [
    ["North America", [["United States", "1-844-759-9903"], ["Canada", "1-866-341-0059"]]],
    ["Europe", [["United Kingdom", "+44 808 189 9383"], ["France", "+33 805 08 0202"], ["Germany", "+49 800 000 1399"], ["Rest of Europe", "+44 808 189 9383"]]],
    ["Other", [["Middle East", "+44 808 189 9383"], ["South Africa", "+44 808 189 9383"]]],
  ];
  const cards: ContactCard[] = [
    { icon: "users", title: "CorelDRAW Communities", desc: "Meet, share and learn from other users in our online communities.", links: [["CorelDRAW", "https://community.coreldraw.com/"], ["CorelDRAW Go", "https://community.go.corel.com/"]] },
    { icon: "ticket", title: "Create Support ticket", desc: "Email us and receive a response within 24 hours", links: [["Submit a ticket", "https://support.corel.com/hc/en-us/requests/new"]] },
    { icon: "chat", title: "Chat", desc: "Start a chat session with a Corel agent", links: [["Start Chat", "https://www.corel.com/contact/"]] },
    { icon: "phone", title: "Call", desc: "1-844-759-9903", phone: true },
  ];
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <div key={c.title} className="bg-white rounded-2xl p-6">
              <span className="w-11 h-11 rounded-xl bg-emerald-50 text-[#00A94F] flex items-center justify-center mb-4"><Icon name={c.icon} /></span>
              <h4 className="font-bold">{c.title}</h4>
              {c.phone ? <a href="tel:18447599903" className="block text-lg font-semibold mt-1">{c.desc}</a> : <p className="text-sm text-gray-600 mt-1">{c.desc}</p>}
              <div className="mt-3 flex flex-col gap-1 text-sm">
                {c.links && c.links.map(([l, h]) => <Link key={l} href={h} className="font-semibold text-[#00A94F] hover:underline">{l}</Link>)}
                {c.phone && <button onClick={() => setPhones(!phones)} className="text-left font-semibold text-[#00A94F]">International numbers {phones ? "▴" : "▾"}</button>}
              </div>
            </div>
          ))}
        </div>
        {phones && (
          <div id="phone-list" className="mt-6 grid md:grid-cols-3 gap-5 bg-white rounded-2xl p-6">
            {regions.map(([r, list]) => (
              <div key={r}><h5 className="font-bold mb-2">{r}</h5><ul className="text-sm space-y-1">{list.map(([c, n]) => <li key={c} className="flex justify-between gap-4"><span className="text-gray-600">{c}</span><span className="font-medium">{n}</span></li>)}</ul></div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

/* =====================================================================
   PAGE TEMPLATES
   ===================================================================== */
function HomePage() {
  return (
    <>
      <HeroSplit
        eyebrow="NEW! CorelDRAW Graphics Suite 2026"
        title="Professional graphic design software"
        body="Powerful tools for vector illustration, layout, photo editing, and typography."
        promo={["BLACK FRIDAY STARTS EARLY", "Save 30%. Limited-time offer."]}
        ctas={[{ label: "Try free", href: "https://web.coreldraw.com/?content=trial" }, { label: "Buy now", href: "/en/product/coreldraw/" }]}
        note="Available for Windows, Mac, and Web"
        image="/static/cdgs/images/home/cdgs-2026-hero.png"
        credit="Éder Minetto"
      />
      <ProductTierCards
        title="Graphic design options for all skill levels"
        cta={{ label: "Help me decide", href: "/en/product/family/" }}
        tiers={[
          { name: "CorelDRAW Go", level: "QUICK & EASY", save: "Save 30%", href: "/en/product/go/", features: [["Beginner-friendly design app", "icon-wand-sparkles"], ["Templates, assets, and easy vector tools", "icon-table-pivot"], ["Great for quick, one-off projects", "icon-bolt"]], apps: ["CorelDRAW Go"] },
          { name: "CorelDRAW Standard", level: "ADVANCED", save: "Save $45", href: "/en/product/coreldraw/standard/", features: [["For enthusiasts and home businesses", "icon-house-heart"], ["Vector illustration plus photo editing", "icon-bezier-curve"], ["Great for logos and signage", "icon-sign-hanging"]], apps: ["CorelDRAW Standard", "Corel PHOTO-PAINT Standard"] },
          { name: "CorelDRAW Graphics Suite", level: "PROFESSIONAL", save: "Save 30%", popular: true, href: "/en/product/coreldraw/", features: [["Built for Windows, Mac, and web", "icon-laptop-mobile"], ["Vector layout, photo editing, and type tools", "icon-grid"], ["Great for professional design work", "icon-swatchbook-blue"]], apps: ["CorelDRAW", "CorelDRAW Web", "Corel PHOTO-PAINT", "Corel Font Manager"] },
        ]}
      />
      <TestimonialCarousel items={CUSTOMERS} cta={{ label: "Customer stories", href: "/en/pages/customer-stories/" }} />
      <LogoMarquee title="You’re in good company" sub="Join millions of users across thousands of global organizations who use CorelDRAW." logos={LOGOS} />
      <CtaBanner title="Test drive CorelDRAW for FREE, no credit card required!" cta={{ label: "Learn more", href: "/en/free-trials/" }} />
    </>
  );
}

function ProductPage() {
  return (
    <>
      <ProductHero />
      <StickySubNav title="CorelDRAW Graphics Suite" links={[["Overview", "#prod-hero"], ["What's New", "#whats-new"], ["Features", "#features"], ["Compare", "#compare"], ["Specs", "#tech-specs"], ["FAQ", "#faq"]]} cta={{ label: "Buy now", href: "#prod-hero" }} />
      <IntroSplit title="Creativity meets productivity" image="/static/cdgs/product_content/cdgs/2026/creativity-meets-productivity.png" paragraphs={["CorelDRAW® Graphics Suite is your fully loaded, professional design toolkit for delivering breathtaking vector illustration, layout, photo editing, and typography projects with total efficiency.", "A budget-friendly subscription provides ongoing value with instant access to exclusive apps, features, content, AI credits, and support for the latest technologies."]} />
      <AwardsStrip awards={AWARDS} />
      <AppGrid title="All the tools you need to tackle any project" apps={APPS} included={INCLUDED} />
      <IndustryGrid title="The sky is the limit!" items={[
        ["Branding and marketing", "From creative professionals in advertising and publishing to small businesses producing in-house marketing materials, create everything from brand identity assets to alluring sales tools."],
        ["Signage and large-format printing", "Sign and print professionals rely on CorelDRAW to create artwork for a variety of print outputs using a powerful color management engine and superior prepress tools."],
        ["Apparel and textiles", "Screen printing, embroidery, direct-to-garment printing or apparel—CorelDRAW Graphics Suite has the tools to produce and output designs for the fashion industry."],
        ["Retail and e-commerce", "Dedicated web and print tools for commerce professionals. Design point-of-sale promotions or create assets to enhance an online store."],
        ["Blueprints, maps, and schematics", "Trusted by engineering, manufacturing, and construction firms for precision tools that create product illustrations, diagrams, schematics, and other technical visuals."],
      ]} />
      <LogoMarquee title="You’re in good company" sub="Join millions of users across thousands of global organizations who use CorelDRAW." logos={LOGOS} />
      <TestimonialCarousel items={CUSTOMERS} cta={{ label: "Customer stories", href: "/en/pages/customer-stories/" }} />
      <RatingsBlock left={{ title: "Our competitive advantage", lead: "Enjoy all-in-one design and layout, a native OS experience, flexible purchasing options, free integrated Pantone® colors, and so much more.", body: "Easy to learn and packed with unique features, CorelDRAW Graphics Suite is a powerful alternative to comparable graphic design software. With a no obligation trial and a subscription that’s significantly more affordable than the leading competition, CorelDRAW is an excellent choice for artists and designers." }} />
      <ReleaseCarousel title="What’s new in CorelDRAW Graphics Suite 2026?" sub="Powered by Artist Intelligence™" releases={RELEASES} cta={{ label: "Compare purchase options", href: "/en/product/coreldraw/compare/" }} />
      <FeatureSpotlight title="Accelerate your ideas with intelligent design tools"
        lead={{ title: "Generate vectors with AI", body: "Transform ideas into editable, scalable vectors in seconds with the new Text-to-vector feature in CorelDRAW's AI Generate docker. Explore directions with text prompts, or generate vectors from existing artwork to quickly create variations—while staying fully in control." }}
        items={[["Generate images with AI", "Create unique AI-generated bitmaps from scratch or existing content in CorelDRAW and Corel PHOTO-PAINT."], ["Remix images with AI", "Quickly edit and transform images using Nano Banana, a powerful AI model for near-instant photo edits."], ["Remove backgrounds with AI", "One-click AI background removal with clean results, even around fine details like hair and fabric."], ["Mask photos with AI", "AI-assisted subject selection and clip masking in Corel PHOTO-PAINT for faster, more accurate masking."]]} />
      <TryCardCarousel title="Start designing with CorelDRAW" cards={TRY_CARDS} />
      <CapabilityGrid title="Professional design tools at your fingertips" subtitle="Core capabilities"
        items={[["Vector illustration", "Turn basic lines and shapes into complex works of art with versatile shaping and drawing tools, plus Contour, Envelope, Blend, Mesh Fill, and more."], ["Page layout", "Create layouts for brochures and multi-page documents. Toggle between single page and multipage editing."], ["Typography", "Arrange type beautifully with block shadows, contours, variable font support, fit text to path, and more."], ["Font management", "Organize your font library with Corel Font Manager and access over 1,700 Google Fonts families."], ["Photo editing", "Adjust color and tone, remove imperfections, correct perspective, and more with layer-based tools in Corel PHOTO-PAINT."], ["Artificial intelligence", "Prompt-based generative AI, AI-assisted image masking, and AI background removal at every stage."]]}
        slider={{ title: "What sets CorelDRAW apart", items: [["Design for print or web", "Master color consistency across media. Access Pantone color palettes free of charge."], ["Non-destructive editing", "Apply reversible adjustments and effects to bitmaps and vectors."], ["Bitmap-to-vector tracing", "Exceptional trace results with AI-assisted PowerTRACE."], ["Multipage view", "View, manage, and edit all of your project’s digital assets in one view."], ["Multi-asset export", "Export a customized list of pages and objects with one click."], ["Styles and style sets", "Apply consistent formatting across objects and whole documents."], ["Unparalleled object control", "Hide, rename, search, and reorder every element. Use Focus Mode to edit in isolation."], ["Workspace customization", "Import workspaces or use predefined, industry-specific workspaces and custom shortcuts."], ["Color, fills, and transparencies", "Swatches, color harmonies, patterns, gradients, mesh fills, and more."], ["Extensive file compatibility", "Support for an immense list of graphics, publishing, and image file formats."]] }} />
      <ComparisonTable title="From new features to content, subscribers get more" sub="As a subscriber, you get access to exclusive features, apps, content, and AI credits." cols={["Subscription", "One-time purchase"]}
        groups={[
          { title: "Value, access, and support", rows: [["CorelDRAW Web", "Browser-based vector illustration and graphic design", true, false], ["Latest and greatest", "Instant access to the latest updates as they become available, at no extra cost.", true, false], ["Generative AI credits", "Included credits for prompt-based image creation and editing.", "2,000 monthly credits", "2,000 one-time credits"], ["Exclusive features", "Enjoy exclusive features, apps, and workflows.", true, false], ["Budget-friendly", "Lowest upfront cost and the flexibility to stop paying as needs change.", true, false], ["Ongoing support", "Guaranteed support for the latest operating systems, devices, and technologies.", true, false], ["Product ownership", "Pay once to own and use the software version for as long as you choose.", false, true]] },
          { title: "Tools, features, and content", rows: [["Cloud-based asset management", "", true, false], ["Cloud storage", "", true, false], ["Creative content", "", "150 extra brushes · 600+ extra templates · cloud library", true], ["Layout tools", "", true, true], ["Drawing tools", "", true, true], ["Image editing tools", "", true, true], ["Typography tools", "", true, true], ["Web and print output tools", "", true, true], ["Learning materials", "", true, true]] },
        ]}
        cta={{ label: "See full comparison", href: "/en/product/coreldraw/compare/" }} />
      <FaqAccordion items={[
        ["What is CorelDRAW Graphics Suite?", ["CorelDRAW Graphics Suite is a professional graphic design software solution for Windows, Mac, and web.", "It includes CorelDRAW® (vector illustration and page layout), CorelDRAW® Web (subscriber exclusive), Corel PHOTO-PAINT™ (image editing), Corel® Font Manager, and CAPTURE™ (screen capture)."]],
        ["How much does CorelDRAW Graphics Suite cost?", ["It depends on the purchasing option you choose. We offer both subscription and one-time purchase options. Not sure yet? Try it free for 15 days—no credit card required!"]],
        ["Is CorelDRAW Graphics Suite free?", ["While CorelDRAW Graphics Suite is not a free product, we offer an obligation-free 15-day trial."]],
        ["Can I buy CorelDRAW Graphics Suite without a subscription?", ["Yes. Choose a one-time purchase for perpetual use, or a perpetual license with maintenance—a low-cost annual plan that keeps you eligible for the latest version, exclusive features, and monthly AI credits."]],
        ["Is CorelDRAW Graphics Suite a one-time purchase?", ["Yes, it is available as a one-time purchase for perpetual use. A subscription and a maintenance option for license customers are also offered."]],
        ["Does CorelDRAW have generative AI?", ["Yes! AI Generate turns text descriptions into custom vectors and images in seconds. CorelDRAW Graphics Suite also has one-click AI background removal and AI-powered image masking."]],
        ["What are AI credits?", ["AI credits power CorelDRAW Graphics Suite’s generative AI features. Subscribers and maintenance customers receive a monthly allowance; one-time purchase customers receive a fixed allotment that does not expire."]],
        ["Can I buy more AI credits?", ["Yes. Choose a monthly or annual credit add-on subscription, or a one-time credit pack."]],
        ["Will CorelDRAW use my artwork to train AI?", ["No. Your creative work in CorelDRAW is never used to train our AI features or third-party AI models. Your content remains yours, period."]],
      ]} />
      <TechSpecs platforms={[
        { name: "Windows", specs: [["Operating system", "Windows 11 or Windows 10, 64-bit, with the latest updates"], ["Processor", "Intel Core i3/i5/i7/i9 (7th gen or newer) or AMD Ryzen 3/5/7/9, Threadripper, EPYC"], ["Memory", "8 GB RAM (16 GB or higher recommended)"], ["Storage", "5.5 GB hard disk space"], ["Graphics", "OpenCL 1.2-compatible video card with 3 GB+ VRAM"], ["Display", "1280 x 720 at 100% (1920 x 1080 recommended)"], ["Input", "Mouse, tablet or multi-touch screen"], ["Connectivity", "Internet connection required to install and authenticate"]] },
        { name: "Mac", specs: [["Operating system", "macOS 27 Golden Gate, Tahoe (26), Sequoia (15), or Sonoma (14)"], ["Processor", "Apple Silicon, or multicore Intel with AVX2 support"], ["Memory", "8 GB RAM (16 GB or higher recommended)"], ["Storage", "3 GB available (SSD recommended; case-sensitive file systems not supported)"], ["Graphics", "OpenCL 1.2-compatible video card with 3 GB+ VRAM"], ["Display", "1920 x 1200 screen resolution"], ["Input", "Mouse or tablet"], ["Connectivity", "Internet connection required to install and authenticate"]] },
        { name: "Web", note: "CorelDRAW Web – browser requirements", specs: [["Google Chrome", "Version 142 or higher"], ["Microsoft Edge", "Version 142 or higher"], ["Mozilla Firefox", "Version 145 or higher (limited support; some features such as clipboard may not work)"]] },
      ]} />
      <GalleryGrid title="Graphic design gallery" sub="Find inspiration in our online gallery, featuring images from CorelDRAW artists and designers from around the world." artists={["Maycon Bartowski", "Joseph Diaz", "Tomasz Mroziński", "Bartowski Design", "Five Nine", "Marco Mastrelli", "Samuel Leon", "Rage Designs", "Kseniia Romanova", "Marcin Chamala", "Teody Lanada", "OCTO"]} />
      <CtaBanner title="Push the boundaries of visual communication with CorelDRAW Graphics Suite" cta={{ label: "Try free", href: "https://web.coreldraw.com/?content=trial" }} />
    </>
  );
}

function OffersPage() {
  return (
    <>
      <OfferHero />
      <OfferCards title="Black Friday deals on Graphics products" offers={[
        { name: "CorelDRAW Graphics Suite 365‑day Subscription", desc: "A low cost option to always stay current", save: "Save 30%", promo: "Save 30% on your first year of the annual plan.", was: "$269.00", price: "$185.00", unit: "/year", popular: true, href: "/en/product/coreldraw/", icon: "/static/cdgs/product_content/product-icons/cdgs/cdgs-sub-icon-on-light-250x250.png" },
        { name: "CorelDRAW Technical Suite", desc: "High-impact technical design software to get you from concept to completion", price: "$1,199.00", href: "/en/product/technical-suite/", icon: "/static/cdgs/product_content/product-icons/cdgs/CDTS-balloon-on-white.png" },
        { name: "CorelDRAW Standard", desc: "Graphic design for enthusiasts and home businesses", save: "Save $45", promo: "Save $45.", was: "$299.00", price: "$254.00", href: "/en/product/coreldraw/standard/", icon: "/static/cdgs/product_content/product-icons/cdgs/CorelDRAW-standard-on-white.png" },
        { name: "CorelDRAW Go", desc: "Intuitive web-based graphic design app that goes beyond templates", save: "Save 30%", promo: "Save 30% on your first year of the annual plan.", was: "$99.99", price: "$69.99", unit: "/year", href: "/en/product/go/", icon: "/static/cdgs/product_content/product-icons/cdgo/cdgo-sub-on-white-tm.png" },
      ]} />
      <CtaBanner title="Test drive CorelDRAW for FREE, no credit card required!" cta={{ label: "Learn more", href: "/en/free-trials/" }} dark={false} />
    </>
  );
}

function TrialsPage() {
  return (
    <>
      <TrialHero />
      <TryCardCarousel title="Login and try with CorelDRAW" cards={TRY_CARDS} />
      <ReleaseCarousel title="What’s new in CorelDRAW Graphics Suite 2026?" releases={RELEASES} />
      <IncludedApps title="What’s included in CorelDRAW Graphics Suite 2026"
        primary={{ name: "CorelDRAW®", sub: "Vector illustration and page layout", desc: "Powerful, full-featured graphics software for vector illustration, page layout, typography, and design across any project.", icon: "/static/cdgs/product_content/cdgs/2026/icon-coreldraw.png", bullets: ["All-in-one design and layout", "Professional vector illustration tools", "AI-powered vector and image generation", "Built-in multipage layout and typography tools"] }}
        also={[["CorelDRAW® Web", "Design on the go in your browser", "/static/cdgs/product_content/cdgs/2026/icon-cdgs-web.png", true], ["Corel PHOTO-PAINT™", "Edit, retouch, and enhance photos", "/static/cdgs/product_content/cdgs/2026/icon-photo-paint.png"], ["Corel® Font Manager", "Find, organize, and manage fonts", "/static/cdgs/product_content/cdgs/2026/icon-font-manager.png"]]}
        included={INCLUDED} />
      <SplitCta title="Try CorelDRAW in your browser, no downloads or installation needed." cta={{ label: "Try free", href: "https://web.coreldraw.com/?content=trial" }} note="*Note that this trial excludes some CorelDRAW features and all of the other applications that come with a CorelDRAW Graphics Suite purchase." secondary={{ lead: "Looking to try even more features and applications?", label: "Try the full CorelDRAW Graphics Suite", href: "https://www.corel.com/akdlm/6763/downloads/free/trials/GraphicsSuite/2026/3$8Fd2xH/CDGS2026.exe" }} />
      <AwardsStrip awards={AWARDS} />
      <RatingsBlock />
    </>
  );
}

function LearnPage() {
  return (
    <>
      <SectionSubNav title="Learning Center" href="/en/learn/" links={[["Tutorials", "/en/learn/tutorials/"], ["Webinars & e-Books", "/en/learn/webinars/"], ["How-tos", "/en/learn/how-to/"], ["Customer Stories", "/en/pages/customer-stories/"], ["Gallery", "/en/learn/gallery/"]]} />
      <PageBanner title="CorelDRAW Learning Center" body="So many ways to learn! See how you can get the most out of your CorelDRAW products with extensive insight into specific tools and features along with helpful tips and tricks." />
      <IconLinkCards overlap items={[
        { title: "CorelDRAW Academy", desc: "Free Corel-certified resources for creatives of all skill levels.", href: "/en/learn/academy/", img: "/static/cdgs/images/learn/ico-academy.svg" },
        { title: "Tutorials", desc: "In-depth learning content for a variety of design topics.", href: "/en/learn/tutorials/", img: "/static/cdgs/images/learn/ico-tutorials.svg" },
        { title: "Webinars & e-Books", desc: "Free online workshops on using tools and features.", href: "/en/learn/webinars/", img: "/static/cdgs/images/learn/ico-webinars.svg" },
        { title: "How-tos", desc: "Step-by-step guides for popular design tasks.", href: "/en/learn/how-to/", img: "/static/cdgs/images/learn/ico-hints.svg" },
      ]} />
      <InspireCards title="Get inspired" items={[
        ["Customer stories", "Discover how real businesses and organizations rely on the graphic design power of CorelDRAW.", "Read stories", "/en/pages/customer-stories/", "/static/cdgs/images/learn/ico-cs.svg"],
        ["Gallery", "Find inspiration in our diverse collection of artwork by CorelDRAW artists and designers from around the world.", "View gallery", "/en/learn/gallery/", "/static/cdgs/images/learn/ico-gallery.svg"],
        ["Discovery Center", "Visit another resource offering additional tutorials, galleries, tips, and eBooks.", "Start discovering", "https://learn.corel.com/graphics-home/", "/static/cdgs/images/learn/ico-dc.svg"],
        ["Guide to Vector Design", "Learn the basics of vector graphics and design with CorelDRAW, and develop your edge as a designer.", "Read more", "/en/learn/guide-to-vector-design/", "/static/cdgs/images/learn/ico-vector.svg"],
        ["Top Tips", "Accelerate and customize your design and production process with simple tips from CorelDRAW training experts.", "Watch videos", "/en/learn/tutorials/tips/", "/static/cdgs/images/learn/icon-tips.svg"],
        ["Guide to Pantone Colors for print", "Learn how to use Pantone Colors for print design with CorelDRAW.", "Read more", "/en/blog/pantone-print-guide/", "/static/cdgs/images/learn/ico-vector.svg"],
      ]} />
    </>
  );
}

function SupportPage() {
  return (
    <>
      <SupportSearch />
      <IconLinkCards overlap cols={5} items={[
        { title: "Install & activate", desc: "Tutorials for product installation", href: "/en/support/install-and-activate/", icon: "cog" },
        { title: "Download", desc: "Patches & Updates", href: "/en/support/updates/", icon: "download" },
        { title: "Orders", desc: "Buy, inquire, return", href: "/en/support/orders/", icon: "box" },
        { title: "Your account", desc: "Update your profile, register a product and more", href: "/en/support/your-account/", icon: "user" },
        { title: "Discovery Center", desc: "Your home for creative learning", href: "https://learn.corel.com/", icon: "book" },
      ]} />
      <Announcements items={[["CorelDRAW Web – Frequently Asked Questions (FAQ)", "https://kb.corel.com/en/130067"], ["CorelDRAW Go – Frequently Asked Questions (FAQ)", "https://kb.corel.com/en/130319"], ["Artificial Intelligence (AI) in CorelDRAW products – FAQ", "https://kb.corel.com/en/131069"]]} />
      <ContactOptions />
    </>
  );
}

/* =====================================================================
   APP SHELL
   ===================================================================== */
const PAGES: Record<PageKey, () => React.JSX.Element> = { home: HomePage, product: ProductPage, offers: OffersPage, trials: TrialsPage, learn: LearnPage, support: SupportPage };

export default function App() {
  const [page, setPage] = useState<PageKey>("home");
  const go = (p: PageKey) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const Page = PAGES[page] || HomePage;
  return (
    <RouterCtx.Provider value={{ go }}>
      <div className="min-h-screen bg-white text-gray-900 antialiased" style={{ fontFamily: "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif" }}>
        {page !== "learn" && page !== "offers" && <PromoBar />}
        <Header />
        <main key={page}><Page /></main>
        <Footer />
        {page === "home" && <PromoModal />}
      </div>
    </RouterCtx.Provider>
  );
}
