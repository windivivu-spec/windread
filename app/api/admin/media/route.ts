import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdminContext, adminErrorResponse } from "../../../../lib/admin/auth";

export type MediaCategory = {
  id: string;
  name: string;
  images: Array<{
    src: string;
    filename: string;
    category: string;
  }>;
};

const VALID_IMAGE_EXTS = new Set([".webp", ".png", ".jpg", ".jpeg"]);

export async function GET() {
  try {
    await requireAdminContext();

    const publicDir = path.join(process.cwd(), "public");
    const imagesDir = path.join(publicDir, "images");

    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ categories: [] });
    }

    const categoryMap: Record<string, Array<{ src: string; filename: string; category: string }>> = {
      dreadlocks: [],
      cornrows: [],
      boxbraids: [],
      braids: [],
      stores: [],
      moments: [],
      other: []
    };

    function scanDir(currentDir: string, relPath: string = "") {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const nextRel = relPath ? `${relPath}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          scanDir(fullPath, nextRel);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (VALID_IMAGE_EXTS.has(ext)) {
            const webSrc = `/images/${nextRel}`;
            const lowerPath = nextRel.toLowerCase();

            let cat = "other";
            if (lowerPath.includes("dreadlock")) {
              cat = "dreadlocks";
            } else if (lowerPath.includes("cornrow")) {
              cat = "cornrows";
            } else if (lowerPath.includes("boxbraid")) {
              cat = "boxbraids";
            } else if (lowerPath.includes("braid")) {
              cat = "braids";
            } else if (lowerPath.includes("store") || lowerPath.includes("branch")) {
              cat = "stores";
            } else if (lowerPath.includes("moment") || lowerPath.includes("dsc")) {
              cat = "moments";
            }

            categoryMap[cat].push({
              src: webSrc,
              filename: entry.name,
              category: cat
            });
          }
        }
      }
    }

    scanDir(imagesDir);

    const categories: MediaCategory[] = [
      { id: "all", name: "Tất cả ảnh", images: Object.values(categoryMap).flat() },
      { id: "dreadlocks", name: "Dreadlocks", images: categoryMap.dreadlocks },
      { id: "cornrows", name: "Cornrows", images: categoryMap.cornrows },
      { id: "boxbraids", name: "Box Braids", images: categoryMap.boxbraids },
      { id: "braids", name: "Braids Nữ & Nam", images: categoryMap.braids },
      { id: "moments", name: "Khoảnh khắc & Chi tiết", images: categoryMap.moments },
      { id: "stores", name: "Không gian cơ sở", images: categoryMap.stores }
    ].filter((c) => c.images.length > 0);

    return NextResponse.json({ categories });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
