import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { config } from "../config";
import { useGoToSection } from "../hooks/useGoToSection";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const goToSection = useGoToSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const go = (id: string) => {
    setOpen(false);
    goToSection(id);
  };

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "") + (open ? " nav-open" : "")}>
      <div className="container">
        <Link className="brand" to="/" aria-label={config.name + " — home"}>
          <span className="brand-name">Bilal Aamer</span>
          <span className="brand-sub">Photography</span>
        </Link>
        <nav className="nav" aria-label="Main navigation">
          <button type="button" onClick={() => go("portfolio")}>
            Portfolio
          </button>
          <button type="button" onClick={() => go("services")}>
            Services
          </button>
          <button type="button" onClick={() => go("about")}>
            About
          </button>
          <button type="button" onClick={() => go("contact")}>
            Contact
          </button>
          <Link className={"nav-weddings" + (pathname === "/weddings" ? " active" : "")} to="/weddings">
            Celebrations
          </Link>
          <Link className={"nav-automobile" + (pathname === "/automobile" ? " active" : "")} to="/automobile">
            Automobile
          </Link>
          <Link className={"nav-pets" + (pathname === "/pets" ? " active" : "")} to="/pets">
            Pets
          </Link>
        </nav>
        <button className="nav-toggle" type="button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
