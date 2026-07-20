import { useState, useEffect, useCallback } from "react";

export default function useCamera(step, STEPS) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [cameraStream, setCameraStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);

  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const loadDevices = async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();

      const cams = list.filter((d) => d.kind === "videoinput");

      setDevices(cams);

      if (!selectedDevice && cams.length > 0) {
        setSelectedDevice(cams[0].deviceId);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startCamera = useCallback(
    async (deviceId = "") => {
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
          constraints.video.deviceId = {
            exact: deviceId,
          };
        } else {
          constraints.video.facingMode = isMobile
            ? {
                ideal: "user",
              }
            : "user";
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        setCameraStream(stream);

        setHasCamera(true);

        await loadDevices();

        return stream;
      } catch (err) {
        console.warn("Device gagal, mencoba fallback...", err);

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
    [stopCamera],
  );

  useEffect(() => {
    if (step === STEPS.PHOTO_CAPTURE) {
      startCamera(selectedDevice);
    } else {
      stopCamera();
    }

    return stopCamera;
  }, [step, selectedDevice]);

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
