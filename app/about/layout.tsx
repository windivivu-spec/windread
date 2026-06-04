import type { ReactNode } from "react";
import { pageSeo } from "../seo";

export const metadata = pageSeo.about;

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
