import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import {
  company,
  contact,
  images,
  projectCategories,
  services,
  stats,
} from "@/lib/site-config";

export default function Home() {
  return (
    <SiteLayout navVariant="dark">
      <Hero />
      <SectorMarquee />
      <Capabilities />
      <SelectedWork />
      <Ledger />
      <Approach />
      <ClosingCta />
    </SiteLayout>
  );
}

/* =========================================================
   HERO — full-bleed photograph, editorial headline
   ========================================================= */
function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full bg-night text-night-fg">
      {/* Photograph */}
      <div className="absolute inset-0">
        <img
          src={images.hero}
          alt="Custom glass facade by Entrance Systems"
          className="h-full w-full object-cover opacity-70"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/30 to-night" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-x relative flex h-full flex-col justify-end pb-16 pt-32 md:pb-24">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8 animate-fade-up">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              001 — Custom glass facades · Pennsburg, PA · Since 1983
            </div>
            <h1 className="display-1 mt-8 max-w-[18ch] text-balance">
              Glass for the buildings that stay&nbsp;standing.
            </h1>
          </div>

          <div className="md:col-span-4 md:pl-6 md:border-l md:border-white/15 animate-fade-up">
            <p className="text-base leading-relaxed text-white/75 md:text-lg">
              {company.yearsExperience}+ years engineering, fabricating, and
              installing custom glass facades for the schools, universities,
              hospitals, and commercial buildings that define Southeastern
              Pennsylvania.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
              >
                <Link to="/contact">
                  Request a project bid
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="link"
                size="lg"
                className="rounded-none px-0 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80"
              >
                <Link to="/work" className="link-underline">
                  View selected work
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marker — scroll cue */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10">
        <div className="container-x flex h-12 items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
          <span>Scroll</span>
          <span>{contact.city}, {contact.state}</span>
          <span className="hidden md:inline">{contact.phone}</span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTOR MARQUEE — restrained typographic strip
   ========================================================= */
