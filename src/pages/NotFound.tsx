import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404 — non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout>
      <section className="pt-32 pb-32 md:pt-48 md:pb-48">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <div className="chapter">Error 404</div>
            <h1 className="display-1 mt-8 max-w-[12ch] text-balance">
              Page not found.
            </h1>
            <p className="lede mt-8">
              The page you're looking for has moved, been retired, or never
              existed. Use the navigation above or return home.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-12 rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
