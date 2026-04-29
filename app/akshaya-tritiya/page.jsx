import AkshayaTritiyaPage from "@/components/AkshayaTritiyaPage";
import { donationStructuredData, seoConfig } from "@/lib/seo";

export const metadata = {
  title: "Donate Annadaan, Narasimha Jayanthi and Gau Seva Online",
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  alternates: {
    canonical: "/akshaya-tritiya"
  },
  openGraph: {
    title: "Donate Annadaan, Narasimha Jayanthi and Gau Seva Online",
    description: seoConfig.description,
    url: "/akshaya-tritiya",
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
    title: "Donate Annadaan, Narasimha Jayanthi and Gau Seva Online",
    description: seoConfig.description,
    images: [seoConfig.image]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function AkshayaTritiyaRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(donationStructuredData("/akshaya-tritiya"))
        }}
      />
      <AkshayaTritiyaPage />
    </>
  );
}
