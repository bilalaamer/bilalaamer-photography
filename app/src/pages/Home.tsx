import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import type { SiteData } from "../sitedata";
import { toArr, labelFor } from "../sitedata";
import Hero from "../components/Hero";
import Ornament from "../components/Ornament";
import RevealGrid3D from "../components/RevealGrid3D";
import ContactSection from "../components/ContactSection";
import { useReveal } from "../hooks/useReveal";
import { useGoToSection } from "../hooks/useGoToSection";
import { config } from "../config";

export default function Home({ data }: { data: SiteData }) {
  const loc = useLocation();
  const goToSection = useGoToSection();
  useReveal([data]);

  useEffect(() => {
    const target = (loc.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      const t = setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      window.history.replaceState({}, "");
      return () => clearTimeout(t);
    }
  }, [loc.state]);

  const portfolio = toArr(data.portfolio);
  /* "Selected Work" is randomly scrambled on every page load */
  const shuffledPortfolio = useMemo(() => {
    const arr = [...portfolio];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio.length]);
  const weddings = toArr(data.weddings);
  const automobile = toArr(data.automobile);
  const pets = toArr(data.pets);
  const home = toArr(data.heroes.home);

  const strip = useMemo(
    () => weddings.find((w) => w.cat === "w-bride") || weddings[0],
    [weddings]
  );
  const autoStrip = useMemo(
    () => automobile.find((a) => a.file === "DSC09013-Enhanced-NR.JPG") || automobile[0],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [automobile.length]
  );
  const petStrip = useMemo(
    () => pets.find((p) => p.file === "DSC08881-Enhanced-NR.JPG") || pets[0],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pets.length]
  );
  const aboutItem = data.heroes.about || portfolio[0];

  return (
    <main>
      <Hero
        images={home}
        eyebrow="Dubai · United Arab Emirates"
        title={
          <>
            Every moment, <em>beautifully</em> told.
          </>
        }
        sub="Weddings, family celebrations, corporate events, automobile shoots and outdoor stories — photographed with warmth, calm direction and a timeless style, across the UAE."
        actions={
          <>
            <Link className="btn btn-gold" to="/weddings">
              Explore Celebrations
            </Link>
            <a
              className="btn btn-ghost"
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                goToSection("portfolio");
              }}
            >
              View Portfolio
            </a>
          </>
        }
      />

      <section className="statement" id="intro">
        <div className="container">
          <p className="eyebrow">Bilal Aamer Photography</p>
          <h2>
            Photographing <em>love</em>, <em>light</em> and life across the Emirates — weddings,
            celebrations and everything in between.
          </h2>
          <Ornament />
        </div>
      </section>

      <section className="section" id="portfolio">
        <div className="container">
          <div className="section-head split reveal">
            <div>
              <p className="eyebrow">Selected Work</p>
              <h2 className="title">
                A look through <em>the lens</em>
              </h2>
            </div>
            <p className="lede">
              Personal projects and client work — automotive, travel, portraits and celebrations,
              all edited by hand.
            </p>
          </div>
          {shuffledPortfolio.length > 0 ? (
            <RevealGrid3D items={shuffledPortfolio} />
          ) : (
            <p className="lede">Photos coming soon.</p>
          )}
        </div>
      </section>

      {strip && (
        <section className="wed-strip">
          <div className="media">
            <img
              src={strip.full}
              alt={labelFor(strip) + " — Bilal Aamer Photography"}
              style={{
                objectPosition: strip.h > strip.w * 1.05 ? "center 25%" : "center"
              }}
            />
          </div>
          <div className="copy">
            <p className="eyebrow">Celebrations</p>
            <h2 className="title">
              Wedding stories, <em>told honestly</em>.
            </h2>
            <p>
              From mehndi nights and nikkah ceremonies to walima receptions — full, calm coverage
              with portraits you will frame for decades.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-gold" to="/weddings">
                View Celebrations
              </Link>
            </div>
          </div>
        </section>
      )}

      {autoStrip && (
        <section className="wed-strip flip">
          <div className="media">
            <img
              src={autoStrip.full}
              alt={"Automobile photography — Bilal Aamer Photography"}
              style={{
                objectPosition: autoStrip.h > autoStrip.w * 1.05 ? "center 25%" : "center"
              }}
            />
          </div>
          <div className="copy">
            <p className="eyebrow">Automobile</p>
            <h2 className="title">
              Machines, <em>beautifully</em> shot.
            </h2>
            <p>
              Golden-hour locations, rolling frames and night studies — for owners, clubs and
              dealerships across the Emirates.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-gold" to="/automobile">
                View Automobile Work
              </Link>
            </div>
          </div>
        </section>
      )}

      {petStrip && (
        <section className="wed-strip">
          <div className="media">
            <img
              src={petStrip.full}
              alt={"Pet photography — Bilal Aamer Photography"}
              style={{
                objectPosition: petStrip.h > petStrip.w * 1.05 ? "center 30%" : "center"
              }}
            />
          </div>
          <div className="copy">
            <p className="eyebrow">Pets</p>
            <h2 className="title">
              Paws, whiskers and <em>personality</em>.
            </h2>
            <p>
              Relaxed portrait sessions for the furry members of your family — at home, outdoors
              or in the studio.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-gold" to="/pets">
                View Pet Portraits
              </Link>
            </div>
          </div>
        </section>
      )}

      <Ornament />

      <section className="section" id="services">
        <div className="container">
          <div className="section-head split reveal">
            <div>
              <p className="eyebrow">Services</p>
              <h2 className="title">
                Photography for <em>every occasion</em>
              </h2>
            </div>
            <p className="lede">
              Based in Dubai and shooting across the Emirates — for families, couples and
              businesses.
            </p>
          </div>
          <div className="services-grid">
            <article className="service reveal">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9.5" cy="14" r="5.2" />
                <circle cx="14.5" cy="14" r="5.2" />
                <path d="M12 3.6l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7z" />
              </svg>
              <h3>Wedding Photography</h3>
              <p>
                Nikah, mehndi and walima coverage with candid storytelling and elegant couple
                portraits. A dedicated gallery on this site shows recent work.
              </p>
              <Link className="svc-link" to="/weddings">
                View celebrations
              </Link>
            </article>
            <article className="service reveal">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
                <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
                <path d="M3 12.5h18" />
              </svg>
              <h3>Corporate &amp; Events</h3>
              <p>
                Conferences, award nights, seminars and brand events across the UAE — discreet
                coverage, quick turnaround, images ready for press and social media.
              </p>
              <button className="svc-link" type="button" onClick={() => goToSection("contact")}>
                Enquire
              </button>
            </article>
            <article className="service reveal">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="17.5" cy="6" r="2.4" />
                <path d="M3 19.5l6.2-9.3 4 5.7 2.3-3.1 5.5 6.7z" />
              </svg>
              <h3>Outdoor &amp; Lifestyle Shoots</h3>
              <p>
                Golden-hour location sessions — desert, corniche or city lights, always planned
                around the best light.
              </p>
              <button className="svc-link" type="button" onClick={() => goToSection("contact")}>
                Enquire
              </button>
            </article>
            <article className="service reveal">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.5 17l1.8-5.5A1.8 1.8 0 0 1 7.1 10.3h9.8a1.8 1.8 0 0 1 1.8 1.2L20.5 17" />
                <path d="M3.5 17h17" />
                <circle cx="7.4" cy="18.2" r="1.6" />
                <circle cx="16.6" cy="18.2" r="1.6" />
              </svg>
              <h3>Automobile Shoots</h3>
              <p>
                Cars, bikes and themed builds — golden-hour location shoots, rolling frames and
                night studies for owners, clubs and dealerships.
              </p>
              <Link className="svc-link" to="/automobile">
                View automobile work
              </Link>
            </article>
            <article className="service reveal">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8.4" r="3.6" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
              <h3>Family &amp; Portrait Sessions</h3>
              <p>
                Bismillah ceremonies, birthdays, graduations and family portraits — relaxed
                sessions that keep everyone comfortable and everyone smiling.
              </p>
              <button className="svc-link" type="button" onClick={() => goToSection("contact")}>
                Enquire
              </button>
            </article>
          </div>
        </div>
      </section>

      <Ornament />

      <section className="section" id="about">
        <div className="container">
          <div className={"about-grid" + (aboutItem ? "" : " no-media")}>
            {aboutItem && (
              <div className="about-media reveal">
                <img
                  src={"src" in aboutItem && aboutItem.src ? aboutItem.src : (aboutItem as { full?: string }).full || ""}
                  alt="Bilal Aamer behind the camera"
                />
              </div>
            )}
            <div className="about-copy reveal">
              <p className="eyebrow">About</p>
              <h2 className="title">
                Behind <em>the camera</em>
              </h2>
              <p>
                I'm Bilal Aamer — a photographer based in the UAE. I'm drawn to honest moments:
                the laughter between poses, the quiet glance before the ceremony, the family
                chaos that makes a house a home.
              </p>
              <p>
                My approach blends calm, documentary-style coverage with gently directed
                portraits, finished with warm, true-to-tone edits that will still feel right
                twenty years from now. I shoot weddings and celebrations, corporate functions,
                and automobile and outdoor sessions across Dubai, Abu Dhabi, Sharjah and the
                wider Emirates.
              </p>
              <p className="signature">Bilal Aamer</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="cta">
        <div className="container">
          <p className="eyebrow">Let's Work Together</p>
          <h2 className="title">
            Planning a wedding or an <em>event</em>?
          </h2>
          <p>
            Tell me your dates and your vision — weddings, corporate functions and outdoor
            shoots across the UAE. I'll take it from there.
          </p>
          <div className="hero-actions">
            <a className="btn btn-gold" href={config.whatsapp} target="_blank" rel="noopener">
              WhatsApp Me
            </a>
            <button className="btn btn-ghost" type="button" onClick={() => goToSection("contact")}>
              Send an Enquiry
            </button>
          </div>
        </div>
      </section>

      <Ornament />

      <ContactSection
        eyebrow="Contact"
        title={
          <>
            Say <em>hello</em>
          </>
        }
        lede="For bookings and enquiries, reach out on any of these — I usually reply within a day."
      />
    </main>
  );
}
