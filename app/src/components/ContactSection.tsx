import React from "react";
import { config } from "../config";

export default function ContactSection({
  eyebrow = "Enquire",
  title = (
    <>
      Let's talk about <em>your day</em>
    </>
  ),
  lede
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  lede: string;
}) {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head split reveal">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="title">{title}</h2>
          </div>
          <p className="lede">{lede}</p>
        </div>
        <div className="contact-grid">
          <a className="contact-card reveal" href={config.whatsapp} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3.5a8.4 8.4 0 0 0-7.2 12.7L3.5 20.5l4.4-1.2A8.4 8.4 0 1 0 12 3.5z" />
              <path d="M8.8 8.2c-.3.7-.4 1.9 1 3.6 1.4 1.7 2.9 2.3 3.6 2.4.7.1 1.4-.1 2-.6l.5-.7-1.6-1.2-.8.4c-.3-.1-.9-.5-1.5-1.2-.5-.7-.7-1.2-.7-1.5l.5-.8-.9-1.6c-.5-.1-1.3 0-2.1 1.2z" />
            </svg>
            <span className="label">WhatsApp</span>
            <span className="value">{config.phoneDisplay}</span>
          </a>
          <a className="contact-card reveal" href={config.instagram} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="1.1" />
            </svg>
            <span className="label">Instagram</span>
            <span className="value">@bilalaamer</span>
          </a>
          <a className="contact-card reveal" href={config.facebook} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 8.5H17V5.2h-2.8c-2.5 0-4 1.5-4 4V11H8v3.2h2.2V21h3.4v-6.8h2.6l.5-3.2h-3.1V9.6c0-.7.3-1.1.9-1.1z" />
            </svg>
            <span className="label">Facebook</span>
            <span className="value">Bilal Aamer Photography</span>
          </a>
          <a className="contact-card reveal" href={"mailto:" + config.email}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3.5 6.5L12 13l8.5-6.5" />
            </svg>
            <span className="label">Email</span>
            <span className="value">{config.email}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
