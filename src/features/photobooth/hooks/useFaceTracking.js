import { useEffect, useRef, useState } from 'react';
import { calculateFaceTransform } from '../utils/ar/calculateFaceTransform';
import { loadFaceMesh } from '../utils/ar/faceMeshLoader';

/**
 * Helper to interpolate two transform objects for smooth movements.
 */
function interpolateTransform(prev, next, factor = 0.35) {
  if (!prev) return next;
  return {
    ...next,
    centerX: prev.centerX * (1 - factor) + next.centerX * factor,
    centerY: prev.centerY * (1 - factor) + next.centerY * factor,
    foreheadX: prev.foreheadX * (1 - factor) + next.foreheadX * factor,
    foreheadY: prev.foreheadY * (1 - factor) + next.foreheadY * factor,
    noseX: prev.noseX * (1 - factor) + next.noseX * factor,
    noseY: prev.noseY * (1 - factor) + next.noseY * factor,
    faceWidth: prev.faceWidth * (1 - factor) + next.faceWidth * factor,
    faceHeight: prev.faceHeight * (1 - factor) + next.faceHeight * factor,
    angle: prev.angle * (1 - factor) + next.angle * factor,
    mouthOpenRatio:
      prev.mouthOpenRatio * (1 - factor) + next.mouthOpenRatio * factor,
    smileRatio: prev.smileRatio * (1 - factor) + next.smileRatio * factor,
  };
}

/**
 * Custom hook managing real-time Face Tracking loop and landmark transforms.
 * Implements temporal smoothing and tracking loss grace periods to prevent flickering.
 *
 * @param {React.RefObject} videoRef - HTML Video element ref
 * @param {boolean} active - True if face tracking should be active
 * @returns {object} { faceTransformRef, isFaceTrackingReady }
 */
export function useFaceTracking(videoRef, active = true) {
  const faceTransformRef = useRef([calculateFaceTransform(null, 640, 480, 0)]);
  const [isFaceTrackingReady, setIsFaceTrackingReady] = useState(false);
  const animFrameIdRef = useRef(null);
  const trackingTimeoutIdRef = useRef(null);
  const landmarksRef = useRef(null);

  // References to preserve tracking stability
  const lastValidTransformsRef = useRef(null);
  const trackingLossCountRef = useRef(0);

  useEffect(() => {
    if (!active) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (trackingTimeoutIdRef.current)
        clearTimeout(trackingTimeoutIdRef.current);
      return;
    }

    let isDestroyed = false;
    let faceMeshInstance = null;
    let isProcessing = false;

    // Load FaceMesh model singleton with lower confidence for better distance sensitivity
    loadFaceMesh()
      .then((faceMesh) => {
        if (isDestroyed) return;
        faceMeshInstance = faceMesh;

        // Tune detector options dynamically for more sensitive, persistent tracking
        faceMesh.setOptions({
          maxNumFaces: 4,
          refineLandmarks: false,
          minDetectionConfidence: 0.45,
          minTrackingConfidence: 0.45,
        });

        faceMesh.onResults((results) => {
          if (isDestroyed) return;
          if (
            results.multiFaceLandmarks &&
            results.multiFaceLandmarks.length > 0
          ) {
            landmarksRef.current = results.multiFaceLandmarks;
          } else {
            landmarksRef.current = null;
          }
          isProcessing = false;
        });

        setIsFaceTrackingReady(true);
        startTrackingLoop();
      })
      .catch((err) => {
        console.warn('Face Mesh loading fallback active:', err);
        setIsFaceTrackingReady(true);
      });

    // 1. Decoupled tracking loop at 30 FPS
    const startTrackingLoop = () => {
      const processFrame = async () => {
        if (isDestroyed) return;

        const video = videoRef?.current;
        if (
          video &&
          video.readyState >= 2 &&
          faceMeshInstance &&
          !isProcessing
        ) {
          isProcessing = true;
          try {
            await faceMeshInstance.send({ image: video });
          } catch (err) {
            isProcessing = false;
          }
        }

        trackingTimeoutIdRef.current = setTimeout(processFrame, 33);
      };

      processFrame();
    };

    // 2. High-performance rendering & calculation loop at 60 FPS
    const renderLoop = (timestamp) => {
      if (isDestroyed) return;

      const video = videoRef?.current;
      const width = video?.videoWidth || 640;
      const height = video?.videoHeight || 480;

      if (landmarksRef.current && landmarksRef.current.length > 0) {
        // Calculate new transforms from landmarks
        const rawTransforms = landmarksRef.current.map((landmarks) =>
          calculateFaceTransform(landmarks, width, height, timestamp),
        );

        // Filter out tiny false positives
        const filtered = rawTransforms.filter((t) => t.faceWidth >= width * 0.13);

        if (filtered.length > 0) {
          // Apply temporal smoothing (Exponential Moving Average)
          const smoothed = filtered.map((nextT, idx) => {
            const prevT = lastValidTransformsRef.current?.[idx];
            return interpolateTransform(prevT, nextT, 0.4); // 0.4 responsiveness factor
          });

          faceTransformRef.current = smoothed;
          lastValidTransformsRef.current = smoothed;
          trackingLossCountRef.current = 0;
        } else {
          handleTrackingLoss(width, height, timestamp);
        }
      } else {
        handleTrackingLoss(width, height, timestamp);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    const handleTrackingLoss = (width, height, timestamp) => {
      trackingLossCountRef.current += 1;

      // Grace period: keep using last known positions for up to 30 frames (~500ms) to prevent flicker
      if (
        trackingLossCountRef.current < 30 &&
        lastValidTransformsRef.current &&
        lastValidTransformsRef.current.length > 0
      ) {
        faceTransformRef.current = lastValidTransformsRef.current;
      } else {
        // Fallback to centered procedural simulation if face is lost long term
        faceTransformRef.current = [
          calculateFaceTransform(null, width, height, timestamp),
        ];
        lastValidTransformsRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isDestroyed = true;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (trackingTimeoutIdRef.current)
        clearTimeout(trackingTimeoutIdRef.current);
    };
  }, [videoRef, active]);

  return {
    faceTransformRef,
    isFaceTrackingReady,
  };
}
