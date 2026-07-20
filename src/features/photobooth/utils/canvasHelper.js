import { LAYOUT_CONFIGS } from "../../../constants/photobooth";

/**
 * Removes only the white placeholder connected to the supplied points.
 *
 * Some frames use white decorations (for example flower petals) above a
 * white photo placeholder. A simple colour key cannot tell them apart. By
 * starting from a known empty point in each photo slot, the black outlines
 * around a sticker keep its white and light-coloured details intact.
 */
const clearConnectedWhiteBackground = (data, width, height, seeds, threshold) => {
  const pixelCount = width * height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Uint32Array(pixelCount);

  const isKeyableWhite = (pixelIndex) => {
    const offset = pixelIndex * 4;
    return (
      data[offset + 3] > 0 &&
      Math.min(data[offset], data[offset + 1], data[offset + 2]) >= threshold
    );
  };

  for (const seed of seeds) {
    const startX = Math.round(seed.x);
    const startY = Math.round(seed.y);
    if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
      continue;
    }

    const start = startY * width + startX;
    if (visited[start] || !isKeyableWhite(start)) continue;

    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    visited[start] = 1;

    while (head < tail) {
      const pixelIndex = queue[head++];
      const offset = pixelIndex * 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      data[offset + 3] = 0;

      const neighbours = [
        x > 0 ? pixelIndex - 1 : -1,
        x < width - 1 ? pixelIndex + 1 : -1,
        y > 0 ? pixelIndex - width : -1,
        y < height - 1 ? pixelIndex + width : -1,
      ];

      for (const neighbour of neighbours) {
        if (
          neighbour >= 0 &&
          !visited[neighbour] &&
          isKeyableWhite(neighbour)
        ) {
          visited[neighbour] = 1;
          queue[tail++] = neighbour;
        }
      }
    }
  }
};

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
    const canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext("2d");

    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.onload = () => {
      // 1. Process white slots to transparent smoothly
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = config.width;
      tempCanvas.height = config.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(frameImg, 0, 0);

      const imgData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
      );
      const data = imgData.data;
      const slots = config.slots;
      const stickerZones = config.stickerZones || [];
      const whiteStickerZones = config.whiteStickerZones || [];
      const whiteSlotSeeds = config.whiteSlotSeeds || [];

      if (whiteSlotSeeds.length) {
        clearConnectedWhiteBackground(
          data,
          config.width,
          config.height,
          whiteSlotSeeds,
          config.whitenessThreshold || 253,
        );
      } else {
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
          if (config.clearSlotBackground) {
            const insideStickerZone = stickerZones.some(
              (zone) =>
                px >= zone.x &&
                px < zone.x + zone.w &&
                py >= zone.y &&
                py < zone.y + zone.h,
            );
            const isPinkSticker = r >= 180 && r - g >= 15 && b >= g;
            const isWhiteSticker =
              whiteStickerZones.some(
                (zone) =>
                  px >= zone.x &&
                  px < zone.x + zone.w &&
                  py >= zone.y &&
                  py < zone.y + zone.h,
              ) &&
              r >= 245 &&
              g >= 245 &&
              b >= 245;
            const isDarkStickerDetail =
              insideStickerZone && r < 150 && g < 150 && b < 170;

            // The new frame has a sky-and-hills placeholder inside each slot.
            // Remove that placeholder, while keeping every sticker pixel that
            // should remain above the user's photo.
            if (!isPinkSticker && !isWhiteSticker && !isDarkStickerDetail) {
              data[i + 3] = 0;
            }
            continue;
          }

          const whiteness = Math.min(r, g, b);
          const threshold = config.whitenessThreshold || 253;
          if (whiteness >= threshold && a > 0) {
            const factor = (whiteness - threshold) / (255 - threshold || 1);
            data[i + 3] = Math.round(a * (1 - factor));
          }
        }
      }
      }
      tempCtx.putImageData(imgData, 0, 0);

      // 2. Fill every slot edge-to-edge with the user's captured photo.
      const promises = photos.map((src, idx) => {
        if (!src || !config.slots[idx]) return Promise.resolve();
        const slot = config.slots[idx];
        return new Promise((res) => {
          const photoImg = new Image();
          photoImg.onload = () => {
            ctx.save();

            ctx.beginPath();

            ctx.rect(slot.x, slot.y, slot.w, slot.h);

            ctx.clip();

            const coverScale = Math.max(
              slot.w / photoImg.width,
              slot.h / photoImg.height,
            );
            const drawWidth = photoImg.width * coverScale;
            const drawHeight = photoImg.height * coverScale;
            const drawX = slot.x + (slot.w - drawWidth) / 2;
            const drawY = slot.y + (slot.h - drawHeight) / 2;

            ctx.filter = "none";
            ctx.drawImage(
              photoImg,
              drawX,
              drawY,
              drawWidth,
              drawHeight,
            );

            ctx.restore();
            res();
          };
          photoImg.onerror = res;
          photoImg.src = src;
        });
      });

      Promise.all(promises).then(() => {
        // 3. Draw processed frame on top
        ctx.drawImage(tempCanvas, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      });
    };
    frameImg.onerror = () => resolve(null);
    frameImg.src = config.image;
  });
};
