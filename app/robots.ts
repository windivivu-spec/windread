import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/services"],
        disallow: ["/admin/", "/api/"]
      }
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString()
  };
}
