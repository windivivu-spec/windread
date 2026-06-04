import { SitePage } from "../page";
import { pageSeo } from "../seo";

export const metadata = pageSeo.shop;

export default function ShopPage() {
  return <SitePage page="shop" />;
}
