/**
 * Render Glitter AR Filter onto canvas:
 * - Shimmering gold & white star sparkles drifting around
 * - Glowing aura particles
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} transform - Output from calculateFaceTransform
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} timestamp - Animation timestamp in ms
 */
export function drawGlitter(ctx, transform, width, height, timestamp = 0) {
  const time = timestamp * 0.002;
  const starCount = 25;

  ctx.save();

  for (let i = 0; i < starCount; i++) {
    const seed = i * 91.3;
    const px = (Math.sin(seed + time * 0.3) * 0.45 + 0.5) * width;
    const py = (Math.cos(seed * 1.5 + time * 0.25) * 0.45 + 0.5) * height;
    const size = 6 + (Math.sin(time * 3 + seed) + 1) * 6;
    const alpha = 0.3 + (Math.sin(time * 4 + seed) + 1) * 0.35;
    const color = i % 2 === 0 ? '#ffd700' : '#ffffff';

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(time + seed);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 1.2;

    ctx.beginPath();
    for (let k = 0; k < 4; k++) {
      ctx.lineTo(Math.cos((k * Math.PI) / 2) * size, Math.sin((k * Math.PI) / 2) * size);
      ctx.lineTo((Math.cos((k * Math.PI) / 2 + Math.PI / 4) * size) / 3, (Math.sin((k * Math.PI) / 2 + Math.PI / 4) * size) / 3);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}
