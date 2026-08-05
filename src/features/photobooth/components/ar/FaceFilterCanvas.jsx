import { useEffect, useRef } from 'react';
import { renderAROverlay } from '../../utils/ar/renderAROverlay';
import { calculateFaceTransform } from '../../utils/ar/calculateFaceTransform';

/**
 * Overlay Canvas Component that renders active AR Face Filter over the camera stream.
 *
 * @param {string} activeARFilter - Active AR filter ID ('hearts', 'dog', 'sakura', 'glitter')
 * @param {React.RefObject} videoRef - Video element ref
 * @param {React.RefObject} faceTransformRef - Shared face tracking ref containing latest landmarks
 * @param {boolean} mirror - True if camera is mirrored
 */
export default function FaceFilterCanvas({
  activeARFilter,
  videoRef,
  faceTransformRef,
  mirror = true,
}) {
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    if (!activeARFilter || activeARFilter === 'none') {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderLoop = (timestamp) => {
      const video = videoRef?.current;
      const ctx = canvas.getContext('2d');

      if (video && video.readyState >= 2) {
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.clearRect(0, 0, width, height);

        // Retrieve all face transforms from tracking hook or fallback procedurally
        const transforms = Array.isArray(faceTransformRef?.current)
          ? faceTransformRef.current
          : [calculateFaceTransform(null, width, height, timestamp)];

        ctx.save();
        if (mirror) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }

        transforms.forEach((transform) => {
          renderAROverlay(
            ctx,
            width,
            height,
            transform,
            activeARFilter,
            timestamp,
            false,
            mirror,
          );
        });
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [activeARFilter, videoRef, faceTransformRef, mirror]);

  if (!activeARFilter || activeARFilter === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
    />
  );
}
