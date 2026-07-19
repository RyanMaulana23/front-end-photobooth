import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STEPS } from '../../../constants/photobooth';
import { compilePhotoStrip } from '../utils/canvasHelper';
import useCamera from '../../../hooks/useCamera';

// Import decoupled handlers (1 file 1 function)
import triggerCaptureSequence from './utils/triggerCaptureSequence';
import takeSnapshot from './utils/takeSnapshot';
import handleStartCapture from './utils/handleStartCapture';
import handleRetakeSelect from './utils/handleRetakeSelect';
import handleFormSubmit from './utils/handleFormSubmit';
import handlePrintTrigger from './utils/handlePrintTrigger';
import handleDownloadStrip from './utils/handleDownloadStrip';
import resetAll from './utils/resetAll';
import getProgressPercent from './utils/getProgressPercent';

export default function usePhotobooth() {
  const navigate = useNavigate();

  // ==========================================
  // States
  // ==========================================
  const [step, setStep] = useState(STEPS.TEMPLATE);
  const [template, setTemplate] = useState('layout1');
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

  // Simulation Progress
  const [processingProgress, setProcessingProgress] = useState(0);
  const [printingProgress, setPrintingProgress] = useState(0);
  const [thankYouCountdown, setThankYouCountdown] = useState(10);
  const [simulatedAvatarSeed, setSimulatedAvatarSeed] = useState(1);

  // ==========================================
  // Refs
  // ==========================================
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const nextPhotoTimeoutRef = useRef(null);

  // Camera stream custom hook integration
  const {
    devices,
    selectedDevice,
    setSelectedDevice,
    cameraStream,
    hasCamera,
  } = useCamera(step, STEPS);

  // ==========================================
  // Side Effects
  // ==========================================

  // Attach camera stream to HTML Video element
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => {
        console.warn('Video playback blocked or failed:', err);
      });
    }
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
  useEffect(() => {
    if (step === STEPS.PREVIEW || step === STEPS.EDIT_DECISION) {
      compilePhotoStrip(template, photos).then((dataUrl) => {
        if (dataUrl) setCompiledStrip(dataUrl);
      });
    }
  }, [step, photos, template]);

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
  }, [step, thankYouCountdown]);

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

  const callHandleStartCapture = () =>
    handleStartCapture({
      template,
      setPhotos,
      setRetakeTarget,
      setCapturingIndex,
      setStep,
      setCountdown,
      STEPS,
    });

  const callHandleRetakeSelect = (index) =>
    handleRetakeSelect(index, {
      setRetakeTarget,
      setCapturingIndex,
      setStep,
      setCountdown,
      STEPS,
    });

  const callHandleFormSubmit = (e) =>
    handleFormSubmit(e, {
      formData,
      setFormErrors,
      setStep,
      setProcessingProgress,
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

  return {
    step,
    setStep,
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
    isFilterModalOpen,
    setIsFilterModalOpen,
    countdownTime,
    setCountdownTime,
    formData,
    setFormData,
    formErrors,
    processingProgress,
    printingProgress,
    thankYouCountdown,
    simulatedAvatarSeed,
    videoRef,
    canvasRef,
    devices,
    selectedDevice,
    setSelectedDevice,
    hasCamera,
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
