import { useState, useEffect, useCallback, useRef } from 'react';

export default function useCamera(step, STEPS) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);

  const streamRef = useRef(null);
  const isStartingRef = useRef(false);
  const activeDeviceIdRef = useRef('');

  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Failed to stop camera track:', e);
        }
      });
      streamRef.current = null;
    }
    activeDeviceIdRef.current = '';
    setCameraStream(null);
    setHasCamera(false);
  }, []);

  const loadDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return [];
      const list = await navigator.mediaDevices.enumerateDevices();
      const cams = list.filter((d) => d.kind === 'videoinput');
      setDevices(cams);
      return cams;
    } catch (err) {
      console.warn('enumerateDevices error:', err);
      return [];
    }
  }, []);

  const startCamera = useCallback(
    async (deviceId = '') => {
      // If current stream is already active with the same device, reuse it
      if (
        streamRef.current &&
        streamRef.current.active &&
        activeDeviceIdRef.current === deviceId &&
        streamRef.current.getVideoTracks().some((t) => t.readyState === 'live')
      ) {
        return streamRef.current;
      }

      if (isStartingRef.current) {
        return null;
      }
      isStartingRef.current = true;

      // Stop previous tracks cleanly
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (e) {
            console.warn('Track stop error:', e);
          }
        });
        streamRef.current = null;
      }

      try {
        let constraints = {
          audio: false,
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        if (deviceId) {
          constraints.video.deviceId = { exact: deviceId };
        } else {
          constraints.video.facingMode = isMobile ? { ideal: 'user' } : 'user';
        }

        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (primaryErr) {
          console.warn('Primary camera constraints failed, attempting fallback...', primaryErr);
          stream = await navigator.mediaDevices.getUserMedia({
            video: deviceId ? { deviceId: { ideal: deviceId } } : true,
            audio: false,
          });
        }

        streamRef.current = stream;
        activeDeviceIdRef.current = deviceId;
        setCameraStream(stream);
        setHasCamera(true);

        // Update device list without triggering circular state updates
        loadDevices().then((cams) => {
          if (!deviceId && cams.length > 0) {
            const track = stream.getVideoTracks()[0];
            const activeId = track?.getSettings?.()?.deviceId || cams[0].deviceId;
            activeDeviceIdRef.current = activeId;
            setSelectedDevice(activeId);
          }
        });

        return stream;
      } catch (err) {
        console.warn('All camera attempts failed:', err);
        streamRef.current = null;
        activeDeviceIdRef.current = '';
        setCameraStream(null);
        setHasCamera(false);
        return null;
      } finally {
        isStartingRef.current = false;
      }
    },
    [isMobile, loadDevices],
  );

  // Monitor device plug/unplug events
  useEffect(() => {
    loadDevices();
    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', loadDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', loadDevices);
      };
    }
  }, [loadDevices]);

  // Manage camera lifecycle based on Photobooth step & selectedDevice
  useEffect(() => {
    if (step === STEPS.PHOTO_CAPTURE) {
      startCamera(selectedDevice);
    } else {
      stopCamera();
    }
  }, [step, selectedDevice, startCamera, stopCamera, STEPS.PHOTO_CAPTURE]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    devices,
    selectedDevice,
    setSelectedDevice,
    cameraStream,
    hasCamera,
    startCamera,
    stopCamera,
  };
}
