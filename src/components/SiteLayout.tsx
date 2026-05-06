import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient liquid blobs — bg color the body radial-gradient already
          handles, these add motion and depth */}
      <div
        className="liquid-blob animate-float-slow"
        style={{
          background: "hsla(200, 95%, 55%, 0.5)",
          width: "520px",
          height: "520px",
          top: "-80px",
          left: "-160px",
        }}
      />
      <div
        className="liquid-blob animate-float-slow"
        style={{
          background: "hsla(220, 80%, 55%, 0.35)",
          width: "640px",
          height: "640px",
          top: "30%",
          right: "-200px",
          animationDelay: "-6s",
        }}
      />
      <div
        className="liquid-blob animate-float-slow"
        style={{
          background: "hsla(190, 90%, 55%, 0.28)",
          width: "480px",
          height: "480px",
          bottom: "-160px",
          left: "30%",
          animationDelay: "-12s",
        }}
      />

      <Navbar />
      <main className="relative z-10 pt-24 md:pt-28">{children}</main>
      <Footer />
    </div>
  );
}