function SectorMarquee() {
  const sectors = [
    "K-12 Education",
    "Higher Education",
    "Healthcare",
    "Commercial Office",
    "Government & Civic",
    "Retail & Mixed-Use",
    "Hospitality",
    "Industrial",
  ];
  // Duplicated for seamless marquee.
  const row = [...sectors, ...sectors, ...sectors];
  return (
    <section className="border-y border-paper-3 bg-paper-2 py-6 overflow-hidden">
      <div className="flex gap-12 whitespace-nowrap animate-marquee">
        {row.map((s, i) => (
          <div
            key={`${s}-${i}`}
            className="font-display text-2xl text-ink/70 md:text-3xl"
          >
            {s}
            <span className="ml-12 text-ink-3">·</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   001 — CAPABILITIES
   ========================================================= */
function Capabilities() {
  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <div className="chapter">001 — Capabilities</div>
            <h2 className="display-2 mt-8">
              Four self-performed disciplines.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="lede">
              For more than three decades, ESI has provided a broad range of
              commercial glazing solutions — from full building envelopes to
              the specialty interior elements that finish a space. Every scope
              is engineered, drafted, fabricated, and installed under one
              roof.
            </p>
            <Link
              to="/services"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] link-underline"
            >
              All capabilities <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-20 border-t border-ink/15">
          {services.map((service, idx) => (
            <Link
              key={service.slug}
              to={`/services#${service.slug}`}
              className="group grid grid-cols-12 items-center gap-6 border-b border-ink/15 py-8 transition-colors hover:bg-paper-2/60 md:py-10"
            >
              <div className="col-span-2 font-mono text-xs text-ink-3 md:col-span-1">
                / 0{idx + 1}
              </div>
              <div className="col-span-10 md:col-span-5">
                <h3 className="font-display text-2xl leading-tight md:text-4xl">
                  {service.title}
                </h3>
              </div>
              <div className="col-span-12 text-sm text-ink-2 md:col-span-5 md:text-base">
                {service.short}
              </div>
              <div className="hidden md:col-span-1 md:flex md:justify-end">
                <ArrowUpRight className="h-5 w-5 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   002 — SELECTED WORK
   Asymmetric editorial grid
   ========================================================= */
function SelectedWork() {
  return (
    <section className="bg-paper-2 py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="chapter">002 — Selected Work</div>
            <h2 className="display-2 mt-8 max-w-md">
              A portfolio of regional landmarks.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="lede">
              We're the firm behind the curtain walls, storefronts, and
              specialty glass on hundreds of school buildings, university
              halls, and medical campuses across the Mid-Atlantic.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-12">
          {projectCategories.map((cat, idx) => {
            // Asymmetric: idx 0 wide, 1 narrow, 2 narrow, 3 wide
            const span =
              idx === 0 || idx === 3 ? "md:col-span-7" : "md:col-span-5";
            const aspect =
              idx === 0 || idx === 3 ? "aspect-[16/10]" : "aspect-[4/5]";
            return (
              <Link
                key={cat.slug}
                to={`/work#${cat.slug}`}
                className={`${span} group block`}
              >
                <div className={`photo-frame ${aspect} w-full`}>
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                      / 0{idx + 1} — {cat.featured}
                    </div>
                    <h3 className="font-display text-2xl mt-2 md:text-3xl">
                      {cat.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 flex-shrink-0 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 flex justify-end">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] link-underline"
          >
            All work <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LEDGER — by the numbers
   ========================================================= */
function Ledger() {
  return (
    <section className="border-t border-paper-3 py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <div className="chapter">003 — By the Numbers</div>
            <h2 className="display-2 mt-8">Forty years of repeat clients.</h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="lede">
              We've built our business on a long list of architects, GCs, and
              owners who keep coming back — because what we promise on paper
              is what shows up on site.
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-ink/15 pt-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label}>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                / 0{i + 1}
              </div>
              <div className="display-2 mt-4 leading-none">{s.value}</div>
              <div className="mt-3 text-sm text-ink-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   APPROACH — process, four steps
   ========================================================= */
function Approach() {
  const steps = [
    {
      n: "01",
      t: "Pre-bid review",
      d: "An estimator reviews drawings, specs, and schedule before pricing.",
    },
    {
      n: "02",
      t: "Detailed proposal",
      d: "Scope, qualifications, and pricing documented in writing — no surprises.",
    },
    {
      n: "03",
      t: "Shop & submittals",
      d: "AutoCAD/Revit shop drawings, samples, and submittals coordinated through your team.",
    },
    {
      n: "04",
      t: "Self-performed install",
      d: "Our own field crews install what our shop fabricates. Quality control never disappears down a sub-tier.",
    },
  ];
  return (
    <section className="bg-night py-24 text-night-fg md:py-36">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <div className="chapter text-white/40">004 — Approach</div>
            <h2 className="display-2 mt-8">
              Engineered, not&nbsp;improvised.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="lede text-white/70">
              Every facade is designed, modeled, and prototyped in-house
              before a single panel is fabricated. The disciplined process is
              why our drawings, samples, and field crews behave like one
              continuous team.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="bg-night p-8 md:p-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                / {s.n}
              </div>
              <h3 className="display-3 mt-6">{s.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CLOSING — CTA before footer
   ========================================================= */
function ClosingCta() {
  return (
    <section className="border-t border-paper-3 py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="chapter">005 — Next step</div>
            <h2 className="display-1 mt-8 max-w-[14ch] text-balance">
              Have a project on the&nbsp;boards?
            </h2>
          </div>
          <div className="md:col-span-4 md:pl-6 md:border-l md:border-ink/15">
            <p className="lede">
              Send drawings, scope, and timeline. We'll route the project to
              the right estimator and respond within two business days.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <Button
                asChild
                size="lg"
                className="w-full rounded-none font-mono text-[11px] uppercase tracking-[0.18em] sm:w-auto sm:self-start"
              >
                <Link to="/contact">
                  Start a project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={`tel:${contact.phoneHref}`}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 link-underline"
              >
                Or call {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
