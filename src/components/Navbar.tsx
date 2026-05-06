import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { contact, navigation } from "@/lib/site-config";

type NavbarProps = {
  /** Use the dark variant on pages that lead with a dark hero. */
  variant?: "light" | "dark";
};

export default function Navbar({ variant = "light" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const dark = variant === "dark";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[backdrop-filter,background-color] duration-300",
        scrolled && (dark ? "glass-bar-dark" : "glass-bar")
      )}
    >
      <div className="container-x">
        <div
          className={cn(
            "flex h-16 items-center justify-between border-b transition-colors md:h-20",
            scrolled
              ? "border-transparent"
              : dark
              ? "border-white/10"
              : "border-paper-3"
          )}
        >
          {/* Wordmark */}
          <Link
            to="/"
            className={cn(
              "group flex items-baseline gap-2",
              dark ? "text-night-fg" : "text-ink"
            )}
          >
            <span className="font-display text-xl font-medium tracking-tight md:text-2xl">
              Entrance Systems
            </span>
            <span
              className={cn(
                "hidden font-mono text-[10px] uppercase tracking-[0.18em] md:inline",
                dark ? "text-white/50" : "text-ink-3"
              )}
            >
              Est. 1983
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity",
                      dark ? "text-night-fg" : "text-ink",
                      isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-6 md:flex">
            <a
              href={`tel:${contact.phoneHref}`}
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.18em]",
                dark ? "text-night-fg" : "text-ink"
              )}
            >
              {contact.phone}
            </a>
            <Button
              asChild
              size="sm"
              variant={dark ? "secondary" : "default"}
              className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              <Link to="/contact">Request a bid</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center md:hidden",
              dark ? "text-night-fg" : "text-ink"
            )}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className={cn(
            "border-t md:hidden",
            dark
              ? "border-white/10 bg-night text-night-fg"
              : "border-paper-3 bg-paper text-ink"
          )}
        >
          <nav className="container-x py-6">
            <ul className="flex flex-col">
              {navigation.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "block border-b py-4 font-display text-2xl",
                        dark ? "border-white/10" : "border-paper-3",
                        isActive ? "opacity-100" : "opacity-60"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`tel:${contact.phoneHref}`}
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.18em]",
                  dark ? "text-white/70" : "text-ink-3"
                )}
              >
                {contact.phone}
              </a>
              <Button
                asChild
                variant={dark ? "secondary" : "default"}
                className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
              >
                <Link to="/contact">Request a bid</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
