"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminFrame } from "../components/AdminFrame";
import type { Article, ArticleCategory, FAQItem } from "../../../lib/seo/articles";

export type MediaCategory = {
  id: string;
  name: string;
  images: Array<{
    src: string;
    filename: string;
    category: string;
  }>;
};

// Vietnamese Slugify helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

// Client-side markdown renderer for editor preview
function renderMarkdownPreview(markdown: string): string {
  return markdown
    .replace(/![(.*?)]((.*?))/g, '<figure style="margin:1.5rem 0;text-align:center;"><img src="$2" alt="$1" style="max-width:90%;height:auto;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.15);border:1px solid #ddd;" /><figcaption style="font-size:0.8rem;color:#777;margin-top:0.4rem;font-style:italic;">$1</figcaption></figure>')
    .replace(/^### (.*$)/gim, '<h3 style="margin:1.4rem 0 0.6rem;font-size:1.2rem;font-weight:800;color:inherit;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="margin:1.8rem 0 0.8rem;font-size:1.45rem;font-weight:800;border-bottom:1px solid rgba(0,0,0,0.1);padding-bottom:0.4rem;color:inherit;">$1</h2>')
    .replace(/^> (.*$)/gim, '<blockquote style="margin:1rem 0;padding:0.6rem 1rem;border-left:3px solid #b94a33;background:rgba(185,74,51,0.06);font-style:italic;">$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#b94a33;text-decoration:underline;">$1</a>')
    .replace(/\n\n+/g, '</p><p style="margin:0 0 1rem;line-height:1.75;">')
    .replace(/^/, '<p style="margin:0 0 1rem;line-height:1.75;">')
    .replace(/$/, '</p>');
}

const CATEGORY_OPTIONS: Array<{ value: ArticleCategory; label: string }> = [
  { value: "local", label: "Địa Chỉ & Bảng Giá" },
  { value: "dreadlocks", label: "Kỹ Thuật Dreadlock" },
  { value: "braids", label: "Braids & Hair Braiding" },
  { value: "barber", label: "Barber Grooming & Fade" }
];

const INTENT_OPTIONS = [
  "Local Discovery",
  "Informational",
  "Commercial Investigation"
] as const;

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [dataSource, setDataSource] = useState<"database" | "static">("database");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("local");
  const [categoryLabel, setCategoryLabel] = useState("Địa Chỉ & Bảng Giá");
  const [intent, setIntent] = useState<string>("Informational");
  const [author, setAuthor] = useState("Win Dread & Crew");
  const [heroImage, setHeroImage] = useState("/images/collection / Dreadlocks for Men/collection1.webp");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentText, setContentText] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [moneyPageLabel, setMoneyPageLabel] = useState("");
  const [moneyPageHref, setMoneyPageHref] = useState("");
  const [published, setPublished] = useState(true);

  // Ref for editor textarea (to insert at cursor)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Media picker modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"thumbnail" | "content">("thumbnail");
  const [mediaCategories, setMediaCategories] = useState<MediaCategory[]>([]);
  const [activeMediaCat, setActiveMediaCat] = useState("all");
  const [customMediaUrl, setCustomMediaUrl] = useState("");
  const [mediaLoading, setMediaLoading] = useState(false);

  // Fetch articles
  async function loadArticles() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news");
      if (!res.ok) throw new Error("Không thể tải danh sách bài viết.");
      const data = await res.json();
      setArticles(data.articles || []);
      setDataSource(data.source || "database");
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Lỗi tải bài viết" });
    } finally {
      setLoading(false);
    }
  }

  // Fetch media library
  async function loadMediaLibrary() {
    if (mediaCategories.length > 0) return;
    setMediaLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMediaCategories(data.categories || []);
      }
    } catch (err) {
      console.warn("Failed to load media library", err);
    } finally {
      setMediaLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchQuery =
        searchQuery === "" ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === "all" || art.category === activeCategory;
      return matchQuery && matchCat;
    });
  }, [articles, searchQuery, activeCategory]);

  // Handle open editor for create
  function handleOpenCreate() {
    setIsCreating(true);
    setIsEditing(true);
    setEditorTab("write");
    setTitle("");
    setSlug("");
    setMetaTitle("");
    setMetaDescription("");
    setCategory("local");
    setCategoryLabel("Địa Chỉ & Bảng Giá");
    setIntent("Informational");
    setAuthor("Win Dread & Crew");
    setHeroImage("/images/collection / Dreadlocks for Men/collection1.webp");
    setTargetKeywords("");
    setExcerpt("");
    setContentText("");
    setFaqs([]);
    setMoneyPageLabel("Xem dịch vụ tại WINDREAD");
    setMoneyPageHref("/dreadlock-da-nang");
    setPublished(true);
  }

  // Handle open editor for edit
  function handleOpenEdit(article: Article) {
    setIsCreating(false);
    setIsEditing(true);
    setEditorTab("write");
    setTitle(article.title);
    setSlug(article.slug);
    setMetaTitle(article.metaTitle || article.title);
    setMetaDescription(article.metaDescription || article.excerpt);
    setCategory(article.category);
    setCategoryLabel(article.categoryLabel);
    setIntent(article.intent);
    setAuthor(article.author);
    setHeroImage(article.heroImage);
    setTargetKeywords(article.targetKeywords?.join(", ") || "");
    setExcerpt(article.excerpt);
    // Join all content paragraphs into one clean text
    const joined = Array.isArray(article.content) ? article.content.join("\n\n") : (article.content || "");
    setContentText(joined);
    setFaqs(article.faqs || []);
    setMoneyPageLabel(article.moneyPageLink?.label || "");
    setMoneyPageHref(article.moneyPageLink?.href || "");
    setPublished(true);
  }

  // Handle auto slug when typing title
  function handleTitleChange(val: string) {
    setTitle(val);
    if (isCreating) {
      setSlug(slugify(val));
    }
  }

  // Category select helper
  function handleCategoryChange(val: ArticleCategory) {
    setCategory(val);
    const found = CATEGORY_OPTIONS.find((c) => c.value === val);
    if (found) setCategoryLabel(found.label);
  }

  // Toolbar actions for Rich Text Editor
  function insertFormatting(prefix: string, suffix: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end);

    const replacement = `${prefix}${selectedText || "văn bản"}${suffix}`;
    const updated = currentText.substring(0, start) + replacement + currentText.substring(end);

    setContentText(updated);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 0);
  }

  // Open Media Picker
  function handleOpenMedia(target: "thumbnail" | "content") {
    setMediaPickerTarget(target);
    loadMediaLibrary();
    setShowMediaModal(true);
  }

  // Handle selecting an image from modal
  function handleSelectImage(src: string, filename: string) {
    if (mediaPickerTarget === "thumbnail") {
      setHeroImage(src);
      setShowMediaModal(false);
      setNotification({ type: "success", message: `Đã chọn ảnh thumbnail: ${filename}` });
    } else {
      // Insert into content at cursor
      const textarea = textareaRef.current;
      const imageMarkdown = `\n\n![${filename.replace(/\.[^/.]+$/, "")}](${src})\n\n`;

      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;
        const updated = currentText.substring(0, start) + imageMarkdown + currentText.substring(end);
        setContentText(updated);
      } else {
        setContentText((prev) => prev + imageMarkdown);
      }

      setShowMediaModal(false);
      setNotification({ type: "success", message: `Đã chèn ảnh vào nội dung: ${filename}` });
    }
  }

  // Add/Remove FAQs
  function handleAddFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }

  function handleUpdateFaq(index: number, field: "question" | "answer", val: string) {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  }

  function handleRemoveFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }

  // Save article
  async function handleSave() {
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !heroImage.trim() || !contentText.trim()) {
      setNotification({ type: "error", message: "Vui lòng nhập đầy đủ: Tiêu đề, Slug, Tóm tắt, Nội dung và Thumbnail!" });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    const keywordsArray = targetKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    // Split content by double newlines into clean sections for storage
    const contentSections = contentText
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      category,
      categoryLabel,
      intent,
      author: author.trim(),
      heroImage: heroImage.trim(),
      targetKeywords: keywordsArray,
      excerpt: excerpt.trim(),
      content: contentSections,
      faqs: faqs.filter((f) => f.question.trim() !== ""),
      moneyPageLink: moneyPageHref.trim() ? { label: moneyPageLabel || "Xem thêm", href: moneyPageHref.trim() } : undefined,
      published
    };

    try {
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch("/api/admin/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể lưu bài viết.");

      setNotification({ type: "success", message: isCreating ? "Đã tạo bài viết mới thành công!" : "Cập nhật bài viết thành công!" });
      setIsEditing(false);
      loadArticles();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Lỗi lưu bài viết." });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Delete article
  async function handleDelete(slugToDelete: string) {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết có slug: "${slugToDelete}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/news?slug=${encodeURIComponent(slugToDelete)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể xóa bài viết.");

      setNotification({ type: "success", message: "Đã xóa bài viết thành công!" });
      loadArticles();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Lỗi xóa bài viết." });
    }
  }

  // Selected media category images
  const currentCategoryImages = useMemo(() => {
    const found = mediaCategories.find((c) => c.id === activeMediaCat);
    return found ? found.images : [];
  }, [mediaCategories, activeMediaCat]);

  return (
    <AdminFrame
      title="Cẩm Nang & Bài Viết"
      eyebrow="WINDREAD / CONTENT MANAGEMENT"
      actions={
        !isEditing ? (
          <button className="admin-button" onClick={handleOpenCreate}>
            + Viết Bài Mới
          </button>
        ) : (
          <button className="admin-button admin-button-subtle" onClick={() => setIsEditing(false)}>
            ← Quay Lại Danh Sách
          </button>
        )
      }
    >
      {notification && (
        <div className={notification.type === "success" ? "admin-form-success" : "admin-form-error"}>
          {notification.message}
        </div>
      )}

      {/* Editor View */}
      {isEditing ? (
        <div className="admin-two-column">
          {/* Main Column: Content */}
          <div className="admin-panel">
            <header>
              <div>
                <p className="admin-kicker">{isCreating ? "TẠO BÀI VIẾT MỚI" : "CHỈNH SỬA BÀI VIẾT"}</p>
                <h2>{title || "Tiêu đề bài viết..."}</h2>
              </div>
            </header>

            <div className="admin-form-stack">
              <label>
                Tiêu đề bài viết (*)
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ví dụ: Top Địa Chỉ Làm Dreadlock Uy Tín Nhất Tại Đà Nẵng"
                  required
                />
              </label>

              <div className="admin-form-pair">
                <label>
                  Đường dẫn tĩnh (Slug) (*)
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="top-dia-chi-lam-dreadlock-tai-da-nang"
                    required
                  />
                </label>

                <label>
                  Chuyên mục (*)
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as ArticleCategory)}
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Đoạn tóm tắt / Sapo (Excerpt) (*)
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Đoạn văn ngắn 2-3 câu giới thiệu cốt lõi của bài viết, thu hút độc giả..."
                  required
                />
              </label>

              {/* Unified Rich Text / Markdown Editor */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <label style={{ margin: 0, fontWeight: 800 }}>Nội Dung Bài Viết Chi Tiết (*)</label>
                  <small style={{ color: "var(--admin-muted)", fontSize: "0.72rem" }}>
                    Hỗ trợ tiêu đề H2, H3, in đậm, danh sách và chèn ảnh trực quan
                  </small>
                </div>

                <div className="admin-rich-editor">
                  {/* Toolbar & Tabs */}
                  <div className="admin-editor-header">
                    <div className="admin-editor-toolbar">
                      <button
                        type="button"
                        className="admin-toolbar-btn"
                        title="Tiêu đề H2"
                        onClick={() => insertFormatting("## ")}
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        className="admin-toolbar-btn"
                        title="Tiêu đề H3"
                        onClick={() => insertFormatting("### ")}
                      >
                        H3
                      </button>

                      <div className="admin-toolbar-divider" />

                      <button
                        type="button"
                        className="admin-toolbar-btn"
                        title="In đậm"
                        onClick={() => insertFormatting("**", "**")}
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        type="button"
                        className="admin-toolbar-btn"
                        title="In nghiêng"
                        onClick={() => insertFormatting("*", "*")}
                      >
                        <em>I</em>
                      </button>

                      <div className="admin-toolbar-divider" />

                      <button
                        type="button"
                        className="admin-toolbar-btn"
                        title="Danh sách gạch đầu dòng"
                        onClick={() => insertFormatting("- ")}
                      >
                        • Danh sách
                      </button>
                      <button
                        type="button"
                        className="admin-toolbar-btn"
                        title="Trích dẫn"
                        onClick={() => insertFormatting("> ")}
                      >
                        “ Trích dẫn
                      </button>
                      <button
                        type="button"
                        className="admin-toolbar-btn"
                        title="Chèn liên kết"
                        onClick={() => insertFormatting("[Tên liên kết](", ")")}
                      >
                        🔗 Link
                      </button>

                      <div className="admin-toolbar-divider" />

                      {/* Primary Image Insertion Button */}
                      <button
                        type="button"
                        className="admin-toolbar-btn btn-image"
                        title="Chèn hình ảnh từ thư viện salon vào bài viết"
                        onClick={() => handleOpenMedia("content")}
                      >
                        📷 Chèn Ảnh Salon
                      </button>
                    </div>

                    {/* Editor View Mode Tabs */}
                    <div className="admin-editor-tabs">
                      <button
                        type="button"
                        className={`admin-editor-tab ${editorTab === "write" ? "is-active" : ""}`}
                        onClick={() => setEditorTab("write")}
                      >
                        ✍ Soạn thảo
                      </button>
                      <button
                        type="button"
                        className={`admin-editor-tab ${editorTab === "preview" ? "is-active" : ""}`}
                        onClick={() => setEditorTab("preview")}
                      >
                        👁 Xem trước
                      </button>
                    </div>
                  </div>

                  {/* Editor Input or Live Preview */}
                  {editorTab === "write" ? (
                    <textarea
                      ref={textareaRef}
                      className="admin-editor-textarea"
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      placeholder="Viết nội dung bài viết tại đây...\n\nBạn có thể dùng thanh công cụ ở trên để tạo tiêu đề H2/H3, in đậm hoặc bấm '📷 Chèn Ảnh Salon' để đưa hình ảnh vào bất kỳ vị trí nào."
                    />
                  ) : (
                    <div
                      className="admin-editor-preview"
                      dangerouslySetInnerHTML={{
                        __html: contentText.trim()
                          ? renderMarkdownPreview(contentText)
                          : '<p style="color:var(--admin-muted);font-style:italic;">Chưa có nội dung để xem trước...</p>'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* FAQs Builder */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", borderTop: "1px solid var(--admin-line)", paddingTop: "1rem" }}>
                  <label style={{ margin: 0, fontWeight: 800 }}>Câu Hỏi Thường Gặp (FAQs & Schema)</label>
                  <button
                    type="button"
                    className="admin-text-button"
                    onClick={handleAddFaq}
                  >
                    + Thêm câu hỏi FAQ
                  </button>
                </div>

                {faqs.map((faq, idx) => (
                  <div key={idx} style={{ padding: "0.85rem", background: "rgba(0,0,0,0.02)", border: "1px solid var(--admin-line)", borderRadius: "0.5rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <strong style={{ fontSize: "0.78rem" }}>FAQ #{idx + 1}</strong>
                      <button
                        type="button"
                        className="admin-text-button danger"
                        onClick={() => handleRemoveFaq(idx)}
                      >
                        Xóa FAQ
                      </button>
                    </div>
                    <input
                      style={{ marginBottom: "0.45rem" }}
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                      placeholder="Câu hỏi: Làm dreadlock giữ được bao lâu?"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                      placeholder="Câu trả lời chi tiết..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Metadata & Thumbnail */}
          <div className="admin-form-panel">
            <div className="admin-panel" style={{ marginBottom: "1rem" }}>
              <header>
                <h2>Ảnh Bìa / Thumbnail</h2>
              </header>

              <div className="admin-thumb-preview" style={{ marginBottom: "0.85rem" }}>
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt="Preview"
                    width={400}
                    height={250}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                ) : (
                  <span className="no-img">Chưa chọn ảnh</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="admin-button admin-button-subtle"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => handleOpenMedia("thumbnail")}
                >
                  📷 Chọn Từ Thư Viện Shop
                </button>

                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="Hoặc dán link ảnh /images/..."
                  style={{ fontSize: "0.74rem" }}
                />
              </div>
            </div>

            <div className="admin-panel" style={{ marginBottom: "1rem" }}>
              <header>
                <h2>Cấu Hình SEO & Xuất Bản</h2>
              </header>

              <div className="admin-form-stack">
                <div className="admin-form-pair">
                  <label>
                    Tác giả
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Win Dread & Crew"
                    />
                  </label>

                  <label>
                    Ý định tìm kiếm (Intent)
                    <select value={intent} onChange={(e) => setIntent(e.target.value)}>
                      {INTENT_OPTIONS.map((it) => (
                        <option key={it} value={it}>
                          {it}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Từ khóa mục tiêu (cách nhau bằng dấu phẩy)
                  <input
                    type="text"
                    value={targetKeywords}
                    onChange={(e) => setTargetKeywords(e.target.value)}
                    placeholder="dreadlock Đà Nẵng, tết tóc Đà Nẵng, làm dreadlock..."
                  />
                </label>

                <label>
                  Meta Title (SEO)
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Tiêu đề hiển thị trên Google..."
                  />
                </label>

                <label>
                  Meta Description (SEO)
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Đoạn trích mô tả xuất hiện trên kết quả tìm kiếm..."
                  />
                </label>

                <div className="admin-form-pair">
                  <label>
                    Nút CTA Dịch Vụ (Label)
                    <input
                      type="text"
                      value={moneyPageLabel}
                      onChange={(e) => setMoneyPageLabel(e.target.value)}
                      placeholder="Xem bảng giá dreadlocks..."
                    />
                  </label>

                  <label>
                    Đường dẫn CTA (Href)
                    <input
                      type="text"
                      value={moneyPageHref}
                      onChange={(e) => setMoneyPageHref(e.target.value)}
                      placeholder="/dreadlock-da-nang"
                    />
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
                  <input
                    type="checkbox"
                    id="chk-published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    style={{ width: "auto" }}
                  />
                  <label htmlFor="chk-published" style={{ margin: 0, cursor: "pointer", fontWeight: 700 }}>
                    Công khai bài viết (Published)
                  </label>
                </div>

                <div style={{ marginTop: "1rem", display: "flex", gap: "0.6rem" }}>
                  <button
                    type="button"
                    className="admin-button"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={handleSave}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang lưu..." : isCreating ? "Tạo Bài Viết" : "Lưu Thay Đổi"}
                  </button>

                  <button
                    type="button"
                    className="admin-button admin-button-subtle"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="admin-single-column">
          {/* Metrics Overview */}
          <div className="admin-metric-grid">
            <article>
              <span>TỔNG BÀI VIẾT</span>
              <strong>{articles.length}</strong>
              <small>Nguồn: {dataSource === "database" ? "Supabase Database" : "Static Code (Sẵn sàng Migrate)"}</small>
            </article>

            <article>
              <span>ĐÃ CÔNG KHAI</span>
              <strong style={{ color: "var(--admin-success)" }}>{articles.length}</strong>
              <small>Hiển thị trực tiếp trên /news</small>
            </article>

            <article>
              <span>CHUYÊN MỤC</span>
              <strong>4</strong>
              <small>Địa chỉ, Dread, Braids, Barber</small>
            </article>

            <article>
              <span>CƠ CHẾ PHỤC VỤ</span>
              <strong>SSG + DB</strong>
              <small>Tối ưu tốc độ tải và SEO</small>
            </article>
          </div>

          <div className="admin-panel">
            <header>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <div className="admin-inline-search">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tiêu đề, slug..."
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")}>
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="admin-tabs">
                  <button
                    className={activeCategory === "all" ? "is-active" : ""}
                    onClick={() => setActiveCategory("all")}
                  >
                    Tất cả ({articles.length})
                  </button>
                  <button
                    className={activeCategory === "local" ? "is-active" : ""}
                    onClick={() => setActiveCategory("local")}
                  >
                    Địa chỉ & Giá ({articles.filter((a) => a.category === "local").length})
                  </button>
                  <button
                    className={activeCategory === "dreadlocks" ? "is-active" : ""}
                    onClick={() => setActiveCategory("dreadlocks")}
                  >
                    Dreadlocks ({articles.filter((a) => a.category === "dreadlocks").length})
                  </button>
                  <button
                    className={activeCategory === "braids" ? "is-active" : ""}
                    onClick={() => setActiveCategory("braids")}
                  >
                    Braids ({articles.filter((a) => a.category === "braids").length})
                  </button>
                  <button
                    className={activeCategory === "barber" ? "is-active" : ""}
                    onClick={() => setActiveCategory("barber")}
                  >
                    Barber ({articles.filter((a) => a.category === "barber").length})
                  </button>
                </div>
              </div>

              <button className="admin-button" onClick={handleOpenCreate}>
                + Viết Bài Mới
              </button>
            </header>

            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-muted)" }}>
                Đang tải danh sách bài viết…
              </div>
            ) : filteredArticles.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-muted)" }}>
                Không tìm thấy bài viết nào phù hợp.
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "70px" }}>Ảnh</th>
                      <th>Tiêu Đề & Slug</th>
                      <th>Chuyên Mục</th>
                      <th>Tác Giả</th>
                      <th>Ngày Cập Nhật</th>
                      <th>Trạng Thái</th>
                      <th style={{ textAlign: "right" }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article.slug}>
                        <td>
                          <div
                            style={{
                              width: "56px",
                              height: "42px",
                              borderRadius: "4px",
                              overflow: "hidden",
                              position: "relative",
                              background: "#eee"
                            }}
                          >
                            <Image
                              src={article.heroImage}
                              alt=""
                              fill
                              sizes="56px"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: "0.85rem", color: "var(--admin-ink)", marginBottom: "0.2rem" }}>
                            {article.title}
                          </strong>
                          <small style={{ color: "var(--admin-muted)", fontFamily: "monospace" }}>
                            /news/{article.slug}
                          </small>
                        </td>
                        <td>
                          <span className="admin-badge admin-badge-cat">{article.categoryLabel}</span>
                        </td>
                        <td>
                          <span>{article.author}</span>
                        </td>
                        <td>
                          <small>{article.updatedAt || article.publishedAt}</small>
                        </td>
                        <td>
                          <span className="admin-badge admin-badge-success">● Published</span>
                        </td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <div style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
                            <button
                              type="button"
                              className="admin-text-button"
                              onClick={() => handleOpenEdit(article)}
                            >
                              Sửa
                            </button>

                            <Link
                              href={`/news/${article.slug}`}
                              target="_blank"
                              className="admin-text-button"
                              style={{ color: "var(--admin-success)" }}
                            >
                              Xem ↗
                            </Link>

                            <button
                              type="button"
                              className="admin-text-button danger"
                              onClick={() => handleDelete(article.slug)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Media Picker Modal */}
      {showMediaModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowMediaModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                {mediaPickerTarget === "thumbnail" ? "Chọn Ảnh Bìa / Thumbnail" : "Chèn Ảnh Vào Nội Dung Bài Viết"}
                {" "}({mediaCategories.find((c) => c.id === activeMediaCat)?.images.length || 0} ảnh)
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowMediaModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Category Filter Pills */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {mediaCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`admin-tabs-btn ${activeMediaCat === cat.id ? "is-active" : ""}`}
                    style={{
                      border: "1px solid var(--admin-line)",
                      borderRadius: "0.4rem",
                      padding: "0.35rem 0.65rem",
                      background: activeMediaCat === cat.id ? "var(--admin-accent)" : "#fff",
                      color: activeMediaCat === cat.id ? "#fff" : "var(--admin-ink)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                    onClick={() => setActiveMediaCat(cat.id)}
                  >
                    {cat.name} ({cat.images.length})
                  </button>
                ))}
              </div>

              {/* Image Grid */}
              {mediaLoading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--admin-muted)" }}>
                  Đang tải danh mục hình ảnh…
                </div>
              ) : currentCategoryImages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--admin-muted)" }}>
                  Không có ảnh trong danh mục này.
                </div>
              ) : (
                <div className="admin-media-grid">
                  {currentCategoryImages.map((img) => {
                    const isSelected = mediaPickerTarget === "thumbnail" && heroImage === img.src;
                    return (
                      <div
                        key={img.src}
                        className={`admin-media-item ${isSelected ? "is-selected" : ""}`}
                        onClick={() => handleSelectImage(img.src, img.filename)}
                      >
                        <Image
                          src={img.src}
                          alt={img.filename}
                          width={150}
                          height={150}
                          style={{ objectFit: "cover" }}
                        />
                        <span>{img.filename}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Custom URL input */}
              <div style={{ borderTop: "1px solid var(--admin-line)", paddingTop: "0.85rem", display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={customMediaUrl}
                  onChange={(e) => setCustomMediaUrl(e.target.value)}
                  placeholder="Hoặc dán link ảnh tùy chỉnh (VD: /images/custom.webp hoặc https://...)"
                  style={{ flex: 1, fontSize: "0.78rem" }}
                />
                <button
                  type="button"
                  className="admin-button"
                  onClick={() => {
                    if (customMediaUrl.trim()) {
                      handleSelectImage(customMediaUrl.trim(), "custom-image");
                      setCustomMediaUrl("");
                    }
                  }}
                >
                  {mediaPickerTarget === "thumbnail" ? "Đặt Làm Thumbnail" : "Chèn Vào Bài"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminFrame>
  );
}
