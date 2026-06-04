import { SitePage } from "../page";
import { pageSeo } from "../seo";

export const metadata = pageSeo.pricing;

export default function PricingPage() {
  return <SitePage page="pricing" />;
}
