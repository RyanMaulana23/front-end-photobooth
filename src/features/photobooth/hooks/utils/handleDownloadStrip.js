import { compilePhotoStrip } from '../../utils/canvasHelper';

/**
 * Downloads compiled photo strip image locally.
 *
 * @param {object} params - Session values and template configs
 */
export default function handleDownloadStrip({ template, photos, formData }) {
  compilePhotoStrip(template, photos).then((dataUrl) => {
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `dscbooth_${template}_${formData.npm || 'session'}.png`;
      link.href = dataUrl;
      link.click();
    }
  });
}
