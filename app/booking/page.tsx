import { SitePage } from "../page";
import { pageSeo } from "../seo";

export const metadata = pageSeo.booking;

export default function BookingPage() {
  return <SitePage page="booking" />;
}
