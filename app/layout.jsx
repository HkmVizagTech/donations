import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata = {
  title: "Akshaya Tritiya Seva | Hare Krishna Movement",
  description:
    "A mobile-friendly Next.js donation landing page for Akshaya Tritiya with improved UI, rich sections, and clear seva calls to action."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>{children}</body>
    </html>
  );
}
