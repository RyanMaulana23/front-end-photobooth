import {
  LAYOUT_CONFIGS,
  STEPS,
  getCameraAspectStyle,
  getMaxPhotos,
  getSlotAspectClass,
  getSlotAspectStyle,
} from '../constants/photobooth';
import usePhotobooth from '../features/photobooth/hooks/usePhotobooth';

// Step components
import CaptureStep from '../features/photobooth/components/CaptureStep';
import EditDecisionStep from '../features/photobooth/components/EditDecisionStep';
import EmailSuccessStep from '../features/photobooth/components/EmailSuccessStep';
import InputDataStep from '../features/photobooth/components/InputDataStep';
import PreviewStep from '../features/photobooth/components/PreviewStep';
import PrintStep from '../features/photobooth/components/PrintStep';
import ProcessingStep from '../features/photobooth/components/ProcessingStep';
import TemplateStep from '../features/photobooth/components/TemplateStep';
import ThankYouStep from '../features/photobooth/components/ThankYouStep';

export default function Photobooth() {
  const {
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
    submissionError,
    printingProgress,
    thankYouCountdown,
    simulatedAvatarSeed,
    videoRef,
    canvasRef,
    devices,
    selectedDevice,
    setSelectedDevice,
    hasCamera,
    faceTransformRef,
    isCreatingSession,
    sessionStartError,
    isSubmitting,
    triggerCaptureSequence,
    handleStartCapture,
    handleRetakeSelect,
    handleFormSubmit,
    handlePrintTrigger,
    handleDownloadStrip,
    resetAll,
    getProgressPercent,
  } = usePhotobooth();

  return (
    <section className="flex-1 bg-cream p-6 md:p-12 relative flex flex-col items-center justify-start min-h-[600px] overflow-hidden">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Progress Flow Header */}
      {step < STEPS.THANK_YOU && (
        <div className="w-full max-w-xl mb-8 flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-medium text-maroon">
            <span>Alur Sesi Foto</span>
            <span>
              Langkah {step} dari 9 ({getProgressPercent()}%)
            </span>
          </div>
          <div className="w-full h-3 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-terracotta transition-all duration-300 rounded-full"
              style={{ width: `${getProgressPercent()}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Template Selection */}
      {step === STEPS.TEMPLATE && (
        <TemplateStep
          template={template}
          setTemplate={setTemplate}
          getMaxPhotos={getMaxPhotos}
          handleStartCapture={handleStartCapture}
          isCreatingSession={isCreatingSession}
          sessionStartError={sessionStartError}
        />
      )}

      {/* Step 2: Photo Capture Screen */}
      {step === STEPS.PHOTO_CAPTURE && (
        <CaptureStep
          photos={photos}
          template={template}
          retakeTarget={retakeTarget}
          capturingIndex={capturingIndex}
          devices={devices}
          selectedDevice={selectedDevice}
          setSelectedDevice={setSelectedDevice}
          countdownTime={countdownTime}
          setCountdownTime={setCountdownTime}
          videoRef={videoRef}
          mirror={mirror}
          setMirror={setMirror}
          flashEnabled={flashEnabled}
          setFlashEnabled={setFlashEnabled}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeARFilter={activeARFilter}
          setActiveARFilter={setActiveARFilter}
          faceTransformRef={faceTransformRef}
          isFilterModalOpen={isFilterModalOpen}
          setIsFilterModalOpen={setIsFilterModalOpen}
          hasCamera={hasCamera}
          countdown={countdown}
          flash={flash}
          simulatedAvatarSeed={simulatedAvatarSeed}
          triggerCaptureSequence={triggerCaptureSequence}
          getMaxPhotos={getMaxPhotos}
          getCameraAspectStyle={getCameraAspectStyle}
        />
      )}

      {/* Step 3: Preview Collected Photos */}
      {step === STEPS.PREVIEW && (
        <PreviewStep
          photos={photos}
          template={template}
          getMaxPhotos={getMaxPhotos}
          getSlotAspectClass={getSlotAspectClass}
          getSlotAspectStyle={getSlotAspectStyle}
          handleRetakeSelect={handleRetakeSelect}
          setStep={setStep}
          STEPS={STEPS}
        />
      )}

      {/* Step 4: Stitched Photo Strip Preview */}
      {step === STEPS.EDIT_DECISION && (
        <EditDecisionStep
          compiledStrip={compiledStrip}
          getMaxPhotos={getMaxPhotos}
          template={template}
          setStep={setStep}
          STEPS={STEPS}
        />
      )}

      {/* Step 5: Input User Details */}
      {step === STEPS.INPUT_DATA && (
        <InputDataStep
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          handleFormSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submissionError={submissionError}
        />
      )}

      {/* Step 6: Processing & Stitching Simulation */}
      {step === STEPS.PROCESSING && (
        <ProcessingStep submissionState={submissionState} />
      )}

      {/* Step 7: Email Sent & Action Success */}
      {step === STEPS.EMAIL_SUCCESS && (
        <EmailSuccessStep
          formData={formData}
          handleDownloadStrip={handleDownloadStrip}
          handlePrintTrigger={handlePrintTrigger}
          setStep={setStep}
          STEPS={STEPS}
        />
      )}

      {/* Step 8: Hardcopy Printing Simulation */}
      {step === STEPS.PRINT_HARDCOPY && (
        <PrintStep
          printingProgress={printingProgress}
          template={template}
          LAYOUT_CONFIGS={LAYOUT_CONFIGS}
        />
      )}

      {/* Step 9: Thank You Screen */}
      {step === STEPS.THANK_YOU && (
        <ThankYouStep
          thankYouCountdown={thankYouCountdown}
          resetAll={resetAll}
        />
      )}
    </section>
  );
}
