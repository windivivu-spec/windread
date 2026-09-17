import { NextRequest, NextResponse } from "next/server";
import { requireAdminContext, adminErrorResponse, AdminAccessError } from "../../../../lib/admin/auth";
import { createServiceClient } from "../../../../lib/supabase/service";
import { articles as staticArticles, type Article, type ArticleCategory } from "../../../../lib/seo/articles";

export async function GET() {
  try {
    await requireAdminContext();

    try {
      const service = createServiceClient();
      const { data, error } = await service
        .from("news_articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Map database columns to Article interface
        const formatted: Article[] = data.map((row) => ({
          slug: row.slug,
          title: row.title,
          metaTitle: row.meta_title || row.title,
          metaDescription: row.meta_description || row.excerpt,
          category: row.category as ArticleCategory,
          categoryLabel: row.category_label || "Cẩm Nang",
          intent: row.intent || "Informational",
          readTime: row.read_time || "5 phút",
          publishedAt: row.published_at || new Date().toISOString().split("T")[0],
          updatedAt: row.updated_at || new Date().toISOString().split("T")[0],
          author: row.author || "Win Dread & Crew",
          heroImage: row.hero_image,
          targetKeywords: Array.isArray(row.target_keywords) ? row.target_keywords : [],
          excerpt: row.excerpt,
          toc: Array.isArray(row.toc) ? row.toc : [],
          content: Array.isArray(row.content) ? row.content : typeof row.content === "string" ? [row.content] : [],
          faqs: Array.isArray(row.faqs) ? row.faqs : [],
          relatedSlugs: Array.isArray(row.related_slugs) ? row.related_slugs : [],
          moneyPageLink: {
            label: row.money_page_label || "Xem dịch vụ",
            href: row.money_page_href || "/services"
          }
        }));

        return NextResponse.json({ articles: formatted, source: "database" });
      }
    } catch (dbError) {
      console.warn("Could not query Supabase news_articles, using fallback static data:", dbError);
    }

    // Fallback to static articles
    return NextResponse.json({ articles: staticArticles, source: "static" });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    if (!["admin", "manager"].includes(context.role)) {
      throw new AdminAccessError("Bạn không có quyền tạo bài viết.", 403);
    }

    const body = await request.json();
    const {
      slug,
      title,
      metaTitle,
      metaDescription,
      category,
      categoryLabel,
      intent,
      readTime,
      author,
      heroImage,
      targetKeywords,
      excerpt,
      toc,
      content,
      faqs,
      relatedSlugs,
      moneyPageLink,
      published = true
    } = body;

    if (!slug || !title || !heroImage || !excerpt) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ: Tiêu đề, Slug, Ảnh Thumbnail và Tóm tắt bài viết." },
        { status: 400 }
      );
    }

    const service = createServiceClient();
    const { data, error } = await service
      .from("news_articles")
      .insert({
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        meta_title: metaTitle?.trim() || title.trim(),
        meta_description: metaDescription?.trim() || excerpt.trim(),
        category: category || "local",
        category_label: categoryLabel || "Địa Chỉ & Bảng Giá",
        intent: intent || "Informational",
        read_time: readTime || "5 phút",
        published_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
        author: author?.trim() || "Win Dread & Crew",
        hero_image: heroImage.trim(),
        target_keywords: targetKeywords || [],
        excerpt: excerpt.trim(),
        toc: toc || [],
        content: Array.isArray(content) ? content : [content],
        faqs: faqs || [],
        related_slugs: relatedSlugs || [],
        money_page_label: moneyPageLink?.label || "Xem dịch vụ",
        money_page_href: moneyPageLink?.href || "/services",
        published: Boolean(published)
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ article: data, message: "Tạo bài viết thành công!" });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    if (!["admin", "manager"].includes(context.role)) {
      throw new AdminAccessError("Bạn không có quyền sửa bài viết.", 403);
    }

    const body = await request.json();
    const {
      slug,
      title,
      metaTitle,
      metaDescription,
      category,
      categoryLabel,
      intent,
      readTime,
      author,
      heroImage,
      targetKeywords,
      excerpt,
      toc,
      content,
      faqs,
      relatedSlugs,
      moneyPageLink,
      published
    } = body;

    if (!slug) {
      return NextResponse.json({ message: "Thiếu slug bài viết cần cập nhật." }, { status: 400 });
    }

    const service = createServiceClient();
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString().split("T")[0]
    };

    if (title !== undefined) updatePayload.title = title.trim();
    if (metaTitle !== undefined) updatePayload.meta_title = metaTitle.trim();
    if (metaDescription !== undefined) updatePayload.meta_description = metaDescription.trim();
    if (category !== undefined) updatePayload.category = category;
    if (categoryLabel !== undefined) updatePayload.category_label = categoryLabel;
    if (intent !== undefined) updatePayload.intent = intent;
    if (readTime !== undefined) updatePayload.read_time = readTime;
    if (author !== undefined) updatePayload.author = author.trim();
    if (heroImage !== undefined) updatePayload.hero_image = heroImage.trim();
    if (targetKeywords !== undefined) updatePayload.target_keywords = targetKeywords;
    if (excerpt !== undefined) updatePayload.excerpt = excerpt.trim();
    if (toc !== undefined) updatePayload.toc = toc;
    if (content !== undefined) updatePayload.content = Array.isArray(content) ? content : [content];
    if (faqs !== undefined) updatePayload.faqs = faqs;
    if (relatedSlugs !== undefined) updatePayload.related_slugs = relatedSlugs;
    if (moneyPageLink !== undefined) {
      updatePayload.money_page_label = moneyPageLink?.label;
      updatePayload.money_page_href = moneyPageLink?.href;
    }
    if (published !== undefined) updatePayload.published = Boolean(published);

    const { data, error } = await service
      .from("news_articles")
      .update(updatePayload)
      .eq("slug", slug)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ article: data, message: "Cập nhật bài viết thành công!" });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    if (context.role !== "admin") {
      throw new AdminAccessError("Chỉ có Quản trị viên cao nhất mới được xóa bài viết.", 403);
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ message: "Thiếu slug bài viết cần xóa." }, { status: 400 });
    }

    const service = createServiceClient();
    const { error } = await service.from("news_articles").delete().eq("slug", slug);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Đã xóa bài viết thành công!" });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
