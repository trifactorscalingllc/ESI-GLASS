/**
 * Single source of truth for ESI site copy, contact info, services,
 * and project data. Update content here, not in pages.
 */

export const company = {
  name: "Entrance Systems, Inc.",
  shortName: "ESI",
  tagline: "Custom Glass Facades Since 1983",
  founded: 1983,
  yearsExperience: new Date().getFullYear() - 1983,
  description:
    "A Southeastern Pennsylvania commercial contract glazing firm building custom glass facades for institutional, educational, healthcare, and commercial buildings.",
  longDescription:
    "Founded in 1983 with the sole purpose of providing dependable, honest, and affordable commercial contract glazing work, Entrance Systems, Inc. has spent over four decades crafting custom glass facades for some of the region's most recognizable buildings. We are a merit shop organization and proud member of the Eastern PA Chapter of Associated Builders and Contractors.",
};

export const contact = {
  address1: "2500 Quakertown Road",
  city: "Pennsburg",
  state: "PA",
  zip: "18073",
  phone: "(215) 679-5900",
  phoneHref: "+12156795900",
  email: "main@esiglass.com",
  hours: "Mon – Fri · 7:30 AM – 4:30 PM",
};

/**
 * Image asset map. Currently using high-quality stock photography from
 * Unsplash so the design renders as intended. The originals from
 * esiglass.com are scaled banners/text logos and were not usable at
 * full-res — the client should provide actual project photography to
 * drop into these slots before launch.
 *
 * Unsplash URLs include sizing params for performance.
 */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * Unsplash IDs verified by visiting unsplash.com. All architecture /
 * glazing themed. Re-checked May 2026.
 */
export const images = {
  // Hero — Toronto skyline w/ glass towers
  hero: unsplash("1486325212027-8081e485255e", 1400),
  // About — modern glass tower looking up
  nitschman: unsplash("1497366754035-f200968a6e72", 1400),
  quarryRidge: unsplash("1487958449943-2429e8be8625", 1400),

  // Services
  serviceCurtainwall: unsplash("1486406146926-c627a92ad1ab", 1400), // curtain wall building
  serviceStorefront: unsplash("1497366811353-6870744d04b2", 1400),  // glass entrance lobby
  serviceInteriors: unsplash("1497366216548-37526070297c", 1400),   // interior glass / atrium feel
  serviceDrafting: unsplash("1503387762-592deb58ef4e", 1400),       // architectural drafting

  // Work — sectors
  workK12: unsplash("1562774053-701939374585", 1400),                // school exterior
  workHigherEd: unsplash("1541339907198-e08756dedf3f", 1400),        // higher-ed campus
  workCommercial: unsplash("1551601651-2a8555f1a136", 1400),         // hospital / commercial
  workInteriors: unsplash("1531973576160-7125cd663d86", 1400),       // interior atrium / skylight
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  image: string;
};

