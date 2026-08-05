/**
 * Render Sakura AR Filter onto canvas:
 * - Falling cherry blossom petals
 * - Soft romantic pink bloom & sparkles
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} transform - Output from calculateFaceTransform
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} timestamp - Animation timestamp in ms
 */
export function drawSakura(ctx, transform, width, height, timestamp = 0) {
  const time = timestamp * 0.0015;
  const petalCount = 20;

  ctx.save();

  // Soft pink ambient aura
  const ambientGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.6);
  ambientGrad.addColorStop(0, 'rgba(255, 192, 203, 0.12)');
  ambientGrad.addColorStop(1, 'rgba(255, 192, 203, 0)');
  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, width, height);

  // Falling Petals Particle Loop
  for (let i = 0; i < petalCount; i++) {
    const seed = i * 45.7;
    const speed = 0.3 + (i % 5) * 0.15;
    const progress = (time * speed + i * 0.2) % 1;

    const px = ((Math.sin(seed + time * 0.8) * 0.4 + (i / petalCount)) * width) % width;
    const py = progress * (height + 60) - 30;
    const pSize = 14 + (i % 4) * 6;
    const rotation = time * (1 + (i % 3)) + seed;
    const opacity = Math.sin(progress * Math.PI) * 0.85;

    drawPetalShape(ctx, px, py, pSize, rotation, opacity);
  }

  ctx.restore();
}

function drawPetalShape(ctx, x, y, size, rotation, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  const gradient = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
  gradient.addColorStop(0, '#ffb7c5');
  gradient.addColorStop(0.7, '#ff69b4');
  gradient.addColorStop(1, '#ff1493');

  ctx.fillStyle = gradient;
  ctx.shadowColor = 'rgba(255, 183, 197, 0.5)';
  ctx.shadowBlur = 4;

  ctx.beginPath();
  ctx.moveTo(0, -size / 2);
  ctx.bezierCurveTo(-size / 2, -size / 4, -size / 3, size / 2, 0, size / 2);
  ctx.bezierCurveTo(size / 3, size / 2, size / 2, -size / 4, 0, -size / 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
