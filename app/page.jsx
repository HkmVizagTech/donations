import AkshayaTritiyaPage from "@/components/AkshayaTritiyaPage";
import { donationStructuredData } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(donationStructuredData("/"))
        }}
      />
      <AkshayaTritiyaPage />
    </>
  );
}