export const services: Service[] = [
  {
    slug: "exterior-curtainwalls",
    title: "Exterior Curtainwalls",
    short: "Engineered facade systems for the buildings that define a skyline.",
    description:
      "We specialize in managing the design, coordination, fabrication, and installation challenges that complex façade types pose. Our completed curtain wall systems total millions of square feet across the Mid-Atlantic.",
    bullets: [
      "Stick-built, unitized, and SSG curtain wall systems",
      "Multi-million-square-foot installation history",
      "Performance-engineered for thermal, structural, and seismic loads",
      "Coordination with structural, mechanical, and fire-rated assemblies",
    ],
    image: images.serviceCurtainwall,
  },
  {
    slug: "storefronts-entrances",
    title: "Storefronts & Entrances",
    short:
      "From multi-story office lobbies to single-door replacements, executed to spec.",
    description:
      "Whether the project is a multi-story office building or an individual door replacement, we deliver custom in-house fabrication of all our framing systems along with full door hardware machining and application capabilities.",
    bullets: [
      "Aluminum storefront systems and entrances",
      "In-house fabrication of all framing systems",
      "Full door hardware machining & application",
      "ADA-compliant and high-traffic vestibule design",
    ],
    image: images.serviceStorefront,
  },
  {
    slug: "interiors-specialties",
    title: "Interiors & Specialties",
    short: "Skylights, all-glass partitions, railings, and custom assemblies.",
    description:
      "Completed applications encompass skylights, all-glass partitions, glass guardrail systems, office partitions, and much more — including the one-off architectural elements that define a space.",
    bullets: [
      "Custom skylights and daylighting systems",
      "All-glass demountable partitions",
      "Engineered glass guardrails and stair systems",
      "Decorative & specialty glass assemblies",
    ],
    image: images.serviceInteriors,
  },
  {
    slug: "design-drafting",
    title: "In-House Design & Drafting",
    short:
      "AutoCAD, Revit, and 3D prototyping resolve issues before they reach the field.",
    description:
      "Our in-house team uses AutoCAD and Revit platforms to provide fully detailed job-specific shop drawings and submittal packages. Cost-effective 3D modeling and prototyping resolves coordination issues before fabrication.",
    bullets: [
      "Job-specific shop drawings and submittal packages",
      "AutoCAD and Revit (BIM) coordination",
      "3D modeling and rapid prototyping",
      "Architect & GC collaboration through every milestone",
    ],
    image: images.serviceDrafting,
  },
];

export type ProjectCategory = {
  slug: string;
  title: string;
  short: string;
  description: string;
  featured: string;
  image: string;
};

export const projectCategories: ProjectCategory[] = [
  {
    slug: "k-12-education",
    title: "K-12 Education",
    short:
      "Hundreds of completed schools, administrative facilities, and athletic complexes.",
    description:
      "Hundreds of successfully completed public and private school buildings, administrative facilities, sports facilities, and more. We carry extensive practice in handling the unique construction and administrative requirements of educational projects.",
    featured: "Upper-Merion Area High School",
    image: images.workK12,
  },
  {
    slug: "higher-education",
    title: "Institutional & Higher Education",
    short:
      "Landmark buildings designed to endure the test of time.",
    description:
      "Landmark buildings, designed to endure the test of time. We have consistently met the demanding expectations of some of the country's most respected architects on university and institutional campuses.",
    featured: "Moravian College",
    image: images.workHigherEd,
  },
  {
    slug: "commercial-healthcare",
    title: "Commercial & Healthcare",
    short:
      "Office, retail, and medical facilities with the tolerances they require.",
    description:
      "From traditional office buildings and retail storefronts to hospitals and medical office buildings, we have the planning, estimating, and design competency to deliver private-market projects on schedule and on budget.",
    featured: "Regional wellness facility",
    image: images.workCommercial,
  },
  {
    slug: "interior-specialties",
    title: "Interiors & Specialties",
    short:
      "Custom skylights, specialty entrances, partitions, railings, and one-off glasswork.",
    description:
      "We welcome custom projects including custom skylights, specialty entrances, all-glass partitions, railings, and just about any other glass application a designer can imagine.",
    featured: "Blue Mountain",
    image: images.workInteriors,
  },
];

export const stats = [
  { value: `${company.yearsExperience}+`, label: "Years in business" },
  { value: "Millions", label: "Sq. ft. of curtain wall installed" },
  { value: "100s", label: "K-12 schools completed" },
  { value: "1983", label: "Family-founded" },
];

export const valueProps = [
  {
    title: "Engineered, not improvised",
    body:
      "Every facade is designed, modeled, and prototyped in-house before fabrication — so what shows up at the site is what was promised on paper.",
  },
  {
    title: "Built around relationships",
    body:
      "We've built our business on a long list of repeat customers — architects, GCs, owners — who keep coming back because we own what we install.",
  },
  {
    title: "Self-performed quality",
    body:
      "We fabricate framing systems in-house and deliver our own field crews, so quality control never disappears down a sub-tier.",
  },
];

