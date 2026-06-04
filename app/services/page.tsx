import { SitePage } from "../page";
import { pageSeo } from "../seo";

export const metadata = pageSeo.services;

export default function ServicesPage() {
  return <SitePage page="services" />;
}
