"use client";

import { useEffect, useRef, useState } from "react";
import BannerCarouselShell from "@/components/BannerCarouselShell";
import CheckoutPage from "@/components/CheckoutPage";
import {
  annadaanCards,
  galleryImages,
  getDonationBySevaId,
  goSevaCards,
  navLinks,
  sliderImages
} from "@/data/donations";

function SevaIcon({ variant }) {
  if (variant === "gau") {
    return (
      <div className={`seva-icon seva-icon-${variant}`} aria-hidden="true">
        <span className="cow-icon">{"\uD83D\uDC04"}</span>
      </div>
    );
  }

  return (
    <div className={`seva-icon seva-icon-${variant}`} aria-hidden="true">
      <span className="plate-icon">{"\uD83C\uDF5A"}</span>
    </div>
  );
}

function DonationCard({ title, amount, sevaId, variant, onDonate }) {
  return (
    <article className={`donation-card-exact donation-card-${variant}`}>
      <div className="donation-card-head">
        <SevaIcon variant={variant} />
      </div>
      <h3>{title}</h3>
      <div className="donation-card-row">
        <div className={`donation-amount donation-amount-${variant}`}>
          <strong>{amount}</strong>
        </div>
        <button
          type="button"
          onClick={() => onDonate(sevaId)}
          className={`donate-button ${
            variant === "gau" ? "donate-button-gau" : "donate-button-annadaan"
          }`}
        >
          DONATE NOW
        </button>
      </div>
    </article>
  );
}

export default function AkshayaTritiyaPage() {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (!selectedDonation || !checkoutRef.current) {
      return;
    }

    window.requestAnimationFrame(() => {
      checkoutRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }, [selectedDonation]);

  const handleDonate = (sevaId) => {
    setSelectedDonation(getDonationBySevaId(sevaId));
  };

  return (
    <main className="exact-page">
      <section className="hero-slider">
        <div className="container-hero">
          <BannerCarouselShell slides={sliderImages} />
        </div>
      </section>

      <section className="headline-wrap container-narrow">
        <div className="headline-block">
          <h1>Your open-hearted contribution will make a difference in</h1>
          <h2>Lives of Hungry &amp; Needy People.</h2>
        </div>
        <div className="headline-actions">
          <a href="#annadaan" className="cta-yellow">
            ANNADAAN
          </a>
          <a href="#goseva" className="cta-green">
            GO SEVA
          </a>
        </div>
      </section>

      <section className="blue-banner">
        <div className="container-narrow blue-banner-inner">
          <img
            src="https://www.harekrishnavizag.org/images/banner1122-1.webp"
            alt="Festival banner"
          />
        </div>
      </section>

      <section className="donation-section container-wide">
        <div className="headline-block thanks">
          <h1>We are thankful for your kind gesture!</h1>
        </div>

        <div className="section-title-wrap">
          <h2 className="section-title annadaan-title" id="annadaan">
            ANNADAAN SEVA
          </h2>
        </div>

        <div className="donation-grid">
          {annadaanCards
            .filter((card) => card.sevaId !== "10")
            .map((card) => (
              <DonationCard
                key={`${card.title}-${card.amount}`}
                {...card}
                variant="annadaan"
                onDonate={handleDonate}
              />
            ))}
          <article className="donation-card-exact donation-card-full donation-card-annadaan">
            <div className="donation-card-head">
              <SevaIcon variant="annadaan" />
            </div>
            <h3>Donate any other Amount</h3>
            <div className="donation-card-row single">
              <button
                type="button"
                onClick={() => handleDonate("10")}
                className="donate-button donate-button-annadaan"
              >
                DONATE NOW
              </button>
            </div>
          </article>
        </div>

        <div className="section-title-wrap">
          <h2 className="section-title goseva-title" id="goseva">
            GO SEVA
          </h2>
        </div>

        <div className="donation-grid">
          {goSevaCards
            .filter((card) => card.sevaId !== "20")
            .map((card) => (
              <DonationCard
                key={`${card.title}-${card.amount}`}
                {...card}
                variant="gau"
                onDonate={handleDonate}
              />
            ))}
          <article className="donation-card-exact donation-card-full donation-card-gau">
            <div className="donation-card-head">
              <SevaIcon variant="gau" />
            </div>
            <h3>Donate any other Amount</h3>
            <div className="donation-card-row single">
              <button
                type="button"
                onClick={() => handleDonate("20")}
                className="donate-button donate-button-gau"
              >
                DONATE NOW
              </button>
            </div>
          </article>
        </div>
      </section>

      {selectedDonation ? (
        <section ref={checkoutRef} className="embedded-checkout-wrap">
          <CheckoutPage
            donation={selectedDonation}
            embedded
            onClose={() => setSelectedDonation(null)}
          />
        </section>
      ) : null}

      <section className="black-strip">
        <div className="container-wide">
          <p>
            Gentle Request! While doing Paytm/UPI App Payments or Bank (NEFT/
            RTGS) please send us screen shot along with Complete address and PAN
            Details on our Whatsapp Number{" "}
            <a href="tel:+919063020108">+91 9063 020 108</a> or to our mail ID{" "}
            <a href="mailto:social@hkmvizag.org">social@hkmvizag.org</a>. You
            may also call on this number for other queries.
          </p>
        </div>
      </section>

      <section className="bank-section container-wide">
        <div className="bank-box">
          <h4>Donation Through Bank (NEFT/ RTGS)</h4>
          <p>
            Beneficiary Name : HARE KRISHNA MOVEMENT INDIA
            <br />
            Bank Name: IDFC FIRST BANK LTD
            <br />
            A/c No: 10091415313
            <br />
            IFSC code: IDFB0080412
          </p>
        </div>
      </section>

      <section className="gallery-section container-wide">
        <div className="gallery-grid">
          {galleryImages.map((src) => (
            <img key={src} src={src} alt="Service activity" />
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid container-wide">
          <div>
            <h3>ABOUT US</h3>
            <p>
              We are trying to give human society an opportunity for a life of
              happiness, good health, peace of mind and all good qualities
              through God Consciousness.
            </p>
            <h3>SOCIAL CONNECT</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/hkm.vizag" target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href="https://www.youtube.com/user/harekrishnavizag" target="_blank" rel="noreferrer">
                YouTube
              </a>
              <a
                href="https://www.instagram.com/hare_krishna_vizag/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h3>NAVIGATION</h3>
            <ul className="footer-links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>ADDRESS</h3>
            <p>
              <strong>Sri Nitai Gauranga Mandir</strong>
              <br />
              Hare Krishna Movement
              <br />
              1-57/45, Plot No 45,
              <br />
              Chaya Kutir Apartment, Sandipini Nagar,
              <br />
              Endada, Visakhapatnam,
              <br />
              Andhra Pradesh 530045
            </p>
          </div>

          <div>
            <img
              src="https://www.harekrishnavizag.org/images/hkv_logo.webp"
              width="140"
              height="88"
              alt="Hare Krishna Vizag logo"
            />
            <h3>CONTACT INFO</h3>
            <ul className="footer-links">
              <li>
                <a href="tel:+919063020108">9063 020 108</a>
              </li>
              <li>
                <a href="mailto:social@hkmvizag.org">social@hkmvizag.org</a>
              </li>
              <li>
                <a href="https://wa.me/919063020108" target="_blank" rel="noreferrer">
                  WhatsApp 9063 020 108
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="copyright-row">
          <div className="container-wide copyright-inner">
            <p>{"Copyright \u00A9 2023 Hare Krishna Vizag."}</p>
            <p>Design by WebMahans</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
