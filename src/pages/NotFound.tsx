import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404 — non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout>
      <section className="container-x">
        <div className="glass-heavy glass-reflective relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] p-10 text-center md:p-16">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative">
            <div className="font-display text-7xl font-bold tracking-tight text-gradient">
              404
            </div>
            <h1 className="display-3 mt-4">Page not found</h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              The page you're looking for has moved, or never existed.
            </p>
            <Link
              to="/"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
