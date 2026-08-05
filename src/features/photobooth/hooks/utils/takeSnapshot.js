import {
  FILTERS,
  LAYOUT_CONFIGS,
  getMaxPhotos,
} from '../../../../constants/photobooth';
import { drawMockAvatar } from '../../utils/mockAvatar';
import { playShutterSound } from '../../../../utils/audio';
import { calculateFaceTransform } from '../../utils/ar/calculateFaceTransform';
import { renderAROverlay } from '../../utils/ar/renderAROverlay';

/**
 * Maps face transform from video coordinate space to cover-cropped canvas coordinates.
 */
function mapTransformToCanvas(
  transform,
  sx,
  sy,
  sw,
  sh,
  canvasWidth,
  canvasHeight,
) {
  if (!transform) return null;
  const scale = canvasWidth / sw;
  return {
    ...transform,
    centerX: (transform.centerX - sx) * scale,
    centerY: (transform.centerY - sy) * scale,
    foreheadX: (transform.foreheadX - sx) * scale,
    foreheadY: (transform.foreheadY - sy) * scale,
    noseX: (transform.noseX - sx) * scale,
    noseY: (transform.noseY - sy) * scale,
    faceWidth: transform.faceWidth * scale,
    faceHeight: transform.faceHeight * scale,
  };
}

/**
 * Capture frame from live camera stream with AR Overlay and Color Filter.
 *
 * @param {object} params - State getters and setters for the snapshot
 */
export default function takeSnapshot({
  flashEnabled,
  setFlash,
  activeFilter,
  activeARFilter,
  faceTransformRef,
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

  const video = videoRef.current;
  const vWidth = video?.videoWidth ?? 0;
  const vHeight = video?.videoHeight ?? 0;
  const hasVideoFrame = hasCamera && video && vWidth > 0 && vHeight > 0;

  const canvas = document.createElement('canvas');
  canvas.width = slot.w;
  canvas.height = slot.h;

  const ctx = canvas.getContext('2d');

  if (hasVideoFrame) {
    const canvasRatio = canvas.width / canvas.height;
    const videoRatio = vWidth / vHeight;
    let sx = 0;
    let sy = 0;
    let sw = vWidth;
    let sh = vHeight;

    if (videoRatio > canvasRatio) {
      sw = vHeight * canvasRatio;
      sx = (vWidth - sw) / 2;
    } else {
      sh = vWidth / canvasRatio;
      sy = (vHeight - sh) / 2;
    }

    ctx.save();
    ctx.filter = filterVal;
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 2. Render AR Overlay on top of captured photo with mapped face transform
    if (activeARFilter && activeARFilter !== 'none') {
      const originalTransforms = Array.isArray(faceTransformRef?.current)
        ? faceTransformRef.current
        : [calculateFaceTransform(null, vWidth, vHeight, performance.now())];

      ctx.save();
      if (mirror) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      originalTransforms.forEach((origTransform) => {
        const mappedTransform = mapTransformToCanvas(
          origTransform,
          sx,
          sy,
          sw,
          sh,
          canvas.width,
          canvas.height,
        );
        renderAROverlay(
          ctx,
          canvas.width,
          canvas.height,
          mappedTransform,
          activeARFilter,
          performance.now(),
          true,
          mirror,
        );
      });

      ctx.restore();
    }
  } else {
    ctx.filter = filterVal;
    drawMockAvatar(ctx, slot.w, slot.h, simulatedAvatarSeed, capturingIndex);

    if (activeARFilter && activeARFilter !== 'none') {
      const transform = calculateFaceTransform(
        null,
        slot.w,
        slot.h,
        performance.now(),
      );
      renderAROverlay(
        ctx,
        slot.w,
        slot.h,
        transform,
        activeARFilter,
        performance.now(),
        true,
      );
    }
  }

  photoData = canvas.toDataURL('image/png');

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
