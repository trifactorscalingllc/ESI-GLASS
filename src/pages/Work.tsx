import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { Reveal, Stagger } from "@/components/Reveal";
import { projectCategories } from "@/lib/site-config";

export default function Work() {
  return (
    <SiteLayout>
      <PageHeader />
      <ProjectIndex />
      <ProjectGallery />
      <ClosingNote />
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
              <div className="chapter">Selected Work</div>
            </Reveal>
            <Reveal variant="fade-up" delay={120}>
              <h1 className="display-1 mt-8 max-w-[18ch] text-balance">
                Buildings that outlast their architects.
              </h1>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-14">
            <Reveal variant="fade-in" delay={300}>
              <p className="lede">
                Hundreds of K-12 campuses, university halls, hospitals, and
                commercial facilities across the Mid-Atlantic. Below are the
                four sectors where we do most of our work.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectIndex() {
  return (
    <section className="border-t border-paper-3">
      <div className="container-x">
        <Stagger step={90} initialDelay={120}>
          <ol>
            {projectCategories.map((cat, idx) => (
              <Reveal key={cat.slug} variant="fade-up" distance={18} as="li">
                <Link
                  to={`#${cat.slug}`}
                  className="ed-row group grid grid-cols-12 items-baseline gap-6 border-b border-paper-3 py-6 md:py-8"
                >
                  <div className="ed-row-marker col-span-2 font-mono text-xs text-ink-3 md:col-span-1">
                    / 0{idx + 1}
                  </div>
                  <div className="col-span-10 md:col-span-7">
                    <h3 className="font-display text-2xl leading-tight md:text-3xl">
                      {cat.title}
                    </h3>
                  </div>
                  <div className="col-span-12 caption md:col-span-3">
                    Featured · {cat.featured}
                  </div>
                  <div className="hidden md:col-span-1 md:flex md:justify-end">
                    <ArrowUpRight className="ed-row-arrow h-5 w-5 text-ink-3" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </ol>
        </Stagger>
      </div>
    </section>
  );
}

function ProjectGallery() {
  return (
    <section>
      {projectCategories.map((cat, idx) => {
        const reverse = idx % 2 === 1;
        return (
          <article
            id={cat.slug}
            key={cat.slug}
            className="border-t border-paper-3 py-24 scroll-mt-24 md:py-36"
          >
            <div className="container-x">
              <div className="grid gap-10 md:grid-cols-12 md:gap-16">
                <div className="md:col-span-4">
                  <Reveal variant="fade-up">
                    <div className="chapter">/ 0{idx + 1} — Sector</div>
                  </Reveal>
                  <Reveal variant="fade-up" delay={120}>
                    <h2 className="display-2 mt-6 max-w-md">{cat.title}</h2>
                  </Reveal>
                </div>
                <div className="md:col-span-7 md:col-start-6">
                  <Reveal variant="fade-in" delay={250}>
                    <p className="lede">{cat.description}</p>
                  </Reveal>
                  <Stagger step={90} initialDelay={400}>
                    <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink/15 pt-8 sm:grid-cols-3">
                      <Reveal variant="fade-up" distance={16}>
                        <dt className="caption">Featured project</dt>
                        <dd className="mt-2 font-display text-lg leading-tight">
                          {cat.featured}
                        </dd>
                      </Reveal>
                      <Reveal variant="fade-up" distance={16}>
                        <dt className="caption">Sector</dt>
                        <dd className="mt-2 font-display text-lg leading-tight">
                          {cat.title}
                        </dd>
                      </Reveal>
                      <Reveal variant="fade-up" distance={16}>
                        <dt className="caption">Region</dt>
                        <dd className="mt-2 font-display text-lg leading-tight">
                          Mid-Atlantic, USA
                        </dd>
                      </Reveal>
                    </dl>
                  </Stagger>
                </div>
              </div>

              <div
                className={`mt-12 grid gap-6 md:grid-cols-12 md:gap-8 ${
                  reverse ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className="md:col-span-8 [direction:ltr]">
                  <Reveal variant="mask-up">
                    <div className="ed-card-photo group relative aspect-[16/10] w-full">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </Reveal>
                </div>
                <div className="md:col-span-4 [direction:ltr] md:flex md:flex-col md:justify-end">
                  <Reveal variant="fade-up" delay={250}>
                    <div className="caption">
                      Plate {String(idx + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-2 font-display text-xl leading-snug">
                      {cat.short}
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function ClosingNote() {
  return (
    <section className="bg-night py-24 text-night-fg md:py-36">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal variant="fade-up">
              <div className="chapter text-white/40">Project archive</div>
            </Reveal>
            <Reveal variant="fade-up" delay={120}>
              <h2 className="display-1 mt-8 max-w-[18ch] text-balance">
                Looking for a specific project?
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:pl-6 md:border-l md:border-white/15">
            <Reveal variant="fade-in" delay={250}>
              <p className="lede text-white/70">
                We don't publish a full archive online — most of our work is
                referenced through architects and GCs we've partnered with for
                years. Tell us what you're working on and we'll send relevant
                case studies.
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
                  Request case studies
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
