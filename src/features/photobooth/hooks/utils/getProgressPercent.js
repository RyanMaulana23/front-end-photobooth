/**
 * Calculates percentage progress of the photobooth flow.
 *
 * @param {number} step - Active step count (1-9)
 * @returns {number} percentage progress
 */
export default function getProgressPercent(step) {
  return Math.round((step / 9) * 100);
}
