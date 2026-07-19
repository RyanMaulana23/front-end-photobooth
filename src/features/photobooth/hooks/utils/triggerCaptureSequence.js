/**
 * Triggers the photo capture countdown sequence for a specific slot.
 *
 * @param {number} index - Slot index to capture
 * @param {object} controls - Control methods and states
 */
export default function triggerCaptureSequence(
  index,
  { setCapturingIndex, setCountdown, countdownTime },
) {
  setCapturingIndex(index);
  setCountdown(countdownTime);
}
