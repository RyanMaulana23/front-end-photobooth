/**
 * Clears timers, resets all photobooth states, and navigates back home.
 *
 * @param {object} controls - Control methods and states
 */
export default function resetAll({
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
}) {
  if (nextPhotoTimeoutRef.current) {
    clearTimeout(nextPhotoTimeoutRef.current);
    nextPhotoTimeoutRef.current = null;
  }

  setStep(STEPS.TEMPLATE);
  setTemplate('layout1');
  setCompiledStrip(null);
  setPhotos([null, null, null, null]);
  setCountdown(-1);
  setRetakeTarget(null);
  setFormData({
    nama: '',
    npm: '',
    email: '',
    nohp: '',
    jurusan: '',
    ig: '',
  });
  setFormErrors({});
  setThankYouCountdown(10);
  navigate('/');
}
