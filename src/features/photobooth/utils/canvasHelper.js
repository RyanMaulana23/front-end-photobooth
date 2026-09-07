import { LAYOUT_CONFIGS } from "../../../constants/photobooth";

/**
 * Combines user photos with a frame template layout.
 * Ensures photos are placed in the back layer (send-to-back), with the full frame
 * template overlaid on top.
 *
 * Compositing sequence:
 * 1. Create canvas with dimensions according to template configuration.
 * 2. Fill clean background base.
 * 3. Render user photos clipped to their respective slots (SEND TO BACK).
 * 4. Render FULL FRAME TEMPLATE on top as the overlay layer.
 * 5. Export canvas as PNG data URL.
 *
 * @param {string} template - The active template key (e.g., 'layout1')
 * @param {Array<string>} photos - Array of user photo data URLs
 * @returns {Promise<string|null>} - Promise resolving to the compiled PNG data URL
 */
export const compilePhotoStrip = (template, photos = []) => {
  const config = LAYOUT_CONFIGS[template];
  if (!config) return Promise.resolve(null);

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext("2d");

    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.onload = async () => {
      // 1. Fill clean background base
      ctx.fillStyle = config.backgroundColor || "#ffffff";
      ctx.fillRect(0, 0, config.width, config.height);

      // 2. Render user photos in the back (SEND TO BACK)
      const drawPhoto = (src, idx) => {
        if (!src || !config.slots[idx]) return Promise.resolve();
        const slot = config.slots[idx];

        return new Promise((res) => {
          const photoImg = new Image();
          photoImg.crossOrigin = "anonymous";
          photoImg.onload = () => {
            ctx.save();
            ctx.beginPath();
            if (slot.radius && typeof ctx.roundRect === "function") {
              ctx.roundRect(slot.x, slot.y, slot.w, slot.h, slot.radius);
            } else {
              ctx.rect(slot.x, slot.y, slot.w, slot.h);
            }
            ctx.clip();

            const coverScale = Math.max(
              slot.w / photoImg.width,
              slot.h / photoImg.height,
            );
            const drawWidth = photoImg.width * coverScale;
            const drawHeight = photoImg.height * coverScale;
            const drawX = slot.x + (slot.w - drawWidth) / 2;
            const drawY = slot.y + (slot.h - drawHeight) / 2;

            ctx.drawImage(photoImg, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
            res();
          };
          photoImg.onerror = res;
          photoImg.src = src;
        });
      };

      for (let i = 0; i < photos.length; i++) {
        if (photos[i]) {
          await drawPhoto(photos[i], i);
        }
      }

      // 3. Render FULL TEMPLATE FRAME on top of the photos!
      ctx.drawImage(frameImg, 0, 0, config.width, config.height);

      // 4. Export canvas as final image
      resolve(canvas.toDataURL("image/png"));
    };

    frameImg.onerror = () => resolve(null);
    frameImg.src = config.image;
  });
};

/**
 * Returns the template image URL as-is.
 *
 * @param {string} template - The active template key
 * @returns {Promise<string|null>}
 */
export const getProcessedFrameOverlay = (template) => {
  const config = LAYOUT_CONFIGS[template];
  if (!config) return Promise.resolve(null);
  return Promise.resolve(config.image);
};
