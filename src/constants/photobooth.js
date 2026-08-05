import layout1Image from "../components/frame-layout/layout dsc 1.png";
import layout2Image from "../components/frame-layout/layout dsc 2.png";
import layout3Image from "../components/frame-layout/layout dsc 3.png";
import layout4Image from "../components/frame-layout/layout dsc 4.png";
import layout5Image from "../components/frame-layout/layout dsc 5.png";

const MOMENT_CAPTURED_STICKER_ZONES = [
  { x: 55, y: 40, w: 180, h: 240 }, // Bow
  { x: 365, y: 35, w: 150, h: 180 }, // Sparkles
  { x: 105, y: 640, w: 400, h: 135 }, // Ribbon
  { x: 185, y: 1200, w: 220, h: 180 }, // Heart sticker
];

const MOMENT_CAPTURED_WHITE_DETAIL_ZONES = [
  { x: 185, y: 1200, w: 220, h: 180 }, // White flower details on the heart
];

export const STEPS = {
  TEMPLATE: 1,
  PHOTO_CAPTURE: 2,
  PREVIEW: 3,
  EDIT_DECISION: 4,
  INPUT_DATA: 5,
  PROCESSING: 6,
  EMAIL_SUCCESS: 7,
  PRINT_HARDCOPY: 8,
  THANK_YOU: 9,
};

export const LAYOUT_CONFIGS = {
  layout1: {
    name: "Watercolor Owl (2x2)",
    image: layout1Image,
    width: 788,
    height: 1182,
    whitenessThreshold: 200,
    slots: [
      { x: 50, y: 65, w: 328, h: 452 }, // Top-Left
      { x: 410, y: 65, w: 328, h: 452 }, // Top-Right
      { x: 50, y: 559, w: 328, h: 452 }, // Bottom-Left
      { x: 410, y: 559, w: 328, h: 452 }, // Bottom-Right
    ],
  },
  layout2: {
    name: "Cloud Kitty (1x4 Strip)",
    image: layout2Image,
    width: 473,
    height: 1340,
    whitenessThreshold: 253,
    slots: [
      { x: 49, y: 73, w: 376, h: 255 },
      { x: 49, y: 359, w: 376, h: 255 },
      { x: 49, y: 645, w: 376, h: 255 },
      { x: 49, y: 931, w: 376, h: 255 },
    ],
  },
  layout3: {
    name: "Space Astronaut (1x3 Strip)",
    image: layout3Image,
    width: 394,
    height: 1182,
    whitenessThreshold: 200,
    slots: [
      { x: 55, y: 103, w: 284, h: 284 },
      { x: 55, y: 467, w: 284, h: 284 },
      { x: 55, y: 831, w: 284, h: 284 },
    ],
  },
  layout4: {
    name: "Good Vibes (1x3 Shapes)",
    image: layout4Image,
    width: 841,
    height: 1870,
    whitenessThreshold: 200,
    slots: [
      { x: 92, y: 47, w: 632, h: 478 },
      { x: 102, y: 560, w: 638, h: 403 },
      { x: 99, y: 1005, w: 648, h: 469 },
    ],
    // One seed per white photo placeholder. The connected-area mask keeps
    // the flowers and sticker colours above the user's photos perfectly intact.
    whiteSlotSeeds: [
      { x: 400, y: 300 },
      { x: 350, y: 700 },
      { x: 400, y: 1200 },
    ],
  },
  layout5: {
    name: "Moment Captured (1x2 Strip)",
    image: layout5Image,
    width: 600,
    height: 1800,
    clearSlotBackground: true,
    stickerZones: MOMENT_CAPTURED_STICKER_ZONES,
    whiteStickerZones: MOMENT_CAPTURED_WHITE_DETAIL_ZONES,
    slots: [
      { x: 66, y: 66, w: 468, h: 588 },
      { x: 66, y: 698, w: 468, h: 560 },
    ],
  },
};

export const getMaxPhotos = (template) => {
  return LAYOUT_CONFIGS[template]?.slots.length ?? 4;
};

