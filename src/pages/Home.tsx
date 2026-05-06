import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2, Building2, GraduationCap, Stethoscope, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import {
  company,
  images,
  projectCategories,
  services,
  stats,
  valueProps,
} from "@/lib/site-config";

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <ServicesPreview />
      <WorkShowcase />
      <ValuePropsSection />
      <CallToAction />
    </SiteLayout>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="eyebrow">{company.tagline}</span>
            <h1 className="display-1 mt-6 text-foreground">
              <span className="text-gradient">Glass facades</span>
              <br />
              built to spec.
              <br />
              <span className="text-foreground/85">Built to last.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              For over four decades, Entrance Systems has engineered, fabricated,
              and installed custom glass facades for the schools, universities,
              hospitals, and commercial buildings that define Southeastern
              Pennsylvania.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_hsla(200,95%,55%,0.4)] transition-all hover:scale-[1.02]"
              >
                Request a Project Bid
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/work"
                className="glass-light inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-foreground transition-colors hover:bg-white/[0.08]"
              >
                See Our Work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
              {[
                "ABC Eastern PA Member",
                "Merit Shop Organization",
                "In-house fabrication",
              ].map((tag) => (
                <div key={tag} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative animate-fade-in">
      <div className="glass-heavy glass-reflective relative overflow-hidden rounded-[2rem]">
        <div className="aspect-[4/5] w-full">
          <img
            src={images.hero}
            alt="Custom glass facade installed by Entrance Systems Inc."
            className="h-full w-full object-cover"
            loading="eager"
          />
          {/* Gradient veil for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(215,50%,5%)]/85 via-[hsl(215,50%,8%)]/30 to-transparent" />

          {/* Top-right "BIM" chip — floats over image, doesn't overlap stats */}
          <div className="glass-light animate-drift absolute right-4 top-4 rounded-full px-3 py-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/95">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              BIM · AutoCAD · Revit
            </div>
          </div>

          {/* Active project chip mid-left */}
          <div
            className="glass animate-drift absolute left-4 top-20 rounded-2xl px-4 py-3"
            style={{ animationDelay: "-3s" }}
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-primary">
              Active Project
            </div>
            <div className="mt-1 font-display text-sm font-semibold leading-tight">
              Higher-Ed Curtainwall
            </div>
            <div className="text-xs text-muted-foreground">42,000 sq. ft.</div>
          </div>

          {/* Bottom panel with stats */}
          <div className="glass-light absolute inset-x-4 bottom-4 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="font-display text-2xl font-semibold leading-none">
                  {company.yearsExperience}+ yrs
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Engineering facades
                </div>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div className="flex-1">
                <div className="font-display text-2xl font-semibold leading-none">
                  100s
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Schools delivered
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- STATS BAND ---------- */
function Stats() {
  return (
    <section className="relative mt-24 md:mt-36">
      <div className="container-x">
        <div className="glass glass-reflective grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/[0.04] md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[hsl(var(--background))]/40 px-6 py-8 text-center md:py-10"
            >
              <div className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICES PREVIEW ---------- */
function ServicesPreview() {
  return (
    <section className="relative mt-32 md:mt-44">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="eyebrow">What we build</span>
            <h2 className="display-2 mt-4 max-w-2xl">
              From a single replacement door to a million square feet of curtain
              wall.
            </h2>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="text-base leading-relaxed text-muted-foreground md:ml-auto md:max-w-sm">
              Four self-performed disciplines, all coordinated under one roof —
              so the design intent makes it from sketch to facade.
            </p>
            <Link
              to="/services"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore all services
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, idx) => (
            <Link
              key={service.slug}
              to={`/services#${service.slug}`}
              className="glass glass-shimmer group relative overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-1"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold leading-tight">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.short}
              </p>
              <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Learn more
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- WORK SHOWCASE ---------- */
const SECTOR_ICONS = {
  "k-12-education": GraduationCap,
  "higher-education": Building2,
  "commercial-healthcare": Stethoscope,
  "interior-specialties": Sparkles,
} as const;

function WorkShowcase() {
  return (
    <section className="relative mt-32 md:mt-44">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Our work</span>
            <h2 className="display-2 mt-4 max-w-2xl">
              The buildings you drive past every day.
            </h2>
          </div>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View the portfolio
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-12">
          {projectCategories.map((cat, idx) => {
            const Icon =
              SECTOR_ICONS[cat.slug as keyof typeof SECTOR_ICONS] ?? Building2;
            // Asymmetric grid: 1st large, 2 medium, 1 large
            const span =
              idx === 0
                ? "md:col-span-7"
                : idx === 1
                ? "md:col-span-5"
                : idx === 2
                ? "md:col-span-5"
                : "md:col-span-7";
            return (
              <Link
                key={cat.slug}
                to={`/work#${cat.slug}`}
                className={`group glass-light glass-shimmer relative overflow-hidden rounded-3xl ${span}`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(215,50%,5%)]/95 via-[hsl(215,50%,5%)]/40 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-7">
                    <div className="glass-light inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground/90">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      Sector
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-semibold leading-tight md:text-3xl">
                      {cat.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-foreground/85">
                      {cat.short}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">
                      <span>Featured: {cat.featured}</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- VALUE PROPS ---------- */
function ValuePropsSection() {
  return (
    <section className="relative mt-32 md:mt-44">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <span className="eyebrow">Why ESI</span>
            <h2 className="display-2 mt-4">
              Forty-plus years of repeat clients.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              We've built our business on a long list of architects, GCs, and
              owners who keep coming back — because what we promise on paper is
              what shows up on site.
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="grid gap-4">
              {valueProps.map((vp, idx) => (
                <div
                  key={vp.title}
                  className="glass glass-reflective rounded-3xl p-7"
                >
                  <div className="flex items-start gap-5">
                    <div className="font-display text-3xl font-semibold leading-none text-primary">
                      0{idx + 1}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">
                        {vp.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {vp.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CallToAction() {
  return (
    <section className="relative mt-32 md:mt-44">
      <div className="container-x">
        <div className="glass-heavy glass-reflective relative overflow-hidden rounded-[2rem] p-10 md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <span className="eyebrow">Have a project on the boards?</span>
              <h2 className="display-2 mt-4">
                Let's talk before bid day.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                Whether you're an architect specifying glazing, a GC pricing a
                package, or an owner planning a new facility — start with a
                short qualifying form and we'll route you to the right
                estimator.
              </p>
            </div>
            <div className="md:col-span-5 md:text-right">
              <Link
                to="/contact"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[0_16px_50px_hsla(200,95%,55%,0.45)] transition-all hover:scale-[1.02]"
              >
                Start a Project
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
