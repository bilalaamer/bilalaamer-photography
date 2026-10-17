import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { SiteData } from "../sitedata";
import { toArr, labelFor } from "../sitedata";
import Hero from "../components/Hero";
import Ornament from "../components/Ornament";
import ContactSection from "../components/ContactSection";
import { useLightbox } from "../components/Lightbox";
import { useReveal } from "../hooks/useReveal";
import { Skiper30 } from "../components/ui/skiper-ui/skiper30";
import { Skiper34 } from "../components/ui/skiper-ui/skiper34";
import { config } from "../config";

export default function Automobile({ data }: { data: SiteData }) {
  useReveal([data]);
  const { open } = useLightbox();

  const automobile = toArr(data.automobile);
  const hero = toArr(data.heroes.automobile);

  /* The scroll gallery leads with this photo. Matched by source filename
     (recorded by build.ps1), so it stays first even when more photos are
     added to the folder later. */
  const LEAD_FILE = "DSC09013-Enhanced-NR.JPG";
  const stack = useMemo(() => {
    const items = [...automobile];
    const idx = items.findIndex((a) => a.file === LEAD_FILE);
    if (idx > 0) {
      const [lead] = items.splice(idx, 1);
      items.unshift(lead);
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automobile.length]);

  const showcase = automobile.slice(0, 12).map((a) => a.full);
  const galleryList = useMemo(
    () => stack.map((a) => ({ full: a.full, thumb: a.thumb, label: labelFor(a) })),
    [stack]
  );

  return (
    <main>
      <Hero
        short
        images={hero}
        eyebrow="Automobile Photography · UAE"
        title={
          <>
            Machines, <em>beautifully</em> shot.
          </>
        }
        sub="Golden-hour location shoots, rolling frames and night studies — for owners, clubs and dealerships across the Emirates."
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
              Book a Shoot
            </a>
          </>
        }
      />

      {showcase.length >= 6 && (
        <section id="showcase" aria-label="Parallax showcase">
          <div className="container" style={{ paddingTop: 76 }}>
            <div className="section-head split reveal">
              <div>
                <p className="eyebrow">Showcase</p>
                <h2 className="title">
                  In motion, <em>in light</em>
                </h2>
              </div>
              <p className="lede">
                Scroll through the depth gallery — a Skiper UI parallax showcase of recent shoots.
              </p>
            </div>
          </div>
          <Skiper30 images={showcase} />
        </section>
      )}

      {automobile.length >= 3 && (
        <section className="section" id="gallery">
          <div className="container">
            <div className="section-head split reveal">
              <div>
                <p className="eyebrow">The Gallery</p>
                <h2 className="title">
                  Automobile <em>shoots</em>
                </h2>
              </div>
              <p className="lede">
                Scroll through the reveal — click any photo to open it full screen.
              </p>
            </div>
          </div>
          <Skiper34
            images={stack.map((a) => a.full)}
            onSelect={(i) => open(galleryList, i)}
          />
        </section>
      )}

      <Ornament />

      <section className="section tight" id="shoot-types">
        <div className="container">
          <div className="section-head split reveal">
            <div>
              <p className="eyebrow">Shoot Types</p>
              <h2 className="title">
                How we can <em>shoot yours</em>
              </h2>
            </div>
            <p className="lede">
              Every shoot is planned around your car, your colour and the best light of the day.
            </p>
          </div>
          <div className="experience-grid reveal">
            <div className="exp">
              <span className="num">01</span>
              <h3>Golden-Hour Locations</h3>
              <p>Desert roads, corniche backdrops and quiet city corners — timed to the best light.</p>
            </div>
            <div className="exp">
              <span className="num">02</span>
              <h3>Night &amp; Neon</h3>
              <p>City lights, wet-pavement reflections and long exposures that make paint and chrome glow.</p>
            </div>
            <div className="exp">
              <span className="num">03</span>
              <h3>Rolling Shots</h3>
              <p>Dynamic frames captured in motion — ideal for features, listings and social media.</p>
            </div>
            <div className="exp">
              <span className="num">04</span>
              <h3>Clubs &amp; Dealerships</h3>
              <p>Coverage for car meets, launches and showroom events across the Emirates.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="cta">
        <div className="container">
          <p className="eyebrow">Book a Shoot</p>
          <h2 className="title">
            Got a build worth <em>showing off</em>?
          </h2>
          <p>
            Tell me the car, the colour and the vibe — I'll plan the locations, the timing and the
            light.
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
            Let's plan your <em>shoot</em>
          </>
        }
        lede="Send over your car or bike and any dates in mind — I usually reply within a day."
      />

      <p style={{ textAlign: "center", padding: "0 5vw 48px" }}>
        <Link className="btn btn-ghost" to="/">
          Back to home
        </Link>
      </p>
    </main>
  );
}
