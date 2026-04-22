export const sliderImages = [
  {
    href: "#annadaan",
    src: "/banners/5-billion-meals.webp",
    alt: "5 Billion Meals banner"
  },
  {
    href: "#goseva",
    src: "/banners/ekadashi-banner.webp",
    alt: "Ekadashi banner"
  }
];

export const annadaanCards = [
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
  "https://www.harekrishnavizag.org/images/a75.webp",
  "https://www.harekrishnavizag.org/images/a2.webp",
  "https://www.harekrishnavizag.org/images/a3.webp",
  "https://www.harekrishnavizag.org/images/a4.webp"
];

export const navLinks = [
  { label: "HARE KRISHNA MOVEMENT", href: "https://www.harekrishnavizag.org/aboutus" },
  { label: "CONTACT US", href: "https://www.harekrishnavizag.org/contactus" },
  { label: "SUBHOJANAM", href: "https://www.harekrishnavizag.org/subhojanam" },
  { label: "TERMS & CONDITIONS", href: "https://www.harekrishnavizag.org/terms_and_conditions" },
  { label: "REFUND POLICY", href: "https://www.harekrishnavizag.org/cancellation_and_refund_policy" },
  { label: "PRIVACY POLICY", href: "https://www.harekrishnavizag.org/privacy_policy" }
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
