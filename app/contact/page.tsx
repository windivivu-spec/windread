import { SitePage } from "../page";
import { pageSeo } from "../seo";

export const metadata = pageSeo.contact;

export default function ContactPage() {
  return <SitePage page="contact" />;
}
