import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { company, contact, navigation, services } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-night text-night-fg">
      <div className="container-x py-20 md:py-28">
        {/* Top — wordmark + tagline */}
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="chapter text-white/40">000 — Colophon</div>
            <h2 className="display-2 mt-6 max-w-2xl">
              Specify ESI on your next package.
            </h2>
            <p className="lede mt-6 text-white/60">
              {company.description}
            </p>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] link-underline"
            >
              Start a project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="md:col-span-5 md:pl-8 md:border-l md:border-white/10">
            <div className="chapter text-white/40">Studio</div>
            <address className="mt-6 not-italic">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${contact.address1}, ${contact.city}, ${contact.state} ${contact.zip}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="block font-display text-xl leading-snug link-draw"
              >
                {contact.address1}
                <br />
                {contact.city}, {contact.state} {contact.zip}
              </a>
            </address>
            <div className="mt-6 space-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">
              <a href={`tel:${contact.phoneHref}`} className="block link-draw">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="block link-draw">
                {contact.email}
              </a>
              <div>{contact.hours}</div>
            </div>
          </div>
        </div>

        <div className="hairline-dark my-16" />

        {/* Index — site nav + services */}
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="chapter text-white/40">Index</div>
            <ul className="mt-6 space-y-3 font-display text-lg">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link to={n.href} className="link-draw">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <div className="chapter text-white/40">Capabilities</div>
            <ul className="mt-6 space-y-3 font-display text-lg">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services#${s.slug}`} className="link-draw">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="chapter text-white/40">Affiliations</div>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              <li>Member, ABC Eastern Pennsylvania</li>
              <li>Merit Shop Organization</li>
              <li>Family-owned since 1983</li>
            </ul>
          </div>
        </div>

        <div className="hairline-dark mt-16" />

        {/* Bottom — colophon */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} Entrance Systems, Inc.
          </div>
          <div>Pennsburg, Pennsylvania</div>
          <div>Mid-Atlantic, USA</div>
        </div>
      </div>
    </footer>
  );
}
