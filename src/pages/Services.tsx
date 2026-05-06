import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { services } from "@/lib/site-config";

export default function Services() {
  return (
    <SiteLayout>
      <PageHeader />
      <ServiceList />
      <ProcessNote />
    </SiteLayout>
  );
}

function PageHeader() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <div className="chapter">Capabilities</div>
            <h1 className="display-1 mt-8 max-w-[16ch] text-balance">
              Four self-performed disciplines.
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-14">
            <p className="lede">
              We design, fabricate, and install the glass envelopes, storefronts,
              and specialty assemblies that finish institutional, healthcare,
              and commercial buildings — all under one roof.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceList() {
  return (
    <section className="border-t border-paper-3">
      {services.map((service, idx) => {
        const reverse = idx % 2 === 1;
        return (
          <article
            id={service.slug}
            key={service.slug}
            className="border-b border-paper-3 py-20 scroll-mt-24 md:py-32"
          >
            <div className="container-x">
              <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-16">
                {/* Image */}
                <div
                  className={`md:col-span-7 ${
                    reverse ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <div className="photo-frame aspect-[5/4]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="caption mt-3 flex items-baseline gap-3">
                    <span className="text-ink">/ 0{idx + 1}</span>
                    <span>{service.title} · Capability</span>
                  </div>
                </div>

                {/* Copy */}
                <div
                  className={`md:col-span-5 ${
                    reverse ? "md:order-1 md:col-start-1" : "md:order-2"
                  }`}
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
                    / 0{idx + 1}
                  </div>
                  <h2 className="display-2 mt-4">{service.title}</h2>
                  <p className="lede mt-6">{service.description}</p>

                  <ul className="mt-8 divide-y divide-paper-3 border-y border-paper-3">
                    {service.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-baseline gap-4 py-4 text-base leading-relaxed text-ink-2"
                      >
                        <span className="font-mono text-xs text-ink-3">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant="default"
                    className="mt-10 rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
                  >
                    <Link to="/contact">
                      Discuss this scope
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function ProcessNote() {
  const steps = [
    {
      n: "01",
      t: "Pre-bid review",
      d: "Drawings, specs, and schedule reviewed by a senior estimator.",
    },
    {
      n: "02",
      t: "Detailed proposal",
      d: "Scope, qualifications, and pricing documented in writing.",
    },
    {
      n: "03",
      t: "Shop & submittals",
      d: "AutoCAD / Revit shop drawings, samples, and submittals.",
    },
    {
      n: "04",
      t: "Self-performed install",
      d: "Our own field crews install what our shop fabricates.",
    },
  ];
  return (
    <section className="bg-night py-24 text-night-fg md:py-36">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <div className="chapter text-white/40">Process</div>
            <h2 className="display-2 mt-8">One disciplined process, every job.</h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="lede text-white/70">
              The buildings change but the workflow doesn't. Every project moves
              through these four stages — from estimator desk to installed
              facade — so nothing falls through the cracks.
            </p>
          </div>
        </div>

        <ol className="mt-20 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="bg-night p-8 md:p-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                / {s.n}
              </div>
              <h3 className="display-3 mt-6">{s.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/65">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex justify-end">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 link-underline"
          >
            Start a project <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
