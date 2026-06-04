import { SitePage } from "../page";
import { pageSeo } from "../seo";

export const metadata = pageSeo.news;

export default function NewsPage() {
  return <SitePage page="news" />;
}
