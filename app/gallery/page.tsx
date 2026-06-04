import { SitePage } from "../page";
import { pageSeo } from "../seo";

export const metadata = pageSeo.gallery;

export default function GalleryPage() {
  return <SitePage page="gallery" />;
}
