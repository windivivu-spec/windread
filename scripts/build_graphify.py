#!/usr/bin/env python3
"""
Graphify Knowledge Graph Builder for WINDREAD Barber & Hair Studio Da Nang
Generates standard Graphify output in `graphify-out/` according to https://github.com/Graphify-Labs/graphify
"""

import json
import os
from datetime import datetime

OUTPUT_DIR = "graphify-out"
WIKI_DIR = os.path.join(OUTPUT_DIR, "wiki")
os.makedirs(WIKI_DIR, exist_ok=True)

# 1. Communities Definition
COMMUNITIES = {
    0: {"name": "Brand & Local Infrastructure", "desc": "WINDREAD brand, physical branches in Da Nang, geo-coordinates, barbers"},
    1: {"name": "Tier 1: Money Pages", "desc": "High-conversion transactional landing pages targeting primary keywords"},
    2: {"name": "Tier 2: Informational Guides (E-E-A-T)", "desc": "Top-of-funnel educational articles establishing topical authority"},
    3: {"name": "Tier 3: Local Discovery Articles", "desc": "Bottom-of-funnel articles capturing high commercial intent in Da Nang"},
    4: {"name": "Keyword Entities & Search Intent", "desc": "Target search terms categorized by intent and volume"},
    5: {"name": "Service Catalog & Pricing", "desc": "Structured service offerings, prices, durations, and booking mappings"}
}

