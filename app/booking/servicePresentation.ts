import { getServiceCategory } from "./serviceCategories";
import type { Service, ServiceCategory } from "./types";

type SectionId =
  | "barber-main"
  | "barber-combos"
  | "barber-finish"
  | "barber-texture"
  | "dread-main"
  | "dread-maintenance"
  | "dread-extensions"
  | "dread-care"
  | "braids-cornrows"
  | "braids-full"
  | "braids-addons"
  | "afro-main"
  | "afro-addons";

type SectionDefinition = {
  id: SectionId;
  category: ServiceCategory;
  vi: string;
  en: string;
  order: number;
};

const sections: SectionDefinition[] = [
  { id: "barber-main", category: "barber", vi: "Dịch vụ chính", en: "Main services", order: 10 },
  { id: "barber-combos", category: "barber", vi: "Combo services", en: "Combo services", order: 20 },
  { id: "barber-finish", category: "barber", vi: "Hoàn thiện & bổ sung", en: "Finishing & add-ons", order: 30 },
  { id: "barber-texture", category: "barber", vi: "Texture, uốn & màu", en: "Texture, perm & colour", order: 40 },
  { id: "dread-main", category: "dreadlocks", vi: "Dịch vụ dreadlocks", en: "Dreadlock services", order: 10 },
  { id: "dread-maintenance", category: "dreadlocks", vi: "Bảo dưỡng", en: "Maintenance", order: 20 },
  { id: "dread-extensions", category: "dreadlocks", vi: "Nối dreadlocks", en: "Dreadlock extensions", order: 30 },
  { id: "dread-care", category: "dreadlocks", vi: "Chăm sóc & tạo kiểu", en: "Care & styling", order: 40 },
  { id: "braids-cornrows", category: "braids", vi: "Cornrows & custom", en: "Cornrows & custom", order: 10 },
  { id: "braids-full", category: "braids", vi: "Full braids", en: "Full braids", order: 20 },
  { id: "braids-addons", category: "braids", vi: "Tóc nối & add-ons", en: "Extensions & add-ons", order: 30 },
  { id: "afro-main", category: "afro", vi: "Dịch vụ afro", en: "Afro services", order: 10 },
  { id: "afro-addons", category: "afro", vi: "Phụ thu theo tình trạng tóc", en: "Hair-condition add-ons", order: 20 }
];

const sectionById = new Map(sections.map((section) => [section.id, section]));

const chuongDuongOrder: Array<[SectionId, string[]]> = [
  ["barber-main", ["cd-haircut", "cd-hot-towel-shave", "cd-haircut-expert"]],
  ["barber-combos", ["cd-fresh-cut", "cd-gentlemans-set", "cd-full-grooming", "cd-win-dread-experience"]],
  ["barber-finish", ["cd-sides-back-fade", "cd-basic-beard-trim-line-up", "cd-hair-washing", "cd-wash-blowdry", "cd-basic-hair-tattoo"]],
  ["barber-texture", ["cd-down-perm", "cd-basic-perm", "cd-curly-perm", "cd-ruffled-perm", "cd-premlock-perm", "cd-afro-perm", "cd-hair-bleaching", "cd-hair-color", "cd-hair-blackening", "cd-bleach-root-touch-up", "cd-beard-coloring"]],
  ["dread-main", ["cd-dreadlocks-new"]],
  ["dread-maintenance", ["cd-dreadlock-maintenance-one-first", "cd-dreadlock-maintenance-one-additional", "cd-dreadlock-maintenance-team-first", "cd-dreadlock-maintenance-team-second", "cd-dreadlock-maintenance-team-additional"]],
  ["dread-extensions", ["cd-dreadlock-extension-short", "cd-dreadlock-extension-medium", "cd-dreadlock-extension-long"]],
  ["dread-care", ["cd-locs-basic-wash", "cd-locs-deep-detox", "cd-locs-styling"]],
  ["braids-cornrows", ["cd-cornrows-half-head", "cd-cornrows-2-lines", "cd-cornrows-4-lines", "cd-cornrows-6-lines", "cd-cornrows-8-lines", "cd-cornrows-10-lines", "cd-braids-custom-design"]],
  ["braids-full", ["cd-box-braids-shoulder", "cd-box-braids-over-shoulder", "cd-box-braids-mid-back", "cd-knotless-braids-shoulder", "cd-knotless-braids-over-shoulder", "cd-knotless-braids-mid-back", "cd-boho-braids-shoulder", "cd-boho-braids-over-shoulder", "cd-boho-braids-mid-back"]],
  ["braids-addons", ["cd-braid-extension-40", "cd-braid-extension-60", "cd-braid-extension-80", "cd-braid-curl-ends"]],
  ["afro-main", ["cd-afro-wash", "cd-afro-wash-care", "cd-afro-blow-dry", "cd-afro-professional-blowout", "cd-afro-deep-treatment", "cd-afro-signature-care", "cd-afro-finger-comb-coil"]]
];