/* ============================================================
   Pre-qualifying contact form options.

   The form is structured to filter for ESI's actual market —
   commercial / institutional / large multi-family — and politely
   route residential single-door inquiries elsewhere.
   ============================================================ */
export const projectTypes = [
  { value: "k12", label: "K-12 School District" },
  { value: "higher-ed", label: "College / University" },
  { value: "healthcare", label: "Hospital / Medical Office" },
  { value: "commercial-office", label: "Commercial Office" },
  { value: "retail", label: "Retail / Mixed-Use" },
  { value: "industrial", label: "Industrial / Manufacturing" },
  { value: "government", label: "Government / Municipal" },
  { value: "multifamily", label: "Multi-Family / Hospitality" },
  { value: "house-of-worship", label: "House of Worship" },
  { value: "other-commercial", label: "Other commercial / institutional" },
  { value: "residential", label: "Residential (single-family home)" },
];

export const roles = [
  { value: "general-contractor", label: "General Contractor / CM" },
  { value: "architect", label: "Architect / Designer" },
  { value: "owner", label: "Building Owner / Developer" },
  { value: "facilities", label: "Facilities / Property Manager" },
  { value: "subcontractor", label: "Subcontractor" },
  { value: "other", label: "Other" },
];

export const scopeOptions = [
  { value: "curtainwall", label: "Curtain Wall (Exterior)" },
  { value: "storefront", label: "Aluminum Storefront / Entrances" },
  { value: "skylights", label: "Skylights / Daylighting" },
  { value: "partitions", label: "All-Glass Partitions" },
  { value: "railings", label: "Glass Guardrails / Stair Rails" },
  { value: "interior", label: "Interior Glazing / Specialties" },
  { value: "doors", label: "Door Hardware / Replacement" },
  { value: "consult", label: "Not yet sure — need a consult" },
];

export const budgetRanges = [
  { value: "under-100k", label: "Under $100K" },
  { value: "100k-500k", label: "$100K – $500K" },
  { value: "500k-2m", label: "$500K – $2M" },
  { value: "2m-10m", label: "$2M – $10M" },
  { value: "10m-plus", label: "$10M+" },
  { value: "tbd", label: "Not yet determined" },
];

export const sqftRanges = [
  { value: "under-5k", label: "Under 5,000 sq. ft." },
  { value: "5k-25k", label: "5,000 – 25,000 sq. ft." },
  { value: "25k-100k", label: "25,000 – 100,000 sq. ft." },
  { value: "100k-plus", label: "100,000+ sq. ft." },
  { value: "tbd", label: "Not yet determined" },
];

export const timelineOptions = [
  { value: "bidding-now", label: "Currently bidding (need pricing soon)" },
  { value: "0-3-months", label: "Construction starts within 3 months" },
  { value: "3-6-months", label: "Construction starts in 3 – 6 months" },
  { value: "6-12-months", label: "Construction starts in 6 – 12 months" },
  { value: "12-plus-months", label: "Beyond 12 months / planning phase" },
  { value: "exploratory", label: "Exploratory only" },
];

export const planStatusOptions = [
  { value: "complete", label: "Complete construction documents available" },
  { value: "schematic", label: "Schematic / design-development drawings" },
  { value: "concept", label: "Concept renderings only" },
  { value: "none", label: "No drawings yet — need design help" },
];

export const referralSources = [
  { value: "search", label: "Google / web search" },
  { value: "referral-architect", label: "Referred by an architect" },
  { value: "referral-gc", label: "Referred by a GC / CM" },
  { value: "referral-owner", label: "Referred by a previous client" },
  { value: "abc", label: "Associated Builders & Contractors (ABC)" },
  { value: "other", label: "Other" },
];

export const navigation = [
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