# 2. Nodes Construction
nodes = [
    # Community 0: Brand & Branches
    {
        "id": "entity:windread-brand",
        "label": "WINDREAD Locs & Barber Club",
        "type": "ORGANIZATION",
        "community": 0,
        "properties": {
            "siteUrl": "https://windread.vn",
            "phone": "+84393549656",
            "city": "Đà Nẵng",
            "country": "Vietnam",
            "specialties": ["Dreadlocks", "Braids", "Cornrows", "Box Braids", "Barber Fades"]
        }
    },
    {
        "id": "branch:an-thuong",
        "label": "WINDREAD An Thượng (Cơ sở 2)",
        "type": "BRANCH",
        "community": 0,
        "properties": {
            "address": "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng",
            "lat": 16.0538,
            "lng": 108.2442,
            "focus": "Locs & Braids",
            "targetAudience": "Locals, Expats, Beach Tourists"
        }
    },
    {
        "id": "branch:chuong-duong",
        "label": "WINDREAD Chương Dương (Cơ sở 1)",
        "type": "BRANCH",
        "community": 0,
        "properties": {
            "address": "223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng",
            "lat": 16.0506,
            "lng": 108.2369,
            "focus": "Barber, Clean Fade & Afro Styles",
            "targetAudience": "Men Grooming, Streetwear Culture"
        }
    },

    # Community 1: Tier 1 Money Pages
    {
        "id": "page:dreadlock-da-nang",
        "label": "/dreadlock-da-nang",
        "type": "MONEY_PAGE",
        "community": 1,
        "properties": {
            "title": "Dreadlock Đà Nẵng | Tiệm Làm & Nối Dreadlocks Chuyên Nghiệp WINDREAD",
            "primaryKeyword": "dreadlock Đà Nẵng",
            "intent": "Transactional / Commercial",
            "priceRange": "1.200.000đ - 6.000.000đ"
        }
    },
    {
        "id": "page:braids-da-nang",
        "label": "/braids-da-nang",
        "type": "MONEY_PAGE",
        "community": 1,
        "properties": {
            "title": "Braid Đà Nẵng | Dịch Vụ Tết Tóc Nam & Nữ Đẹp Chuyên Nghiệp | WINDREAD",
            "primaryKeyword": "braid Đà Nẵng",
            "intent": "Transactional / Commercial",
            "priceRange": "350.000đ - 2.200.000đ"
        }
    },
    {
        "id": "page:cornrows-da-nang",
        "label": "/cornrows-da-nang",
        "type": "MONEY_PAGE",
        "community": 1,
        "properties": {
            "title": "Cornrow Đà Nẵng | Tết Tóc Sát Da Đầu Nam & Nữ Sắc Nét | WINDREAD",
            "primaryKeyword": "cornrow Đà Nẵng",
            "intent": "Transactional / Commercial",
            "priceRange": "300.000đ - 800.000đ"
        }
    },
    {
        "id": "page:box-braids-da-nang",
        "label": "/box-braids-da-nang",
        "type": "MONEY_PAGE",
        "community": 1,
        "properties": {
            "title": "Box Braids Đà Nẵng | Tết Tóc Hộp Đẹp, Cá Tính Cho Nam & Nữ | WINDREAD",
            "primaryKeyword": "box braids Đà Nẵng",
            "intent": "Transactional / Commercial",
            "priceRange": "400.000đ - 2.600.000đ"
        }
    },

    # Community 3: Tier 3 Local Discovery Articles
    {
        "id": "article:top-dia-chi-lam-dreadlock-tai-da-nang",
        "label": "Top Địa Chỉ Làm Dreadlock Tại Đà Nẵng",
        "type": "ARTICLE_LOCAL_DISCOVERY",
        "community": 3,
        "properties": {
            "slug": "top-dia-chi-lam-dreadlock-tai-da-nang",
            "intent": "Commercial Investigation",
            "targetKeywords": ["top địa chỉ làm dreadlock tại đà nẵng", "làm dreadlock ở đà nẵng"]
        }
    },
    {
        "id": "article:top-noi-lam-braids-tai-da-nang",
        "label": "Top Nơi Làm Braids Tại Đà Nẵng",
        "type": "ARTICLE_LOCAL_DISCOVERY",
        "community": 3,
        "properties": {
            "slug": "top-noi-lam-braids-tai-da-nang",
            "intent": "Commercial Investigation",
            "targetKeywords": ["top nơi làm braids tại đà nẵng", "tết tóc đà nẵng"]
        }
    },
    {
        "id": "article:gia-lam-dreadlock-o-da-nang",
        "label": "Giá Làm Dreadlock Ở Đà Nẵng",
        "type": "ARTICLE_LOCAL_DISCOVERY",
        "community": 3,
        "properties": {
            "slug": "gia-lam-dreadlock-o-da-nang",
            "intent": "Commercial Investigation",
            "targetKeywords": ["giá làm dreadlock ở đà nẵng", "bảng giá dreadlock đà nẵng"]
        }
    },
    {
        "id": "article:hair-braiding-da-nang-for-foreigners",
        "label": "Hair Braiding Da Nang For Foreigners",
        "type": "ARTICLE_LOCAL_DISCOVERY",
        "community": 3,
        "properties": {
            "slug": "hair-braiding-da-nang-for-foreigners",
            "intent": "Local Commercial",
            "targetKeywords": ["hair braiding Da Nang", "braids Da Nang", "dreadlock Da Nang"]
        }
    },
    {
        "id": "article:barber-cat-toc-my-den-da-nang",
        "label": "Barber Cắt Tóc Mỹ Đen Đà Nẵng",
        "type": "ARTICLE_LOCAL_DISCOVERY",
        "community": 3,
        "properties": {
            "slug": "barber-cat-toc-my-den-da-nang",
            "intent": "Commercial / Local",
            "targetKeywords": ["barber tại đà nẵng", "tóc mỹ đen đà nẵng", "cắt tóc đẹp đà nẵng"]
        }
    },
    {
        "id": "article:tiem-lam-cornrow-dep-o-da-nang",
        "label": "Tiệm Làm Cornrow Đẹp Ở Đà Nẵng",
        "type": "ARTICLE_LOCAL_DISCOVERY",
        "community": 3,
        "properties": {
            "slug": "tiem-lam-cornrow-dep-o-da-nang",
            "intent": "Commercial Investigation",
            "targetKeywords": ["tiệm làm cornrow đẹp ở đà nẵng", "cornrow Đà Nẵng"]
        }
    },
    {
        "id": "article:du-lich-da-nang-tet-toc-o-dau",
        "label": "Du Lịch Đà Nẵng Tết Tóc Ở Đâu",
        "type": "ARTICLE_LOCAL_DISCOVERY",
        "community": 3,
        "properties": {
            "slug": "du-lich-da-nang-tet-toc-o-dau",
            "intent": "Local Discovery",
            "targetKeywords": ["du lịch đà nẵng tết tóc ở đâu", "tết tóc đi biển đà nẵng"]
        }
    },
    {
        "id": "article:phuc-hoi-va-retwist-dreadlock-da-nang",
        "label": "Phục Hồi & Retwist Dreadlock Đà Nẵng",
        "type": "ARTICLE_LOCAL_DISCOVERY",
        "community": 3,
        "properties": {
            "slug": "phuc-hoi-va-retwist-dreadlock-da-nang",
            "intent": "Commercial / Care",
            "targetKeywords": ["retwist dreadlock Đà Nẵng", "phục hồi dreadlock đà nẵng"]
        }
    },

    # Community 2: Tier 2 Informational Guides
    {
        "id": "article:dreadlock-la-gi",
        "label": "Dreadlock Là Gì?",
        "type": "ARTICLE_INFORMATIONAL",
        "community": 2,
        "properties": {"slug": "dreadlock-la-gi", "intent": "Informational", "targetKeywords": ["dreadlock là gì", "các kiểu dreadlock"]}
    },
    {
        "id": "article:nguon-goc-dreadlock",
        "label": "Nguồn Gốc Dreadlock",
        "type": "ARTICLE_INFORMATIONAL",
        "community": 2,
        "properties": {"slug": "nguon-goc-dreadlock", "intent": "Informational", "targetKeywords": ["nguồn gốc dreadlock", "lịch sử dreadlock"]}
    },
    {
        "id": "article:dreadlock-giu-duoc-bao-lau",
        "label": "Dreadlock Giữ Được Bao Lâu?",
        "type": "ARTICLE_INFORMATIONAL",
        "community": 2,
        "properties": {"slug": "dreadlock-giu-duoc-bao-lau", "intent": "Informational", "targetKeywords": ["dreadlock giữ được bao lâu"]}
    },
    {
        "id": "article:phan-biet-cornrow-va-box-braids",
        "label": "Phân Biệt Cornrow Và Box Braids",
        "type": "ARTICLE_INFORMATIONAL",
        "community": 2,
        "properties": {"slug": "phan-biet-cornrow-va-box-braids", "intent": "Informational Comparison", "targetKeywords": ["cornrow và box braids khác nhau thế nào"]}
    },
    {
        "id": "article:khi-nao-nen-retwist-dreadlock",
        "label": "Khi Nào Nên Retwist Dreadlock?",
        "type": "ARTICLE_INFORMATIONAL",
        "community": 2,
        "properties": {"slug": "khi-nao-nen-retwist-dreadlock", "intent": "Informational Care", "targetKeywords": ["khi nào nên retwist dreadlock"]}
    },
    {
        "id": "article:cach-cham-soc-toc-braids",
        "label": "Cách Chăm Sóc Tóc Braids",
        "type": "ARTICLE_INFORMATIONAL",
        "community": 2,
        "properties": {"slug": "cach-cham-soc-toc-braids", "intent": "Informational Care", "targetKeywords": ["cách chăm sóc tóc braids", "gội đầu khi tết tóc braids"]}
    },
    {
        "id": "article:starter-locs-huong-dan-cho-nguoi-moi",
        "label": "Starter Locs Hướng Dẫn Người Mới",
        "type": "ARTICLE_INFORMATIONAL",
        "community": 2,
        "properties": {"slug": "starter-locs-huong-dan-cho-nguoi-moi", "intent": "Informational Guide", "targetKeywords": ["starter locs", "bắt đầu làm dreadlock"]}
    },

    # Community 4: Keyword Entities
    {"id": "kw:dreadlock-da-nang", "label": "dreadlock Đà Nẵng", "type": "KEYWORD", "community": 4, "properties": {"priority": 1, "intent": "Transactional"}},
    {"id": "kw:braid-da-nang", "label": "braid Đà Nẵng", "type": "KEYWORD", "community": 4, "properties": {"priority": 1, "intent": "Transactional"}},
    {"id": "kw:cornrow-da-nang", "label": "cornrow Đà Nẵng", "type": "KEYWORD", "community": 4, "properties": {"priority": 1, "intent": "Transactional"}},
    {"id": "kw:box-braids-da-nang", "label": "box braids Đà Nẵng", "type": "KEYWORD", "community": 4, "properties": {"priority": 1, "intent": "Transactional"}},
    {"id": "kw:tet-toc-da-nang", "label": "tết tóc Đà Nẵng", "type": "KEYWORD", "community": 4, "properties": {"priority": 1, "intent": "Transactional"}},
    {"id": "kw:hair-braiding-da-nang", "label": "hair braiding Da Nang", "type": "KEYWORD", "community": 4, "properties": {"priority": 1, "intent": "Transactional"}},
    {"id": "kw:barber-tai-da-nang", "label": "barber tại đà nẵng", "type": "KEYWORD", "community": 4, "properties": {"priority": 2, "intent": "Commercial"}},
    {"id": "kw:cat-toc-dep-da-nang", "label": "cắt tóc đẹp đà nẵng", "type": "KEYWORD", "community": 4, "properties": {"priority": 2, "intent": "Commercial"}},
    {"id": "kw:toc-my-den-da-nang", "label": "tóc mỹ đen đà nẵng", "type": "KEYWORD", "community": 4, "properties": {"priority": 2, "intent": "Commercial"}}
]

