import { SitePage } from "../page";
import { pageSeo } from "../seo";

export const metadata = pageSeo.barbers;

export default function BarbersPage() {
  return <SitePage page="barbers" />;
}
