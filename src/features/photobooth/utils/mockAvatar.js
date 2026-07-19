/**
 * Draws a cute animated vector placeholder on the canvas context when camera is offline.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} width - Slot width
 * @param {number} height - Slot height
 * @param {number} seed - Animation tick seed
 * @param {number} slotIndex - Current capturing slot index (0-based)
 */
export function drawMockAvatar(ctx, width, height, seed, slotIndex) {
  // 1. Draw gradient background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#fbcfe8');
  grad.addColorStop(1, '#fef08a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw avatar body/head
  ctx.beginPath();
  ctx.arc(
    width / 2,
    height * 0.45,
    Math.min(width, height) * 0.25,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = '#ec4899';
  ctx.fill();

  // 3. Draw outer eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(
    width * 0.43,
    height * 0.42,
    Math.min(width, height) * 0.04,
    0,
    Math.PI * 2,
  );
  ctx.arc(
    width * 0.57,
    height * 0.42,
    Math.min(width, height) * 0.04,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // 4. Draw pupils (moving eyes based on seed)
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(
    width * 0.43 + Math.sin(seed / 10) * 1.5,
    height * 0.42,
    Math.min(width, height) * 0.015,
    0,
    Math.PI * 2,
  );
  ctx.arc(
    width * 0.57 + Math.sin(seed / 10) * 1.5,
    height * 0.42,
    Math.min(width, height) * 0.015,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // 5. Draw mouth/smile
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = Math.max(3, Math.round(Math.min(width, height) * 0.025));
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(width / 2, height * 0.48, Math.min(width, height) * 0.09, 0, Math.PI);
  ctx.stroke();

  // 6. Draw decorations/emojis
  ctx.fillStyle = '#fff';
  ctx.font = `${Math.max(12, Math.round(width * 0.07))}px sans-serif`;
  ctx.fillText('✨', width * 0.15, height * 0.25);
  ctx.fillText('💫', width * 0.78, height * 0.3);
  ctx.fillText('✌️', width * 0.18, height * 0.8);
  ctx.fillText('🌸', width * 0.75, height * 0.75);

  // 7. Draw slot label text
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.font = `bold ${Math.max(10, Math.round(width * 0.045))}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(`SLOT #${slotIndex + 1}`, width / 2, height * 0.92);
}
