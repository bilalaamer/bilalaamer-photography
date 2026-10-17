import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { SiteData } from "../sitedata";
import { toArr, labelFor } from "../sitedata";
import Hero from "../components/Hero";
import Ornament from "../components/Ornament";
import { StickyCard002 } from "../components/ui/skiper-ui/skiper17";
import ContactSection from "../components/ContactSection";
import { useLightbox } from "../components/Lightbox";
import { useReveal } from "../hooks/useReveal";
import { config } from "../config";

export default function Weddings({ data }: { data: SiteData }) {
  useReveal([data]);
  const { open } = useLightbox();

  const weddings = toArr(data.weddings);
  const hero = toArr(data.heroes.wedding);

  const galleryList = useMemo(
    () => weddings.map((w) => ({ full: w.full, thumb: w.thumb, label: labelFor(w) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weddings.length]
  );

  return (
    <main>
      <Hero
        short
        images={hero}
        eyebrow="Celebrations · UAE"
        title={
          <>
            Your love story, <em>frame</em> by frame.
          </>
        }
        sub="From mehndi nights to nikkah ceremonies and walima receptions — calm, documentary-style coverage with portraits you will actually frame."
        actions={
          <>
            <a
              className="btn btn-gold"
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View the Gallery
            </a>
            <a
              className="btn btn-ghost"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Enquire Now
            </a>
          </>
        }
      />

      <Ornament />

      {weddings.length >= 2 && (
        <section className="section" id="gallery">
          <div className="container">
            <div className="section-head split reveal">
              <div>
                <p className="eyebrow">The Gallery</p>
                <h2 className="title">
                  Celebration <em>moments</em>
                </h2>
              </div>
              <p className="lede">
                A selection of favourite frames from recent weddings across the UAE — scroll
                through the stack, and click any photo to open it full screen.
              </p>
            </div>
          </div>
          <StickyCard002
            cards={weddings.map((w) => ({ id: w.id, image: w.full, alt: labelFor(w) }))}
            onSelect={(i) => open(galleryList, i)}
          />
        </section>
      )}

      <Ornament />

      <section className="section tight" id="experience">
        <div className="container">
          <div className="section-head split reveal">
            <div>
              <p className="eyebrow">The Experience</p>
              <h2 className="title">
                What your coverage <em>includes</em>
              </h2>
            </div>
            <p className="lede">Every wedding is different — these are the essentials I bring to all of them.</p>
          </div>
          <div className="experience-grid reveal">
            <div className="exp">
              <span className="num">01</span>
              <h3>Multi-Event Coverage</h3>
              <p>Mehndi, nikkah, baraat and walima days covered end to end — no moment left to chance.</p>
            </div>
            <div className="exp">
              <span className="num">02</span>
              <h3>Documentary Storytelling</h3>
              <p>Candid, unposed moments captured as they happen, so the day feels like it really felt.</p>
            </div>
            <div className="exp">
              <span className="num">03</span>
              <h3>Couple &amp; Family Portraits</h3>
              <p>Gently directed portraits of the two of you and both families — efficient, warm and flattering.</p>
            </div>
            <div className="exp">
              <span className="num">04</span>
              <h3>True-to-Tone Editing</h3>
              <p>Warm, elegant colour grading that respects skin tones and ages beautifully.</p>
            </div>
            <div className="exp">
              <span className="num">05</span>
              <h3>A Quick Sneak Peek</h3>
              <p>A curated preview set delivered soon after the wedding — perfect for sharing with family abroad.</p>
            </div>
            <div className="exp">
              <span className="num">06</span>
              <h3>Private Gallery &amp; Albums</h3>
              <p>A private online gallery to share with loved ones, with fine-art album design on request.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="cta">
        <div className="container">
          <p className="eyebrow">Reserve Your Date</p>
          <h2 className="title">
            Wedding season books <em>early</em>.
          </h2>
          <p>Share your event dates and venue — I'll get back to you with availability and everything that's included.</p>
          <div className="hero-actions">
            <a className="btn btn-gold" href={config.whatsapp} target="_blank" rel="noopener">
              WhatsApp Me
            </a>
            <a className="btn btn-ghost" href={config.instagram} target="_blank" rel="noopener">
              See More on Instagram
            </a>
          </div>
        </div>
      </section>

      <Ornament />

      <ContactSection
        lede="Tell me your dates, venue and which events you'd like covered — I usually reply within a day."
      />

      <p style={{ textAlign: "center", padding: "0 5vw 48px" }}>
        <Link className="btn btn-ghost" to="/">
          Back to home
        </Link>
      </p>
    </main>
  );
}
