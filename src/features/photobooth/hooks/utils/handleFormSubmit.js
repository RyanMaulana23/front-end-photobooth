/**
 * Handles form submission: triggers TanStack Query backend API submission mutation
 * and progresses the UI state smoothly to PROCESSING then EMAIL_SUCCESS.
 *
 * @param {object} customerData - Validated customer data from React Hook Form
 * @param {object} controls - Control methods, photos, and mutation hooks
 */
export default async function handleFormSubmit(
  customerData,
  { photos, compiledStrip, submitSessionMutation, setStep, setProcessingProgress, STEPS },
) {
  setStep(STEPS.PROCESSING);
  setProcessingProgress(20);

  try {
    setProcessingProgress(50);
    if (submitSessionMutation && submitSessionMutation.mutateAsync) {
      await submitSessionMutation.mutateAsync({
        photos,
        compiledStrip,
        customerData,
      });
    }
    setProcessingProgress(90);
  } catch (error) {
    console.warn('Backend API session submission warning:', error);
  } finally {
    setProcessingProgress(100);
    setTimeout(() => {
      setStep(STEPS.EMAIL_SUCCESS);
    }, 500);
  }
}
