import { useState, useEffect, useCallback } from 'react';

export default function useCamera(step, STEPS) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);

  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const loadDevices = useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const cams = list.filter((d) => d.kind === 'videoinput');
      setDevices(cams);
      setSelectedDevice((curr) => {
        if (!curr && cams.length > 0) {
          return cams[0].deviceId;
        }
        return curr;
      });
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const startCamera = useCallback(
    async (deviceId = '') => {
      stopCamera();

      try {
        let constraints = {
          audio: false,
          video: {
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
          },
        };

        if (deviceId) {
          constraints.video.deviceId = deviceId;
        } else {
          constraints.video.facingMode = isMobile
            ? {
                ideal: 'user',
              }
            : 'user';
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setCameraStream(stream);
        setHasCamera(true);
        await loadDevices();
        return stream;
      } catch (err) {
        console.warn('Device gagal, mencoba fallback...', err);

        try {
          const fallback = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });

          setCameraStream(fallback);
          setHasCamera(true);
          await loadDevices();
          return fallback;
        } catch (e) {
          console.warn(e);
          setHasCamera(false);
          return null;
        }
      }
    },
    [stopCamera, loadDevices, isMobile],
  );

  // Monitor device changes (plug/unplug USB cameras)
  useEffect(() => {
    Promise.resolve().then(() => {
      loadDevices();
    });
    navigator.mediaDevices.addEventListener('devicechange', loadDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', loadDevices);
    };
  }, [loadDevices]);

  useEffect(() => {
    if (step === STEPS.PHOTO_CAPTURE) {
      Promise.resolve().then(() => {
        startCamera(selectedDevice);
      });
    } else {
      Promise.resolve().then(() => {
        stopCamera();
      });
    }

    return stopCamera;
  }, [step, selectedDevice, startCamera, stopCamera, STEPS.PHOTO_CAPTURE]);

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