export const AR_FILTERS = [
  {
    id: "none",
    label: "Tanpa AR",
    category: "ar",
    icon: "🚫",
    description: "Matikan filter wajah AR",
    previewBg: "#f1f5f9",
  },
  {
    id: "bird",
    label: "Boothcool Bird",
    category: "ar",
    icon: "🐦",
    description: "Burung biru Boothcool berkedip & mengepak di atas kepala",
    previewBg: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
  },
  {
    id: "hearts",
    label: "Hearts",
    category: "ar",
    icon: "💖",
    description: "Mahkota hati melayang, pipi merah & kilau bintang",
    previewBg: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  },
  {
    id: "dog",
    label: "Puppy Dog",
    category: "ar",
    icon: "🐶",
    description: "Telinga anjing bergerak, hidung imut & lidah melet saat mulut terbuka",
    previewBg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  },
  {
    id: "sakura",
    label: "Sakura",
    category: "ar",
    icon: "🌸",
    description: "Kelopak bunga sakura berguguran & kilatan cahaya",
    previewBg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  },
  {
    id: "glitter",
    label: "Glitter",
    category: "ar",
    icon: "✨",
    description: "Partikel emas & bintang gemerlap melayang",
    previewBg: "linear-gradient(135deg, #f5d020 0%, #f5d020 100%)",
  },
  {
    id: "bunny",
    label: "Bunny",
    category: "ar",
    icon: "🐰",
    description: "Telinga kelinci panjang & hidung kelinci merah muda",
    previewBg: "linear-gradient(135deg, #e2ebf0 0%, #cfd9df 100%)",
  },
  {
    id: "cat",
    label: "Cat",
    category: "ar",
    icon: "🐱",
    description: "Telinga kucing lancip, kumis & hidung kucing kecil",
    previewBg: "linear-gradient(135deg, #fddb92 0%, #d1f2a5 100%)",
  },
  {
    id: "crown",
    label: "Princess Crown",
    category: "ar",
    icon: "👑",
    description: "Mahkota emas berkilau mengambang di dahi",
    previewBg: "linear-gradient(135deg, #ffd700 0%, #fbc2eb 100%)",
  },
  {
    id: "sunglasses",
    label: "Sunglasses",
    category: "ar",
    icon: "🕶️",
    description: "Kacamata hitam keren terpasang di area mata",
    previewBg: "linear-gradient(135deg, #1e272e 0%, #485460 100%)",
  },
  {
    id: "santa",
    label: "Santa",
    category: "ar",
    icon: "🎅",
    description: "Topi merah Santa Claus & jenggot putih tebal",
    previewBg: "linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)",
  },
  {
    id: "halloween",
    label: "Halloween",
    category: "ar",
    icon: "👻",
    description: "Hantu-hantu kecil terbang mengelilingi kepala",
    previewBg: "linear-gradient(135deg, #3d3d3d 0%, #1e1e1e 100%)",
  },
  {
    id: "christmas",
    label: "Christmas",
    category: "ar",
    icon: "🎄",
    description: "Daun holly di dahi & efek salju berguguran",
    previewBg: "linear-gradient(135deg, #2ed573 0%, #7bed9f 100%)",
  },
  {
    id: "wedding",
    label: "Wedding",
    category: "ar",
    icon: "💍",
    description: "Tiara bunga & kelopak mawar jatuh berguguran",
    previewBg: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  },
  {
    id: "wings",
    label: "Angel Wings",
    category: "ar",
    icon: "🪶",
    description: "Sayap malaikat putih bersinar di kanan kiri kepala",
    previewBg: "linear-gradient(135deg, #ffffff 0%, #eef2f3 100%)",
  },
  {
    id: "rainbow",
    label: "Rainbow",
    category: "ar",
    icon: "🌈",
    description: "Pelangi indah melengkung & taburan confetti warna-warni",
    previewBg: "linear-gradient(135deg, #ff7675 0%, #ffeaa7 100%)",
  },
];

