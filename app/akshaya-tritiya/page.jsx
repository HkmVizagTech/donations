import AkshayaTritiyaPage from "@/components/AkshayaTritiyaPage";

const pageTitle =
  "Donate Annadan, Annadanam and Gau Seva in Vizag";
const pageDescription =
  "Donate online for Annadan, Annadanam, Gau Seva, cow protection, festival seva and food donation through Hare Krishna Movement Vizag. Mobile-friendly donation page with fast checkout.";

export const metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "donate",
    "donation",
    "annadan",
    "annadan donation",
    "annadanam",
    "annadanam donation",
    "food donation",
    "gau seva",
    "gau seva donation",
    "go seva",
    "cow donation",
    "cow protection donation",
    "charity donation",
    "festival donation",
    "narasimha jayanthi donation",
    "ekadashi donation",
    "hare krishna vizag donation",
    "donate for needy",
    "donate food online"
  ],
  alternates: {
    canonical: "/akshaya-tritiya"
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://annadan.harekrishnavizag.org/akshaya-tritiya",
    siteName: "Hare Krishna Movement Vizag",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/banners/nsj-annadan-web.jpeg",
        width: 1690,
        height: 669,
        alt: "Annadan and Gau Seva donation banner"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/banners/nsj-annadan-web.jpeg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function AkshayaTritiyaRoute() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        name: "Hare Krishna Movement Vizag",
        url: "https://annadan.harekrishnavizag.org/akshaya-tritiya",
        logo: "https://annadan.harekrishnavizag.org/banners/nsj-annadan-web.jpeg",
        email: "mukunda@hkmvizag.org",
        telephone: "+91-8977761187",
        areaServed: "India",
        description: pageDescription,
        sameAs: [
          "https://www.facebook.com/hkm.vizag",
          "https://www.instagram.com/harekrishnavizag/",
          "https://www.youtube.com/user/harekrishnavizag"
        ]
      },
      {
        "@type": "WebPage",
        name: pageTitle,
        url: "https://annadan.harekrishnavizag.org/akshaya-tritiya",
        description: pageDescription,
        about: [
          "Annadan donation",
          "Annadanam",
          "Gau Seva",
          "Food donation",
          "Cow protection donation"
        ],
        potentialAction: {
          "@type": "DonateAction",
          target: "https://annadan.harekrishnavizag.org/akshaya-tritiya"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AkshayaTritiyaPage />
    </>
  );
}
