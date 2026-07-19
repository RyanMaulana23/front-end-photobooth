import {
  FILTERS,
  LAYOUT_CONFIGS,
  getMaxPhotos,
} from '../../../../constants/photobooth';
import { drawMockAvatar } from '../../utils/mockAvatar';
import { playShutterSound } from '../../../../utils/audio';

/**
 * Capture frame from live camera stream or draw mock visual when offline.
 *
 * @param {object} params - State getters and setters for the snapshot
 */
export default function takeSnapshot({
  flashEnabled,
  setFlash,
  activeFilter,
  template,
  capturingIndex,
  hasCamera,
  videoRef,
  mirror,
  simulatedAvatarSeed,
  setPhotos,
  retakeTarget,
  setRetakeTarget,
  setStep,
  setCountdown,
  setCapturingIndex,
  nextPhotoTimeoutRef,
  countdownTime,
  STEPS,
}) {
  // 1. Shutter sound & Flash overlay trigger
  if (flashEnabled) {
    setFlash(true);
    playShutterSound();
    setTimeout(() => setFlash(false), 200);
  } else {
    playShutterSound();
  }

  let photoData = '';
  const config = LAYOUT_CONFIGS[template];
  const slot = config.slots[capturingIndex];
  const filterVal =
    FILTERS.find((f) => f.id === activeFilter)?.canvasFilter || 'none';

  if (hasCamera && videoRef.current) {
    // 2. Render actual camera frame onto canvas slot
    const canvas = document.createElement('canvas');
    canvas.width = slot.w;
    canvas.height = slot.h;
    const ctx = canvas.getContext('2d');
    ctx.filter = filterVal;

    const video = videoRef.current;
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;
    const slotAspect = slot.w / slot.h;
    const videoAspect = vWidth / vHeight;

    let sx = 0,
      sy = 0,
      sw = vWidth,
      sh = vHeight;

    if (videoAspect > slotAspect) {
      sw = vHeight * slotAspect;
      sh = vHeight;
      sx = (vWidth - sw) / 2;
    } else {
      sw = vWidth;
      sh = vWidth / slotAspect;
      sy = (vHeight - sh) / 2;
    }

    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, slot.w, slot.h);
    photoData = canvas.toDataURL('image/png');
  } else {
    // 3. Render animated mock visual placeholder
    const canvas = document.createElement('canvas');
    canvas.width = slot.w;
    canvas.height = slot.h;
    const ctx = canvas.getContext('2d');
    ctx.filter = filterVal;

    drawMockAvatar(ctx, slot.w, slot.h, simulatedAvatarSeed, capturingIndex);
    photoData = canvas.toDataURL('image/png');
  }

  // 4. Save photo data
  setPhotos((prev) => {
    const next = [...prev];
    next[capturingIndex] = photoData;
    return next;
  });

  // 5. Navigate to preview or queue next capture slot
  if (retakeTarget !== null) {
    setRetakeTarget(null);
    setStep(STEPS.PREVIEW);
  } else {
    const nextIndex = capturingIndex + 1;
    if (nextIndex < getMaxPhotos(template)) {
      setCapturingIndex(nextIndex);
      setCountdown(-1);

      if (nextPhotoTimeoutRef.current) {
        clearTimeout(nextPhotoTimeoutRef.current);
      }

      nextPhotoTimeoutRef.current = setTimeout(() => {
        setCountdown(countdownTime);
      }, 1800);
    } else {
      setStep(STEPS.PREVIEW);
    }
  }
}
