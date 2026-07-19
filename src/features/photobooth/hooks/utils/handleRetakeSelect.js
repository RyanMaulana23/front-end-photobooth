/**
 * Sets states to retake a photo in a specific slot.
 *
 * @param {number} index - Slot index to retake
 * @param {object} controls - Control methods and states
 */
export default function handleRetakeSelect(
  index,
  { setRetakeTarget, setCapturingIndex, setStep, setCountdown, STEPS },
) {
  setRetakeTarget(index);
  setCapturingIndex(index);
  setStep(STEPS.PHOTO_CAPTURE);
  setCountdown(-1);
}
