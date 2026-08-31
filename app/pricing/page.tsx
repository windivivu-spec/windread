import { SitePage } from "../page";
import { getServices } from "../booking/supabaseServer";
import { pageSeo } from "../seo";

export const metadata = pageSeo.pricing;
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  try {
    return <SitePage page="pricing" pricingServices={await getServices()} />;
  } catch {
    return <SitePage page="pricing" pricingDataUnavailable />;
  }
}
