import type { MetadataRoute } from "next";
import { routes, siteUrl } from "./seo";
import { articles } from "../lib/seo/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const staticEntries = routes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified: currentDate,
    changeFrequency:
      route.path === "/news" || route.path === "/"
        ? ("weekly" as const)
        : ("monthly" as const),
    priority: route.priority
  }));

  const articleEntries = articles.map((article) => ({
    url: new URL(`/news/${article.slug}`, siteUrl).toString(),
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  return [...staticEntries, ...articleEntries];
}
