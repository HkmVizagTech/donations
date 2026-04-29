export const sliderImages = [
  {
    href: "#annadaan",
    src: "/banners/nsj-annadan-web.jpeg",
    mobileSrc: "/banners/nsj-annadan-mobile.jpeg",
    alt: "Narasimha Jayanthi Annadaan donation banner for ISKCON Charity Vizag"
  },
  {
    href: "#goseva",
    src: "/banners/gau-seva-desktop.png",
    mobileSrc: "/banners/gau-seva-mobile.png",
    alt: "Gau Seva donation and cow protection banner"
  },
  {
    href: "#annadaan",
    src: "/banners/5-billion-meals-desktop.webp",
    mobileSrc: "/banners/5-billion-meals-mobile-final.jpeg",
    alt: "Annadaan food donation campaign banner"
  },
  {
    href: "#goseva",
    src: "/banners/ekadashi-desktop.webp",
    mobileSrc: "/banners/ekadashi-mobile.webp",
    alt: "Ekadashi Annadaan and Gau Seva donation banner"
  }
];

export const annadaanCards = [
  { sevaId: "251", title: "Offer Annadaan Seva", amount: "Rs. 251", numericAmount: 251 },
  { sevaId: "500", title: "Support Annadaan Seva", amount: "Rs. 500", numericAmount: 500 },
  { sevaId: "1000", title: "Sponsor Annadaan Seva", amount: "Rs. 1000", numericAmount: 1000 },
  { sevaId: "11", title: "Feed 50 people", amount: "Rs. 1501", numericAmount: 1501 },
  { sevaId: "1", title: "Feed 100 people", amount: "Rs. 3001", numericAmount: 3001 },
  { sevaId: "2", title: "Feed 200 people", amount: "Rs. 6001", numericAmount: 6001 },
  { sevaId: "3", title: "Feed 300 people", amount: "Rs. 9001", numericAmount: 9001 },
  { sevaId: "4", title: "Feed 500 people", amount: "Rs. 15001", numericAmount: 15001 },
  { sevaId: "5", title: "Feed 1000 people", amount: "Rs. 30,001", numericAmount: 30001 },
  { sevaId: "6", title: "Feed 2000 people", amount: "Rs. 60,001", numericAmount: 60001 },
  { sevaId: "7", title: "Feed 3000 people", amount: "Rs. 90,001", numericAmount: 90001 },
  { sevaId: "8", title: "Feed 5000 people", amount: "Rs. 1,50,000", numericAmount: 150000 },
  { sevaId: "9", title: "Feed 10,000 people", amount: "Rs. 3,00,000", numericAmount: 300000 },
  { sevaId: "10", title: "Donate any other Amount", amount: "Custom Amount", numericAmount: 0 }
];

export const goSevaCards = [
  { sevaId: "251-gau", title: "Offer Gau Seva", amount: "Rs. 251", numericAmount: 251 },
  { sevaId: "500-gau", title: "Support Gau Seva", amount: "Rs. 500", numericAmount: 500 },
  { sevaId: "1000-gau", title: "Sponsor Gau Seva", amount: "Rs. 1000", numericAmount: 1000 },
  { sevaId: "21", title: "Feed 10 Cows For A Day", amount: "Rs. 1500", numericAmount: 1500 },
  { sevaId: "12", title: "Medicines For Cow", amount: "Rs. 2500", numericAmount: 2500 },
  { sevaId: "13", title: "Feed A Cow For A Month", amount: "Rs. 3500", numericAmount: 3500 },
  { sevaId: "14", title: "Feed 5 Cows For A Week", amount: "Rs. 5000", numericAmount: 5000 },
  { sevaId: "15", title: "Green Grass For All Cows For A Day", amount: "Rs. 9000", numericAmount: 9000 },
  { sevaId: "16", title: "Fooder For All Cows For A Day", amount: "Rs. 15,000", numericAmount: 15000 },
  { sevaId: "17", title: "Adopt A Cow For An Year", amount: "Rs. 40,000", numericAmount: 40000 },
  { sevaId: "18", title: "Adopt 3 Cows For An Year", amount: "Rs. 1,20,000", numericAmount: 120000 },
  { sevaId: "19", title: "Adopt 5 Cows For An Year", amount: "Rs. 2,00,000", numericAmount: 200000 },
  { sevaId: "20", title: "Donate any other Amount", amount: "Custom Amount", numericAmount: 0 }
];

export const galleryImages = [
  {
    src: "/gallery/service-activity-1.png",
    alt: "Supporters of Hare Krishna Movement Vizag charity seva"
  },
  {
    src: "/gallery/service-activity-2.png",
    alt: "Well-wishers supporting Annadaan and Gau Seva donations"
  },
  {
    src: "/gallery/service-activity-3.png",
    alt: "Daily Annadaan food distribution service in Visakhapatnam"
  },
  {
    src: "/gallery/service-activity-4.png",
    alt: "Children receiving Annadaan meal support"
  }
];

const withVariant = (items, variant, sectionTitle) =>
  items.map((item) => ({
    ...item,
    variant,
    sectionTitle
  }));

export const allDonations = [
  ...withVariant(annadaanCards, "annadaan", "Annadaan Seva"),
  ...withVariant(goSevaCards, "gau", "Gau Seva")
];

export function getDonationBySevaId(sevaId) {
  return allDonations.find((item) => item.sevaId === sevaId) ?? allDonations[0];
}
