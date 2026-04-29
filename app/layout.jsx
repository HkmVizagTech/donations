import { Poppins } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import { absoluteUrl, seoConfig } from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.title,
    template: "%s | ISKCON Charity Vizag"
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: seoConfig.title,
    description: seoConfig.description,
    url: seoConfig.siteUrl,
    siteName: "ISKCON Charity Vizag",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: seoConfig.image,
        width: 1690,
        height: 669,
        alt: seoConfig.imageAlt
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    images: [seoConfig.image]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: absoluteUrl("/branding/iskcon-gambheeram-logo.png")
  }
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
