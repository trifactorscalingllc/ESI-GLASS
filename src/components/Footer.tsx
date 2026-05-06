import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { company, contact, navigation, services } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-2xl font-bold tracking-tight">
              Entrance Systems, Inc.
            </div>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
              {company.tagline}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {company.description}
            </p>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${contact.address1}, ${contact.city}, ${contact.state} ${contact.zip}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-start gap-3 text-foreground/80 hover:text-foreground"
              >
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  {contact.address1}
                  <br />
                  {contact.city}, {contact.state} {contact.zip}
                </span>
              </a>
              <a
                href={`tel:${contact.phoneHref}`}
                className="inline-flex items-center gap-3 text-foreground/80 hover:text-foreground"
              >
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-3 text-foreground/80 hover:text-foreground"
              >
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                {contact.email}
              </a>
              <div className="inline-flex items-center gap-3 text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
                {contact.hours}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
              Services
            </div>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services#${s.slug}`}
                    className="text-foreground/80 hover:text-foreground"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
              Company
            </div>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link
                    to={n.href}
                    className="text-foreground/80 hover:text-foreground"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
              Affiliations
            </div>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-foreground/80">
              <li>Member, ABC Eastern PA</li>
              <li>Merit Shop Organization</li>
              <li>Family-Owned Since 1983</li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12" />
        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} Entrance Systems, Inc. All rights
            reserved.
          </div>
          <div>Pennsburg, PA · Serving the Mid-Atlantic region.</div>
        </div>
      </div>
    </footer>
  );
}
