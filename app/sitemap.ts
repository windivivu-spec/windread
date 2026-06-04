import type { MetadataRoute } from "next";
import { routes, siteUrl } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified,
    changeFrequency: route.path === "/news" ? "weekly" : "monthly",
    priority: route.priority
  }));
}
