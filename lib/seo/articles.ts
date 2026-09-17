export type ArticleCategory = "local" | "dreadlocks" | "braids" | "barber";

export type FAQItem = {
  question: string;
  answer: string;
};

export type TOCItem = {
  id: string;
  title: string;
};

export type Article = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: ArticleCategory;
  categoryLabel: string;
  intent: "Local Discovery" | "Informational" | "Commercial Investigation";
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  heroImage: string;
  targetKeywords: string[];
  excerpt: string;
  toc: TOCItem[];
  content: string[]; // array of structured markdown/html sections
  faqs: FAQItem[];
  relatedSlugs: string[];
  moneyPageLink: {
    label: string;
    href: string;
  };
};

export const articles: Article[] = [
  {
    slug: "top-dia-chi-lam-dreadlock-tai-da-nang",
    title: "Top Địa Chỉ Làm Dreadlock Uy Tín Nhất Tại Đà Nẵng (Đánh Giá Chi Tiết)",
    metaTitle: "Top Địa Chỉ Làm Dreadlock Tại Đà Nẵng Uy Tín Nhất | WINDREAD",
    metaDescription: "Khám phá top các tiệm làm dreadlock đẹp, uy tín tại Đà Nẵng. Đánh giá chất lượng kỹ thuật móc locs thủ công, giá làm tóc và review từ cộng đồng.",
    category: "local",
    categoryLabel: "Địa Chỉ & Bảng Giá",
    intent: "Local Discovery",
    readTime: "7 phút",
    publishedAt: "2025-01-10",
    updatedAt: "2025-02-15",
    author: "Win Dread & Crew",
    heroImage: "/images/collection / Dreadlocks for Men/collection1.webp",
    targetKeywords: ["dreadlock Đà Nẵng", "top địa chỉ làm dreadlock tại đà nẵng", "làm dreadlock ở đà nẵng", "tiệm dreadlock uy tín đà nẵng"],
    excerpt: "Nếu bạn đang tìm kiếm địa chỉ làm dreadlock chuẩn nghệ nhân tại Đà Nẵng, bài viết này phân tích chi tiết các tiệm tóc uy tín, kỹ thuật móc tóc không hóa chất và dịch vụ bảo dưỡng locs tốt nhất.",
    toc: [
      { id: "tong-quan-nhu-cau-dreadlock-da-nang", title: "1. Nhu cầu làm Dreadlock tại Đà Nẵng" },
      { id: "tieu-chi-danh-gia-tiem-uy-tin", title: "2. Tiêu chí chọn tiệm Dreadlock chất lượng" },
      { id: "windread-an-thuong-dia-chi-so-1", title: "3. WINDREAD Locs & Barber Club - Điểm đến số 1" },
      { id: "so-sanh-cac-lua-chon-khac", title: "4. So sánh với các studio cá nhân & barber truyền thống" },
      { id: "bang-gia-tham-khao", title: "5. Bảng giá làm Dreadlock tại Đà Nẵng" },
      { id: "faq", title: "6. Câu hỏi thường gặp" }
    ],
    content: [
      "Đà Nẵng không chỉ là thiên đường du lịch biển mà còn là cái nôi phát triển mạnh mẽ của văn hóa đường phố, hiphop và phong cách tóc độc bản. Trong những năm gần đây, nhu cầu tìm kiếm **dreadlock Đà Nẵng** tăng vọt từ cả giới trẻ địa phương, nghệ sĩ biểu diễn và cộng đồng expat/du khách quốc tế.",
      "Tuy nhiên, làm tóc dreadlock là một kỹ thuật đòi hỏi tính nghệ thuật và độ kiên nhẫn cực cao. Không giống như uốn hay nhuộm tóc thông thường có thể dùng hóa chất định hình cấp tốc, dreadlocks chuẩn tự nhiên cần được chia section tỉ mỉ và dùng kim móc chuyên dụng (crochet hook) để bện chặt từng sợi tóc mà không làm gãy rụng nang tóc.",
      "### Tiêu chí chọn tiệm làm Dreadlock uy tín tại Đà Nẵng\n\n1. **Kỹ thuật móc tóc thủ công (Crochet method)**: Tuyệt đối không dùng keo sáp độc hại gây bết dính và tích tụ vi khuẩn (buildup).\n2. **Kinh nghiệm chia Section**: Một bộ locs chuẩn phải có đường chia da đầu (grid pattern) cân đối: triangle, square hay diamond, giúp tóc mọc dài tự nhiên không bị kéo căng đau buốt.\n3. **Dịch vụ hậu mãi & bảo dưỡng**: Chăm sóc locs không dừng lại ở ngày đầu tiên. Tiệm phải có dịch vụ retwist, repair chân tóc và detox da đầu định kỳ.\n4. **Không gian & sự am hiểu văn hóa**: Một tiệm chuyên locs thực thụ luôn mang tinh thần đường phố cởi mở và tư vấn tận tâm.",
      "### WINDREAD An Thượng - Địa chỉ chuyên sâu hàng đầu\n\nTọa lạc tại **35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng** (trung tâm khu phố du lịch An Thượng), WINDREAD được xem là điểm hẹn văn hóa số 1 cho những ai đam mê dreadlock và braids. Đứng đầu bởi nghệ nhân Win Dread cùng đội ngũ thợ lành nghề, tiệm sở hữu catalog hàng trăm mẫu tóc thực tế từ starter locs, semi-freeform đến instant locs nối sợi cao cấp.",
      "Điểm đặc biệt tại WINDREAD là quy trình tư vấn chất tóc kỹ lưỡng: đánh giá độ dày sợi tóc, tình trạng da đầu và mục đích sử dụng trước khi tư vấn độ dài hay phương pháp thực hiện. Bên cạnh đó, tiệm có cơ sở 1 tại **223 Chương Dương** sẵn sàng phục vụ combo cắt fade sắc nét kết hợp locs taper cực ngầu."
    ],
    faqs: [
      { question: "Làm dreadlock tại Đà Nẵng giá bao nhiêu?", answer: "Chi phí làm dreadlock tại Đà Nẵng dao động từ 1.200.000đ cho nửa đầu (taper locs) đến 2.500.000đ - 4.500.000đ cho cả đầu tùy theo độ dài và kỹ thuật nối tóc." },
      { question: "Thời gian làm một bộ dreadlock mất bao lâu?", answer: "Thông thường một bộ starter locs mất từ 3 đến 6 tiếng. Với những bộ dreadlocks nối dài toàn đầu có thể mất từ 6 đến 8 tiếng." },
      { question: "Tóc ngắn bao nhiêu cm thì làm được dreadlock?", answer: "Độ dài tối thiểu để làm starter locs tự nhiên là khoảng 8 - 10cm. Nếu bạn muốn nối tóc nhân tạo hoặc tóc thật, độ dài tóc tự nhiên khoảng 6 - 7cm là có thể thực hiện được." }
    ],
    relatedSlugs: ["gia-lam-dreadlock-o-da-nang", "dreadlock-la-gi", "khi-nao-nen-retwist-dreadlock"],
    moneyPageLink: { label: "Xem dịch vụ Dreadlock Đà Nẵng chuyên sâu", href: "/dreadlock-da-nang" }
  },
  {
    slug: "top-noi-lam-braids-tai-da-nang",
    title: "Top Nơi Làm Braids & Tết Tóc Chuyên Nghiệp Tại Đà Nẵng (Nam & Nữ)",
    metaTitle: "Top Nơi Làm Braids & Tết Tóc Đà Nẵng Nam Nữ Đẹp Nhất | WINDREAD",
    metaDescription: "Tổng hợp các địa chỉ tết tóc braids đẹp, uy tín tại Đà Nẵng. Chuyên box braids, cornrows, knotless braids cho cả nam và nữ, không đau da đầu.",
    category: "local",
    categoryLabel: "Địa Chỉ & Bảng Giá",
    intent: "Local Discovery",
    readTime: "6 phút",
    publishedAt: "2025-01-14",
    updatedAt: "2025-02-18",
    author: "WINDREAD Braiding Team",
    heroImage: "/images/collection /Braids for Women/collection1.webp",
    targetKeywords: ["braid Đà Nẵng", "tết tóc Đà Nẵng", "top nơi làm braids tại đà nẵng", "tết tóc nam đà nẵng"],
    excerpt: "Bạn đang chuẩn bị đi biển, quay MV hoặc muốn đổi phong cách cực chất? Xem ngay danh sách những nơi làm braids và tết tóc đẹp nhất Đà Nẵng với đường line sắc sảo.",
    toc: [
      { id: "xu-huong-braids-da-nang", title: "1. Xu hướng tết tóc Braids tại thành phố biển Đà Nẵng" },
      { id: "cac-kieu-braids-pho-bien", title: "2. Các kiểu braids hot nhất cho nam và nữ" },
      { id: "dia-chi-tet-toc-uy-tin", title: "3. Nơi tết tóc braids chuẩn đẹp không đau" },
      { id: "kinh-nghiem-khi-di-tet-toc", title: "4. Kinh nghiệm chuẩn bị trước khi tết tóc" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Braids (tết tóc phong cách đường phố) đã trở thành một biểu tượng thẩm mỹ không thể thiếu tại Đà Nẵng. Dù bạn là một bạn nam mê phong cách Hiphop hay một bạn nữ muốn bộ ảnh check-in biển Mỹ Khê bùng nổ, một kiểu braids gọn gàng, sắc nét luôn tạo nên điểm nhấn khó cưỡng.",
      "Tuy nhiên, rất nhiều salon tóc thông thường tại Đà Nẵng không có thợ chuyên về kỹ thuật tết tóc sát da đầu. Tết tóc sai kỹ thuật có thể gây căng tức chân tóc, gãy rụng và đỏ rát da đầu.",
      "### Các kiểu Braids được yêu thích nhất hiện nay\n\n- **Cornrows**: Đường tết thẳng sát chân tóc, mang vẻ đẹp năng động, thể thao và rất mát mẻ cho thời tiết nắng nóng miền Trung.\n- **Box Braids**: Tết chia ô hình vuông hoặc tam giác đều tăm tắp, có thể thả tự nhiên hoặc búi cao.\n- **Knotless Braids**: Kỹ thuật tết không thắt nút ở gốc, nhẹ êm ái cho da đầu và tự nhiên tối đa.\n- **Twist / Rope Braids**: Kiểu bện xoắn 2 sợi đơn giản mà cực kỳ sang trọng.",
      "### WINDREAD - Tiệm tết tóc Braids hàng đầu Đà Nẵng\n\nTại WINDREAD An Thượng (35 - 37 An Thượng 29), chúng tôi tự hào sở hữu đội ngũ braider chuyên nghiệp với hàng ngàn giờ thao tác. Mỗi đường chia tóc đều được vuốt gel giữ nếp chuyên dụng, lực tay siết đều đặn đảm bảo chặt nếp nhưng hoàn toàn không gây đau buốt."
    ],
    faqs: [
      { question: "Tết tóc braids giữ được bao lâu?", answer: "Kiểu cornrows thông thường giữ được 2 - 4 tuần. Với box braids hoặc knotless braids kết hợp tóc giả có thể giữ từ 4 - 6 tuần nếu chăm sóc đúng cách." },
      { question: "Tết tóc braids có gội đầu được không?", answer: "Có! Bạn hoàn toàn có thể gội đầu bằng cách tạo bọt xà phòng nhẹ nhàng massage theo kẽ tóc và sấy khô da đầu ở chế độ gió mát." },
      { question: "Tóc nam ngắn có tết được braid không?", answer: "Chỉ cần tóc dài từ 7-10cm ở phần đỉnh là đã có thể tết các kiểu cornrows phối fade viền cực kỳ cá tính." }
    ],
    relatedSlugs: ["tiem-lam-cornrow-dep-o-da-nang", "phan-biet-cornrow-va-box-braids", "cach-cham-soc-toc-braids"],
    moneyPageLink: { label: "Khám phá dịch vụ Braids Đà Nẵng", href: "/braids-da-nang" }
  },
  {
    slug: "gia-lam-dreadlock-o-da-nang",
    title: "Giá Làm Dreadlock Ở Đà Nẵng Bao Nhiêu? Bảng Giá Mới Nhất 2025",
    metaTitle: "Bảng Giá Làm Dreadlock Ở Đà Nẵng Mới Nhất | Chi Phí Nối & Retwist",
    metaDescription: "Cập nhật bảng giá làm dreadlock tại Đà Nẵng chi tiết nhất: Giá starter locs, nối tóc, retwist, repair và detox chân tóc. Bảng giá minh bạch không phát sinh.",
    category: "local",
    categoryLabel: "Địa Chỉ & Bảng Giá",
    intent: "Commercial Investigation",
    readTime: "5 phút",
    publishedAt: "2025-01-20",
    updatedAt: "2025-02-20",
    author: "WINDREAD Management",
    heroImage: "/images/collection / Dreadlocks for Men/collection6.webp",
    targetKeywords: ["giá làm dreadlock ở đà nẵng", "bảng giá dreadlock đà nẵng", "chi phí làm dreadlock đà nẵng", "retwist dreadlock giá bao nhiêu"],
    excerpt: "Bạn đang thắc mắc làm một bộ dreadlocks ở Đà Nẵng tốn bao nhiêu tiền? Xem ngay bảng giá chi tiết từng dịch vụ: làm mới, nối tóc, retwist và bảo dưỡng.",
    toc: [
      { id: "cac-yeu-to-anh-huong-gia", title: "1. Các yếu tố quyết định giá làm Dreadlock" },
      { id: "bang-gia-chi-tiet-windread", title: "2. Bảng giá dịch vụ Dreadlock tại WINDREAD Đà Nẵng" },
      { id: "gia-retwist-va-bao-duong", title: "3. Chi phí Retwist & Chăm sóc định kỳ" },
      { id: "co-phat-sinh-chi-phi-khong", title: "4. Chính sách bảo hành và cam kết" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Chi phí làm dreadlocks luôn là mối quan tâm hàng đầu của bất kỳ ai chuẩn bị bước vào hành trình gắn bó với bộ tóc cá tính này. Tại Đà Nẵng, giá làm dreadlock có sự chênh lệch tùy thuộc vào phương pháp, độ dài tóc và chất liệu sợi tóc.",
      "### Các yếu tố cấu thành chi phí làm Dreadlock\n\n1. **Kỹ thuật làm trên tóc tự nhiên hay nối tóc**: Tóc tự nhiên mất nhiều thời gian chia lọn và đan móc hơn. Nếu nối thêm sợi tóc nhân tạo hoặc tóc thật (human hair), chi phí sẽ bao gồm tiền nguyên liệu sợi nối.\n2. **Phạm vi làm**: Làm nửa đầu kết hợp Clean Fade (Top Dread / High Top) sẽ có chi phí dễ tiếp cận hơn so với làm toàn bộ đầu (Full Head).\n3. **Độ dày và số lượng lọn (Loc count)**: Làm 40-50 lọn to (thick locs) sẽ nhanh và rẻ hơn so với 80-120 lọn mảnh (micro/sister locs).\n4. **Tay nghề nghệ nhân**: Thợ lành nghề đảm bảo không làm tổn thương chân tóc và form lọn đều tăm tắp.",
      "### Bảng giá tham khảo tại WINDREAD Đà Nẵng\n\n- **Starter Locs (Nửa đầu / Top Head)**: Từ 1.200.000đ - 1.800.000đ.\n- **Starter Locs (Toàn đầu / Full Head)**: Từ 2.200.000đ - 3.500.000đ.\n- **Nối tóc Dreadlock dài (Theo yêu cầu)**: Từ 3.500.000đ - 6.000.000đ (đã bao gồm tóc nối cao cấp).\n- **Retwist & Chăm chân tóc**: 250.000đ - 450.000đ/buổi.\n- **Locs Detox da đầu & Rửa buildup**: 200.000đ - 350.000đ.\n- **Sửa chữa lọn đứt gãy (Loc Repair)**: 50.000đ - 80.000đ/lọn."
    ],
    faqs: [
      { question: "Sau khi làm dreadlock có được bảo hành không?", answer: "Tại WINDREAD, tất cả khách hàng làm starter locs đều được miễn phí kiểm tra và dặm lại chân tóc sau 10 ngày đầu tiên." },
      { question: "Retwist bao lâu nên làm một lần và tốn bao nhiêu?", answer: "Trung bình khoảng 4-6 tuần bạn nên đến tiệm retwist một lần. Chi phí chỉ từ 250.000đ - 450.000đ tùy độ dày của tóc." }
    ],
    relatedSlugs: ["top-dia-chi-lam-dreadlock-tai-da-nang", "khi-nao-nen-retwist-dreadlock", "dreadlock-giu-duoc-bao-lau"],
    moneyPageLink: { label: "Xem bảng giá Dreadlock chi tiết", href: "/pricing" }
  },
  {
    slug: "hair-braiding-da-nang-for-foreigners",
    title: "Best Hair Braiding & Locs Studio in Da Nang for Expats & Travelers",
    metaTitle: "Hair Braiding Da Nang for Expats & Foreigners | English Speaking Studio",
    metaDescription: "Looking for English-speaking hair braiding in Da Nang? WINDREAD studio in An Thuong tourist area offers expert box braids, cornrows & dreadlocks for travelers.",
    category: "local",
    categoryLabel: "Địa Chỉ & Bảng Giá",
    intent: "Local Discovery",
    readTime: "6 min read",
    publishedAt: "2025-01-25",
    updatedAt: "2025-02-22",
    author: "WINDREAD International Desk",
    heroImage: "/images/an thuong store/space 1.jpg",
    targetKeywords: ["hair braiding Da Nang", "braids Da Nang", "dreadlock Da Nang", "cornrows Da Nang", "barber Da Nang for foreigners"],
    excerpt: "Traveling or living in Da Nang and looking for tight, clean hair braids or dreadlock maintenance? Visit WINDREAD Studio in the heart of An Thuong expat neighborhood.",
    toc: [
      { id: "hair-braiding-da-nang-overview", title: "1. Why Travelers Love Getting Braids in Da Nang" },
      { id: "windread-an-thuong-location", title: "2. Prime Location in An Thuong Expat Area" },
      { id: "services-for-international-clients", title: "3. Specialized Services: Braids, Locs & Fades" },
      { id: "english-speaking-consultation", title: "4. English Consultation & Transparent Pricing" },
      { id: "booking-contact-info", title: "5. How to Book Online" }
    ],
    content: [
      "Da Nang is Vietnam's coastal hotspot, beloved by digital nomads, surfers, and vacationers. While soaking up the sun at My Khe Beach, many travelers search for professional **hair braiding in Da Nang** to protect their hair from tropical sea humidity and sport an effortless beach style.",
      "Finding authentic street hair stylists who speak fluent English and understand diverse hair textures (from fine straight Caucasian hair to thick Afro curls) can be challenging. That is why **WINDREAD Locs & Barber Club** was created.",
      "### Located in the Heart of An Thuong Tourist Quarter\n\nOur flagship braiding studio is situated at **35 - 37 An Thuong 29, Ngu Hanh Son, Da Nang**—just a 3-minute stroll from My Khe beach and surrounded by international cafes, craft breweries, and vegan restaurants.",
      "### Signature Services for Foreigners\n\n- **Cornrows & Feed-in Braids**: Sleek scalp braids ideal for beach sports, surfing, and gym sessions.\n- **Knotless & Box Braids**: Painless root braiding with optional synthetic extensions in diverse colors.\n- **Dreadlock Maintenance & Starter Locs**: Crochet hook method without wax or glue buildup.\n- **Precision Fades & Beard Shaves**: Hot towel grooming and razor line-ups by master barbers.",
      "We accept all international payment options (Visa, Mastercard, Wise, Apple Pay, Cash, Bank Transfer) with zero hidden fees."
    ],
    faqs: [
      { question: "Do your braiders speak English?", answer: "Yes! Our team in An Thuong provides clear English consultations to make sure your exact design and length expectations are met." },
      { question: "Can I swim in the ocean after getting braids?", answer: "Yes. Braids are the ultimate beach hairstyle. We recommend rinsing your scalp with fresh water after swimming and allowing it to air-dry completely." },
      { question: "Do you take walk-ins or appointment only?", answer: "We welcome walk-ins at 35-37 An Thuong 29, but booking online in advance is highly recommended to secure your preferred stylist without waiting." }
    ],
    relatedSlugs: ["top-noi-lam-braids-tai-da-nang", "tiem-lam-cornrow-dep-o-da-nang", "du-lich-da-nang-tet-toc-o-dau"],
    moneyPageLink: { label: "Book Hair Braiding in Da Nang Now", href: "/booking" }
  },
  {
    slug: "barber-cat-toc-my-den-da-nang",
    title: "Tiệm Barber Cắt Tóc Phong Cách Mỹ Đen (Afro, Clean Fade) Đẹp Nhất Đà Nẵng",
    metaTitle: "Barber Cắt Tóc Mỹ Đen Đà Nẵng | Chuyên Clean Fade, Afro, Taper Sắc Nét",
    metaDescription: "Tìm tiệm barber cắt tóc phong cách Mỹ đen tại Đà Nẵng? WINDREAD chuyên Clean Fade, Low Fade, Taper, Burst Fade và râu khăn nóng chuẩn form đường phố.",
    category: "barber",
    categoryLabel: "Barber & Fade",
    intent: "Local Discovery",
    readTime: "5 phút",
    publishedAt: "2025-02-01",
    updatedAt: "2025-02-24",
    author: "Huy Barber & Team Chương Dương",
    heroImage: "/images/chuong duong store/space1.webp",
    targetKeywords: ["barber tại đà nẵng", "tóc mỹ đen đà nẵng", "cắt tóc đẹp đà nẵng", "clean fade đà nẵng"],
    excerpt: "Nếu bạn yêu thích những đường fade mịn như nhung, viền line sắc lẹm và form tóc đậm chất hiphop Mỹ đen, hãy ghé ngay WINDREAD cơ sở Chương Dương Đà Nẵng.",
    toc: [
      { id: "suc-hut-toc-my-den", title: "1. Sức hút của phong cách Barber Mỹ đen tại Đà Nẵng" },
      { id: "ky-thuat-fade-dinh-cao", title: "2. Kỹ thuật Clean Fade, Taper và Edge Up chuẩn xác" },
      { id: "windread-chuong-duong", title: "3. Cơ sở 223 Chương Dương - Không gian chuẩn Old School" },
      { id: "dich-vu-grooming-tron-goi", title: "4. Dịch vụ cạo râu khăn nóng & tạo kiểu" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Phong cách barber Mỹ đen (Black Barber Culture) từ lâu đã trở thành thước đo vàng cho sự sắc bén trong nghề tóc nam. Khác với kiểu cắt layer hay undercut đại trà, tóc phong cách Mỹ đen đòi hỏi kỹ thuật blend tông đơ siêu mượt (zero gap), đường viền sắc như dao cạo (crispy line-up) và form đầu vuông vắn mạnh mẽ.",
      "Tại Đà Nẵng, **WINDREAD cơ sở 1 (223 Chương Dương, Ngũ Hành Sơn)** chính là thánh địa cho các tín đồ của phong cách này.",
      "### Kỹ thuật Fade đỉnh cao tại WINDREAD\n\n- **Skin Fade / Bald Fade**: Cạo sát trắng chân viền và chuyển sắc độ mượt mà lên đỉnh đầu không một vết gờ.\n- **Taper Fade**: Giữ nguyên độ dài hai bên tai và sau gáy được vát sạch sẽ, cực kỳ ăn ý khi kết hợp cùng dreadlocks hoặc braids.\n- **Burst Fade & Drop Fade**: Đường cong fade ôm trọn vành tai, tạo điểm nhấn nổi loạn cho các kiểu tóc mohawk hoặc curly afro.\n- **Line Up & Beard Detailing**: Định hình góc cạnh trán, thái dương và râu quai nón sắc nét bằng dao cạo truyền thống.",
      "Không gian tại Chương Dương ngập tràn âm hưởng hiphop old-school, ghế da cổ điển và trang thiết bị Wahl, Babyliss chính hãng đảm bảo từng đường cắt đạt độ hoàn hảo tối đa."
    ],
    faqs: [
      { question: "Cắt Clean Fade tại WINDREAD giữ được đẹp trong bao lâu?", answer: "Thông thường form fade đẹp nhất trong khoảng 10-14 ngày. Sau 2 tuần bạn nên ghé dặm lại viền taper hoặc fade để duy trì độ sắc nét." },
      { question: "Tiệm có nhận cạo râu tạo form khăn nóng không?", answer: "Có! WINDREAD cung cấp dịch vụ cạo râu khăn nóng truyền thống với tinh dầu dưỡng da và cạo sát êm ái." }
    ],
    relatedSlugs: ["gia-lam-dreadlock-o-da-nang", "top-dia-chi-lam-dreadlock-tai-da-nang"],
    moneyPageLink: { label: "Xem dịch vụ Barber & Đặt lịch", href: "/services" }
  },
  {
    slug: "tiem-lam-cornrow-dep-o-da-nang",
    title: "Tiệm Làm Cornrows Đẹp, Chia Đường Line Nét Căng & Êm Da Đầu Tại Đà Nẵng",
    metaTitle: "Tiệm Làm Cornrows Đà Nẵng Đẹp Nét Căng | Tết Tóc Sát Da Đầu Uy Tín",
    metaDescription: "Khám phá địa chỉ tết tóc Cornrows đẹp nhất Đà Nẵng. Chia đường line thẳng tắp, họa tiết chữ chi, ziczac cá tính, tết êm không đau buốt chân tóc.",
    category: "braids",
    categoryLabel: "Kỹ Thuật Braids",
    intent: "Local Discovery",
    readTime: "5 phút",
    publishedAt: "2025-02-05",
    updatedAt: "2025-02-25",
    author: "WINDREAD Braider Crew",
    heroImage: "/images/collection /Cornrows for Men/collection1.webp",
    targetKeywords: ["cornrow Đà Nẵng", "tiệm làm cornrow đẹp ở đà nẵng", "tết tóc sát da đầu đà nẵng", "cornrows da nang"],
    excerpt: "Cornrow là kiểu tóc tết sát da đầu đậm chất thể thao đường phố. Xem ngay địa chỉ làm cornrow tại Đà Nẵng với đường nét chuẩn chỉnh, không đau rát.",
    toc: [
      { id: "cornrow-la-gi", title: "1. Nghệ thuật tết tóc Cornrows sát da đầu" },
      { id: "cac-mau-cornrow-thinh-hanh", title: "2. Các mẫu Cornrows hot nhất tại Đà Nẵng" },
      { id: "tai-sao-chon-windread", title: "3. Vì sao khách hàng tin chọn WINDREAD để làm Cornrows" },
      { id: "luu-y-cham-soc", title: "4. Hướng dẫn giữ nếp tóc cornrows bền lâu" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Cornrows (hay tết tóc sát da đầu) bắt nguồn từ châu Phi cổ đại và đã trở thành biểu tượng phong cách của các vận động viên NBA, rapper và người yêu thời trang streetwear. Từng lọn tóc được bện chặt chẽ ôm sát da đầu tạo nên những đường rãnh thẳng hàng hoặc uốn lượn nghệ thuật.",
      "### Các mẫu Cornrows được yêu cầu nhiều nhất tại WINDREAD Đà Nẵng\n\n1. **Classic Straight-Backs**: 4 đến 8 đường tết thẳng tắp từ trán ra sau gáy. Tối giản, thể thao và rất ngầu.\n2. **Pop Smoke Braids**: Mẫu cornrows chia đôi sang hai bên mang đậm dấu ấn phong cách drill hiphop.\n3. **Zig-Zag & Geometric Cornrows**: Các đường tết gấp khúc ziczac, xoắn ốc hoặc đan chéo thể hiện cá tính riêng.\n4. **Cornrows kết hợp Taper Fade**: Cắt sát hai bên mang tai và sau gáy, tạo sự thanh thoát và gọn gàng cho khuôn mặt người châu Á.",
      "Tại WINDREAD, chúng tôi sử dụng sáp tết không cặn giúp các sợi tóc con vào nếp mượt mà, đường chia da đầu trắng sáng và giảm thiểu tối đa lực kéo lên chân tóc."
    ],
    faqs: [
      { question: "Tết cornrow có bị đau da đầu không?", answer: "Tại WINDREAD, kỹ thuật siết lọn đều tay giúp cố định tóc chắc chắn mà không gây đau buốt hay đỏ da đầu. Sau 1-2 ngày đầu tóc sẽ hoàn toàn mềm mại tự nhiên." },
      { question: "Tết cornrows mất bao nhiêu thời gian?", answer: "Tùy thuộc vào số lượng đường tết (từ 4 đến 12 đường), thời gian thực hiện thường chỉ mất từ 45 phút đến 2 tiếng." }
    ],
    relatedSlugs: ["phan-biet-cornrow-va-box-braids", "top-noi-lam-braids-tai-da-nang", "cach-cham-soc-toc-braids"],
    moneyPageLink: { label: "Xem chi tiết dịch vụ Cornrows Đà Nẵng", href: "/cornrows-da-nang" }
  },
  {
    slug: "du-lich-da-nang-tet-toc-o-dau",
    title: "Du Lịch Đà Nẵng Tết Tóc Ở Đâu? Cẩm Nang Tạo Kiểu Check-in Biển Cực Chất",
    metaTitle: "Du Lịch Đà Nẵng Tết Tóc Ở Đâu Đẹp? | Kinh Nghiệm Check-in Biển Mỹ Khê",
    metaDescription: "Kinh nghiệm du lịch Đà Nẵng tết tóc braids, cornrow chụp ảnh biển cực đẹp. Địa chỉ tiệm tết tóc gần biển Mỹ Khê và phố đi bộ An Thượng lấy liền trong ngày.",
    category: "local",
    categoryLabel: "Địa Chỉ & Bảng Giá",
    intent: "Local Discovery",
    readTime: "5 phút",
    publishedAt: "2025-02-10",
    updatedAt: "2025-02-26",
    author: "WINDREAD Travel Guide",
    heroImage: "/images/moment/DSC09788.webp",
    targetKeywords: ["tết tóc Đà Nẵng", "tết tóc đi biển đà nẵng", "du lịch đà nẵng tết tóc ở đâu", "tết tóc an thượng đà nẵng"],
    excerpt: "Đi du lịch Đà Nẵng muốn có bộ tóc độc lạ để thả dáng bên bãi biển Mỹ Khê, bán đảo Sơn Trà hay phố cổ Hội An? Xem ngay địa chỉ tiệm tết tóc lấy ngay sát biển.",
    toc: [
      { id: "ly-do-nen-tet-toc-khi-du-lich", title: "1. Vì sao nên tết tóc khi đi du lịch Đà Nẵng?" },
      { id: "dia-chi-gan-bien-my-khe", title: "2. Vị trí đắc địa tại khu phố Tây An Thượng" },
      { id: "cac-goi-tet-toc-nhanh", title: "3. Các gói tết tóc nhanh dành cho khách du lịch" },
      { id: "kinh-nghiem-tam-bien", title: "4. Mẹo tắm biển và bảo quản tóc tết trong kỳ nghỉ" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Khi đi du lịch biển, gió biển ẩm và nước mặn thường khiến tóc bị rối bù, bết dính và khó tạo kiểu. Chính vì vậy, xu hướng tết tóc Braids và Cornrows trước khi vi vu Đà Nẵng - Hội An đang được đông đảo bạn trẻ và du khách săn đón.",
      "Tết tóc không chỉ giúp bạn thoải mái tắm biển, lặn ngắm san hô hay chạy xe máy ven đèo Hải Vân mà không lo tóc che mắt, mà còn giúp mọi bức ảnh sống ảo trở nên ấn tượng và khác biệt tuyệt đối.",
      "### WINDREAD An Thượng - Tiệm tết tóc lý tưởng cho khách du lịch\n\nNằm tại **35 - 37 An Thượng 29**, tiệm chỉ cách bờ biển Mỹ Khê vài bước chân. Bạn có thể ghé tiệm vào buổi sáng, thưởng thức một ly cà phê mát lạnh trong khi các braider tạo kiểu cho bạn chỉ trong 1 - 2 tiếng, sau đó tự tin bước ra bãi biển check-in ngay dưới ánh nắng rực rỡ.",
      "Tiệm có sẵn đa dạng các sợi tóc giả nối màu ombre, neon, pastel hay đính hạt cườm vỏ ốc phong cách bohemian cực kỳ bắt mắt."
    ],
    faqs: [
      { question: "Khách du lịch có cần đặt lịch trước không?", answer: "Vào mùa cao điểm du lịch (tháng 3 đến tháng 9), bạn nên đặt lịch trước qua website hoặc Zalo 0393549656 ít nhất 1-2 ngày để tiệm giữ ghế và chuẩn bị phụ kiện màu sắc theo ý bạn." },
      { question: "Tháo tóc braids sau chuyến du lịch có khó không?", answer: "Rất dễ dàng! Bạn chỉ cần cắt dây thun ở ngọn và gỡ dần từng nút thắt từ dưới lên trên. Khi tháo xong hãy chải tơi tóc trước khi gội đầu." }
    ],
    relatedSlugs: ["top-noi-lam-braids-tai-da-nang", "hair-braiding-da-nang-for-foreigners", "cach-cham-soc-toc-braids"],
    moneyPageLink: { label: "Đặt lịch tết tóc đi biển ngay", href: "/booking" }
  },
  {
    slug: "phuc-hoi-va-retwist-dreadlock-da-nang",
    title: "Dịch Vụ Phục Hồi, Nối Lại & Retwist Dreadlock Hư Tổn Tại Đà Nẵng",
    metaTitle: "Phục Hồi & Retwist Dreadlock Đà Nẵng | Sửa Lọn Đứt Gãy, Detox Da Đầu",
    metaDescription: "Dịch vụ phục hồi dreadlocks chuyên nghiệp tại Đà Nẵng: Sửa chân tóc yếu, nối lại lọn đứt gãy, retwist định hình và detox rửa sạch cặn bẩn tích tụ.",
    category: "dreadlocks",
    categoryLabel: "Kỹ Thuật Dreadlock",
    intent: "Local Discovery",
    readTime: "6 phút",
    publishedAt: "2025-02-12",
    updatedAt: "2025-02-27",
    author: "Win Dread Specialist",
    heroImage: "/images/collection / Dreadlocks for Men/collection10.webp",
    targetKeywords: ["retwist dreadlock Đà Nẵng", "sửa dreadlock đà nẵng", "detox dreadlock đà nẵng", "phục hồi dreadlock đà nẵng"],
    excerpt: "Bộ dreadlocks của bạn bị bung form, chân tóc mọc xù không vào nếp hoặc bị đứt gãy lọn? Tìm hiểu ngay quy trình phục hồi và retwist chuyên sâu tại WINDREAD Đà Nẵng.",
    toc: [
      { id: "cac-van-de-thuong-gap-o-dreadlock", title: "1. Những vấn đề thường gặp sau một thời gian chơi Dreadlocks" },
      { id: "quy-trinh-phuc-hoi-tai-windread", title: "2. Quy trình phục hồi 4 bước chuẩn chuyên gia" },
      { id: "dich-vu-locs-detox-chuyen-sau", title: "3. Locs Detox - Tẩy sạch cặn bẩn tích tụ trong thân lọn" },
      { id: "cach-duy-tri-sau-khi-retwist", title: "4. Cách chăm sóc để chân tóc chắc khỏe lâu dài" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Dreadlocks là một phong cách tóc lâu dài, nhưng nếu không được chăm sóc đúng cách, lọn tóc có thể gặp phải các vấn đề: chân tóc mới mọc quá nhiều gây xơ rối (frizz), lọn tóc bị mỏng dần ở thân và có nguy cơ đứt gãy, hoặc tích tụ bụi bẩn và xà phòng (buildup) bên trong ruột lọn tóc.",
      "Tại Đà Nẵng, WINDREAD là một trong số rất ít studio sở hữu đầy đủ kỹ thuật móc kim phục hồi cấu trúc lọn tóc mà không cần cắt bỏ.",
      "### Quy trình 4 bước phục hồi tóc tại WINDREAD\n\n1. **Khám tóc & Kiểm tra da đầu**: Đánh giá độ chịu lực của nang tóc và vị trí các lọn bị yếu.\n2. **Locs Detox làm sạch sâu**: Ngâm và xả lọn tóc với công thức muối nở (baking soda), giấm táo (apple cider vinegar) và tinh dầu tràm trà để đẩy toàn bộ cặn bã tích tụ ra ngoài.\n3. **Củng cố & Đan móc lại lọn (Loc Repair)**: Dùng kim móc 0.5mm và 0.75mm đan lại các sợi tóc tưa rách, gia cố chân tóc bị mỏng bằng tóc tự nhiên.\n4. **Retwist & Dưỡng nếp**: Vê gọn chân tóc theo đúng chiều xoắn nguyên bản, sấy khô bằng máy sấy chuyên dụng để cố định form lọn hoàn hảo."
    ],
    faqs: [
      { question: "Lọn dreadlock bị đứt rời có nối lại được không?", answer: "Hoàn toàn nối lại được! Chỉ cần bạn giữ lại phần lọn tóc đã rụng, thợ tại WINDREAD sẽ dùng kỹ thuật crochet đan nối lại vào chân tóc mà không để lại vết sẹo nối." },
      { question: "Bao lâu nên đi làm Locs Detox một lần?", answer: "Bạn nên làm Locs Detox sâu khoảng 3 đến 6 tháng một lần để giữ cho lọn tóc nhẹ nhàng, thơm tho và da đầu thông thoáng." }
    ],
    relatedSlugs: ["khi-nao-nen-retwist-dreadlock", "dreadlock-giu-duoc-bao-lau", "gia-lam-dreadlock-o-da-nang"],
    moneyPageLink: { label: "Đặt lịch phục hồi & Retwist ngay", href: "/booking" }
  },
  {
    slug: "dreadlock-la-gi",
    title: "Dreadlock Là Gì? Toàn Bộ Kiến Thức & Các Kiểu Tóc Dreadlocks Đẹp Nhất",
    metaTitle: "Dreadlock Là Gì? Tất Tần Tật Về Các Kiểu Tóc Dreadlocks | WINDREAD",
    metaDescription: "Dreadlock là gì? Khám phá định nghĩa, phân loại các kiểu dreadlock nam nữ thịnh hành và bí quyết để biết bạn có phù hợp với kiểu tóc này hay không.",
    category: "dreadlocks",
    categoryLabel: "Kỹ Thuật Dreadlock",
    intent: "Informational",
    readTime: "7 phút",
    publishedAt: "2025-01-05",
    updatedAt: "2025-02-10",
    author: "Win Dread",
    heroImage: "/images/collection / Dreadlocks for Men/collection11.webp",
    targetKeywords: ["dreadlock là gì", "dreadlocks là gì", "các kiểu dreadlock", "tóc dreadlock nam"],
    excerpt: "Dreadlock (hay tóc bện thừng) là một trong những kiểu tóc lâu đời và độc đáo nhất lịch sử nhân loại. Cùng tìm hiểu chi tiết cấu trúc lọn tóc và các biến thể hiện đại.",
    toc: [
      { id: "dinh-nghia-dreadlock", title: "1. Định nghĩa Dreadlock là gì?" },
      { id: "cau-truc-ben-trong-lon-toc", title: "2. Cấu trúc bên trong của một lọn tóc Locs" },
      { id: "phan-loai-cac-kieu-dreadlock", title: "3. Phân loại các kiểu Dreadlock phổ biến hiện nay" },
      { id: "ai-phu-hop-choi-dreadlock", title: "4. Ai phù hợp để làm tóc Dreadlock?" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "**Dreadlocks** (thường được gọi tắt là **Locs** hoặc tóc bện thừng) là kiểu tóc mà các sợi tóc được đan bện, xoắn chặt và khóa vào nhau (interlocking) để tạo thành những lọn tóc hình trụ đặc trưng.",
      "Không giống như tóc tết thông thường có thể dễ dàng tháo ra sau vài ngày, dreadlocks trải qua quá trình tự nhiên hóa: các vảy biểu bì của sợi tóc móc vào nhau theo thời gian, hình thành một khối đồng nhất bền vững có thể giữ được nhiều năm.",
      "### Các kiểu Dreadlock thịnh hành nhất ngày nay\n\n1. **Traditional Locs (Dreadlock truyền thống)**: Kích thước lọn vừa phải (bằng ngón tay út), chia section vuông hoặc tam giác đều đặn.\n2. **Freeform Locs**: Để tóc tự khóa tự nhiên theo thời gian mà không cần chải hay chia ngôi gò bó, mang đậm chất hoang dã của các nghệ sĩ reggae.\n3. **Semi-Freeform Locs**: Kết hợp giữa chia section ban đầu gọn gàng nhưng để thân lọn phát triển tự do, giữ được nét bụi bặm nhưng không luộm thuộm.\n4. **High-Top / Taper Dreadlocks**: Cắt fade sát hai bên tai và sau gáy, chỉ để dreadlocks ở phần đỉnh đầu. Đây là kiểu tóc được nam giới châu Á ưa chuộng nhất vì vừa chất chơi vừa dễ mặc đồ công sở, streetwear.\n5. **Instant Locs (Móc khóa tức thì)**: Kỹ thuật dùng kim móc crochet siêu nhỏ móc trực tiếp, giúp bạn sở hữu bộ dreadlock hoàn chỉnh ngay trong ngày mà không cần chờ đợi nhiều tháng."
    ],
    faqs: [
      { question: "Người Việt tóc thẳng có làm được Dreadlock không?", answer: "Hoàn toàn làm được! Bằng kỹ thuật móc kim chuyên dụng (crochet method), chất tóc thẳng của người châu Á vẫn có thể tạo nên những lọn dreadlocks cứng cáp và tròn đều." },
      { question: "Làm dreadlocks có phải cạo trọc khi không chơi nữa không?", answer: "Không nhất thiết! Nếu bạn muốn tháo dreadlocks, thợ chuyên nghiệp có thể dùng dầu xả đậm đặc và kim gỡ kiên nhẫn để giữ lại độ dài tóc tự nhiên của bạn." }
    ],
    relatedSlugs: ["nguon-goc-dreadlock", "dreadlock-giu-duoc-bao-lau", "starter-locs-huong-dan-cho-nguoi-moi"],
    moneyPageLink: { label: "Xem dịch vụ Dreadlock tại WINDREAD Đà Nẵng", href: "/dreadlock-da-nang" }
  },
  {
    slug: "nguon-goc-dreadlock",
    title: "Nguồn Gốc Của Dreadlock: Lịch Sử, Ý Nghĩa Văn Hóa & Biểu Tượng Tự Do",
    metaTitle: "Nguồn Gốc Của Dreadlock | Lịch Sử Văn Hóa Rastafari Đến Thời Trang",
    metaDescription: "Tìm hiểu nguồn gốc sâu xa của tóc dreadlock: Từ các chiến binh Ai Cập cổ đại, văn hóa Rastafari Jamaica đến biểu tượng thời trang đường phố toàn cầu.",
    category: "dreadlocks",
    categoryLabel: "Kỹ Thuật Dreadlock",
    intent: "Informational",
    readTime: "6 phút",
    publishedAt: "2025-01-08",
    updatedAt: "2025-02-11",
    author: "WINDREAD Culture Lab",
    heroImage: "/images/about/about-hor.png",
    targetKeywords: ["nguồn gốc dreadlock", "lịch sử dreadlock", "văn hóa dreadlocks", "rastafari dreadlocks"],
    excerpt: "Dreadlock không đơn thuần là một kiểu tóc thời thượng. Đằng sau những lọn tóc bện là hàng ngàn năm lịch sử, tín ngưỡng tâm linh và tinh thần tự do bất khuất.",
    toc: [
      { id: "dau-vet-lich-su-co-dai", title: "1. Dấu vết Dreadlock trong các nền văn minh cổ đại" },
      { id: "phong-trao-rastafari-jamaica", title: "2. Phong trào Rastafari & Biểu tượng của Bob Marley" },
      { id: "ten-goi-dreadlock", title: "3. Tên gọi 'Dreadlocks' xuất phát từ đâu?" },
      { id: "dreadlock-trong-thoi-dai-hien-dai", title: "4. Dreadlocks trong văn hóa hiphop & thời trang hiện đại" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Nhiều người lầm tưởng dreadlocks chỉ xuất hiện từ phong trào nhạc Reggae ở Jamaica vào thế kỷ 20. Trên thực tế, các nhà khảo cổ học đã tìm thấy những hình vẽ và xác ướp mang tóc dreadlocks từ nền văn minh **Ai Cập cổ đại**, các chiến binh **Sparta (Hy Lạp)**, các tu sĩ **Sadhu giáo phái Hindu tại Ấn Độ**, và các chiến binh **Maasai ở Đông Phi** từ hàng ngàn năm trước Công nguyên.",
      "### Phong trào Rastafari & Bob Marley\n\nVào những năm 1930 tại Jamaica, phong trào tôn giáo xã hội Rastafari ra đời. Với người Rasta, mái tóc dreadlocks tượng trưng cho bờm sư tử xứ Judah, thể hiện mối dây liên kết thiêng liêng với đấng sáng tạo Jah và sự phản kháng chống lại ách áp bức thuộc địa.",
      "Huyền thoại âm nhạc Bob Marley đã mang âm nhạc Reggae cùng hình ảnh mái tóc dreadlocks bay bổng ra toàn thế giới, biến nó thành biểu tượng toàn cầu của hòa bình, tình yêu và tự do.",
      "### Bước chuyển mình sang thời trang & văn hóa đương đại\n\nNgày nay, dreadlocks đã vượt qua ranh giới tôn giáo để trở thành một phần cốt lõi của văn hóa hiphop, thể thao mạo hiểm và streetwear. Các ngôi sao quốc tế như Lil Wayne, Travis Scott, J. Cole, hay các vận động viên bóng rổ NBA đã chứng minh sức hút mãnh liệt và không bao giờ lỗi mốt của mái tóc này."
    ],
    faqs: [
      { question: "Tại sao lại gọi là 'Dread' locks?", answer: "Từ 'dread' xuất hiện khi thực dân Anh nhìn thấy các chiến binh Mau Mau mang mái tóc bện hoang dã và cảm thấy 'khiếp sợ' (dread). Sau đó, cộng đồng người da màu đã lấy lại từ này với niềm tự hào kiêu hãnh." }
    ],
    relatedSlugs: ["dreadlock-la-gi", "starter-locs-huong-dan-cho-nguoi-moi"],
    moneyPageLink: { label: "Tìm hiểu dịch vụ Dreadlock Đà Nẵng", href: "/dreadlock-da-nang" }
  },
  {
    slug: "dreadlock-giu-duoc-bao-lau",
    title: "Dreadlock Giữ Được Bao Lâu? Bí Quyết Chăm Sóc Giữ Nếp Bền Đẹp Nhiều Năm",
    metaTitle: "Dreadlock Giữ Được Bao Lâu? | Bí Quyết Giữ Lọn Bền Từ 6 Tháng Đến Vài Năm",
    metaDescription: "Dreadlock chơi được bao lâu? Hướng dẫn chi tiết vòng đời của một bộ locs, lịch bảo dưỡng và cách giữ form tóc dreadlocks bền đẹp bất chấp thời tiết.",
    category: "dreadlocks",
    categoryLabel: "Kỹ Thuật Dreadlock",
    intent: "Informational",
    readTime: "5 phút",
    publishedAt: "2025-01-18",
    updatedAt: "2025-02-14",
    author: "Win Dread",
    heroImage: "/images/collection / Dreadlocks for Men/collection7.webp",
    targetKeywords: ["dreadlock giữ được bao lâu", "tóc dreadlock chơi được bao lâu", "độ bền của dreadlocks"],
    excerpt: "Một trong những câu hỏi phổ biến nhất trước khi làm dreadlocks: Bộ tóc này giữ được bao lâu? Câu trả lời có thể khiến bạn bất ngờ vì dreadlocks có thể đồng hành cùng bạn suốt đời.",
    toc: [
      { id: "do-ben-cua-dreadlock", title: "1. Dreadlock có thể giữ được bao lâu?" },
      { id: "cac-giai-doan-phat-trien", title: "2. Các giai đoạn phát triển của một bộ Locs" },
      { id: "cac-yeu-to-quyet-dinh-do-ben", title: "3. Yếu tố quyết định độ bền của lọn tóc" },
      { id: "bi-quyet-cham-soc", title: "4. Bí quyết giữ form dreadlock luôn sạch đẹp" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Khác với các kiểu tóc uốn hay tết tạm thời chỉ giữ được vài tuần, **dreadlocks là một kiểu tóc vĩnh viễn (permanent hairstyle)** nếu bạn duy trì chăm sóc.",
      "Bạn có thể chơi dreadlocks trong **6 tháng, 1 năm, 3 năm hoặc thậm chí 10 năm** cho đến khi bạn quyết định tháo gỡ hoặc cắt ngắn.",
      "### Vòng đời phát triển của một bộ Dreadlocks\n\n1. **Giai đoạn Starter (Tháng 1 - 3)**: Các lọn tóc mới được móc, chân tóc còn mềm, dễ bị xù khi gội. Đây là giai đoạn cần kiên nhẫn nhất.\n2. **Giai đoạn Sprouting (Tháng 3 - 6)**: Tóc bắt đầu nở ra và các sợi tóc bên trong bắt đầu bện chặt vào nhau.\n3. **Giai đoạn Locking (Tháng 6 - 12)**: Lọn tóc co lại, săn chắc và hình thành cấu trúc trụ tròn đặc ruột.\n4. **Giai đoạn Mature (Sau 1 năm)**: Bộ locs hoàn toàn trưởng thành, đầm tay, bền bỉ và cực kỳ dễ chăm sóc.",
      "Tại môi trường khí hậu miền Trung như Đà Nẵng, việc giữ tóc khô ráo sau khi tắm biển và đội mũ ngủ satin là chìa khóa vàng giúp kéo dài tuổi thọ cho bộ locs của bạn."
    ],
    faqs: [
      { question: "Nếu không retwist thì dreadlock có bị hỏng không?", answer: "Nếu không retwist, tóc mới mọc sẽ phát triển theo hướng Semi-freeform (tự do). Lọn tóc không bị hỏng nhưng chân tóc sẽ to hơn và các lọn liền kề có thể dính vào nhau nếu không tách định kỳ." }
    ],
    relatedSlugs: ["dreadlock-la-gi", "khi-nao-nen-retwist-dreadlock", "phuc-hoi-va-retwist-dreadlock-da-nang"],
    moneyPageLink: { label: "Xem hướng dẫn dịch vụ Dreadlock", href: "/dreadlock-da-nang" }
  },
  {
    slug: "phan-biet-cornrow-va-box-braids",
    title: "Cornrow Và Box Braids Khác Nhau Thế Nào? So Sánh Chi Tiết Để Chọn Kiểu",
    metaTitle: "Phân Biệt Cornrow Và Box Braids Khác Nhau Thế Nào? | WINDREAD",
    metaDescription: "So sánh chi tiết Cornrow và Box Braids: Điểm khác biệt về kỹ thuật tết, độ bền, cảm giác da đầu và phong cách khuôn mặt phù hợp cho nam & nữ.",
    category: "braids",
    categoryLabel: "Kỹ Thuật Braids",
    intent: "Informational",
    readTime: "6 phút",
    publishedAt: "2025-01-22",
    updatedAt: "2025-02-16",
    author: "WINDREAD Braider Specialist",
    heroImage: "/images/collection /Boxbraids for Men/collection1.webp",
    targetKeywords: ["cornrow và box braids khác nhau thế nào", "phân biệt cornrow và box braid", "so sánh cornrow và braids"],
    excerpt: "Cả Cornrow và Box Braids đều là những kiểu tết tóc siêu ngầu, nhưng chúng có cấu trúc, kỹ thuật và tính ứng dụng hoàn toàn khác nhau. Khám phá ngay để chọn kiểu tóc chân ái.",
    toc: [
      { id: "tong-quan-hai-kieu-tet", title: "1. Tổng quan về Cornrow và Box Braids" },
      { id: "bang-so-sanh-chi-tiet", title: "2. Bảng so sánh chi tiết 5 tiêu chí cốt lõi" },
      { id: "khi-nao-nen-chon-cornrows", title: "3. Khi nào bạn nên chọn Cornrows?" },
      { id: "khi-nao-nen-chon-box-braids", title: "4. Khi nào bạn nên chọn Box Braids?" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Đối với những người mới tìm hiểu về văn hóa tóc tết, việc phân biệt giữa **Cornrows** và **Box Braids** đôi khi gây bối rối. Mặc dù cả hai đều sử dụng kỹ thuật đan 3 lọn tóc, sự khác biệt nằm ở cách lọn tóc bám vào da đầu.",
      "### Bảng so sánh chi tiết\n\n| Tiêu chí | Cornrows | Box Braids |\n| :--- | :--- | :--- |\n| **Kỹ thuật** | Tết sát da đầu theo từng đường rãnh | Chia ô da đầu (hình vuông/tam giác), lọn thả tự do |\n| **Chuyển động** | Cố định sát hộp sọ | Lọn tóc bay bổng, cử động linh hoạt |\n| **Thời gian thực hiện** | Nhanh hơn (45p - 2 tiếng) | Lâu hơn (3 - 6 tiếng) |\n| **Độ bền giữ nếp** | 2 - 4 tuần | 4 - 6 tuần |\n| **Cảm giác da đầu** | Thoáng khí, nhẹ đầu | Nặng hơn nếu nối thêm nhiều sợi tóc giả |",
      "### Nên chọn kiểu nào?\n\n- **Chọn Cornrows nếu**: Bạn thích phong cách thể thao, năng động, thường xuyên tập gym, chơi bóng rổ hoặc muốn một kiểu tóc mát mẻ cho mùa hè Đà Nẵng.\n- **Chọn Box Braids nếu**: Bạn thích sự biến hóa đa dạng (có thể xõa, buộc đuôi ngựa, búi củ tỏi man-bun) và muốn độ bồng bềnh cá tính."
    ],
    faqs: [
      { question: "Kiểu nào ít đau hơn khi tết?", answer: "Cả hai kiểu nếu được thợ tay nghề cao thực hiện đều không đau. Tuy nhiên, Box Braids thường tạo cảm giác nhẹ nhàng hơn ở ngày đầu vì lực kéo phân bổ đều theo từng ô tóc." }
    ],
    relatedSlugs: ["tiem-lam-cornrow-dep-o-da-nang", "top-noi-lam-braids-tai-da-nang", "cach-cham-soc-toc-braids"],
    moneyPageLink: { label: "Xem dịch vụ Tết tóc Box Braids", href: "/box-braids-da-nang" }
  },
  {
    slug: "khi-nao-nen-retwist-dreadlock",
    title: "Khi Nào Nên Retwist Dreadlock? Dấu Hiệu & Lịch Bảo Dưỡng Chuẩn Nhất",
    metaTitle: "Khi Nào Nên Retwist Dreadlock? | Lịch Trình Bảo Dưỡng Chân Tóc Chuẩn",
    metaDescription: "Bao lâu nên retwist dreadlock một lần? Nhận biết 4 dấu hiệu chân tóc cần bảo dưỡng ngay để tránh lọn tóc bị mỏng, gãy rụng và mất form.",
    category: "dreadlocks",
    categoryLabel: "Kỹ Thuật Dreadlock",
    intent: "Informational",
    readTime: "5 phút",
    publishedAt: "2025-01-28",
    updatedAt: "2025-02-17",
    author: "Win Dread",
    heroImage: "/images/collection / Dreadlocks for Men/collection6.webp",
    targetKeywords: ["khi nào nên retwist dreadlock", "bao lâu retwist một lần", "retwist dreadlocks đà nẵng"],
    excerpt: "Retwist quá thường xuyên có thể làm yếu chân tóc, nhưng bỏ bê quá lâu sẽ làm lọn tóc dính chùm mất form. Xem ngay lịch trình retwist chuẩn từ nghệ nhân.",
    toc: [
      { id: "retwist-la-gi", title: "1. Retwist Dreadlock là gì?" },
      { id: "tan-suat-retwist-ly-tuong", title: "2. Tần suất Retwist lý tưởng theo từng giai đoạn" },
      { id: "4-dau-hieu-can-retwist", title: "3. 4 dấu hiệu nhắc bạn cần ghé tiệm retwist ngay" },
      { id: "tac-hai-khi-retwist-qua-nhieu", title: "4. Tác hại khi Retwist quá đà (Over-twisting)" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "**Retwist** là quá trình gom các sợi tóc con mới mọc ở chân da đầu và xoắn/móc chúng lại vào thân lọn dreadlock tương ứng. Quá trình này giúp đường chia ngôi (parts) trở nên sắc nét, da đầu thông thoáng và lọn tóc duy trì độ dày đồng đều từ gốc đến ngọn.",
      "### Tần suất Retwist lý tưởng\n\n- **Giai đoạn Starter Locs (3 tháng đầu)**: Khoảng **3 - 4 tuần/lần** để định hình thói quen mọc của sợi tóc.\n- **Giai đoạn Locs đã trưởng thành (sau 1 năm)**: Khoảng **6 - 8 tuần/lần** là thời gian hoàn hảo để da đầu được nghỉ ngơi tự nhiên.",
      "### 4 dấu hiệu bạn cần Retwist ngay\n\n1. Chân tóc mới mọc dài hơn 2-3cm và bị rối xù (frizzy base).\n2. Đường chia ngôi ban đầu bị che lấp hoàn toàn.\n3. Các lọn tóc cạnh nhau bắt đầu bện dính vào nhau ở chân gốc.\n4. Bạn sắp tham gia một sự kiện quan trọng và cần một diện mạo chỉn chu, sắc sảo."
    ],
    faqs: [
      { question: "Retwist có làm tóc mọc nhanh hơn không?", answer: "Retwist không làm tăng tốc độ mọc tóc từ nang tóc, nhưng giúp gom trọn vẹn độ dài tóc mới vào lọn, ngăn ngừa đứt gãy và giữ tóc dài tối đa." }
    ],
    relatedSlugs: ["phuc-hoi-va-retwist-dreadlock-da-nang", "dreadlock-giu-duoc-bao-lau", "starter-locs-huong-dan-cho-nguoi-moi"],
    moneyPageLink: { label: "Đặt lịch Retwist tại WINDREAD", href: "/booking" }
  },
  {
    slug: "cach-cham-soc-toc-braids",
    title: "Cách Chăm Sóc Tóc Braids Bền Đẹp: Hướng Dẫn Gội Đầu, Ngủ & Giảm Ngứa",
    metaTitle: "Cách Chăm Sóc Tóc Braids Tại Nhà Bền Đẹp | Gội Đầu & Giảm Ngứa Da Đầu",
    metaDescription: "Cẩm nang chăm sóc tóc braids, cornrows sau khi tết: Cách gội đầu không bung lọn, mẹo ngủ giữ nếp bằng khăn satin và xịt dưỡng giảm ngứa da đầu hiệu quả.",
    category: "braids",
    categoryLabel: "Kỹ Thuật Braids",
    intent: "Informational",
    readTime: "6 phút",
    publishedAt: "2025-02-02",
    updatedAt: "2025-02-19",
    author: "WINDREAD Care Team",
    heroImage: "/images/collection /Braids for Women/collection5.webp",
    targetKeywords: ["cách chăm sóc tóc braids", "gội đầu khi tết tóc braids", "cách giữ nếp tóc tết", "tóc tết bị ngứa da đầu"],
    excerpt: "Sở hữu một bộ braids đẹp là bước 1, nhưng chăm sóc ra sao để tóc giữ nếp bền 1 tháng mà da đầu vẫn sạch thơm mới là nghệ thuật. Xem ngay cẩm nang chi tiết.",
    toc: [
      { id: "cham-soc-khi-ngu", title: "1. Bảo vệ tóc khi ngủ bằng khăn Satin / Bonnets" },
      { id: "cach-goi-dau-chuan", title: "2. Hướng dẫn gội đầu đúng cách cho tóc Braids" },
      { id: "giai-phap-khi-bi-ngua", title: "3. Cách xử lý ngứa và khô da đầu hiệu quả" },
      { id: "khi-nao-nen-thao", title: "4. Thời điểm vàng nên tháo tóc để bảo vệ nang tóc" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "Nhiều người e ngại tết tóc braids vì nghĩ rằng không thể gội đầu hoặc tóc sẽ bốc mùi khó chịu. Đây là quan niệm hoàn toàn sai lầm! Một người chơi braids sành điệu luôn biết cách giữ cho da đầu sạch sẽ và thơm tho mỗi ngày.",
      "### Quy tắc vàng chăm sóc tóc Braids tại nhà\n\n1. **Luôn bảo vệ tóc khi ngủ**: Vỏ gối cotton thông thường có độ ma sát cao hút sạch độ ẩm của tóc và kéo sợi tóc con bung xù. Hãy sử dụng **mũ trùm satin (bonnet)** hoặc dùng khăn lụa quấn nhẹ trước khi lên giường.\n2. **Cách gội đầu êm ái**: Không đổ trực tiếp dầu gội đặc lên tóc. Hãy pha loãng dầu gội vào một bình xịt nước, xịt đều vào các đường rãnh da đầu, dùng đầu ngón tay xoa bóp nhẹ nhàng rồi xả lại bằng vòi hoa sen áp lực vừa phải.\n3. **Làm khô tuyệt đối**: Sau khi gội, thấm khô bằng khăn microfiber và sấy da đầu ở chế độ gió mát. Tuyệt đối không để chân tóc ẩm ướt đi ngủ vì dễ sinh nấm mốc.\n4. **Giảm ngứa tức thì**: Sử dụng xịt dưỡng gốc nước chứa tinh dầu bạc hà (peppermint) hoặc tràm trà (tea tree) làm dịu da đầu ngay tức khắc."
    ],
    faqs: [
      { question: "Nên giữ tóc braids tối đa bao lâu?", answer: "Thời gian an toàn nhất để giữ braids là từ 4 đến 6 tuần. Giữ tóc quá 8 tuần có thể gây bết dính và tích tụ tóc chết ở chân gốc, dẫn đến rụng tóc." }
    ],
    relatedSlugs: ["top-noi-lam-braids-tai-da-nang", "phan-biet-cornrow-va-box-braids", "tiem-lam-cornrow-dep-o-da-nang"],
    moneyPageLink: { label: "Xem bộ sưu tập Braids tại WINDREAD", href: "/braids-da-nang" }
  },
  {
    slug: "starter-locs-huong-dan-cho-nguoi-moi",
    title: "Starter Locs: Hướng Dẫn Nhập Môn Dreadlock Từ A-Z Cho Người Mới Bắt Đầu",
    metaTitle: "Starter Locs Là Gì? Cẩm Nang Làm Dreadlock Cho Người Mới Bắt Đầu",
    metaDescription: "Bắt đầu hành trình dreadlocks với Starter Locs: Tìm hiểu các phương pháp khởi tạo (comb coils, two-strand twists, instant locs), chuẩn bị tóc và chi phí.",
    category: "dreadlocks",
    categoryLabel: "Kỹ Thuật Dreadlock",
    intent: "Informational",
    readTime: "7 phút",
    publishedAt: "2025-02-08",
    updatedAt: "2025-02-21",
    author: "Win Dread",
    heroImage: "/images/collection / Dreadlocks for Men/collection1.webp",
    targetKeywords: ["starter locs", "starter locs là gì", "làm dreadlock cho người mới", "bắt đầu làm dreadlock"],
    excerpt: "Bạn muốn bắt đầu chơi dreadlocks nhưng không biết bắt đầu từ đâu? Hướng dẫn nhập môn này giúp bạn chọn đúng phương pháp khởi tạo và tránh mọi sai lầm phổ biến.",
    toc: [
      { id: "starter-locs-la-gi", title: "1. Starter Locs là gì?" },
      { id: "3-phuong-phap-khoi-tao", title: "2. 3 phương pháp làm Starter Locs phổ biến" },
      { id: "chuan-bi-truoc-khi-lam", title: "3. Bạn cần chuẩn bị gì trước khi đến tiệm?" },
      { id: "nhung-dieu-khong-nen-lam", title: "4. Những sai lầm tai hại trong 3 tháng đầu" },
      { id: "faq", title: "5. Câu hỏi thường gặp" }
    ],
    content: [
      "**Starter Locs** (hay Baby Locs) là giai đoạn đầu tiên đánh dấu sự ra đời của một bộ dreadlocks. Đây là nền móng quyết định toàn bộ hình dáng, kích thước và độ chắc khỏe của mái tóc bạn trong nhiều năm tới.",
      "### 3 phương pháp làm Starter Locs phổ biến nhất\n\n1. **Instant Locs (Bằng kim móc Crochet)**: Đây là phương pháp tối ưu nhất cho chất tóc người Việt. Nghệ nhân dùng kim móc tạo lọn tóc đặc ruột ngay lập tức trong 4-6 tiếng. Bạn có ngay bộ dreadlock chắc chắn mà không sợ bung khi gội đầu.\n2. **Comb Coils (Xoắn lược)**: Dùng đuôi lược xoắn từng lọn tóc tròn nhỏ. Phương pháp này phù hợp với tóc xoăn tự nhiên, mất 3-6 tháng để tóc khóa chặt.\n3. **Two-Strand Twists**: Bện xoắn 2 sợi. Mang lại form lọn dày dặn và ít bị bung hơn comb coils.",
      "### Lời khuyên vàng cho người mới bắt đầu tại WINDREAD\n\nTrước khi ghé tiệm, hãy gội đầu sạch sẽ bằng dầu gội làm sạch sâu (clarifying shampoo), **tuyệt đối không dùng dầu xả hay dầu dưỡng** vì chất làm mượt sẽ khiến tóc trơn tuột, khó khóa lọn. Hãy chuẩn bị tinh thần kiên nhẫn để cùng đồng hành với sự biến chuyển của mái tóc."
    ],
    faqs: [
      { question: "Tóc ngắn bao nhiêu cm thì làm được starter locs?", answer: "Độ dài tối thiểu lý tưởng là 8-10cm. Nếu tóc bạn ngắn hơn (khoảng 6-7cm), bạn có thể lựa chọn kỹ thuật Instant Locs kết hợp nối sợi." }
    ],
    relatedSlugs: ["dreadlock-la-gi", "gia-lam-dreadlock-o-da-nang", "khi-nao-nen-retwist-dreadlock"],
    moneyPageLink: { label: "Tư vấn làm Starter Locs tại WINDREAD Đà Nẵng", href: "/dreadlock-da-nang" }
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((article) => article.category === category);
}

export async function getLiveArticles(): Promise<Article[]> {
  try {
    const { createServiceClient } = await import("../supabase/service");
    const service = createServiceClient();
    const { data, error } = await service
      .from("news_articles")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
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
    }
  } catch (err) {
    // Graceful fallback to static articles
  }
  return articles;
}

export async function getLiveArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const { createServiceClient } = await import("../supabase/service");
    const service = createServiceClient();
    const { data, error } = await service
      .from("news_articles")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (!error && data) {
      return {
        slug: data.slug,
        title: data.title,
        metaTitle: data.meta_title || data.title,
        metaDescription: data.meta_description || data.excerpt,
        category: data.category as ArticleCategory,
        categoryLabel: data.category_label || "Cẩm Nang",
        intent: data.intent || "Informational",
        readTime: data.read_time || "5 phút",
        publishedAt: data.published_at || new Date().toISOString().split("T")[0],
        updatedAt: data.updated_at || new Date().toISOString().split("T")[0],
        author: data.author || "Win Dread & Crew",
        heroImage: data.hero_image,
        targetKeywords: Array.isArray(data.target_keywords) ? data.target_keywords : [],
        excerpt: data.excerpt,
        toc: Array.isArray(data.toc) ? data.toc : [],
        content: Array.isArray(data.content) ? data.content : typeof data.content === "string" ? [data.content] : [],
        faqs: Array.isArray(data.faqs) ? data.faqs : [],
        relatedSlugs: Array.isArray(data.related_slugs) ? data.related_slugs : [],
        moneyPageLink: {
          label: data.money_page_label || "Xem dịch vụ",
          href: data.money_page_href || "/services"
        }
      };
    }
  } catch (err) {
    // Fallback
  }
  return getArticleBySlug(slug);
}

