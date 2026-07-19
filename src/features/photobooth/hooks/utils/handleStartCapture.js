import { getMaxPhotos } from '../../../../constants/photobooth';

/**
 * Initializes the photo capture session state.
 *
 * @param {object} controls - React state setters and values
 */
export default function handleStartCapture({
  template,
  setPhotos,
  setRetakeTarget,
  setCapturingIndex,
  setStep,
  setCountdown,
  STEPS,
}) {
  const max = getMaxPhotos(template);
  setPhotos(Array(max).fill(null));
  setRetakeTarget(null);
  setCapturingIndex(0);
  setStep(STEPS.PHOTO_CAPTURE);
  setCountdown(-1);
}
