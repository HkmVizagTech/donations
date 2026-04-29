import { seoConfig } from "@/lib/seo";

export default function sitemap() {
  const lastModified = new Date();

  return [
    {
      url: seoConfig.siteUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${seoConfig.siteUrl}/akshaya-tritiya`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9
    }
  ];
}
