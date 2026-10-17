import { Link } from "react-router-dom";
import { config } from "../config";
import { useGoToSection } from "../hooks/useGoToSection";

export default function SiteFooter() {
  const goToSection = useGoToSection();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="brand" aria-hidden="true">
            <span className="brand-name">Bilal Aamer</span>
            <span className="brand-sub">Photography</span>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <button type="button" onClick={() => goToSection("portfolio")}>
              Portfolio
            </button>
            <button type="button" onClick={() => goToSection("services")}>
              Services
            </button>
            <button type="button" onClick={() => goToSection("about")}>
              About
            </button>
            <button type="button" onClick={() => goToSection("contact")}>
              Contact
            </button>
            <Link to="/weddings">Celebrations</Link>
            <Link to="/automobile">Automobile</Link>
            <Link to="/pets">Pets</Link>
          </nav>
          <div className="footer-social">
            <a href={config.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8A6.2 6.2 0 1 0 18.2 12 6.2 6.2 0 0 0 12 5.8zm0 10.2A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-11.8a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4z"
                />
              </svg>
            </a>
            <a href={config.facebook} target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.6c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bilal Aamer Photography · Dubai, United Arab Emirates</span>
          <span>Celebrations · Events · Automobile</span>
        </div>
        <p className="footer-credit">
          Gallery motion inspired by{" "}
          <a href="https://skiper-ui.com" target="_blank" rel="noopener">
            Skiper UI
          </a>
        </p>
      </div>
    </footer>
  );
}
