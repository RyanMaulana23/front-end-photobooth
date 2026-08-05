/**
 * Render procedural vector elements for Future AR Face Filters.
 */

// 1. Bunny Ears & Pink Nose
export function drawBunny(ctx, transform) {
  const { foreheadX, foreheadY, noseX, noseY, faceWidth, faceHeight, angle } = transform;
  ctx.save();
  ctx.translate(foreheadX, foreheadY);
  ctx.rotate(angle);

  const earW = faceWidth * 0.24;
  const earH = faceHeight * 0.75;

  // Left Bunny Ear
  ctx.save();
  ctx.translate(-faceWidth * 0.25, -faceHeight * 0.1);
  ctx.rotate(-0.05);
  drawSingleBunnyEar(ctx, earW, earH);
  ctx.restore();

  // Right Bunny Ear
  ctx.save();
  ctx.translate(faceWidth * 0.25, -faceHeight * 0.1);
  ctx.rotate(0.05);
  drawSingleBunnyEar(ctx, earW, earH);
  ctx.restore();

  ctx.restore();

  // Pink nose
  ctx.save();
  ctx.translate(noseX, noseY);
  ctx.fillStyle = '#ff80ab';
  ctx.beginPath();
  ctx.ellipse(0, 0, faceWidth * 0.08, faceWidth * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSingleBunnyEar(ctx, w, h) {
  // Outer Ear (White)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.5, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner Ear (Pink)
  ctx.fillStyle = '#ff80ab';
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.5, w * 0.28, h * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
}

// 2. Pointy Cat Ears, Nose & Whiskers
export function drawCat(ctx, transform) {
  const { foreheadX, foreheadY, noseX, noseY, faceWidth, faceHeight, angle } = transform;
  ctx.save();
  ctx.translate(foreheadX, foreheadY);
  ctx.rotate(angle);

  const earSize = faceWidth * 0.35;

  // Left Pointy Ear
  ctx.fillStyle = '#455a64';
  ctx.beginPath();
  ctx.moveTo(-faceWidth * 0.45, 0);
  ctx.lineTo(-faceWidth * 0.15, 0);
  ctx.lineTo(-faceWidth * 0.38, -earSize);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff80ab';
  ctx.beginPath();
  ctx.moveTo(-faceWidth * 0.4, -2);
  ctx.lineTo(-faceWidth * 0.2, -2);
  ctx.lineTo(-faceWidth * 0.36, -earSize * 0.7);
  ctx.closePath();
  ctx.fill();

  // Right Pointy Ear
  ctx.fillStyle = '#455a64';
  ctx.beginPath();
  ctx.moveTo(faceWidth * 0.15, 0);
  ctx.lineTo(faceWidth * 0.45, 0);
  ctx.lineTo(faceWidth * 0.38, -earSize);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff80ab';
  ctx.beginPath();
  ctx.moveTo(faceWidth * 0.2, -2);
  ctx.lineTo(faceWidth * 0.4, -2);
  ctx.lineTo(faceWidth * 0.36, -earSize * 0.7);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Nose and Whiskers
  ctx.save();
  ctx.translate(noseX, noseY);
  ctx.rotate(angle);

  // Whiskers Left
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = faceWidth * 0.012;
  [-0.1, 0, 0.1].forEach((ang) => {
    ctx.beginPath();
    ctx.moveTo(-faceWidth * 0.1, faceHeight * 0.05);
    ctx.lineTo(-faceWidth * 0.48, faceHeight * 0.05 + ang * faceWidth * 0.5);
    ctx.stroke();
  });

  // Whiskers Right
  [-0.1, 0, 0.1].forEach((ang) => {
    ctx.beginPath();
    ctx.moveTo(faceWidth * 0.1, faceHeight * 0.05);
    ctx.lineTo(faceWidth * 0.48, faceHeight * 0.05 + ang * faceWidth * 0.5);
    ctx.stroke();
  });

  // Small nose
  ctx.fillStyle = '#ff4081';
  ctx.beginPath();
  ctx.arc(0, 0, faceWidth * 0.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3. Fox Orange Mask & Ears
export function drawFox(ctx, transform) {
  const { foreheadX, foreheadY, noseX, noseY, faceWidth, faceHeight, angle } = transform;
  ctx.save();

  // Orange Fox Ears
  ctx.save();
  ctx.translate(foreheadX, foreheadY);
  ctx.rotate(angle);
  ctx.fillStyle = '#ff6b35';

  const earSize = faceWidth * 0.38;
  // Left Ear
  ctx.beginPath();
  ctx.moveTo(-faceWidth * 0.46, 0);
  ctx.lineTo(-faceWidth * 0.12, 0);
  ctx.lineTo(-faceWidth * 0.38, -earSize);
  ctx.closePath();
  ctx.fill();

  // Right Ear
  ctx.beginPath();
  ctx.moveTo(faceWidth * 0.12, 0);
  ctx.lineTo(faceWidth * 0.46, 0);
  ctx.lineTo(faceWidth * 0.38, -earSize);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Fox Snout Mask
  ctx.save();
  ctx.translate(noseX, noseY);
  ctx.rotate(angle);

  // Orange base snout
  ctx.fillStyle = '#ff6b35';
  ctx.beginPath();
  ctx.moveTo(-faceWidth * 0.32, -faceHeight * 0.08);
  ctx.quadraticCurveTo(0, -faceHeight * 0.22, faceWidth * 0.32, -faceHeight * 0.08);
  ctx.lineTo(faceWidth * 0.22, faceHeight * 0.05);
  ctx.lineTo(0, faceHeight * 0.12);
  ctx.lineTo(-faceWidth * 0.22, faceHeight * 0.05);
  ctx.closePath();
  ctx.fill();

  // White cheeks
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-faceWidth * 0.18, -faceHeight * 0.02, faceWidth * 0.11, 0, Math.PI * 2);
  ctx.arc(faceWidth * 0.18, -faceHeight * 0.02, faceWidth * 0.11, 0, Math.PI * 2);
  ctx.fill();

  // Fox Nose Tip
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.arc(0, faceHeight * 0.06, faceWidth * 0.045, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 4. Golden Princess Crown
export function drawCrown(ctx, transform, timestamp = 0) {
  const { foreheadX, foreheadY, faceWidth, faceHeight, angle } = transform;
  const time = timestamp * 0.002;

  ctx.save();
  ctx.translate(foreheadX, foreheadY - faceHeight * 0.16); // Floats higher above head
  ctx.rotate(angle);

  // Sway crown gently
  ctx.translate(0, Math.sin(time * 2) * 5);

  const w = faceWidth * 0.76; // Larger crown
  const h = faceHeight * 0.28;

  // Gold crown path
  const gradient = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  gradient.addColorStop(0, '#ffd700');
  gradient.addColorStop(0.5, '#fff9db');
  gradient.addColorStop(1, '#ffa000');

  ctx.fillStyle = gradient;
  ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.moveTo(-w * 0.5, h * 0.4);
  ctx.lineTo(-w * 0.5, -h * 0.2);
  ctx.lineTo(-w * 0.25, h * 0.1);
  ctx.lineTo(0, -h * 0.5); // Center spike
  ctx.lineTo(w * 0.25, h * 0.1);
  ctx.lineTo(w * 0.5, -h * 0.2);
  ctx.lineTo(w * 0.5, h * 0.4);
  ctx.quadraticCurveTo(0, h * 0.55, -w * 0.5, h * 0.4);
  ctx.closePath();
  ctx.fill();

  // Little gems on spikes
  ctx.fillStyle = '#ffffff';
  [-w * 0.5, 0, w * 0.5].forEach((gemX, idx) => {
    ctx.beginPath();
    ctx.arc(gemX, idx === 1 ? -h * 0.55 : -h * 0.25, w * 0.05, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// 5. Graduation Hat (Toga cap)
export function drawGrad(ctx, transform) {
  const { foreheadX, foreheadY, faceWidth, faceHeight, angle } = transform;

  ctx.save();
  ctx.translate(foreheadX, foreheadY - faceHeight * 0.06);
  ctx.rotate(angle);

  const w = faceWidth * 0.95;
  const h = faceHeight * 0.16;

  // Hat Skull cap base
  ctx.fillStyle = '#1e272e';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.3, w * 0.35, h * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mortarboard Diamond top
  ctx.fillStyle = '#2f3542';
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.6);
  ctx.lineTo(w * 0.5, 0);
  ctx.lineTo(0, h * 0.6);
  ctx.lineTo(-w * 0.5, 0);
  ctx.closePath();
  ctx.fill();

  // Cap border highlight
  ctx.strokeStyle = '#57606f';
  ctx.lineWidth = w * 0.02;
  ctx.stroke();

  // Cap tassel button & thread
  ctx.fillStyle = '#ffa502';
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.038, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffa502';
  ctx.lineWidth = w * 0.015;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-w * 0.28, h * 0.1, -w * 0.32, h * 0.65);
  ctx.stroke();

  // Hanging tassel pom
  ctx.beginPath();
  ctx.arc(-w * 0.32, h * 0.65, w * 0.048, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 6. Cool Sunglasses
export function drawSunglasses(ctx, transform) {
  const { centerX, centerY, faceWidth, faceHeight, angle } = transform;

  ctx.save();
  // Align sunglasses directly on the eye center
  ctx.translate(centerX, centerY + faceHeight * 0.015);
  ctx.rotate(angle);

  const gWidth = faceWidth * 0.48; // Wider sunglasses
  const gHeight = faceHeight * 0.12;

  // Black lenses
  ctx.fillStyle = '#0f172a';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;

  // Left Lens
  ctx.beginPath();
  ctx.roundRect(-gWidth * 1.12, -gHeight * 0.5, gWidth, gHeight, gHeight * 0.45);
  ctx.fill();

  // Right Lens
  ctx.beginPath();
  ctx.roundRect(gWidth * 0.12, -gHeight * 0.5, gWidth, gHeight, gHeight * 0.45);
  ctx.fill();

  // Sunglasses bridge bar
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = faceWidth * 0.03;
  ctx.beginPath();
  ctx.moveTo(-gWidth * 0.2, -gHeight * 0.25);
  ctx.lineTo(gWidth * 0.2, -gHeight * 0.25);
  ctx.stroke();

  // Specular reflection shine
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = faceWidth * 0.018;
  ctx.beginPath();
  ctx.moveTo(-gWidth * 0.85, -gHeight * 0.2);
  ctx.lineTo(-gWidth * 0.65, gHeight * 0.18);
  ctx.moveTo(gWidth * 0.45, -gHeight * 0.2);
  ctx.lineTo(gWidth * 0.65, gHeight * 0.18);
  ctx.stroke();

  ctx.restore();
}

// 7. Santa Hat & White Beard & Red Nose
export function drawSanta(ctx, transform) {
  const { foreheadX, foreheadY, noseX, noseY, faceWidth, faceHeight, angle } = transform;

  ctx.save();

  // Santa Hat
  ctx.save();
  ctx.translate(foreheadX, foreheadY - faceHeight * 0.08); // Higher up
  ctx.rotate(angle);

  // Red cap - larger dimensions
  ctx.fillStyle = '#d63031';
  ctx.beginPath();
  ctx.moveTo(-faceWidth * 0.55, 0);
  ctx.quadraticCurveTo(0, -faceHeight * 0.55, faceWidth * 0.18, -faceHeight * 0.5);
  ctx.quadraticCurveTo(faceWidth * 0.52, -faceHeight * 0.25, faceWidth * 0.45, 0);
  ctx.closePath();
  ctx.fill();

  // White base fluffy border - wider
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-faceWidth * 0.62, -faceHeight * 0.08, faceWidth * 1.25, faceHeight * 0.18, faceHeight * 0.09);
  ctx.fill();

  // Fluffy white pompom at tip - larger
  ctx.beginPath();
  ctx.arc(faceWidth * 0.45, -faceHeight * 0.38, faceWidth * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Fluffy White Beard (overlapping solid circles)
  ctx.save();
  ctx.translate(noseX, noseY + faceHeight * 0.22);
  ctx.rotate(angle);

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 6;

  ctx.beginPath();
  // Left side cheeks
  ctx.arc(-faceWidth * 0.25, faceHeight * 0.1, faceWidth * 0.18, 0, Math.PI * 2);
  // Right side cheeks
  ctx.arc(faceWidth * 0.25, faceHeight * 0.1, faceWidth * 0.18, 0, Math.PI * 2);
  // Center chin circles
  ctx.arc(0, faceHeight * 0.25, faceWidth * 0.24, 0, Math.PI * 2);
  ctx.arc(-faceWidth * 0.12, faceHeight * 0.35, faceWidth * 0.22, 0, Math.PI * 2);
  ctx.arc(faceWidth * 0.12, faceHeight * 0.35, faceWidth * 0.22, 0, Math.PI * 2);
  ctx.arc(0, faceHeight * 0.45, faceWidth * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  

  // Specular highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-faceWidth * 0.03, -faceWidth * 0.03, faceWidth * 0.026, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// 8. Spooky Halloween Ghosts
export function drawHalloween(ctx, transform, timestamp = 0) {
  const { foreheadX, foreheadY, faceWidth, faceHeight, angle } = transform;
  const time = timestamp * 0.002;

  ctx.save();
  ctx.translate(foreheadX, foreheadY);
  ctx.rotate(angle);

  // Two floating ghosts on sides
  [1, -1].forEach((side, idx) => {
    ctx.save();
    const bx = side * faceWidth * 0.72;
    const by = -faceHeight * 0.15 + Math.sin(time * 2.5 + idx) * 12;

    ctx.translate(bx, by);

    // Ghost body
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.arc(0, 0, faceWidth * 0.15, Math.PI, 0);
    ctx.lineTo(faceWidth * 0.15, faceHeight * 0.22);
    // Wavy bottom
    ctx.quadraticCurveTo(faceWidth * 0.08, faceHeight * 0.15, 0, faceHeight * 0.22);
    ctx.quadraticCurveTo(-faceWidth * 0.08, faceHeight * 0.15, -faceWidth * 0.15, faceHeight * 0.22);
    ctx.closePath();
    ctx.fill();

    // Spooky eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-faceWidth * 0.04, -faceHeight * 0.02, faceWidth * 0.02, 0, Math.PI * 2);
    ctx.arc(faceWidth * 0.04, -faceHeight * 0.02, faceWidth * 0.02, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  ctx.restore();
}

// 9. Christmas Holly Leaves & Snow
// 9. Christmas Holly Leaves, Rudolph Nose & Snow
export function drawChristmas(ctx, transform, width, height, timestamp = 0) {
  const { noseX, noseY, faceWidth, faceHeight, angle } = transform;
  const time = timestamp * 0.002;

  ctx.save();

  // 1. Rudolph Red Nose & Holly Leaves anchored at Nose Tip
  ctx.save();
  ctx.translate(noseX, noseY);
  ctx.rotate(angle);

  // Shiny Red Rudolph Nose Tip
  ctx.fillStyle = '#ff2f2f';
  ctx.beginPath();
  ctx.arc(0, 0, faceWidth * 0.09, 0, Math.PI * 2);
  ctx.fill();

  // Specular shine on nose tip
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-faceWidth * 0.028, -faceWidth * 0.028, faceWidth * 0.025, 0, Math.PI * 2);
  ctx.fill();

  // Holly leaves resting above nose tip
  ctx.fillStyle = '#2ed573';
  ctx.beginPath();
  // Left leaf
  ctx.ellipse(-faceWidth * 0.12, -faceHeight * 0.08, faceWidth * 0.15, faceWidth * 0.07, -0.4, 0, Math.PI * 2);
  // Right leaf
  ctx.ellipse(faceWidth * 0.12, -faceHeight * 0.08, faceWidth * 0.15, faceWidth * 0.07, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Red berries
  ctx.fillStyle = '#ff4757';
  [-faceWidth * 0.035, 0, faceWidth * 0.035].forEach((bx, idx) => {
    ctx.beginPath();
    ctx.arc(bx, -faceHeight * 0.08 + (idx === 1 ? -faceWidth * 0.025 : 0), faceWidth * 0.045, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Snowfall particles
  const snowCount = 18;
  for (let i = 0; i < snowCount; i++) {
    const seed = i * 61.3;
    const progress = (time * 0.4 + i * 0.2) % 1;
    const sx = (Math.sin(seed + time) * 0.42 + 0.5) * width;
    const sy = progress * (height + 30) - 15;
    const size = 3 + (i % 3) * 3;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 10. Wedding Glowing Pink Neon "Just Married" Sign
export function drawWedding(ctx, transform, width, height, timestamp = 0, mirror = false) {
  const { foreheadX, foreheadY, faceWidth, faceHeight, angle } = transform;
  const time = timestamp * 0.002;

  ctx.save();

  // 1. Neon Sign floating above head
  ctx.save();
  ctx.translate(foreheadX, foreheadY - faceHeight * 0.42);
  ctx.rotate(angle);

  // Gentle float bobbing animation
  ctx.translate(0, Math.sin(time * 2.5) * 4);

  // If the canvas context is mirrored (flipped scaleX(-1)), un-mirror locally so text reads left-to-right
  if (mirror) {
    ctx.scale(-1, 1);
  }

  const fontSizeTop = faceWidth * 0.28;
  const fontSizeBottom = faceWidth * 0.35;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Layer 1: Pink Neon Shadow Glow
  ctx.shadowColor = '#ff2a6d';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ff758c';
  ctx.font = `bold ${fontSizeTop}px 'Dancing Script', 'Brush Script MT', 'Pacifico', cursive`;
  ctx.fillText('Just', 0, -faceHeight * 0.14);

  ctx.font = `bold ${fontSizeBottom}px 'Dancing Script', 'Brush Script MT', 'Pacifico', cursive`;
  ctx.fillText('Married', 0, faceHeight * 0.12);

  // Layer 2: White Core Neon Glow
  ctx.shadowColor = '#ff94b8';
  ctx.shadowBlur = 6;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${fontSizeTop}px 'Dancing Script', 'Brush Script MT', 'Pacifico', cursive`;
  ctx.fillText('Just', 0, -faceHeight * 0.14);

  ctx.font = `bold ${fontSizeBottom}px 'Dancing Script', 'Brush Script MT', 'Pacifico', cursive`;
  ctx.fillText('Married', 0, faceHeight * 0.12);

  // Glowing Neon Hearts on left & right
  ctx.strokeStyle = '#ff758c';
  ctx.lineWidth = faceWidth * 0.024;
  ctx.shadowColor = '#ff2a6d';
  ctx.shadowBlur = 14;

  // Left Heart
  ctx.save();
  ctx.translate(-faceWidth * 0.42, -faceHeight * 0.16);
  ctx.rotate(-0.25);
  drawNeonHeart(ctx, faceWidth * 0.12);
  ctx.restore();

  // Right Heart
  ctx.save();
  ctx.translate(faceWidth * 0.42, -faceHeight * 0.08);
  ctx.rotate(0.25);
  drawNeonHeart(ctx, faceWidth * 0.12);
  ctx.restore();

  ctx.restore();

  // 2. Rose petals / sparkles falling
  const petalCount = 15;
  for (let i = 0; i < petalCount; i++) {
    const seed = i * 78.4;
    const progress = (time * 0.35 + i * 0.3) % 1;
    const px = (Math.sin(seed + time * 0.8) * 0.45 + 0.5) * width;
    const py = progress * (height + 40) - 20;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(time + seed);
    ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.85;

    ctx.fillStyle = '#ff758c';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawNeonHeart(ctx, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, topCurveHeight / 2, 0, size);
  ctx.bezierCurveTo(size, topCurveHeight / 2, size / 2, -topCurveHeight, 0, topCurveHeight);
  ctx.closePath();
  ctx.stroke();
}

// 11. Glowing Angel Wings (Send to Back Design)
export function drawWings(ctx, transform, timestamp = 0) {
  const { centerX, centerY, foreheadX, foreheadY, faceWidth, faceHeight, angle } = transform;
  const time = timestamp * 0.002;

  // 1. Draw Golden Halo (Yellow Ring in perspective) above the top of the head
  // Anchor: top of head with Offset Y (-0.48 of head height)
  ctx.save();
  ctx.translate(foreheadX, foreheadY - faceHeight * 0.48);
  ctx.rotate(angle);
  
  // Bobbing float animation for halo
  ctx.translate(0, Math.sin(time * 3) * 4);

  ctx.strokeStyle = '#ffd700'; // Bright gold
  ctx.lineWidth = faceWidth * 0.055;
  ctx.shadowColor = '#fff9db';
  ctx.shadowBlur = 14;

  ctx.beginPath();
  // Draw an ellipse representing the halo ring in 3D perspective
  ctx.ellipse(0, 0, faceWidth * 0.36, faceWidth * 0.11, -0.05, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Draw Angel Wings snugly behind shoulder contours (closer to shoulders & prominent)
  const shoulderOffsetY = faceHeight * 0.55;
  const shoulderOffsetX = faceWidth * 1.15;

  const cosA = Math.cos(angle * 0.4);
  const sinA = Math.sin(angle * 0.4);

  // Left shoulder anchor (snug behind shoulder edge)
  const leftX = centerX - shoulderOffsetX * cosA - shoulderOffsetY * sinA;
  const leftY = centerY - shoulderOffsetX * sinA + shoulderOffsetY * cosA;

  // Right shoulder anchor (snug behind shoulder edge)
  const rightX = centerX + shoulderOffsetX * cosA - shoulderOffsetY * sinA;
  const rightY = centerY + shoulderOffsetX * sinA + shoulderOffsetY * cosA;

  // Soft wing flap animation
  const flap = Math.sin(time * 3.5) * 0.05;

  // Left Wing (positioned snugly behind left shoulder)
  ctx.save();
  ctx.translate(leftX, leftY);
  ctx.rotate(-0.35 + angle * 0.4 + flap);
  drawCartoonWing(ctx, faceWidth * 1.45, faceHeight * 1.1);
  ctx.restore();

  // Right Wing (positioned snugly behind right shoulder, flipped horizontally)
  ctx.save();
  ctx.translate(rightX, rightY);
  ctx.scale(-1, 1);
  ctx.rotate(-0.35 - angle * 0.4 + flap);
  drawCartoonWing(ctx, faceWidth * 1.45, faceHeight * 1.1);
  ctx.restore();
}

function drawCartoonWing(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = 'rgba(227, 242, 253, 0.92)'; // Soft baby blue fill
  ctx.strokeStyle = '#64b5f6'; // Bright clean blue outline
  ctx.lineWidth = w * 0.05;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(100, 181, 246, 0.35)';

  ctx.beginPath();
  ctx.moveTo(0, 0);
  // Drawing fluffy rounded feather lobes extending strictly outwards away from the body
  ctx.quadraticCurveTo(-w * 0.4, -h * 0.5, -w * 0.85, -h * 0.25);
  ctx.quadraticCurveTo(-w * 1.0, 0, -w * 0.9, h * 0.25);
  ctx.quadraticCurveTo(-w * 0.75, h * 0.45, -w * 0.55, h * 0.35);
  ctx.quadraticCurveTo(-w * 0.5, h * 0.58, -w * 0.3, h * 0.45);
  ctx.quadraticCurveTo(-w * 0.2, h * 0.6, 0, h * 0.35);
  ctx.quadraticCurveTo(0, h * 0.1, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner feather curve details
  ctx.strokeStyle = 'rgba(100, 181, 246, 0.75)';
  ctx.lineWidth = w * 0.035;
  ctx.beginPath();
  ctx.moveTo(-w * 0.3, -h * 0.1);
  ctx.quadraticCurveTo(-w * 0.5, 0, -w * 0.7, h * 0.1);
  ctx.moveTo(-w * 0.2, h * 0.12);
  ctx.quadraticCurveTo(-w * 0.4, h * 0.2, -w * 0.5, h * 0.22);
  ctx.stroke();

  ctx.restore();
}

// 12. Fire Aura
export function drawFire(ctx, transform, width, height, timestamp = 0) {
  const { foreheadX, foreheadY, faceWidth, faceHeight } = transform;
  const time = timestamp * 0.002;

  ctx.save();
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 29.8;
    const progress = (time * 0.85 + i * 0.15) % 1;
    const px = foreheadX + (Math.sin(seed + time * 2) * 0.65) * faceWidth;
    const py = (foreheadY + faceHeight * 0.4) - progress * (faceHeight * 1.25);
    const size = (faceWidth * 0.12) * (1 - progress);

    ctx.save();
    ctx.translate(px, py);
    ctx.globalAlpha = (1 - progress) * 0.9;
    ctx.shadowBlur = size * 1.5;

    const colorVal = i % 3;
    const color = colorVal === 0 ? '#ff9f43' : colorVal === 1 ? '#ff5252' : '#ffea00';
    ctx.fillStyle = color;
    ctx.shadowColor = color;

    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// 13. Electric Lightning Bolts
export function drawLightning(ctx, transform, timestamp = 0) {
  const { foreheadX, foreheadY, faceWidth, faceHeight, angle } = transform;
  const time = timestamp * 0.002;

  const flashActive = Math.sin(time * 6) > 0.65;
  if (!flashActive) return;

  ctx.save();
  ctx.translate(foreheadX, foreheadY + faceHeight * 0.15);
  ctx.rotate(angle);

  ctx.strokeStyle = '#00d2d3';
  ctx.shadowColor = '#00d2d3';
  ctx.shadowBlur = 18;
  ctx.lineWidth = faceWidth * 0.024;

  // Left Eye Lightning
  ctx.save();
  ctx.translate(-faceWidth * 0.22, 0);
  drawBolt(ctx, faceWidth * 0.25);
  ctx.restore();

  // Right Eye Lightning
  ctx.save();
  ctx.translate(faceWidth * 0.22, 0);
  drawBolt(ctx, faceWidth * 0.25);
  ctx.restore();

  ctx.restore();
}

function drawBolt(ctx, len) {
  ctx.beginPath();
  ctx.moveTo(0, -len * 0.5);
  ctx.lineTo(-len * 0.3, 0);
  ctx.lineTo(len * 0.1, -len * 0.05);
  ctx.lineTo(-len * 0.2, len * 0.6);
  ctx.stroke();
}

// 14. Curved Rainbow & Confetti
export function drawRainbow(ctx, transform, width, height, timestamp = 0) {
  const { foreheadX, foreheadY, faceWidth, faceHeight, angle } = transform;
  const time = timestamp * 0.002;

  ctx.save();

  // Rainbow Arch above head
  ctx.save();
  ctx.translate(foreheadX, foreheadY - faceHeight * 0.08);
  ctx.rotate(angle);

  const colors = ['#ff4757', '#ffa502', '#ffa502', '#2ed573', '#1e90ff', '#3742fa', '#9b59b6'];
  const baseRadius = faceWidth * 0.46;
  const strokeW = faceWidth * 0.038;

  ctx.shadowBlur = 8;
  ctx.shadowColor = 'rgba(255,255,255,0.45)';

  colors.forEach((color, idx) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.arc(0, faceHeight * 0.18, baseRadius + idx * strokeW, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();
  });
  ctx.restore();

  // Confetti particles loop
  const particleCount = 20;
  const confettiColors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#eccc68', '#ff7f50'];

  for (let i = 0; i < particleCount; i++) {
    const seed = i * 48.6;
    const progress = (time * 0.45 + i * 0.18) % 1;
    const px = (Math.sin(seed + time * 0.5) * 0.48 + 0.5) * width;
    const py = progress * (height + 20) - 10;
    const size = 6 + (i % 3) * 3;
    const color = confettiColors[i % confettiColors.length];

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(time * (1 + (i % 2)) + seed);
    ctx.fillStyle = color;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }

  ctx.restore();
}

/// 15. Boothcool 360-Degree Orbiting Multi-Bird Filter
export function drawBird(ctx, transform, timestamp = 0) {
  const { foreheadX, foreheadY, faceWidth, faceHeight, angle } = transform;
  const time = timestamp * 0.002;

  ctx.save();
  // Orbit ring center above head
  ctx.translate(foreheadX, foreheadY - faceHeight * 0.45);
  ctx.rotate(angle);

  const numBirds = 6;
  const radiusX = faceWidth * 0.65;
  const radiusY = faceHeight * 0.22;
  const baseW = faceWidth * 0.22;
  const baseH = faceHeight * 0.18;

  // Calculate 3D positions for all 6 birds to sort by Z-depth (back-to-front rendering)
  const birds = [];
  for (let i = 0; i < numBirds; i++) {
    const orbitAngle = (timestamp * 0.0016) + (i / numBirds) * Math.PI * 2;
    const zDepth = Math.sin(orbitAngle); // -1 (back) to +1 (front)
    const bx = Math.cos(orbitAngle) * radiusX;
    const by = Math.sin(orbitAngle) * radiusY;
    const scale = 0.72 + 0.35 * ((zDepth + 1) / 2);
    const alpha = 0.65 + 0.35 * ((zDepth + 1) / 2);
    const isMovingLeft = Math.sin(orbitAngle + Math.PI / 2) < 0;

    birds.push({
      bx,
      by,
      zDepth,
      scale,
      alpha,
      isMovingLeft,
      phase: i * 1.2,
    });
  }

  // Sort by zDepth so background birds are drawn behind foreground birds
  birds.sort((a, b) => a.zDepth - b.zDepth);

  // Render each orbiting bird
  birds.forEach((bird) => {
    ctx.save();
    ctx.translate(bird.bx, bird.by);
    ctx.globalAlpha = bird.alpha;
    ctx.scale(bird.scale * (bird.isMovingLeft ? -1 : 1), bird.scale);

    drawSingleBoothcoolBird(ctx, baseW, baseH, time, bird.phase);
    ctx.restore();
  });

  ctx.restore();
}

function drawSingleBoothcoolBird(ctx, w, h, time, phase = 0) {
  ctx.save();

  // Dynamic wing flap angle
  const flapAngle = Math.sin(time * 10 + phase) * 0.35;

  // 1. Back Wing
  ctx.save();
  ctx.translate(-w * 0.05, -h * 0.15);
  ctx.rotate(-0.4 + flapAngle * 0.7);
  ctx.fillStyle = '#0288d1';
  ctx.beginPath();
  ctx.ellipse(-w * 0.05, -h * 0.25, w * 0.25, h * 0.45, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Tail Feathers
  ctx.fillStyle = '#29b6f6';
  ctx.beginPath();
  ctx.ellipse(-w * 0.45, h * 0.05, w * 0.25, h * 0.09, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // 3. Main Body
  ctx.fillStyle = '#29b6f6';
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.42, h * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. Light Blue Belly Patch
  ctx.fillStyle = '#e1f5fe';
  ctx.beginPath();
  ctx.ellipse(w * 0.08, h * 0.12, w * 0.26, h * 0.22, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // 5. Head & Eye
  ctx.fillStyle = '#29b6f6';
  ctx.beginPath();
  ctx.arc(w * 0.25, -h * 0.1, w * 0.24, 0, Math.PI * 2);
  ctx.fill();

  // Eye (White circle + Black pupil)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(w * 0.28, -h * 0.15, w * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(w * 0.3, -h * 0.15, w * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // Specular shine in pupil
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(w * 0.31, -h * 0.17, w * 0.015, 0, Math.PI * 2);
  ctx.fill();

  // 6. Orange Beak
  ctx.fillStyle = '#ff9800';
  ctx.beginPath();
  ctx.moveTo(w * 0.45, -h * 0.08);
  ctx.lineTo(w * 0.68, 0);
  ctx.lineTo(w * 0.42, h * 0.08);
  ctx.closePath();
  ctx.fill();

  // 7. Front Wing
  ctx.save();
  ctx.translate(0, -h * 0.05);
  ctx.rotate(-0.3 + flapAngle);
  ctx.fillStyle = '#0288d1';
  ctx.beginPath();
  ctx.ellipse(-w * 0.05, -h * 0.3, w * 0.28, h * 0.5, -0.25, 0, Math.PI * 2);
  ctx.fill();

  // Wing highlight line
  ctx.strokeStyle = '#81d4fa';
  ctx.lineWidth = w * 0.04;
  ctx.beginPath();
  ctx.ellipse(-w * 0.05, -h * 0.3, w * 0.18, h * 0.35, -0.25, 0.4, Math.PI * 1.2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}
