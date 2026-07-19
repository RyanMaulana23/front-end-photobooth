import { validateForm } from '../../../../utils/validation';

/**
 * Validates details form and triggers processing simulation on success.
 *
 * @param {Event} e - Form submit event
 * @param {object} controls - Control methods and states
 */
export default function handleFormSubmit(
  e,
  { formData, setFormErrors, setStep, setProcessingProgress, STEPS },
) {
  e.preventDefault();
  const errors = validateForm(formData);
  setFormErrors(errors);

  if (Object.keys(errors).length === 0) {
    setStep(STEPS.PROCESSING);

    // Simulate dynamic stitching/emailing progress bar
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(STEPS.EMAIL_SUCCESS);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  }
}