export const FILTERS = [
  {
    id: "vintage",
    label: "Vintage",
    css: "sepia(0.25) saturate(1.4) contrast(1.0) brightness(1.15) hue-rotate(-25deg)",
    canvasFilter:
      "sepia(0.25) saturate(1.4) contrast(1.0) brightness(1.15) hue-rotate(-25deg)",
    previewType: "color",
    previewBg: "linear-gradient(to bottom, #f472b6, #fb7185)",
  },
  {
    id: "grayscale",
    label: "Grayscale",
    css: "grayscale(1) contrast(1.05) brightness(1.05)",
    canvasFilter: "grayscale(1) contrast(1.05) brightness(1.05)",
    previewType: "color",
    previewBg: "#cbd5e1",
  },
  {
    id: "smooth",
    label: "Smooth",
    css: "contrast(0.9) brightness(1.08) saturate(0.9) blur(0.2px)",
    canvasFilter: "contrast(0.9) brightness(1.08) saturate(0.9)",
    previewType: "color",
    previewBg: "#fbcfe8",
  },
  {
    id: "bw",
    label: "B&W",
    css: "grayscale(1) contrast(1.5) brightness(0.85)",
    canvasFilter: "grayscale(1) contrast(1.5) brightness(0.85)",
    previewType: "color",
    previewBg: "#334155",
  },
  {
    id: "cyber",
    label: "Cyber",
    css: "sepia(0.65) saturate(0.8) contrast(1.1) brightness(1.05) hue-rotate(5deg)",
    canvasFilter:
      "sepia(0.65) saturate(0.8) contrast(1.1) brightness(1.05) hue-rotate(5deg)",
    previewType: "color",
    previewBg: "#e2d3b4",
  },
  {
    id: "none",
    label: "Normal",
    css: "none",
    canvasFilter: "none",
    previewType: "color",
    previewBg: "#ec4899",
  },
  {
    id: "bittersweet",
    label: "Bittersweet",
    css: "contrast(1.15) sepia(0.2) saturate(0.95) brightness(0.96) hue-rotate(-10deg)",
    canvasFilter:
      "contrast(1.15) sepia(0.2) saturate(0.95) brightness(0.96) hue-rotate(-10deg)",
    previewType: "image",
  },
  {
    id: "ogvintage",
    label: "OG Vintage",
    css: "grayscale(0.7) sepia(0.4) contrast(1.2) brightness(0.9)",
    canvasFilter: "grayscale(0.7) sepia(0.4) contrast(1.2) brightness(0.9)",
    previewType: "image",
  },
  {
    id: "fresh",
    label: "Fresh",
    css: "contrast(1.1) saturate(1.2) hue-rotate(30deg) brightness(0.98)",
    canvasFilter:
      "contrast(1.1) saturate(1.2) hue-rotate(30deg) brightness(0.98)",
    previewType: "image",
  },
  {
    id: "citrus",
    label: "Citrus",
    css: "saturate(1.6) hue-rotate(-10deg) contrast(1.05) sepia(0.15)",
    canvasFilter: "saturate(1.6) hue-rotate(-10deg) contrast(1.05) sepia(0.15)",
    previewType: "image",
  },
  {
    id: "year2015",
    label: "2015",
    css: "contrast(0.9) brightness(0.98) saturate(1.15) hue-rotate(-25deg) sepia(0.1)",
    canvasFilter:
      "contrast(0.9) brightness(0.98) saturate(1.15) hue-rotate(-25deg) sepia(0.1)",
    previewType: "image",
  },
  {
    id: "focus",
    label: "Focus",
    css: "contrast(1.35) saturate(1.1) brightness(0.92)",
    canvasFilter: "contrast(1.35) saturate(1.1) brightness(0.92)",
    previewType: "image",
  },
  {
    id: "candy",
    label: "Candy",
    css: "saturate(1.4) hue-rotate(330deg) contrast(1.08) brightness(1.02)",
    canvasFilter:
      "saturate(1.4) hue-rotate(330deg) contrast(1.08) brightness(1.02)",
    previewType: "image",
  },
  {
    id: "eighties",
    label: "80s",
    css: "sepia(0.55) saturate(1.45) contrast(0.95) brightness(0.95) hue-rotate(-15deg)",
    canvasFilter:
      "sepia(0.55) saturate(1.45) contrast(0.95) brightness(0.95) hue-rotate(-15deg)",
    previewType: "image",
  },
  {
    id: "nostalgia",
    label: "Nostalgia",
    css: "sepia(0.35) saturate(0.7) contrast(0.95) brightness(1.02) hue-rotate(5deg)",
    canvasFilter:
      "sepia(0.35) saturate(0.7) contrast(0.95) brightness(1.02) hue-rotate(5deg)",
    previewType: "image",
  },
];
export const getCameraAspectStyle = (template) => {

    const config = LAYOUT_CONFIGS?.[template];

    if (!config || !config.slots?.length) {
        return {
            aspectRatio: "3/4",
            maxWidth: "420px"
        };
    }

    const slot = config.slots[0];

    return {
        aspectRatio: `${slot.w}/${slot.h}`,
        maxWidth: "420px"
    };
};

export const getSlotAspectClass = (template) => {
  const config = LAYOUT_CONFIGS?.[template];

  if (!config || !config.slots?.length) {
    return "w-full aspect-[3/4] object-cover";
  }

  const slot = config.slots[0];
  return `w-full aspect-[${slot.w}/${slot.h}] object-cover`;
};
