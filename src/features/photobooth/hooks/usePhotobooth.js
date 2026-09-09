import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { STEPS } from '../../../constants/photobooth';
import useCamera from '../../../hooks/useCamera';
import { compilePhotoStrip } from '../utils/canvasHelper';

// Import decoupled handlers (1 file 1 function)
import { useFaceTracking } from './useFaceTracking';
import {
  useCreatePhotoSession,
  useSubmitPhotoboothSession,
} from './usePhotoboothApi';
import getProgressPercent from './utils/getProgressPercent';
import handleDownloadStrip from './utils/handleDownloadStrip';
import handleFormSubmit from './utils/handleFormSubmit';
import handlePrintTrigger from './utils/handlePrintTrigger';
import handleRetakeSelect from './utils/handleRetakeSelect';
import handleStartCapture from './utils/handleStartCapture';
import resetAll from './utils/resetAll';
import takeSnapshot from './utils/takeSnapshot';
import triggerCaptureSequence from './utils/triggerCaptureSequence';

export default function usePhotobooth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams();
  const createSessionMutation = useCreatePhotoSession();
  const submitSessionMutation = useSubmitPhotoboothSession();

  // ==========================================
  // States
  // ==========================================
  const [step, setStep] = useState(STEPS.TEMPLATE);
  const [template, setTemplate] = useState(
    () => location.state?.template || 'layout1',
  );
  const [compiledStrip, setCompiledStrip] = useState(null);
  const [photos, setPhotos] = useState([null, null, null, null]);
  const [capturingIndex, setCapturingIndex] = useState(0);
  const [countdown, setCountdown] = useState(-1);
  const [flash, setFlash] = useState(false);
  const [retakeTarget, setRetakeTarget] = useState(null);

  // Camera & Filter Settings
  const [mirror, setMirror] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [activeFilter, setActiveFilter] = useState('none');
  const [activeARFilter, setActiveARFilter] = useState('none');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [countdownTime, setCountdownTime] = useState(3);

  // Form Input
  const [formData, setFormData] = useState({
    nama: '',
    npm: '',
    email: '',
    nohp: '',
    jurusan: '',
    ig: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const [submissionState, setSubmissionState] = useState({
    status: 'idle',
    step: 0,
    progress: 0,
    message: '',
    error: null,
  });
  const [sessionStartError, setSessionStartError] = useState(null);
  const [printingProgress, setPrintingProgress] = useState(0);
  const [thankYouCountdown, setThankYouCountdown] = useState(10);
  const [simulatedAvatarSeed, setSimulatedAvatarSeed] = useState(1);
  const [zipUrl, setZipUrl] = useState('');

  // ==========================================
  // Refs
  // ==========================================
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const nextPhotoTimeoutRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const isCreatingSessionRef = useRef(false);
  const startedCaptureSessionRef = useRef(null);
  const previewCompileQueueRef = useRef(Promise.resolve(null));
  const previewRequestRef = useRef(0);
  const previewSourceRef = useRef(null);

  // Camera stream custom hook integration
  const {
    devices,
    selectedDevice,
    setSelectedDevice,
    cameraStream,
    hasCamera,
  } = useCamera(step, STEPS);

  // Real-time face tracking model hook
  const { faceTransformRef } = useFaceTracking(videoRef, step === STEPS.PHOTO_CAPTURE);

  // ==========================================
  // Wrappers for decoupled handlers
  // ==========================================

  const callTriggerCaptureSequence = (index) =>
    triggerCaptureSequence(index, {
      setCapturingIndex,
      setCountdown,
      countdownTime,
    });

  const callTakeSnapshot = () =>
    takeSnapshot({
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
    });

  const callHandleStartCapture = async () => {
    if (isCreatingSessionRef.current) return;

    isCreatingSessionRef.current = true;
    setSessionStartError(null);

    try {
      const session = await createSessionMutation.mutateAsync();
      if (!session?.id) {
        throw new Error('Server tidak mengembalikan ID sesi foto.');
      }

      navigate(`/photobooth/${session.id}`, { state: { template } });
    } catch (error) {
      setSessionStartError(
        error?.response?.data?.message ||
          error?.message ||
          'Gagal memulai sesi foto. Silakan coba lagi.',
      );
    } finally {
      isCreatingSessionRef.current = false;
    }
  };

  const callHandleRetakeSelect = (index) =>
    handleRetakeSelect(index, {
      setRetakeTarget,
      setCapturingIndex,
      setStep,
      setCountdown,
      STEPS,
    });

  const callHandleFormSubmit = (customerData) =>
    handleFormSubmit(customerData, {
      photos,
      compiledStrip,
      sessionId,
      submitSessionMutation,
      isSubmittingRef,
      setSubmissionState,
      setStep,
      setZipUrl,
      STEPS,
    });

  const callHandlePrintTrigger = () =>
    handlePrintTrigger({
      setStep,
      setPrintingProgress,
      STEPS,
    });

  const callHandleDownloadStrip = () =>
    handleDownloadStrip({
      template,
      photos,
      formData,
    });

  const callResetAll = () =>
    resetAll({
      nextPhotoTimeoutRef,
      setStep,
      setTemplate,
      setCompiledStrip,
      setPhotos,
      setCountdown,
      setRetakeTarget,
      setFormData,
      setFormErrors,
      setThankYouCountdown,
      navigate,
      STEPS,
    });

  const callGetProgressPercent = () => getProgressPercent(step);

  // ==========================================
  // Side Effects
  // ==========================================

  useEffect(() => {
    if (!sessionId || startedCaptureSessionRef.current === sessionId) return;

    startedCaptureSessionRef.current = sessionId;
    handleStartCapture({
      template,
      setPhotos,
      setRetakeTarget,
      setCapturingIndex,
      setStep,
      setCountdown,
      STEPS,
    });
  }, [sessionId, template]);

  // Attach camera stream to HTML Video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cameraStream) return;

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');

    if (video.srcObject !== cameraStream) {
      video.srcObject = cameraStream;
    }

    const playVideo = () => {
      if (video.paused) {
        video.play().catch((err) => {
          console.warn('Video play was prevented:', err);
        });
      }
    };

    video.addEventListener('loadedmetadata', playVideo);
    video.addEventListener('canplay', playVideo);

    if (video.readyState >= 1) {
      playVideo();
    }

    return () => {
      video.removeEventListener('loadedmetadata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, [cameraStream, step]);

  // Countdown timer handler
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      callTakeSnapshot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  // Offline mock avatar animator
  useEffect(() => {
    if (step === STEPS.PHOTO_CAPTURE && !hasCamera) {
      const ticker = setInterval(() => {
        setSimulatedAvatarSeed((s) => (s + 1) % 360);
      }, 150);
      return () => clearInterval(ticker);
    }
  }, [step, hasCamera]);

  // Canvas photo strip compiler
  const shouldCompilePreview =
    step === STEPS.PREVIEW || step === STEPS.EDIT_DECISION;

  useEffect(() => {
    if (shouldCompilePreview) {
      const previewSource = { template, photos };
      if (
        previewSourceRef.current?.template === template &&
        previewSourceRef.current?.photos === photos
      ) {
        return;
      }

      previewSourceRef.current = previewSource;
      const requestId = ++previewRequestRef.current;
      setCompiledStrip(null);
      const compilePreview = async () => {
        try {
          const dataUrl = await compilePhotoStrip(template, photos);
          if (requestId === previewRequestRef.current && dataUrl) {
            setCompiledStrip(dataUrl);
          }
          return dataUrl;
        } catch (err) {
          console.error(err);
          return null;
        }
      };

      previewCompileQueueRef.current = previewCompileQueueRef.current
        .catch(() => undefined)
        .then(compilePreview);
    }
  }, [photos, shouldCompilePreview, template]);

  // Exit thank you screen when timer reaches 0
  useEffect(() => {
    if (step === STEPS.THANK_YOU) {
      if (thankYouCountdown > 0) {
        const timer = setTimeout(() => {
          setThankYouCountdown(thankYouCountdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        callResetAll();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, thankYouCountdown]);



  return {
    step,
    setStep,
    sessionId,
    template,
    setTemplate,
    compiledStrip,
    photos,
    capturingIndex,
    countdown,
    flash,
    retakeTarget,
    mirror,
    setMirror,
    flashEnabled,
    setFlashEnabled,
    activeFilter,
    setActiveFilter,
    activeARFilter,
    setActiveARFilter,
    isFilterModalOpen,
    setIsFilterModalOpen,
    countdownTime,
    setCountdownTime,
    formData,
    setFormData,
    formErrors,
    submissionState,
    printingProgress,
    thankYouCountdown,
    simulatedAvatarSeed,
    zipUrl,
    videoRef,
    canvasRef,
    devices,
    selectedDevice,
    setSelectedDevice,
    hasCamera,
    faceTransformRef,
    isCreatingSession: createSessionMutation.isPending,
    sessionStartError,
    isSubmitting:
      submissionState.status === 'processing' ||
      submitSessionMutation.isPending,
    submissionError: submissionState.error,
    triggerCaptureSequence: callTriggerCaptureSequence,
    takeSnapshot: callTakeSnapshot,
    handleStartCapture: callHandleStartCapture,
    handleRetakeSelect: callHandleRetakeSelect,
    handleFormSubmit: callHandleFormSubmit,
    handlePrintTrigger: callHandlePrintTrigger,
    handleDownloadStrip: callHandleDownloadStrip,
    resetAll: callResetAll,
    getProgressPercent: callGetProgressPercent,
  };
}
