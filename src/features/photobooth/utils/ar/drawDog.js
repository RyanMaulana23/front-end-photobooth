/**
 * Render Dog AR Filter onto canvas:
 * - Floppy Dog Ears (bouncing with movement)
 * - Puppy Dog Nose at nose tip
 * - Animated Pink Tongue (appears when mouth opens)
 * - Cheerful cheek freckles
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} transform - Output from calculateFaceTransform
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} timestamp - Animation timestamp in ms
 */
export function drawDog(ctx, transform, width, height, timestamp = 0) {
  const { foreheadX, foreheadY, noseX, noseY, faceWidth, faceHeight, angle, mouthOpenRatio } = transform;
  const time = timestamp * 0.002;

  ctx.save();

  // 1. Dog Ears (Left & Right Floppy Ears)
  ctx.save();
  ctx.translate(foreheadX, foreheadY);
  ctx.rotate(angle);

  const earWidth = faceWidth * 0.36;
  const earHeight = faceHeight * 0.48;
  const earYOffset = -faceHeight * 0.12;

  // Gentle bouncing angle based on movement/time
  const earBounceLeft = Math.sin(time * 4) * 0.08;
  const earBounceRight = Math.cos(time * 4) * 0.08;

  // Left Ear
  drawDogEar(ctx, -faceWidth * 0.42, earYOffset, earWidth, earHeight, -0.25 + earBounceLeft, true);

  // Right Ear
  drawDogEar(ctx, faceWidth * 0.42, earYOffset, earWidth, earHeight, 0.25 + earBounceRight, false);

  ctx.restore();

  // 2. Dog Nose (Centered on nose tip)
  ctx.save();
  ctx.translate(noseX, noseY);
  ctx.rotate(angle);

  const noseWidth = faceWidth * 0.28;
  const noseHeight = faceWidth * 0.22;

  // Soft brown dog nose shape with highlight
  ctx.fillStyle = '#4a2c11';
  ctx.shadowColor = 'rgba(74, 44, 17, 0.3)';
  ctx.shadowBlur = 6;

  ctx.beginPath();
  ctx.ellipse(0, 0, noseWidth * 0.5, noseHeight * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Darker nose tip bottom
  ctx.fillStyle = '#2d1806';
  ctx.beginPath();
  ctx.ellipse(0, noseHeight * 0.15, noseWidth * 0.38, noseHeight * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // White specular shine highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.ellipse(-noseWidth * 0.15, -noseHeight * 0.15, noseWidth * 0.12, noseHeight * 0.08, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 3. Cute Cheek Freckles
  ctx.save();
  ctx.translate(noseX, noseY);
  ctx.rotate(angle);
  ctx.fillStyle = '#8b5a2b';
  ctx.globalAlpha = 0.55;

  const freckleOffsets = [
    { x: -faceWidth * 0.22, y: faceHeight * 0.05 },
    { x: -faceWidth * 0.26, y: faceHeight * 0.08 },
    { x: -faceWidth * 0.2, y: faceHeight * 0.11 },
    { x: faceWidth * 0.22, y: faceHeight * 0.05 },
    { x: faceWidth * 0.26, y: faceHeight * 0.08 },
    { x: faceWidth * 0.2, y: faceHeight * 0.11 },
  ];

  freckleOffsets.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, faceWidth * 0.012, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 4. Animated Dog Tongue (Appears when mouth is open)
  if (mouthOpenRatio > 0.18) {
    ctx.save();
    const mouthY = noseY + faceHeight * 0.25;
    ctx.translate(noseX, mouthY);
    ctx.rotate(angle);

    // Smooth tongue extend animation based on mouthOpenRatio
    const tongueProgress = Math.min((mouthOpenRatio - 0.18) * 2.2, 1);
    const tongueWidth = faceWidth * 0.24 * tongueProgress;
    const tongueHeight = faceHeight * 0.32 * tongueProgress;

    // Pink tongue body
    const gradient = ctx.createLinearGradient(0, 0, 0, tongueHeight);
    gradient.addColorStop(0, '#ff6b81');
    gradient.addColorStop(0.7, '#ff4757');
    gradient.addColorStop(1, '#e84118');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(-tongueWidth * 0.45, 0);
    ctx.quadraticCurveTo(-tongueWidth * 0.55, tongueHeight * 0.7, 0, tongueHeight);
    ctx.quadraticCurveTo(tongueWidth * 0.55, tongueHeight * 0.7, tongueWidth * 0.45, 0);
    ctx.closePath();
    ctx.fill();

    // Center tongue line
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = Math.max(1, faceWidth * 0.01);
    ctx.beginPath();
    ctx.moveTo(0, tongueHeight * 0.15);
    ctx.lineTo(0, tongueHeight * 0.75);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draw floppy dog ear
 */
function drawDogEar(ctx, x, y, width, height, rotation, isLeft) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Main ear outer shape (brown fur)
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#795548');
  gradient.addColorStop(0.6, '#5d4037');
  gradient.addColorStop(1, '#4e342e');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    isLeft ? -width * 0.8 : width * 0.8,
    height * 0.2,
    isLeft ? -width * 0.6 : width * 0.6,
    height,
    0,
    height,
  );
  ctx.bezierCurveTo(
    isLeft ? width * 0.4 : -width * 0.4,
    height * 0.8,
    isLeft ? width * 0.2 : -width * 0.2,
    height * 0.3,
    0,
    0,
  );
  ctx.closePath();
  ctx.fill();

  // Inner ear pink flap
  ctx.fillStyle = '#ff80ab';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.15);
  ctx.bezierCurveTo(
    isLeft ? -width * 0.4 : width * 0.4,
    height * 0.3,
    isLeft ? -width * 0.3 : width * 0.3,
    height * 0.8,
    0,
    height * 0.8,
  );
  ctx.bezierCurveTo(
    isLeft ? width * 0.2 : -width * 0.2,
    height * 0.6,
    0,
    height * 0.3,
    0,
    height * 0.15,
  );
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
