/**
 * Triggers layout print simulation progress bars.
 *
 * @param {object} controls - Control methods and states
 */
export default function handlePrintTrigger({
  setStep,
  setPrintingProgress,
  STEPS,
}) {
  setStep(STEPS.PRINT_HARDCOPY);
  setPrintingProgress(0);

  const interval = setInterval(() => {
    setPrintingProgress((prev) => {
      if (prev >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep(STEPS.THANK_YOU);
        }, 800);
        return 100;
      }
      return prev + 4;
    });
  }, 120);
}
