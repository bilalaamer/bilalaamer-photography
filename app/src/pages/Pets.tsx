import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { SiteData } from "../sitedata";
import { toArr, labelFor } from "../sitedata";
import Hero from "../components/Hero";
import Ornament from "../components/Ornament";
import ContactSection from "../components/ContactSection";
import { useLightbox } from "../components/Lightbox";
import { useReveal } from "../hooks/useReveal";
import { StickyCard002 } from "../components/ui/skiper-ui/skiper17";
import { config } from "../config";

export default function Pets({ data }: { data: SiteData }) {
  useReveal([data]);
  const { open } = useLightbox();

  const pets = toArr(data.pets);
  const hero = toArr(data.heroes.pets);

  const galleryList = useMemo(
    () => pets.map((p) => ({ full: p.full, thumb: p.thumb, label: labelFor(p) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pets.length]
  );

  return (
    <main>
      <Hero
        short
        images={hero}
        eyebrow="Pet Photography · UAE"
        title={
          <>
            Paws, whiskers and <em>personality</em>.
          </>
        }
        sub="Portrait sessions for the furry members of your family — at home, outdoors or in the studio, with plenty of patience and treats."
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

      <section className="section" id="gallery">
        <div className="container">
          <div className="section-head split reveal">
            <div>
              <p className="eyebrow">The Gallery</p>
              <h2 className="title">
                Pet <em>portraits</em>
              </h2>
            </div>
            <p className="lede">
              A few favourite frames from recent sessions — scroll through the stack, and click
              any photo to open it full screen.
            </p>
          </div>
        </div>
        {pets.length >= 2 ? (
          <StickyCard002
            cards={pets.map((p) => ({ id: p.id, image: p.full, alt: labelFor(p) }))}
            onSelect={(i) => open(galleryList, i)}
          />
        ) : (
          <div className="container">
            <p className="lede">Photos coming soon.</p>
          </div>
        )}
      </section>

      <Ornament />

      <section className="section tight" id="experience">
        <div className="container">
          <div className="section-head split reveal">
            <div>
              <p className="eyebrow">Session Types</p>
              <h2 className="title">
                How we can <em>shoot yours</em>
              </h2>
            </div>
            <p className="lede">Sessions are built around your pet's comfort — their pace, their space, their favourite treats.</p>
          </div>
          <div className="experience-grid reveal">
            <div className="exp">
              <span className="num">01</span>
              <h3>At-Home Sessions</h3>
              <p>Relaxed portraits in your pet's own space — where they are happiest and most themselves.</p>
            </div>
            <div className="exp">
              <span className="num">02</span>
              <h3>Outdoor Adventures</h3>
              <p>Parks, beaches and golden-hour corners — sessions built around play and natural light.</p>
            </div>
            <div className="exp">
              <span className="num">03</span>
              <h3>Studio &amp; Events</h3>
              <p>Clean studio portraits, adoption days and pet-club events across the Emirates.</p>
            </div>
            <div className="exp">
              <span className="num">04</span>
              <h3>Family &amp; Kids</h3>
              <p>Portraits with the whole family — pets included, chaos warmly welcomed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="cta">
        <div className="container">
          <p className="eyebrow">Book a Session</p>
          <h2 className="title">
            Got a photogenic <em>pet</em>?
          </h2>
          <p>
            Tell me about your furry — or feathered — family member and I'll plan the session
            around them.
          </p>
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
        eyebrow="Enquire"
        title={
          <>
            Let's book your <em>pet session</em>
          </>
        }
        lede="Send over a photo of your pet and any dates in mind — I usually reply within a day."
      />

      <p style={{ textAlign: "center", padding: "0 5vw 48px" }}>
        <Link className="btn btn-ghost" to="/">
          Back to home
        </Link>
      </p>
    </main>
  );
}
