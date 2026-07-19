import { useState, useEffect, useCallback } from 'react';

export default function useCamera(step, STEPS) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const startCamera = useCallback(async (deviceId) => {
    try {
      // stop existing camera first
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      const constraints = {
        video: {
          width: 640,
          height: 480,
          deviceId: deviceId ? { exact: deviceId } : undefined,
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setHasCamera(true);
      return stream;
    } catch (e) {
      console.warn(
        'Webcam not found or access denied, using simulated camera:',
        e,
      );
      setHasCamera(false);
      setCameraStream(null);
      return null;
    }
  }, [cameraStream]);

  // Enumerate video devices on mount
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((deviceInfos) => {
          const videoDevices = deviceInfos.filter(
            (d) => d.kind === 'videoinput',
          );
          setDevices(videoDevices);
          if (videoDevices.length > 0) {
            setSelectedDevice(videoDevices[0].deviceId);
          }
        })
        .catch((err) => {
          console.warn('Could not list cameras:', err);
        });
    }
  }, []);

  // Start/Stop camera based on active step & device selection
  useEffect(() => {
    if (step === STEPS.PHOTO_CAPTURE) {
      startCamera(selectedDevice);
    } else {
      stopCamera();
    }
    return () => {
      // Cleanup stream on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
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
