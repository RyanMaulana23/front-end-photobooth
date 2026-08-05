/**
 * Render Hearts AR Filter onto canvas:
 * - Floating Heart Crown above forehead
 * - Animated floating hearts particle system
 * - Soft pink cheek blush
 * - Sparkle accents
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} transform - Output from calculateFaceTransform
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} timestamp - Animation timestamp in ms
 * @param {boolean} isCapturing - True if currently snapshotting frame
 */
export function drawHearts(ctx, transform, width, height, timestamp = 0, isCapturing = false) {
  const { foreheadX, foreheadY, noseX, noseY, faceWidth, faceHeight, angle, smileRatio } = transform;
  const time = timestamp * 0.002;

  ctx.save();

  // 1. Soft Pink Cheek Blush
  const cheekOffset = faceWidth * 0.28;
  const cheekY = noseY + faceHeight * 0.02;
  const blushRadius = faceWidth * 0.16;

  [foreheadX - cheekOffset, foreheadX + cheekOffset].forEach((cx) => {
    const gradient = ctx.createRadialGradient(cx, cheekY, 0, cx, cheekY, blushRadius);
    gradient.addColorStop(0, 'rgba(255, 105, 180, 0.35)');
    gradient.addColorStop(0.6, 'rgba(255, 182, 193, 0.18)');
    gradient.addColorStop(1, 'rgba(255, 182, 193, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cheekY, blushRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Heart Crown (Arch above forehead)
  ctx.save();
  ctx.translate(foreheadX, foreheadY);
  ctx.rotate(angle);

  const crownHeartCount = 11;
  const crownRadiusX = faceWidth * 0.52;
  const crownRadiusY = faceHeight * 0.18;

  for (let i = 0; i < crownHeartCount; i++) {
    const t = (i / (crownHeartCount - 1) - 0.5) * Math.PI * 0.85;
    const hx = Math.sin(t) * crownRadiusX;
    const hy = -Math.cos(t) * crownRadiusY - faceHeight * 0.08;

    // Breathing scale and sway
    const heartScale = (faceWidth * 0.09) * (1 + Math.sin(time * 3 + i) * 0.12);
    const heartAngle = Math.sin(time * 2 + i) * 0.15;
    const opacity = 0.85 + Math.sin(time * 2.5 + i) * 0.15;

    drawHeartShape(ctx, hx, hy, heartScale, heartAngle, opacity);
  }
  ctx.restore();

  // 3. Floating Hearts Particle System
  const particleCount = isCapturing ? 24 : 12;
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 137.5;
    const cycle = (time * 0.8 + i * 0.3) % 1;
    const px = foreheadX + Math.sin(seed + time * 0.5) * (faceWidth * 0.8);
    const py = foreheadY - cycle * (height * 0.45);
    const pScale = (faceWidth * 0.06) * (1 - cycle * 0.5);
    const pOpacity = (1 - cycle) * (0.4 + Math.sin(time * 4 + i) * 0.4);
    const pAngle = Math.sin(time * 2 + seed) * 0.3;

    drawHeartShape(ctx, px, py, pScale, pAngle, pOpacity);
  }

  // 4. Extra Sparkles on Smile
  if (smileRatio > 0.3 || isCapturing) {
    const sparkleCount = 6;
    for (let i = 0; i < sparkleCount; i++) {
      const sx = foreheadX + Math.cos(i * 1.05 + time) * (faceWidth * 0.6);
      const sy = foreheadY + Math.sin(i * 1.05 + time * 1.5) * (faceHeight * 0.3);
      drawSparkleShape(ctx, sx, sy, faceWidth * 0.04, time + i);
    }
  }

  ctx.restore();
}

/**
 * Draw vector heart shape on canvas
 */
function drawHeartShape(ctx, x, y, size, rotation, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  // Gradient fill for 3D glossy heart look
  const gradient = ctx.createLinearGradient(-size, -size, size, size);
  gradient.addColorStop(0, '#ff4b72');
  gradient.addColorStop(0.5, '#ff758c');
  gradient.addColorStop(1, '#ff9a9e');

  ctx.fillStyle = gradient;
  ctx.shadowColor = 'rgba(255, 75, 114, 0.4)';
  ctx.shadowBlur = size * 0.4;

  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
  ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, topCurveHeight);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draw twinkling sparkle star
 */
function drawSparkleShape(ctx, x, y, radius, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * 2);
  ctx.fillStyle = '#fff59d';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 8;

  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    ctx.lineTo(Math.cos((i * Math.PI) / 2) * radius, Math.sin((i * Math.PI) / 2) * radius);
    ctx.lineTo((Math.cos((i * Math.PI) / 2 + Math.PI / 4) * radius) / 3, (Math.sin((i * Math.PI) / 2 + Math.PI / 4) * radius) / 3);
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
