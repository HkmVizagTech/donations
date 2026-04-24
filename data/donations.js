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
  ...withVariant(annadaanCards, "annadaan", "Akshaya Tritiya Seva"),
  ...withVariant(goSevaCards, "gau", "Gau Seva")
];

export function getDonationBySevaId(sevaId) {
  return allDonations.find((item) => item.sevaId === sevaId) ?? allDonations[0];
}
