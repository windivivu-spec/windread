export const shopKnowledge = {
  brand: "WINDREAD Locs & Barber Club",
  summary:
    "Barbershop tại Ngũ Hành Sơn, Đà Nẵng, chuyên locs, dreadlocks, braids, fade, cắt tóc, râu, uốn, nhuộm và chăm sóc tóc.",
  expertise: [
    "Starter locs, retwist, palm roll, locs styling, maintenance và repair",
    "Braids và dreadlocks",
    "Clean fade, classic cut, crop, texture cut và line up",
    "Beard trim và hot towel shave",
    "Color locs, nhuộm, uốn và treatment"
  ],
  locations: [
    {
      name: "Cơ sở 1",
      address: "223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng"
    },
    {
      name: "Cơ sở 2",
      address: "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng"
    }
  ],
  contact: {
    phone: "0393549656",
    channels: "Điện thoại / Zalo / WhatsApp"
  },
  hours: {
    mondayToSaturday: "10:00-21:00",
    sunday: "12:00-18:00",
    timezone: "Asia/Ho_Chi_Minh"
  },
  pricing: [
    {
      group: "Locs Services",
      items: [
        ["Starter Locs", "Sectioning, crochet/palm roll, tư vấn chăm sóc", "từ 900.000đ"],
        ["Locs Maintenance", "Làm sạch chân, tighten, sửa locs yếu", "từ 500.000đ"],
        ["Retwist", "Palm roll, gel nhẹ, finish gọn", "từ 450.000đ"],
        ["Locs Styling", "Two-strand, barrel, bun, rope twist", "từ 350.000đ"]
      ]
    },
    {
      group: "Haircut & Fades",
      items: [
        ["Clean Fade", "Low/mid/high fade, line up", "từ 220.000đ"],
        ["Classic Cut", "Crop, taper, texture cut", "từ 200.000đ"],
        ["Line Up", "Viền tóc, mai, gáy", "từ 90.000đ"]
      ]
    },
    {
      group: "Beard & Shaving",
      items: [
        ["Beard Trim", "Shape râu, balm finish", "từ 120.000đ"],
        ["Hot Towel Shave", "Khăn nóng, dao cạo classic", "từ 180.000đ"]
      ]
    },
    {
      group: "Color & Treatment",
      items: [
        ["Color Locs", "Highlight, tone, treatment bảo vệ locs", "từ 1.200.000đ"],
        ["Detox Locs", "Deep clean buildup, rinse và dry", "từ 650.000đ"],
        ["Scalp Treatment", "Làm dịu da đầu, cân bằng dầu", "từ 250.000đ"]
      ]
    },
    {
      group: "Combo Packages",
      items: [
        ["Dread & Fade Combo", "Retwist + clean fade + line up", "từ 650.000đ"],
        ["Full Street Reset", "Detox + retwist + style + fade", "từ 1.350.000đ"]
      ]
    }
  ],
  pricingNote:
    "Tóc quá dài/dày, locs cần repair nhiều, dịch vụ sau giờ hoặc house call có thể phụ thu. Crew báo giá rõ trước khi làm.",
  bookingPolicies: [
    "Đặt cọc 30%",
    "Có buffer 10 phút giữa mỗi lịch",
    "Trễ hơn 15 phút có thể cần đổi slot",
    "Khách nên lưu mã booking để đối chiếu"
  ]
} as const;
