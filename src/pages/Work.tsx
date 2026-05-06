import { Link } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, Stethoscope, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { projectCategories } from "@/lib/site-config";

const SECTOR_ICONS = {
  "k-12-education": GraduationCap,
  "higher-education": Building2,
  "commercial-healthcare": Stethoscope,
  "interior-specialties": Sparkles,
} as const;

export default function Work() {
  return (
    <SiteLayout>
      <section className="container-x">
        <div className="max-w-3xl animate-fade-up">
          <span className="eyebrow">Our work</span>
          <h1 className="display-1 mt-6">
            <span className="text-gradient">Buildings</span> that
            <br />
            outlast their architects.
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
            Our portfolio spans hundreds of K-12 campuses, university buildings,
            hospitals, and commercial facilities across the Mid-Atlantic. Below
            are the four sectors where we do most of our work.
          </p>
        </div>
      </section>

      <section className="container-x mt-20 md:mt-28">
        <div className="flex flex-col gap-10">
          {projectCategories.map((cat, idx) => {
            const Icon =
              SECTOR_ICONS[cat.slug as keyof typeof SECTOR_ICONS] ?? Building2;
            const reverse = idx % 2 === 1;
            return (
              <article
                id={cat.slug}
                key={cat.slug}
                className="glass glass-reflective glass-shimmer relative grid scroll-mt-32 overflow-hidden rounded-[2rem] md:grid-cols-12"
              >
                <div
                  className={`relative md:col-span-7 ${
                    reverse ? "md:order-2" : ""
                  }`}
                >
                  <div className="aspect-[16/10] w-full md:aspect-auto md:h-full">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,50%,5%)]/40 via-transparent to-transparent md:bg-gradient-to-l" />
                </div>

                <div className="md:col-span-5 p-8 md:p-12">
                  <div className="glass-light inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground/90">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    Sector {idx + 1} of {projectCategories.length}
                  </div>
                  <h2 className="display-3 mt-5">{cat.title}</h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                  <div className="hairline mt-7" />
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Featured project
                    </span>
                  </div>
                  <div className="mt-1 font-display text-xl font-semibold">
                    {cat.featured}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-x mt-32 md:mt-44">
        <div className="glass-heavy glass-reflective relative overflow-hidden rounded-[2rem] p-10 md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <h2 className="display-3">
                Want to see specific projects?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                We don't publish a full project archive online — most of our
                work is referenced through architects and GCs we've partnered
                with for years. Tell us what you're working on and we'll send
                relevant case studies.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                to="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_hsla(200,95%,55%,0.4)] transition-transform hover:scale-[1.02]"
              >
                Request case studies
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
