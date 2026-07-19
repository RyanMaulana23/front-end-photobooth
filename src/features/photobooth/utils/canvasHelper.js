import { LAYOUT_CONFIGS } from '../../../constants/photobooth';

/**
 * Combines user photos with a frame template layout.
 * Resolves white pixels inside slots to transparent and overlays the frame.
 * 
 * @param {string} template - The active template key (e.g., 'layout1')
 * @param {Array} photos - Array of user photo data URLs
 * @returns {Promise<string>} - Promise resolving to the stitched PNG data URL
 */
export const compilePhotoStrip = (template, photos) => {
  const config = LAYOUT_CONFIGS[template];
  if (!config) return Promise.resolve(null);

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');

    const frameImg = new Image();
    frameImg.crossOrigin = 'anonymous';
    frameImg.onload = () => {
      // 1. Process white slots to transparent smoothly
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = config.width;
      tempCanvas.height = config.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(frameImg, 0, 0);

      const imgData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
      );
      const data = imgData.data;
      const slots = config.slots;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const pixelIndex = i / 4;
        const px = pixelIndex % config.width;
        const py = Math.floor(pixelIndex / config.width);

        let insideSlot = false;
        for (let s = 0; s < slots.length; s++) {
          const slot = slots[s];
          if (
            px >= slot.x &&
            px < slot.x + slot.w &&
            py >= slot.y &&
            py < slot.y + slot.h
          ) {
            insideSlot = true;
            break;
          }
        }

        let insideProtection = false;
        const zones = config.protectionZones || [];
        for (let z = 0; z < zones.length; z++) {
          const zone = zones[z];
          if (
            px >= zone.x &&
            px < zone.x + zone.w &&
            py >= zone.y &&
            py < zone.y + zone.h
          ) {
            insideProtection = true;
            break;
          }
        }

        if (insideSlot && !insideProtection) {
          const whiteness = Math.min(r, g, b);
          const threshold = config.whitenessThreshold || 253;
          if (whiteness >= threshold && a > 0) {
            const factor = (whiteness - threshold) / (255 - threshold || 1);
            data[i + 3] = Math.round(a * (1 - factor));
          }
        }
      }
      tempCtx.putImageData(imgData, 0, 0);

      // 2. Draw user photos (with 3px bleed margin)
      const promises = photos.map((src, idx) => {
        if (!src || !config.slots[idx]) return Promise.resolve();
        const slot = config.slots[idx];
        return new Promise((res) => {
          const photoImg = new Image();
          photoImg.onload = () => {
            const bleedX = slot.x - 3;
            const bleedY = slot.y - 3;
            const bleedW = slot.w + 6;
            const bleedH = slot.h + 6;
            ctx.drawImage(photoImg, bleedX, bleedY, bleedW, bleedH);
            res();
          };
          photoImg.onerror = res;
          photoImg.src = src;
        });
      });

      Promise.all(promises).then(() => {
        // 3. Draw processed frame on top
        ctx.drawImage(tempCanvas, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      });
    };
    frameImg.onerror = () => resolve(null);
    frameImg.src = config.image;
  });
};
