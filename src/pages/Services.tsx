import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { services } from "@/lib/site-config";

export default function Services() {
  return (
    <SiteLayout>
      <section className="container-x">
        <div className="max-w-3xl animate-fade-up">
          <span className="eyebrow">Capabilities</span>
          <h1 className="display-1 mt-6">
            <span className="text-gradient">Four disciplines.</span>
            <br />
            One coordinated team.
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
            For more than three decades, ESI has provided a broad range of
            commercial glazing solutions — from full building envelopes to the
            specialty interior elements that finish a space.
          </p>
        </div>
      </section>

      <section className="container-x mt-20 md:mt-28">
        <div className="flex flex-col gap-24 md:gap-32">
          {services.map((service, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <article
                id={service.slug}
                key={service.slug}
                className="grid items-center gap-10 scroll-mt-32 md:grid-cols-12 md:gap-16"
              >
                <div
                  className={`md:col-span-6 ${
                    reverse ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <div className="glass glass-reflective glass-shimmer relative overflow-hidden rounded-[2rem]">
                    <div className="aspect-[5/4] w-full">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(215,50%,8%)]/35 via-transparent to-transparent" />
                  </div>
                </div>

                <div
                  className={`md:col-span-6 ${
                    reverse ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    0{idx + 1} · Capability
                  </div>
                  <h2 className="display-3 mt-3">{service.title}</h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <ul className="mt-7 grid gap-3">
                    {service.bullets.map((b) => (
                      <li
                        key={b}
                        className="glass-light flex items-start gap-3 rounded-2xl px-4 py-3 text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="text-foreground/90">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsla(200,95%,55%,0.35)] transition-transform hover:scale-[1.02]"
                  >
                    Discuss this scope
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-x mt-32 md:mt-44">
        <div className="glass-heavy glass-reflective rounded-[2rem] p-10 md:p-14">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <span className="eyebrow">How we deliver</span>
              <h2 className="display-3 mt-4">
                Every project, the same disciplined process.
              </h2>
            </div>
            <div className="md:col-span-8">
              <ol className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    n: "01",
                    t: "Pre-bid review",
                    d: "Drawings, specs, and schedule reviewed by an estimator.",
                  },
                  {
                    n: "02",
                    t: "Detailed proposal",
                    d: "Scope, qualifications, and pricing documented in writing.",
                  },
                  {
                    n: "03",
                    t: "Shop drawings",
                    d: "AutoCAD/Revit shop drawings, samples, and submittals.",
                  },
                  {
                    n: "04",
                    t: "Self-performed install",
                    d: "Our own field crews install what our shop fabricates.",
                  },
                ].map((s) => (
                  <li key={s.n} className="glass-light rounded-2xl p-5">
                    <div className="font-display text-2xl font-semibold text-primary">
                      {s.n}
                    </div>
                    <div className="mt-2 font-display text-lg font-semibold">
                      {s.t}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {s.d}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