const chuongDuongPlacement = new Map<string, { sectionId: SectionId; itemOrder: number }>();
for (const [sectionId, serviceIds] of chuongDuongOrder) {
  serviceIds.forEach((serviceId, itemOrder) => chuongDuongPlacement.set(serviceId, { sectionId, itemOrder }));
}

function fallbackSection(service: Service): SectionId {
  const category = getServiceCategory(service);
  const id = service.id.toLowerCase();

  if (category === "barber") {
    if (id.includes("gentleman") || id.includes("vip") || id.includes("combo")) return "barber-combos";
    if (id.includes("perm") || id.includes("bleach") || id.includes("dye") || id.includes("color") || id.includes("restore")) return "barber-texture";
    return "barber-main";
  }
  if (category === "dreadlocks") {
    if (id.includes("maintenance")) return "dread-maintenance";
    if (id.includes("extension")) return "dread-extensions";
    if (id.includes("wash") || id.includes("styling") || id.includes("detox")) return "dread-care";
    return "dread-main";
  }
  if (category === "braids") {
    if (id.includes("cornrow")) return "braids-cornrows";
    if (id.includes("extension") || id.includes("curl-ends")) return "braids-addons";
    return "braids-full";
  }
  return id.includes("extra") || id.includes("heavy") ? "afro-addons" : "afro-main";
}

export type ServiceDisplayGroup = {
  id: SectionId;
  label: string;
  services: Service[];
};

export function groupServicesForDisplay(services: Service[], isEnglish: boolean): ServiceDisplayGroup[] {
  const buckets = new Map<SectionId, Array<{ service: Service; itemOrder: number }>>();

  for (const service of services) {
    const placement = service.branchId === "chuong-duong" ? chuongDuongPlacement.get(service.id) : undefined;
    const sectionId = placement?.sectionId ?? fallbackSection(service);
    const bucket = buckets.get(sectionId) ?? [];
    bucket.push({ service, itemOrder: placement?.itemOrder ?? Number.MAX_SAFE_INTEGER });
    buckets.set(sectionId, bucket);
  }

  return [...buckets.entries()]
    .map(([id, entries]) => {
      const section = sectionById.get(id)!;
      return {
        id,
        label: isEnglish ? section.en : section.vi,
        order: section.order,
        services: entries
          .sort((a, b) => a.itemOrder - b.itemOrder || a.service.price - b.service.price || a.service.name.localeCompare(b.service.name))
          .map(({ service }) => service)
      };
    })
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...group }) => group);
}

type EnglishServiceCopy = Pick<Service, "name" | "description">;

