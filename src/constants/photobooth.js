import layout1Image from '../components/frame-layout/layout dsc 1.png';
import layout2Image from '../components/frame-layout/layout dsc 2.png';
import layout3Image from '../components/frame-layout/layout dsc 3.png';
import layout4Image from '../components/frame-layout/layout dsc 4.png';
import layout5Image from '../components/frame-layout/layout dsc 5.png';

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
    name: 'Watercolor Owl (2x2)',
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
    name: 'Cloud Kitty (1x4 Strip)',
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
    name: 'Space Astronaut (1x3 Strip)',
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
    name: 'Good Vibes (1x3 Shapes)',
    image: layout4Image,
    width: 841,
    height: 1870,
    whitenessThreshold: 200,
    slots: [
      { x: 92, y: 47, w: 632, h: 478 },
      { x: 102, y: 560, w: 638, h: 403 },
      { x: 99, y: 1005, w: 648, h: 469 },
    ],
    protectionZones: [
      { x: 600, y: 860, w: 241, h: 140 }, // Daisy flower (expanded to protect all white petals)
    ],
  },
  layout5: {
    name: 'Moment Captured (1x2 Strip)',
    image: layout5Image,
    width: 724,
    height: 2172,
    whitenessThreshold: 200,
    slots: [
      { x: 80, y: 80, w: 564, h: 705 },
      { x: 80, y: 839, w: 564, h: 705 },
    ],
  },
};

export const FILTERS = [
  {
    id: 'vintage',
    label: 'Vintage',
    css: 'sepia(0.25) saturate(1.4) contrast(1.0) brightness(1.15) hue-rotate(-25deg)',
    canvasFilter:
      'sepia(0.25) saturate(1.4) contrast(1.0) brightness(1.15) hue-rotate(-25deg)',
    previewType: 'color',
    previewBg: 'linear-gradient(to bottom, #f472b6, #fb7185)',
  },
  {
    id: 'grayscale',
    label: 'Grayscale',
    css: 'grayscale(1) contrast(1.05) brightness(1.05)',
    canvasFilter: 'grayscale(1) contrast(1.05) brightness(1.05)',
    previewType: 'color',
    previewBg: '#cbd5e1',
  },
  {
    id: 'smooth',
    label: 'Smooth',
    css: 'contrast(0.9) brightness(1.08) saturate(0.9) blur(0.2px)',
    canvasFilter: 'contrast(0.9) brightness(1.08) saturate(0.9)',
    previewType: 'color',
    previewBg: '#fbcfe8',
  },
  {
    id: 'bw',
    label: 'B&W',
    css: 'grayscale(1) contrast(1.5) brightness(0.85)',
    canvasFilter: 'grayscale(1) contrast(1.5) brightness(0.85)',
    previewType: 'color',
    previewBg: '#334155',
  },
  {
    id: 'cyber',
    label: 'Cyber',
    css: 'sepia(0.65) saturate(0.8) contrast(1.1) brightness(1.05) hue-rotate(5deg)',
    canvasFilter:
      'sepia(0.65) saturate(0.8) contrast(1.1) brightness(1.05) hue-rotate(5deg)',
    previewType: 'color',
    previewBg: '#e2d3b4',
  },
  {
    id: 'none',
    label: 'Normal',
    css: 'none',
    canvasFilter: 'none',
    previewType: 'color',
    previewBg: '#ec4899',
  },
  {
    id: 'bittersweet',
    label: 'Bittersweet',
    css: 'contrast(1.15) sepia(0.2) saturate(0.95) brightness(0.96) hue-rotate(-10deg)',
    canvasFilter:
      'contrast(1.15) sepia(0.2) saturate(0.95) brightness(0.96) hue-rotate(-10deg)',
    previewType: 'image',
  },
  {
    id: 'ogvintage',
    label: 'OG Vintage',
    css: 'grayscale(0.7) sepia(0.4) contrast(1.2) brightness(0.9)',
    canvasFilter: 'grayscale(0.7) sepia(0.4) contrast(1.2) brightness(0.9)',
    previewType: 'image',
  },
  {
    id: 'fresh',
    label: 'Fresh',
    css: 'contrast(1.1) saturate(1.2) hue-rotate(30deg) brightness(0.98)',
    canvasFilter:
      'contrast(1.1) saturate(1.2) hue-rotate(30deg) brightness(0.98)',
    previewType: 'image',
  },
  {
    id: 'citrus',
    label: 'Citrus',
    css: 'saturate(1.6) hue-rotate(-10deg) contrast(1.05) sepia(0.15)',
    canvasFilter: 'saturate(1.6) hue-rotate(-10deg) contrast(1.05) sepia(0.15)',
    previewType: 'image',
  },
  {
    id: 'year2015',
    label: '2015',
    css: 'contrast(0.9) brightness(0.98) saturate(1.15) hue-rotate(-25deg) sepia(0.1)',
    canvasFilter:
      'contrast(0.9) brightness(0.98) saturate(1.15) hue-rotate(-25deg) sepia(0.1)',
    previewType: 'image',
  },
  {
    id: 'focus',
    label: 'Focus',
    css: 'contrast(1.35) saturate(1.1) brightness(0.92)',
    canvasFilter: 'contrast(1.35) saturate(1.1) brightness(0.92)',
    previewType: 'image',
  },
  {
    id: 'candy',
    label: 'Candy',
    css: 'saturate(1.4) hue-rotate(330deg) contrast(1.08) brightness(1.02)',
    canvasFilter:
      'saturate(1.4) hue-rotate(330deg) contrast(1.08) brightness(1.02)',
    previewType: 'image',
  },
  {
    id: 'eighties',
    label: '80s',
    css: 'sepia(0.55) saturate(1.45) contrast(0.95) brightness(0.95) hue-rotate(-15deg)',
    canvasFilter:
      'sepia(0.55) saturate(1.45) contrast(0.95) brightness(0.95) hue-rotate(-15deg)',
    previewType: 'image',
  },
  {
    id: 'nostalgia',
    label: 'Nostalgia',
    css: 'sepia(0.35) saturate(0.7) contrast(0.95) brightness(1.02) hue-rotate(5deg)',
    canvasFilter:
      'sepia(0.35) saturate(0.7) contrast(0.95) brightness(1.02) hue-rotate(5deg)',
    previewType: 'image',
  },
];

export const getMaxPhotos = (t) => {
  if (t === 'layout3' || t === 'layout4') return 3;
  if (t === 'layout5') return 2;
  return 4;
};

export const getCameraAspectStyle = (t) => {
  if (t === 'layout1') return { aspectRatio: '328/452', maxWidth: '320px' };
  if (t === 'layout2') return { aspectRatio: '376/255', maxWidth: '440px' };
  if (t === 'layout3') return { aspectRatio: '284/284', maxWidth: '360px' };
  if (t === 'layout4') return { aspectRatio: '640/440', maxWidth: '440px' };
  return { aspectRatio: '564/705', maxWidth: '320px' }; // layout5
};

export const getSlotAspectClass = (t) => {
  if (t === 'layout1') return 'aspect-[328/452] w-40 object-cover';
  if (t === 'layout2') return 'aspect-[376/255] w-48 object-cover';
  if (t === 'layout3') return 'aspect-[284/284] w-40 object-cover';
  if (t === 'layout4') return 'aspect-[640/440] w-48 object-cover';
  return 'aspect-[564/705] w-40 object-cover'; // layout5
};
