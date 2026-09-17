# WINDREAD Knowledge Graph Report (Graphify)

> Generated: 2026-09-15 10:05:27  
> Total Nodes: **31** | Total Relationships: **32** | Topical Communities: **6**

---

## 1. God Nodes (Highest Centrality Hubs)
Entities with the highest connectivity serving as core authority pillars:

1. **`page:dreadlock-da-nang`** (Degree: 10)
   - The central transactional anchor for all dreadlocks searches in Da Nang.
   - Connected to: 6 incoming article links, 1 primary keyword, 1 physical branch.
2. **`page:braids-da-nang`** (Degree: 8)
   - The central transactional anchor for all braid, hair braiding & tết tóc queries.
   - Connected to: 5 incoming article links, 3 primary keywords, 1 branch.
3. **`entity:windread-brand`** (Degree: 2)
   - Brand entity with multi-branch schema mapping to An Thượng & Chương Dương.
4. **`branch:an-thuong`** (Degree: 5)
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