const englishServiceCopy: Record<string, EnglishServiceCopy> = {
  "cd-haircut": { name: "Haircut & styling", description: "Haircut and styling." },
  "cd-hot-towel-shave": { name: "Hot & cold towel shave", description: "Beard trim and shaping, face shave, hot and cold towels." },
  "cd-haircut-expert": { name: "Signature haircut", description: "Signature haircut; advance booking recommended." },
  "cd-fresh-cut": { name: "Fresh Cut", description: "Haircut and styling with a wash." },
  "cd-gentlemans-set": { name: "Gentleman's Set", description: "Haircut and styling with a hot and cold towel shave." },
  "cd-full-grooming": { name: "Full Grooming", description: "Haircut and styling, wash, and hot and cold towel shave." },
  "cd-win-dread-experience": { name: "W Signature Grooming Experience", description: "Signature haircut, wash, grooming and hot and cold towel shave. Advance booking only." },
  "cd-sides-back-fade": { name: "Sides & nape fade", description: "A clean-up for the sides and nape." },
  "cd-basic-beard-trim-line-up": { name: "Basic beard trim & line-up", description: "Beard and outline clean-up." },
  "cd-hair-washing": { name: "Hair wash", description: "Basic hair wash." },
  "cd-wash-blowdry": { name: "Blow-dry & styling", description: "Blow-dry and hair styling." },
  "cd-basic-hair-tattoo": { name: "Basic hair tattoo", description: "A simple hair tattoo design." },
  "cd-down-perm": { name: "Down perm", description: "Down perm for the sides." },
  "cd-basic-perm": { name: "Basic perm", description: "A basic perm based on hair length and texture." },
  "cd-curly-perm": { name: "Curly perm", description: "A curly perm based on hair length and texture." },
  "cd-ruffled-perm": { name: "Ruffled / textured perm", description: "Ruffled or textured perm." },
  "cd-premlock-perm": { name: "Pre-lock perm", description: "A pre-lock perm based on hair length." },
  "cd-afro-perm": { name: "Afro perm", description: "An afro perm based on hair length and density." },
  "cd-hair-bleaching": { name: "Hair bleaching", description: "Hair bleaching per treatment." },
  "cd-hair-color": { name: "Fashion colour", description: "Fashion colour based on your hair base." },
  "cd-hair-blackening": { name: "Black colour", description: "Black colour based on your hair base." },
  "cd-bleach-root-touch-up": { name: "Root bleach touch-up", description: "Bleaching new growth at the roots." },
  "cd-beard-coloring": { name: "Beard colouring", description: "Beard colouring based on beard condition." },
  "cd-dreadlocks-new": { name: "New dreadlocks", description: "New dreadlocks; consultation required first." },
  "cd-dreadlock-maintenance-one-first": { name: "Loc maintenance · 1 barber · first hour", description: "Loc maintenance with one barber." },
  "cd-dreadlock-maintenance-one-additional": { name: "Loc maintenance · 1 barber · additional hour", description: "Charged from the second hour." },
  "cd-dreadlock-maintenance-team-first": { name: "Loc maintenance · 2 barbers · first hour", description: "Loc maintenance with two barbers." },
  "cd-dreadlock-maintenance-team-second": { name: "Loc maintenance · 2 barbers · second hour", description: "Loc maintenance with two barbers." },
  "cd-dreadlock-maintenance-team-additional": { name: "Loc maintenance · 2 barbers · additional hour", description: "Charged from the third hour." },
  "cd-dreadlock-extension-short": { name: "Short loc extension 20–30 cm", description: "Priced per loc." },
  "cd-dreadlock-extension-medium": { name: "Medium loc extension 30–40 cm", description: "Priced per loc." },
  "cd-dreadlock-extension-long": { name: "Long loc extension 40–50 cm", description: "Priced per loc." },
  "cd-locs-basic-wash": { name: "Basic loc wash", description: "Basic loc wash." },
  "cd-locs-deep-detox": { name: "Deep loc detox", description: "Deep cleanse for locs." },
  "cd-locs-styling": { name: "Loc styling", description: "Loc styling, charged hourly." },
  "cd-cornrows-half-head": { name: "Half-head cornrows", description: "Half-head cornrow braiding." },
  "cd-cornrows-2-lines": { name: "2-line cornrows", description: "Close-to-scalp cornrow braiding." },
  "cd-cornrows-4-lines": { name: "4-line cornrows", description: "Close-to-scalp cornrow braiding." },
  "cd-cornrows-6-lines": { name: "6-line cornrows", description: "Close-to-scalp cornrow braiding." },
  "cd-cornrows-8-lines": { name: "8-line cornrows", description: "Close-to-scalp cornrow braiding." },
  "cd-cornrows-10-lines": { name: "10+ line cornrows", description: "From 10 lines, priced per line." },
  "cd-braids-custom-design": { name: "Custom braid design", description: "Custom braid design, charged hourly." },
  "cd-box-braids-shoulder": { name: "Box braids · shoulder length", description: "Full-head box braids at shoulder length." },
  "cd-box-braids-over-shoulder": { name: "Box braids · below shoulder", description: "Full-head box braids below the shoulder." },
  "cd-box-braids-mid-back": { name: "Box braids · mid-back", description: "Full-head box braids at mid-back length." },
  "cd-knotless-braids-shoulder": { name: "Knotless braids · shoulder length", description: "Full-head knotless braids at shoulder length." },
  "cd-knotless-braids-over-shoulder": { name: "Knotless braids · below shoulder", description: "Full-head knotless braids below the shoulder." },
  "cd-knotless-braids-mid-back": { name: "Knotless braids · mid-back", description: "Full-head knotless braids at mid-back length." },
  "cd-boho-braids-shoulder": { name: "Boho braids · shoulder length", description: "Full-head boho braids at shoulder length." },
  "cd-boho-braids-over-shoulder": { name: "Boho braids · below shoulder", description: "Full-head boho braids below the shoulder." },
  "cd-boho-braids-mid-back": { name: "Boho braids · mid-back", description: "Full-head boho braids at mid-back length." },
  "cd-braid-extension-40": { name: "Braid extensions 40 cm", description: "Extensions priced per pack." },
  "cd-braid-extension-60": { name: "Braid extensions 60 cm", description: "Extensions priced per pack." },
  "cd-braid-extension-80": { name: "Braid extensions 80 cm", description: "Extensions priced per pack." },
  "cd-braid-curl-ends": { name: "Curled braid ends", description: "Add-on service for curled ends." },
  "cd-afro-basic-wash": { name: "Basic afro wash", description: "Afro wash based on hair length." },
  "cd-afro-wash-detangle": { name: "Afro wash & detangle", description: "Wash and detangle afro hair." },
  "cd-afro-heavy-detangle": { name: "Heavy afro detangling add-on", description: "Add-on for each 30 minutes of intensive detangling." },
  "cd-afro-signature-curl-treatment": { name: "Signature afro curl treatment", description: "Curl treatment for afro hair." },
  "cd-afro-extra-density": { name: "Extra-density afro add-on", description: "Add-on for each 30 minutes of extra density." },
  "cd-afro-extra-length": { name: "Extra-length afro add-on", description: "Add-on for each 30 minutes of extra length." },
  "cd-afro-wash": { name: "Basic afro wash", description: "A basic afro wash." },
  "cd-afro-wash-care": { name: "Afro wash & care", description: "Basic afro wash and conditioning." },
  "cd-afro-blow-dry": { name: "Afro stretch blow-dry", description: "Afro wash with stretch blow-dry." },
  "cd-afro-professional-blowout": { name: "Professional afro blowout", description: "Afro blowout using professional equipment." },
  "cd-afro-deep-treatment": { name: "Deep treatment", description: "Deep conditioning treatment for afro hair." },
  "cd-afro-signature-care": { name: "Signature Afro Care", description: "Wash, deep treatment, conditioning and styling." },
  "cd-afro-finger-comb-coil": { name: "Finger / comb coil", description: "Hand-coiled styling, charged hourly." },
  "an-dreadlock": { name: "Dreadlocks", description: "New dreadlocks based on length, density and hair base; consultation required." },
  "an-single-dread": { name: "Single dread", description: "One individual dread for 20–30 cm length." },
  "an-pair-dreads": { name: "Pair of dreads", description: "A pair of dreads for 30–40 cm length." },
  "an-cornrow": { name: "Cornrows 2–8 lines", description: "Close-to-scalp cornrows, priced per line." },
  "an-cornrow-10-16": { name: "Cornrows 10–16 lines", description: "Close-to-scalp cornrows, priced per line." },
  "an-braids-men": { name: "Men's braids", description: "Box braids or patterns based on hair base and section count." },
  "an-braids-women": { name: "Women's braids", description: "Box braids based on your preferred length, density and design." },
  "an-locs-styling": { name: "Loc / braid styling", description: "Twist, cornrow or braid styling, charged hourly." },
  "an-maintenance-1-worker-first-hour": { name: "Maintenance · 1 barber · first hour", description: "Dread/loc maintenance with one barber." },
  "an-maintenance-1-worker-additional-hour": { name: "Maintenance · 1 barber · additional hour", description: "Dread/loc maintenance from the second hour." },
  "an-maintenance-2-workers-first-hour": { name: "Maintenance · 2 barbers · first hour", description: "Dread/loc maintenance with two barbers." },
  "an-maintenance-2-workers-second-hour": { name: "Maintenance · 2 barbers · second hour", description: "Dread/loc maintenance with two barbers." },
  "an-maintenance-2-workers-additional-hour": { name: "Maintenance · 2 barbers · additional hour", description: "Dread/loc maintenance from the third hour." },
  "an-basic-perm": { name: "Basic perm", description: "Basic perm based on hair length and texture." },
  "an-curly-perm": { name: "Curly perm", description: "Curly perm based on hair length and texture." },
  "an-ruffled-perm": { name: "Ruffled perm", description: "Ruffled perm based on hair shape." },
  "an-texture-perm": { name: "Texture perm", description: "Textured perm based on hair condition." },
  "an-premlock-perm": { name: "PremLock perm", description: "PremLock perm based on hair length." },
  "an-afro-perm": { name: "Afro perm", description: "Afro perm based on hair length and density." },
  "an-hair-bleach": { name: "Hair bleaching", description: "Hair bleaching per treatment; hair-base check included." },
  "an-root-bleaching": { name: "Root bleach touch-up", description: "Root bleach touch-up based on your hair base." },
  "an-hair-pressed-down": { name: "Down perm", description: "Down perm for the sides." },
  "an-hair-restore": { name: "Hair restoration", description: "Restorative care for damaged hair." },
  "an-beard-dye": { name: "Beard colouring", description: "Beard colouring based on beard condition." },
  "an-black-dye": { name: "Black colour", description: "Black colour based on your hair base." },
  "an-haircut-styling": { name: "Haircut & styling", description: "Haircut and styling with Uppercut." },
  "an-hot-cold-towel-shave": { name: "Hot & cold towel shave", description: "Hot and cold towel shave." },
  "an-basic-beard-trim-side": { name: "Basic beard trim / side clean-up", description: "Basic beard trim or side clean-up." },
  "an-hair-styling": { name: "Blow-dry & styling", description: "Hair styling after a wash or haircut." },
  "an-hair-washing": { name: "Hair wash", description: "Basic hair wash." },
  "an-locs-washing": { name: "Dread / loc wash & cleanse", description: "Price varies by dread or loc length." },
  "an-afro-wash-blowdry": { name: "Afro wash & blow-dry", description: "Afro wash and blow-dry; price varies by hair length." },
  "an-basic-hair-tattoo": { name: "Basic hair tattoo", description: "Price varies by design." },
  "an-gentlemans-set-1": { name: "Gentleman's Set I", description: "Haircut, hot/cold towel shave and Uppercut." },
  "an-gentlemans-set-2": { name: "Gentleman's Set II", description: "Haircut, wash, hot/cold towel shave and Uppercut." },
  "an-vip-gentlemans-combo": { name: "VIP Gentleman's Combo", description: "Advance booking only; styling consult, haircut/shave, hot/cold towels, grooming and priority service." }
};

export function getLocalizedService(service: Service, isEnglish: boolean): Service {
  if (!isEnglish) return service;
  const translation = englishServiceCopy[service.id];
  return translation ? { ...service, ...translation } : service;
}

export function getLocalizedPriceLabel(service: Service, isEnglish: boolean): string {
  const label = service.priceLabel;
  if (!label) return "";
  if (!isEnglish) return label;
  return label
    .replace(/^Từ\s*/i, "From ")
    .replace(/(\d)\.(?=\d{3}(?:\D|$))/g, "$1,")
    .replace(/đ/g, " VND")
    .replace(/\s*\/\s*giờ/gi, " / hour")
    .replace(/\s*\/\s*lần/gi, " / session")
    .replace(/\s*\/\s*cặp/gi, " / pair")
    .replace(/\s*\/\s*bịch/gi, " / pack")
    .replace(/\s*\/\s*30\s*phút/gi, " / 30 min")
    .replace(/\s*\/\s*phút/gi, " / min");
}
