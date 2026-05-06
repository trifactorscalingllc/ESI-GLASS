import { Link } from "react-router-dom";
import { ArrowRight, Hammer, Handshake, Shield, Users } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { company, contact, images, stats } from "@/lib/site-config";

const principles = [
  {
    icon: Shield,
    title: "Ethics first",
    body: "Honest pricing, honest scopes, honest schedules. We say what we mean and stand behind it.",
  },
  {
    icon: Hammer,
    title: "Hard work",
    body: "Self-performed fabrication and self-performed installation — there is no quality control without ownership.",
  },
  {
    icon: Handshake,
    title: "Enduring relationships",
    body: "Most of our projects come from clients we've worked with for decades. We earn that the slow way.",
  },
  {
    icon: Users,
    title: "Merit-shop pride",
    body: "An ABC Eastern PA member organization that promotes craft, training, and merit-based opportunity.",
  },
];

export default function About() {
  return (
    <SiteLayout>
      <section className="container-x">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7 animate-fade-up">
            <span className="eyebrow">About ESI</span>
            <h1 className="display-1 mt-6">
              Family-founded
              <br />
              in <span className="text-gradient">{company.founded}.</span>
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
              {company.longDescription}
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              We genuinely value our extensive list of repeat customers and
              strive to maintain — and continuously build — those relationships
              one project at a time.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="glass glass-reflective relative overflow-hidden rounded-[2rem]">
              <div className="aspect-[4/5] w-full">
                <img
                  src={images.hero}
                  alt="Custom glass facade by Entrance Systems"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-x-4 bottom-4">
                <div className="glass-light rounded-2xl p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-primary">
                    Headquarters
                  </div>
                  <div className="mt-1 font-display text-base font-semibold">
                    {contact.address1}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact.city}, {contact.state} {contact.zip}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x mt-24 md:mt-32">
        <div className="glass glass-reflective grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/[0.04] md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[hsl(var(--background))]/40 px-6 py-8 text-center md:py-10"
            >
              <div className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-32 md:mt-44">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <span className="eyebrow">Our foundation</span>
            <h2 className="display-2 mt-4">
              Built on four principles.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              From the day we opened our doors in 1983, ESI has operated with
              the same straightforward set of values. They show up in every
              proposal, shop drawing, and field punch list.
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="glass glass-reflective rounded-3xl p-6"
                >
                  <div className="glass-light inline-flex h-11 w-11 items-center justify-center rounded-2xl">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x mt-32 md:mt-44">
        <div className="glass-heavy glass-reflective relative overflow-hidden rounded-[2rem] p-10 md:p-16">
          <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 className="display-2">
                Ready to spec ESI on your next bid package?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Send us your drawings, scope, and timeline. We'll route the
                project to the right estimator and get back within two business
                days.
              </p>
            </div>
            <div className="md:col-span-5 md:text-right">
              <Link
                to="/contact"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[0_16px_50px_hsla(200,95%,55%,0.45)] transition-all hover:scale-[1.02]"
              >
                Start a Project
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
