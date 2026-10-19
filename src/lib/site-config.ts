import {
  BadgeCheck,
  BookOpenCheck,
  Building2,
  Calculator,
  Cpu,
  Factory,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Hotel,
  Landmark,
  LineChart,
  Receipt,
  ShieldCheck,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Central place for firm details and homepage copy.
 * Everything wrapped in [brackets] is a placeholder — replace before launch.
 * Do not add statistics, awards, testimonials or credentials that cannot be verified.
 */
export const siteConfig = {
  name: "Toka",
  tagline: "Chartered Accountants",
  description:
    "Audit, tax, accounting and compliance services for businesses in Nepal. Book a consultation with our Chartered Accountants.",
  // Set NEXT_PUBLIC_SITE_URL in Netlify once the domain is known.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com",
  locale: "en_NP",
  credentials: {
    icanFirmRegNo: "[ICAN Firm Reg. No. XXXX]",
    panNo: "[PAN XXXXXXXXX]",
  },
  contact: {
    phoneDisplay: "+977 [01-XXXXXXX]",
    phoneHref: "tel:+97710000000",
    email: "[info@yourfirm.com.np]",
    emailHref: "mailto:info@example.com",
    addressLines: ["[Street / Tole]", "[City], Nepal"],
    hours: "[Sun – Fri, 10:00 – 17:00]",
  },
} as const;

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Contact", href: "/contact" },
];

export const QUOTE_HREF = "/get-a-quote";

export type Service = {
  title: string;
  description: string;
  /** Shown on the Services page. Confirm these match the firm's actual offerings. */
  includes: string[];
  icon: LucideIcon;
  tone: Tone;
};

export type Tone = "brand" | "orange" | "coral" | "blue";

export const services: Service[] = [
  {
    title: "Audit & Assurance",
    description:
      "Statutory, internal and special-purpose audits carried out in line with Nepal Standards on Auditing.",
    includes: ["Statutory audit", "Internal audit", "Tax audit", "Special-purpose & donor audits"],
    icon: ShieldCheck,
    tone: "blue",
  },
  {
    title: "Tax Advisory & Compliance",
    description:
      "Income tax, VAT and TDS planning and filing with the Inland Revenue Department, plus support during assessments.",
    includes: ["Income tax returns", "VAT returns", "TDS filing", "Tax assessment support"],
    icon: Receipt,
    tone: "orange",
  },
  {
    title: "Accounting & Bookkeeping",
    description:
      "Monthly bookkeeping and financial statements prepared under NFRS, so your records are always audit-ready.",
    includes: ["Monthly bookkeeping", "NFRS financial statements", "Management reports", "Accounting system setup"],
    icon: Calculator,
    tone: "brand",
  },
  {
    title: "Company Registration & Secretarial",
    description:
      "Company incorporation with the Office of Company Registrar, PAN/VAT registration and annual filings.",
    includes: ["Company incorporation", "PAN / VAT registration", "Annual returns (OCR)", "Share & director changes"],
    icon: Building2,
    tone: "coral",
  },
  {
    title: "Payroll & SSF Compliance",
    description:
      "Payroll processing, salary TDS and Social Security Fund contributions handled accurately every month.",
    includes: ["Monthly payroll", "Salary TDS", "SSF registration & contributions", "Payslips & reports"],
    icon: HandCoins,
    tone: "blue",
  },
  {
    title: "Business Advisory",
    description:
      "Budgeting, feasibility studies, internal controls and financial guidance for decisions that matter.",
    includes: ["Budgeting & forecasting", "Feasibility studies", "Internal control reviews", "Business valuation"],
    icon: LineChart,
    tone: "orange",
  },
];

export type Industry = {
  name: string;
  icon: LucideIcon;
  tone: Tone;
  /** Optional photo for the homepage wheel, e.g. "/wheel/manufacturing.jpg" in /public. */
  image?: string;
};

export const industries: Industry[] = [
  { name: "Manufacturing", icon: Factory, tone: "blue" },
  { name: "Trading & Retail", icon: Store, tone: "orange" },
  { name: "Hospitality & Tourism", icon: Hotel, tone: "brand" },
  { name: "IT & Software", icon: Cpu, tone: "coral" },
  { name: "Healthcare", icon: HeartPulse, tone: "blue" },
  { name: "Education", icon: GraduationCap, tone: "orange" },
  { name: "NGOs & INGOs", icon: Users, tone: "brand" },
  { name: "Cooperatives & Finance", icon: Landmark, tone: "coral" },
];

// Describes how the firm works — edit to match your actual practice.
export const approachPoints: { title: string; icon: LucideIcon }[] = [
  { title: "Engagements led by qualified Chartered Accountants", icon: BadgeCheck },
  { title: "Clear scope and fees agreed before work begins", icon: BookOpenCheck },
  { title: "Advice grounded in current Nepal tax and company law", icon: ShieldCheck },
];
