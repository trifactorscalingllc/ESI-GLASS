import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
  /** Use "dark" when the page leads with a dark hero (so the navbar inverts). */
  navVariant?: "light" | "dark";
};

export default function SiteLayout({ children, navVariant = "light" }: Props) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar variant={navVariant} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
