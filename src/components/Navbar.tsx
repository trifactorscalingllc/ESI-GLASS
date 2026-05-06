import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { company, contact, navigation } from "@/lib/site-config";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="container-x">
        <nav
          className={cn(
            "glass-light glass-reflective relative flex items-center justify-between rounded-2xl px-4 py-3 md:px-5",
            scrolled && "shadow-[0_8px_32px_hsla(215,50%,4%,0.4)]"
          )}
        >
          <Link
            to="/"
            className="group flex items-center gap-3"
            aria-label={`${company.name} home`}
          >
            <Logo className="h-8 w-8 text-primary transition-transform group-hover:rotate-3" />
            <div className="leading-tight">
              <div className="font-display text-[15px] font-bold tracking-tight text-foreground">
                Entrance Systems
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
                Custom Glass Facades · Since 1983
              </div>
            </div>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "relative inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
                      isActive &&
                        "text-foreground bg-white/[0.06] border border-white/10"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={`tel:${contact.phoneHref}`}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              <Phone className="h-3.5 w-3.5" />
              {contact.phone}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_hsla(200,95%,55%,0.35)] transition-transform hover:scale-[1.02] hover:bg-primary/90"
            >
              Request a Bid
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="glass-heavy mt-2 rounded-2xl p-4 md:hidden">
            <ul className="flex flex-col gap-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-xl px-4 py-3 text-base font-medium text-foreground/80 hover:bg-white/5 hover:text-foreground",
                        isActive && "bg-white/5 text-foreground"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                <a
                  href={`tel:${contact.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-foreground"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {contact.phone}
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Request a Bid
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

function Logo({ className }: { className?: string }) {
  // Crystalline "E" mark — abstract glass-facade panes
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <defs>
        <linearGradient id="esi-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(200, 95%, 80%)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="hsl(200, 95%, 55%)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect
        x="3.5"
        y="3.5"
        width="25"
        height="25"
        rx="3"
        fill="url(#esi-grad)"
        stroke="currentColor"
      />
      <path
        d="M10 9.5h12M10 16h9M10 22.5h12"
        stroke="hsl(215, 50%, 10%)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