# 3. Edges Construction (Relationships)
edges = [
    # Brand operates branches
    {"source": "entity:windread-brand", "target": "branch:an-thuong", "relation": "OPERATES_BRANCH", "weight": 1.0},
    {"source": "entity:windread-brand", "target": "branch:chuong-duong", "relation": "OPERATES_BRANCH", "weight": 1.0},

    # Branch specializations
    {"source": "branch:an-thuong", "target": "page:dreadlock-da-nang", "relation": "PRIMARY_LOCATION_FOR", "weight": 1.0},
    {"source": "branch:an-thuong", "target": "page:braids-da-nang", "relation": "PRIMARY_LOCATION_FOR", "weight": 1.0},
    {"source": "branch:an-thuong", "target": "page:cornrows-da-nang", "relation": "PRIMARY_LOCATION_FOR", "weight": 1.0},
    {"source": "branch:an-thuong", "target": "page:box-braids-da-nang", "relation": "PRIMARY_LOCATION_FOR", "weight": 1.0},
    {"source": "branch:chuong-duong", "target": "article:barber-cat-toc-my-den-da-nang", "relation": "PRIMARY_LOCATION_FOR", "weight": 1.0},

    # Money pages target primary keywords
    {"source": "page:dreadlock-da-nang", "target": "kw:dreadlock-da-nang", "relation": "TARGETS_KEYWORD", "weight": 1.0},
    {"source": "page:braids-da-nang", "target": "kw:braid-da-nang", "relation": "TARGETS_KEYWORD", "weight": 1.0},
    {"source": "page:braids-da-nang", "target": "kw:tet-toc-da-nang", "relation": "TARGETS_KEYWORD", "weight": 0.9},
    {"source": "page:braids-da-nang", "target": "kw:hair-braiding-da-nang", "relation": "TARGETS_KEYWORD", "weight": 0.9},
    {"source": "page:cornrows-da-nang", "target": "kw:cornrow-da-nang", "relation": "TARGETS_KEYWORD", "weight": 1.0},
    {"source": "page:box-braids-da-nang", "target": "kw:box-braids-da-nang", "relation": "TARGETS_KEYWORD", "weight": 1.0},

    # Local Discovery Articles link to Money Pages (SILO Hub & Spoke)
    {"source": "article:top-dia-chi-lam-dreadlock-tai-da-nang", "target": "page:dreadlock-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.95},
    {"source": "article:gia-lam-dreadlock-o-da-nang", "target": "page:dreadlock-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.95},
    {"source": "article:phuc-hoi-va-retwist-dreadlock-da-nang", "target": "page:dreadlock-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.95},
    {"source": "article:top-noi-lam-braids-tai-da-nang", "target": "page:braids-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.95},
    {"source": "article:hair-braiding-da-nang-for-foreigners", "target": "page:braids-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.95},
    {"source": "article:tiem-lam-cornrow-dep-o-da-nang", "target": "page:cornrows-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.95},
    {"source": "article:du-lich-da-nang-tet-toc-o-dau", "target": "page:braids-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.95},

    # Informational Articles link to Money Pages
    {"source": "article:dreadlock-la-gi", "target": "page:dreadlock-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.8},
    {"source": "article:nguon-goc-dreadlock", "target": "page:dreadlock-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.8},
    {"source": "article:dreadlock-giu-duoc-bao-lau", "target": "page:dreadlock-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.85},
    {"source": "article:starter-locs-huong-dan-cho-nguoi-moi", "target": "page:dreadlock-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.9},
    {"source": "article:khi-nao-nen-retwist-dreadlock", "target": "page:dreadlock-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.85},
    {"source": "article:phan-biet-cornrow-va-box-braids", "target": "page:cornrows-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.85},
    {"source": "article:phan-biet-cornrow-va-box-braids", "target": "page:box-braids-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.85},
    {"source": "article:cach-cham-soc-toc-braids", "target": "page:braids-da-nang", "relation": "INTERNAL_LINKS_TO", "weight": 0.85},

    # Cross-article related connections
    {"source": "article:dreadlock-la-gi", "target": "article:nguon-goc-dreadlock", "relation": "RELATED_ARTICLE", "weight": 0.7},
    {"source": "article:top-dia-chi-lam-dreadlock-tai-da-nang", "target": "article:gia-lam-dreadlock-o-da-nang", "relation": "RELATED_ARTICLE", "weight": 0.85},
    {"source": "article:top-noi-lam-braids-tai-da-nang", "target": "article:hair-braiding-da-nang-for-foreigners", "relation": "RELATED_ARTICLE", "weight": 0.85},
    {"source": "article:tiem-lam-cornrow-dep-o-da-nang", "target": "article:phan-biet-cornrow-va-box-braids", "relation": "RELATED_ARTICLE", "weight": 0.8}
]

# Calculate node degrees
degree_map = {}
for edge in edges:
    s = edge["source"]
    t = edge["target"]
    degree_map[s] = degree_map.get(s, 0) + 1
    degree_map[t] = degree_map.get(t, 0) + 1

for node in nodes:
    node["degree"] = degree_map.get(node["id"], 0)

# Build graph structure
graph_data = {
    "metadata": {
        "generator": "graphify-labs/graphify",
        "version": "1.0.0",
        "createdAt": datetime.now().isoformat(),
        "totalNodes": len(nodes),
        "totalEdges": len(edges),
        "communities": COMMUNITIES
    },
    "nodes": nodes,
    "edges": edges
}

# Write graph.json
with open(os.path.join(OUTPUT_DIR, "graph.json"), "w", encoding="utf-8") as f:
    json.dump(graph_data, f, ensure_ascii=False, indent=2)

# Write GRAPH_REPORT.md
report_content = f"""# WINDREAD Knowledge Graph Report (Graphify)

> Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
> Total Nodes: **{len(nodes)}** | Total Relationships: **{len(edges)}** | Topical Communities: **{len(COMMUNITIES)}**

---

## 1. God Nodes (Highest Centrality Hubs)
Entities with the highest connectivity serving as core authority pillars:

1. **`page:dreadlock-da-nang`** (Degree: {degree_map.get('page:dreadlock-da-nang', 0)})
   - The central transactional anchor for all dreadlocks searches in Da Nang.
   - Connected to: 6 incoming article links, 1 primary keyword, 1 physical branch.
2. **`page:braids-da-nang`** (Degree: {degree_map.get('page:braids-da-nang', 0)})
   - The central transactional anchor for all braid, hair braiding & tết tóc queries.
   - Connected to: 5 incoming article links, 3 primary keywords, 1 branch.
3. **`entity:windread-brand`** (Degree: {degree_map.get('entity:windread-brand', 0)})
   - Brand entity with multi-branch schema mapping to An Thượng & Chương Dương.
4. **`branch:an-thuong`** (Degree: {degree_map.get('branch:an-thuong', 0)})
   - Primary operational hub for Locs & Braids in the Da Nang tourist quarter.

---

## 2. Topical Clusters (Communities)
| Community ID | Name | Node Count | Focus |
| :--- | :--- | :--- | :--- |
| **0** | Brand & Local Infrastructure | 3 | Physical locations, addresses, coordinates |
| **1** | Tier 1: Money Pages | 4 | Primary commercial landing pages (/dreadlock-da-nang, etc.) |
| **2** | Tier 2: Informational Guides | 7 | Educational, historical, and E-E-A-T background articles |
| **3** | Tier 3: Local Discovery Articles | 8 | Commercial investigation articles capturing intent in Da Nang |
| **4** | Keyword Entities & Search Intent | 9 | Target query nodes mapped to destination URLs |

---

## 3. Low-Token AI Query Pathways
Using this graph, future AI sessions can retrieve specific knowledge in < 200 tokens:
- **Querying pricing**: Check `branch:an-thuong` -> `page:dreadlock-da-nang` properties.
- **Checking internal link targets**: Traverse `article:*` -> `INTERNAL_LINKS_TO` -> `page:*`.
- **Keyword distribution**: Inspect `page:*` -> `TARGETS_KEYWORD` -> `kw:*` to prevent cannibalization.
"""

with open(os.path.join(OUTPUT_DIR, "GRAPH_REPORT.md"), "w", encoding="utf-8") as f:
    f.write(report_content)

# Write Wiki files
wiki_pages = {
    "WINDREAD_BRAND_AND_BRANCHES.md": """# WINDREAD Brand & Branches
- **Brand**: WINDREAD Locs & Barber Club
- **City**: Đà Nẵng, Vietnam
- **Hotline**: 0393549656 (Zalo / WhatsApp)
- **Branch 1 (Chương Dương)**: 223 Chương Dương, Ngũ Hành Sơn. Specializes in: Barber, Clean Fade, Afro, Taper.
- **Branch 2 (An Thượng)**: 35 - 37 An Thượng 29, Ngũ Hành Sơn (Khu phố Tây). Specializes in: Dreadlocks, Starter Locs, Braids, Cornrows, Box Braids.
""",
    "TIER_1_MONEY_PAGES.md": """# Tier 1: Money Pages (High Commercial Intent)
1. `/dreadlock-da-nang`: Primary keyword `dreadlock Đà Nẵng`.
2. `/braids-da-nang`: Primary keyword `braid Đà Nẵng`, `tết tóc Đà Nẵng`, `hair braiding Da Nang`.
3. `/cornrows-da-nang`: Primary keyword `cornrow Đà Nẵng`, `tết tóc sát da đầu Đà Nẵng`.
4. `/box-braids-da-nang`: Primary keyword `box braids Đà Nẵng`, `tết tóc box braid Đà Nẵng`.
""",
    "CONTENT_SILO_MAPPING.md": """# Content Silo Mapping (Internal Linking)
- **Dreadlock Cluster**:
  - Money Page: `/dreadlock-da-nang`
  - Supporting Articles:
    - `/news/top-dia-chi-lam-dreadlock-tai-da-nang`
    - `/news/gia-lam-dreadlock-o-da-nang`
    - `/news/phuc-hoi-va-retwist-dreadlock-da-nang`
    - `/news/dreadlock-la-gi`
    - `/news/nguon-goc-dreadlock`
    - `/news/dreadlock-giu-duoc-bao-lau`
    - `/news/starter-locs-huong-dan-cho-nguoi-moi`
    - `/news/khi-nao-nen-retwist-dreadlock`
- **Braids & Cornrow Cluster**:
  - Money Pages: `/braids-da-nang`, `/cornrows-da-nang`, `/box-braids-da-nang`
  - Supporting Articles:
    - `/news/top-noi-lam-braids-tai-da-nang`
    - `/news/hair-braiding-da-nang-for-foreigners`
    - `/news/tiem-lam-cornrow-dep-o-da-nang`
    - `/news/du-lich-da-nang-tet-toc-o-dau`
    - `/news/phan-biet-cornrow-va-box-braids`
    - `/news/cach-cham-soc-toc-braids`
- **Barber Cluster**:
  - Supporting Article: `/news/barber-cat-toc-my-den-da-nang` -> Branch 1 Chương Dương.
"""
}

for filename, content in wiki_pages.items():
    with open(os.path.join(WIKI_DIR, filename), "w", encoding="utf-8") as f:
        f.write(content)

# Write graph.html (Interactive HTML Visualization)
html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>WINDREAD Knowledge Graph (Graphify)</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b070d; color: #f4eee8; overflow: hidden; }
    #header { position: absolute; top: 15px; left: 20px; z-index: 10; background: rgba(22, 15, 23, 0.85); backdrop-filter: blur(8px); padding: 12px 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
    #header h1 { margin: 0 0 5px 0; font-size: 1.1rem; color: #d83245; }
    #header p { margin: 0; font-size: 0.85rem; color: #b7aaa4; }
    #info-panel { position: absolute; bottom: 20px; right: 20px; width: 320px; max-height: 400px; overflow-y: auto; background: rgba(22, 15, 23, 0.9); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); padding: 15px; font-size: 0.85rem; }
    svg { width: 100vw; height: 100vh; }
    .node text { font-size: 11px; fill: #eee; pointer-events: none; }
    .node circle { stroke: #fff; stroke-width: 1.5px; cursor: pointer; }
    .edge { stroke: rgba(255,255,255,0.2); stroke-width: 1.2px; }
  </style>
</head>
<body>
  <div id="header">
    <h1>WINDREAD Knowledge Graph</h1>
    <p>3-Tier Architecture & Local SEO Entities (Graphify standard)</p>
  </div>
  <div id="info-panel">
    <h3>Entity Inspector</h3>
    <p id="inspector-desc">Click any node to inspect relationships, community and SEO properties.</p>
  </div>
  <svg id="canvas"></svg>

  <script>
    fetch('graph.json')
      .then(r => r.json())
      .then(data => {
        const svg = document.getElementById('canvas');
        const width = window.innerWidth;
        const height = window.innerHeight;
        const colors = ['#e63946', '#f4a261', '#2a9d8f', '#e76f51', '#457b9d', '#a8dadc'];
        
        // Simple force layout representation
        const nodes = data.nodes;
        const edges = data.edges;
        const posMap = {};
        
        nodes.forEach((n, idx) => {
          const angle = (idx / nodes.length) * 2 * Math.PI;
          const radius = n.community === 1 ? 150 : (n.community === 0 ? 80 : 320);
          posMap[n.id] = {
            x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
            y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
            node: n
          };
        });

        let edgeSvg = '';
        edges.forEach(e => {
          const s = posMap[e.source];
          const t = posMap[e.target];
          if (s && t) {
            edgeSvg += `<line class="edge" x1="${s.x}" y1="${s.y}" x2="${t.x}" y2="${t.y}" />`;
          }
        });

        let nodeSvg = '';
        nodes.forEach(n => {
          const p = posMap[n.id];
          const r = n.community === 1 ? 16 : (n.community === 0 ? 18 : 10);
          const color = colors[n.community % colors.length];
          nodeSvg += `
            <g class="node" transform="translate(${p.x},${p.y})" onclick="inspectNode('${n.id}')">
              <circle r="${r}" fill="${color}" />
              <text dx="${r + 4}" dy="4">${n.label}</text>
            </g>
          `;
        });

        svg.innerHTML = edgeSvg + nodeSvg;
        window.graphData = data;
      });

    function inspectNode(id) {
      const node = window.graphData.nodes.find(n => n.id === id);
      if (!node) return;
      const panel = document.getElementById('inspector-desc');
      panel.innerHTML = `
        <strong>${node.label}</strong><br/>
        Type: <code>${node.type}</code><br/>
        Community: <strong>${window.graphData.metadata.communities[node.community].name}</strong><br/>
        Degree: <strong>${node.degree}</strong><br/><br/>
        <pre style="background: rgba(0,0,0,0.4); padding: 8px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(node.properties, null, 2)}</pre>
      `;
    }
  </script>
</body>
</html>
"""

with open(os.path.join(OUTPUT_DIR, "graph.html"), "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Graphify build complete! Saved {len(nodes)} nodes and {len(edges)} edges in '{OUTPUT_DIR}/'")
