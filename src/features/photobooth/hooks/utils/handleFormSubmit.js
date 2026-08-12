/**
 * Orchestrates the complete submission queue from one async flow.
 *
 * @param {object} customerData - Validated customer data from React Hook Form
 * @param {object} controls - Control methods, photos, and mutation hooks
 */
export default async function handleFormSubmit(
  customerData,
  {
    photos,
    compiledStrip,
    sessionId,
    submitSessionMutation,
    isSubmittingRef,
    setSubmissionState,
    setStep,
    setZipUrl,
    STEPS,
  },
) {
  if (isSubmittingRef.current) return;

  isSubmittingRef.current = true;
  setStep(STEPS.PROCESSING);
  setSubmissionState({
    status: 'processing',
    step: 1,
    progress: 10,
    message: 'Memvalidasi data pengiriman',
    error: null,
  });

  try {
    if (!submitSessionMutation?.mutateAsync) {
      throw new Error('Layanan pengiriman belum tersedia.');
    }

    const result = await submitSessionMutation.mutateAsync({
      sessionId,
      photos,
      compiledStrip,
      customerData,
      onStageChange: (nextStage) => {
        setSubmissionState((currentState) => ({
          ...currentState,
          ...nextStage,
          progress: Math.max(currentState.progress, nextStage.progress),
          error: null,
        }));
      },
    });

    if (result?.customerResult?.zipUrl) {
      setZipUrl(result.customerResult.zipUrl);
    }

    setStep(STEPS.EMAIL_SUCCESS);
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Pengiriman gagal. Silakan coba lagi.';

    setSubmissionState((currentState) => ({
      ...currentState,
      status: 'error',
      error: message,
    }));
    setStep(STEPS.INPUT_DATA);
    return false;
  } finally {
    isSubmittingRef.current = false;
  }
}
