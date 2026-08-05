import { drawHearts } from './drawHearts';
import { drawDog } from './drawDog';
import { drawSakura } from './drawSakura';
import { drawGlitter } from './drawGlitter';
import {
  drawBunny,
  drawCat,
  drawFox,
  drawCrown,
  drawGrad,
  drawSunglasses,
  drawSanta,
  drawHalloween,
  drawChristmas,
  drawWedding,
  drawWings,
  drawFire,
  drawLightning,
  drawRainbow,
  drawBird,
} from './drawFutureFilters';

/**
 * Render active AR Face Filter overlay onto target canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - Target canvas 2D context
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @param {object} transform - Output of calculateFaceTransform
 * @param {string} activeARFilter - Active AR filter ID ('hearts', 'dog', 'sakura', 'glitter', etc)
 * @param {number} timestamp - Animation frame timestamp
 * @param {boolean} isCapturing - True if rendering captured photo
 */
export function renderAROverlay(
  ctx,
  width,
  height,
  transform,
  activeARFilter,
  timestamp = performance.now(),
  isCapturing = false,
  mirror = false,
) {
  if (!ctx || !activeARFilter || activeARFilter === 'none') return;

  switch (activeARFilter) {
    case 'hearts':
      drawHearts(ctx, transform, width, height, timestamp, isCapturing);
      break;
    case 'dog':
      drawDog(ctx, transform, width, height, timestamp, isCapturing);
      break;
    case 'sakura':
      drawSakura(ctx, transform, width, height, timestamp, isCapturing);
      break;
    case 'glitter':
      drawGlitter(ctx, transform, width, height, timestamp, isCapturing);
      break;
    case 'bunny':
      drawBunny(ctx, transform, width, height, timestamp);
      break;
    case 'cat':
      drawCat(ctx, transform, width, height, timestamp);
      break;
    case 'fox':
      drawFox(ctx, transform, width, height, timestamp);
      break;
    case 'crown':
      drawCrown(ctx, transform, timestamp);
      break;
    case 'grad':
      drawGrad(ctx, transform, timestamp);
      break;
    case 'sunglasses':
      drawSunglasses(ctx, transform, timestamp);
      break;
    case 'santa':
      drawSanta(ctx, transform, timestamp);
      break;
    case 'halloween':
      drawHalloween(ctx, transform, timestamp);
      break;
    case 'christmas':
      drawChristmas(ctx, transform, width, height, timestamp);
      break;
    case 'wedding':
      drawWedding(ctx, transform, width, height, timestamp, mirror);
      break;
    case 'wings':
      drawWings(ctx, transform, timestamp);
      break;
    case 'fire':
      drawFire(ctx, transform, width, height, timestamp);
      break;
    case 'lightning':
      drawLightning(ctx, transform, timestamp);
      break;
    case 'rainbow':
      drawRainbow(ctx, transform, width, height, timestamp);
      break;
    case 'bird':
      drawBird(ctx, transform, timestamp);
      break;
    default:
      break;
  }
}
