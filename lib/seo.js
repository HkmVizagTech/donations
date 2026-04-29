const siteUrl = "https://iskconcharity.org";

export const seoConfig = {
  siteUrl,
  organizationName: "Hare Krishna Movement Vizag",
  legalName: "Hare Krishna Movement India",
  title: "Donate Annadaan and Gau Seva Online | ISKCON Charity Vizag",
  description:
    "Donate online for Annadaan Seva, Narasimha Jayanthi Annadan, Gau Seva, cow protection and food donation through Hare Krishna Movement Vizag. Support meals for needy people and receive 80G tax benefits.",
  keywords: [
    "ISKCON charity",
    "ISKCON donation",
    "ISKCON Vizag donation",
    "annadaan donation",
    "annadanam donation",
    "Narasimha Jayanthi donation",
    "food donation in Vizag",
    "donate meals online",
    "gau seva donation",
    "cow protection donation",
    "80G donation",
    "Hare Krishna donation",
    "Hare Krishna Movement Vizag",
    "donate food to needy"
  ],
  image: "/banners/nsj-annadan-web.jpeg",
  imageAlt: "Narasimha Jayanthi Annadaan Seva donation by Hare Krishna Movement Vizag",
  phone: "+91-8977761187",
  email: "mukunda@hkmvizag.org",
  address: {
    streetAddress: "IIM Rd, opp. Akshaya Patra Foundation, Gambhiram",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "531163",
    addressCountry: "IN"
  },
  sameAs: [
    "https://www.facebook.com/hkm.vizag",
    "https://www.instagram.com/harekrishnavizag/",
    "https://www.youtube.com/user/harekrishnavizag"
  ]
};

export function absoluteUrl(path = "/") {
  return new URL(path, seoConfig.siteUrl).toString();
}

export function donationStructuredData(path = "/") {
  const pageUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(seoConfig.image);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": `${seoConfig.siteUrl}/#organization`,
        name: seoConfig.organizationName,
        legalName: seoConfig.legalName,
        url: seoConfig.siteUrl,
        logo: absoluteUrl("/branding/iskcon-gambheeram-logo.png"),
        image: imageUrl,
        email: seoConfig.email,
        telephone: seoConfig.phone,
        areaServed: ["Visakhapatnam", "Andhra Pradesh", "India"],
        address: {
          "@type": "PostalAddress",
          ...seoConfig.address
        },
        description: seoConfig.description,
        sameAs: seoConfig.sameAs
      },
      {
        "@type": "WebSite",
        "@id": `${seoConfig.siteUrl}/#website`,
        url: seoConfig.siteUrl,
        name: "ISKCON Charity Vizag",
        publisher: {
          "@id": `${seoConfig.siteUrl}/#organization`
        },
        inLanguage: "en-IN"
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seoConfig.title,
        headline: "Donate Annadaan and Gau Seva Online",
        description: seoConfig.description,
        image: imageUrl,
        isPartOf: {
          "@id": `${seoConfig.siteUrl}/#website`
        },
        about: [
          "Annadaan Seva",
          "Narasimha Jayanthi Annadan",
          "Gau Seva",
          "Food donation",
          "Cow protection donation",
          "80G donation"
        ],
        mainEntity: {
          "@type": "DonateAction",
          name: "Donate for Annadaan and Gau Seva",
          target: pageUrl,
          recipient: {
            "@id": `${seoConfig.siteUrl}/#organization`
          }
        },
        inLanguage: "en-IN"
      }
    ]
  };
}
