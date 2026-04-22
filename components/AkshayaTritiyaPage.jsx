import BannerCarousel from "@/components/BannerCarousel";

const sliderImages = [
  {
    href: "#annadaan",
    src: "/banners/annadaan-banner.webp",
    alt: "Annadaan banner"
  },
  {
    href: "#goseva",
    src: "/banners/goseva-banner.webp",
    alt: "Go Seva banner"
  }
];

const annadaanCards = [
  { title: "Feed 50 people", amount: "Rs. 1501", href: "checkout.php?seva_id=11" },
  { title: "Feed 100 people", amount: "Rs. 3001", href: "checkout.php?seva_id=1" },
  { title: "Feed 200 people", amount: "Rs. 6001", href: "checkout.php?seva_id=2" },
  { title: "Feed 300 people", amount: "Rs. 9001", href: "checkout.php?seva_id=3" },
  { title: "Feed 500 people", amount: "Rs. 15001", href: "checkout.php?seva_id=4" },
  { title: "Feed 1000 people", amount: "Rs. 30,001", href: "checkout.php?seva_id=5" },
  { title: "Feed 2000 people", amount: "Rs. 60,001", href: "checkout.php?seva_id=6" },
  { title: "Feed 3000 people", amount: "Rs. 90,001", href: "checkout.php?seva_id=7" },
  { title: "Feed 5000 people", amount: "Rs. 1,50,000", href: "checkout.php?seva_id=8" },
  { title: "Feed 10,000 people", amount: "Rs. 3,00,000", href: "checkout.php?seva_id=9" }
];

const goSevaCards = [
  { title: "Feed 10 Cows For A Day", amount: "Rs. 1500", href: "checkout.php?seva_id=21" },
  { title: "Medicines For Cow", amount: "Rs. 2500", href: "checkout.php?seva_id=12" },
  { title: "Feed A Cow For A Month", amount: "Rs. 3500", href: "checkout.php?seva_id=13" },
  { title: "Feed 5 Cows For A Week", amount: "Rs. 5000", href: "checkout.php?seva_id=14" },
  { title: "Green Grass For All Cows For A Day", amount: "Rs. 9000", href: "checkout.php?seva_id=15" },
  { title: "Fooder For All Cows For A Day", amount: "Rs. 15,000", href: "checkout.php?seva_id=16" },
  { title: "Adopt A Cow For An Year", amount: "Rs. 40,000", href: "checkout.php?seva_id=17" },
  { title: "Adopt 3 Cows For An Year", amount: "Rs. 1,20,000", href: "checkout.php?seva_id=18" },
  { title: "Adopt 5 Cows For An Year", amount: "Rs. 2,00,000", href: "checkout.php?seva_id=19" }
];

const galleryImages = [
  "https://www.harekrishnavizag.org/images/a75.webp",
  "https://www.harekrishnavizag.org/images/a2.webp",
  "https://www.harekrishnavizag.org/images/a3.webp",
  "https://www.harekrishnavizag.org/images/a4.webp"
];

const navLinks = [
  { label: "HARE KRISHNA MOVEMENT", href: "https://www.harekrishnavizag.org/aboutus" },
  { label: "CONTACT US", href: "https://www.harekrishnavizag.org/contactus" },
  { label: "SUBHOJANAM", href: "https://www.harekrishnavizag.org/subhojanam" },
  { label: "TERMS & CONDITIONS", href: "https://www.harekrishnavizag.org/terms_and_conditions" },
  { label: "REFUND POLICY", href: "https://www.harekrishnavizag.org/cancellation_and_refund_policy" },
  { label: "PRIVACY POLICY", href: "https://www.harekrishnavizag.org/privacy_policy" }
];

function DonationCard({ title, amount, href }) {
  return (
    <article className="donation-card-exact">
      <h3>{title}</h3>
      <div className="donation-card-row">
        <div className="donation-amount">
          <strong>{amount}</strong>
        </div>
        <a
          href={`https://www.harekrishnavizag.org/${href}`}
          className="donate-button"
          target="_blank"
          rel="noreferrer"
        >
          DONATE NOW
        </a>
      </div>
    </article>
  );
}

export default function AkshayaTritiyaPage() {
  return (
    <main className="exact-page">
      <section className="hero-slider">
        <div className="container-hero">
          <BannerCarousel slides={sliderImages} />
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
          {annadaanCards.map((card) => (
            <DonationCard key={`${card.title}-${card.amount}`} {...card} />
          ))}
          <article className="donation-card-exact donation-card-full">
            <h3>Donate any other Amount</h3>
            <div className="donation-card-row single">
              <a
                href="https://www.harekrishnavizag.org/checkout.php?seva_id=10"
                className="donate-button"
                target="_blank"
                rel="noreferrer"
              >
                DONATE NOW
              </a>
            </div>
          </article>
        </div>

        <div className="section-title-wrap">
          <h2 className="section-title goseva-title" id="goseva">
            GO SEVA
          </h2>
        </div>

        <div className="donation-grid">
          {goSevaCards.map((card) => (
            <DonationCard key={`${card.title}-${card.amount}`} {...card} />
          ))}
          <article className="donation-card-exact donation-card-full">
            <h3>Donate any other Amount</h3>
            <div className="donation-card-row single">
              <a
                href="https://www.harekrishnavizag.org/checkout.php?seva_id=20"
                className="donate-button"
                target="_blank"
                rel="noreferrer"
              >
                DONATE NOW
              </a>
            </div>
          </article>
        </div>
      </section>

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
              <a href="https://www.instagram.com/hare_krishna_vizag/" target="_blank" rel="noreferrer">
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
