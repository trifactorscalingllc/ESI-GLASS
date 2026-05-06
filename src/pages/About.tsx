import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { Reveal, Stagger } from "@/components/Reveal";
import { company, contact, images, stats } from "@/lib/site-config";

const principles = [
  {
    n: "01",
    t: "Ethics first",
    d: "Honest pricing. Honest scopes. Honest schedules. We say what we mean and stand behind it.",
  },
  {
    n: "02",
    t: "Hard work",
    d: "Self-performed fabrication and self-performed installation — there is no quality control without ownership.",
  },
  {
    n: "03",
    t: "Enduring relationships",
    d: "Most of our projects come from clients we've worked with for decades. We earn that the slow way.",
  },
  {
    n: "04",
    t: "Merit-shop pride",
    d: "An ABC Eastern PA member organization that promotes craft, training, and merit-based opportunity.",
  },
];

export default function About() {
  return (
    <SiteLayout>
      <PageHeader />
      <Manifesto />
      <Numbers />
      <Principles />
      <ClosingCta />
    </SiteLayout>
  );
}

function PageHeader() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Reveal variant="fade-up">
              <div className="chapter">About — Est. {company.founded}</div>
            </Reveal>
            <Reveal variant="fade-up" delay={120}>
              <h1 className="display-1 mt-8 max-w-[14ch] text-balance">
                A family firm, four decades on.
              </h1>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-14">
            <Reveal variant="fade-in" delay={300}>
              <p className="lede">
                Founded in {company.founded} in Pennsburg, Pennsylvania, with a
                singular brief: dependable, honest, affordable commercial
                contract glazing.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="border-t border-paper-3">
      <div className="container-x py-20 md:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Reveal variant="mask-up">
              <div className="ed-card-photo group relative aspect-[5/4]">
                <img
                  src={images.hero}
                  alt="ESI custom glass facade"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={250}>
              <div className="caption mt-3">
                / 01 — {contact.address1}, {contact.city}, {contact.state}
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:flex md:flex-col md:justify-center">
            <Reveal variant="fade-up">
              <div className="chapter">/ Manifesto</div>
            </Reveal>
            <Reveal variant="fade-up" delay={150}>
              <p className="mt-6 font-display text-2xl leading-snug md:text-3xl">
                {company.longDescription}
              </p>
            </Reveal>
            <Reveal variant="fade-in" delay={350}>
              <p className="lede mt-8">
                We genuinely value our extensive list of repeat customers and
                strive to maintain — and continuously build — those
                relationships one project at a time.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Numbers() {
  return (
    <section className="bg-paper-2 py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal variant="fade-up">
              <div className="chapter">By the Numbers</div>
            </Reveal>
            <Reveal variant="fade-up" delay={120}>
              <h2 className="display-2 mt-8 max-w-md">
                Forty years, hundreds of buildings.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal variant="fade-in" delay={250}>
              <p className="lede">
                We've spent more than four decades crafting custom glass facades
                for some of the region's most recognizable buildings.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal variant="line-draw" className="mt-20 origin-left h-px bg-ink/15" />
        <Stagger step={100} initialDelay={150}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-12 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} variant="fade-up" distance={20}>
                <div className="ed-stat">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                    / 0{i + 1}
                  </div>
                  <div className="display-2 ed-stat-value mt-4 leading-none">
                    {s.value}
                  </div>
                  <div className="mt-3 text-sm text-ink-2">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="border-t border-paper-3 py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal variant="fade-up">
              <div className="chapter">/ Principles</div>
            </Reveal>
            <Reveal variant="fade-up" delay={120}>
              <h2 className="display-2 mt-8 max-w-md">Built on four ideas.</h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal variant="fade-in" delay={250}>
              <p className="lede">
                From the day we opened our doors in 1983, ESI has operated
                with the same straightforward set of values. They show up in
                every proposal, shop drawing, and field punch list.
              </p>
            </Reveal>
          </div>
        </div>

        <Stagger step={120} initialDelay={200}>
          <ol className="mt-20 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2">
            {principles.map((p) => (
              <Reveal key={p.n} variant="fade-up" distance={20} as="li">
                <div className="group bg-paper p-8 transition-colors duration-500 hover:bg-paper-2 md:p-12">
                  <div className="ed-marker font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
                    / {p.n}
                  </div>
                  <h3 className="display-3 mt-6">{p.t}</h3>
                  <p className="mt-4 text-base leading-relaxed text-ink-2">
                    {p.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Stagger>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="bg-night py-24 text-night-fg md:py-36">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal variant="fade-up">
              <div className="chapter text-white/40">/ Next step</div>
            </Reveal>
            <Reveal variant="fade-up" delay={120}>
              <h2 className="display-1 mt-8 max-w-[16ch] text-balance">
                Spec ESI on your next package.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:pl-6 md:border-l md:border-white/15">
            <Reveal variant="fade-in" delay={250}>
              <p className="lede text-white/70">
                Send us your drawings, scope, and timeline. We'll route the
                project to the right estimator and respond within two business
                days.
              </p>
            </Reveal>
            <Reveal variant="fade-up" delay={400}>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="ed-cta mt-8 w-full rounded-none font-mono text-[11px] uppercase tracking-[0.18em] sm:w-auto"
              >
                <Link to="/contact">
                  Start a project
                  <ArrowRight className="ed-cta-arrow ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
