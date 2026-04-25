import { Poppins } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata = {
  metadataBase: new URL("https://annadan.harekrishnavizag.org"),
  title: {
    default: "Annadan Donation | Gau Seva Donation | Hare Krishna Movement Vizag",
    template: "%s | Hare Krishna Movement Vizag"
  },
  description:
    "Support Annadan donation, Annadanam seva, Gau Seva donation, food donation and charitable seva initiatives from Hare Krishna Movement Vizag through a fast, mobile-friendly donation experience."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
