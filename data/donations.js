export const sliderImages = [
  {
    href: "#annadaan",
    src: "/banners/narasimha-jayanthi-desktop.jpeg",
    mobileSrc: "/banners/narasimha-jayanthi-mobile.jpeg",
    alt: "Narasimha Jayanthi banner"
  },
  {
    href: "#goseva",
    src: "/banners/gau-seva-desktop.png",
    mobileSrc: "/banners/gau-seva-mobile.png",
    alt: "Gau Seva banner"
  },
  {
    href: "#annadaan",
    src: "/banners/5-billion-meals-desktop.webp",
    mobileSrc: "/banners/5-billion-meals-mobile.jpeg",
    alt: "5 Billion Meals banner"
  },
  {
    href: "#goseva",
    src: "/banners/ekadashi-desktop.webp",
    mobileSrc: "/banners/ekadashi-mobile.webp",
    alt: "Ekadashi banner"
  }
];

export const annadaanCards = [
  { sevaId: "11", title: "Mahalakshmi Homa", amount: "Rs. 1,100", numericAmount: 1100 },
  { sevaId: "1", title: "Annadana Seva", amount: "Rs. 1,100", numericAmount: 1100 },
  { sevaId: "2", title: "Gau Seva", amount: "Rs. 1,100", numericAmount: 1100 },
  { sevaId: "3", title: "Mandir Nirman Seva", amount: "Rs. 2,100", numericAmount: 2100 },
  { sevaId: "4", title: "Chandan Alankar Seva", amount: "Rs. 501", numericAmount: 501 },
  { sevaId: "5", title: "Akshaya Tritiya Seva", amount: "Rs. 1,100", numericAmount: 1100 },
  { sevaId: "10", title: "Donate any other Amount", amount: "Custom Amount", numericAmount: 0 }
];

export const goSevaCards = [
  { sevaId: "21", title: "Gau Seva", amount: "Rs. 1,100", numericAmount: 1100 },
  { sevaId: "12", title: "Medicines For Cow", amount: "Rs. 2,500", numericAmount: 2500 },
  { sevaId: "13", title: "Feed A Cow For A Month", amount: "Rs. 3,500", numericAmount: 3500 },
  { sevaId: "14", title: "Green Grass For All Cows", amount: "Rs. 9,000", numericAmount: 9000 },
  { sevaId: "15", title: "Fooder For All Cows", amount: "Rs. 15,000", numericAmount: 15000 },
  { sevaId: "16", title: "Adopt A Cow For An Year", amount: "Rs. 40,000", numericAmount: 40000 },
  { sevaId: "20", title: "Donate any other Amount", amount: "Custom Amount", numericAmount: 0 }
];

export const galleryImages = [
  {
    src: "/gallery/service-activity-1.png",
    alt: "Eminent personalities supporting the cause"
  },
  {
    src: "/gallery/service-activity-2.png",
    alt: "Well-wishers and supporters standing with the mission"
  },
  {
    src: "/gallery/service-activity-3.png",
    alt: "Daily anna-daan service activity"
  },
  {
    src: "/gallery/service-activity-4.png",
    alt: "Children receiving annadaan support"
  }
];

const withVariant = (items, variant, sectionTitle) =>
  items.map((item) => ({
    ...item,
    variant,
    sectionTitle
  }));

export const allDonations = [
  ...withVariant(annadaanCards, "annadaan", "Akshaya Tritiya Seva"),
  ...withVariant(goSevaCards, "gau", "Gau Seva")
];

export function getDonationBySevaId(sevaId) {
  return allDonations.find((item) => item.sevaId === sevaId) ?? allDonations[0];
}
