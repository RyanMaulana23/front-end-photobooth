import { useMutation, useQueryClient } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import api from '../../../config/axios';
import { saveSessionTriggerTime } from '../../../utils/dateHelper';

/**
 * Utility function to convert dataURL/base64 to File object for upload
 */
export function dataURLtoFile(dataurl, filename) {
  if (!dataurl) return null;
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const submissionStages = {
  validating: {
    step: 1,
    progress: 10,
    message: 'Memvalidasi data pengiriman',
  },
  uploadingPhotos: {
    step: 2,
    progress: 45,
    message: 'Mengunggah foto ke server',
  },
  creatingZip: {
    step: 3,
    progress: 65,
    message: 'Folder ZIP berhasil dibuat',
  },
  uploadingZip: {
    step: 4,
    progress: 80,
    message: 'Folder ZIP berhasil diunggah',
  },
  sendingEmail: {
    step: 5,
    progress: 90,
    message: 'Mengirim email',
  },
  complete: {
    status: 'success',
    step: 6,
    progress: 100,
    message: 'Pengiriman selesai',
  },
};

function updateStage(onStageChange, stageName, details = {}) {
  onStageChange?.({
    stage: stageName,
    ...submissionStages[stageName],
    ...details,
  });
}

/**
 * Mutation to create a new photo session
 */
export function useCreatePhotoSession() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/photo-sessions');
      const sessionData = response.data?.data;
      if (sessionData?.id) {
        saveSessionTriggerTime(
          sessionData.id,
          sessionData.createdAt ||
            sessionData.created_at ||
            new Date().toISOString(),
        );
      }
      return sessionData;
    },
  });
}

/**
 * Mutation to upload photos to a photo session
 */
export function useUploadPhotos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, files }) => {
      const formData = new FormData();
      files.forEach((file) => {
        if (file) {
          formData.append('files', file);
        }
      });

      const response = await api.post(`/photos/${sessionId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

/**
 * Mutation to save customer data attached to a photo session
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, customerData }) => {
      const response = await api.post(`/customers/${sessionId}`, customerData);
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

/**
 * Combined end-to-end photobooth submission flow mutation
 */
export function useSubmitPhotoboothSession() {
  const uploadPhotos = useUploadPhotos();
  const createCustomer = useCreateCustomer();

  return useMutation({
    mutationFn: async ({
      sessionId,
      photos,
      compiledStrip,
      customerData,
      onStageChange,
    }) => {
      if (!sessionId) {
        throw new Error(
          'ID sesi foto tidak ditemukan. Silakan mulai sesi baru.',
        );
      }

      updateStage(onStageChange, 'validating');

      const fileObjects = [];
      const photoDataUrls = photos.filter(Boolean);

      const compressionOptions = {
        maxSizeMB: 1, // Maksimal 1MB, sesuaikan jika butuh lebih kecil/besar
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      for (let index = 0; index < photoDataUrls.length; index += 1) {
        const photoDataUrl = photoDataUrls[index];
        updateStage(onStageChange, 'uploadingPhotos', {
          progress: 20 + Math.round(((index + 1) / photoDataUrls.length) * 20),
          message: `Memproses foto ${index + 1} dari ${photoDataUrls.length}`,
        });

        if (photoDataUrl) {
          const file = dataURLtoFile(photoDataUrl, `photo-${index + 1}.png`);
          if (file) {
            try {
              const compressedFile = await imageCompression(
                file,
                compressionOptions,
              );
              // Memastikan hasil kompresi tetap berupa File dengan nama dan ekstensi asli
              const finalFile = new File([compressedFile], file.name, {
                type: compressedFile.type || file.type,
              });
              fileObjects.push(finalFile);
            } catch (error) {
              console.error(`Gagal mengompresi foto ${index + 1}:`, error);
              fileObjects.push(file); // Fallback ke original
            }
          }
        }
      }

      if (compiledStrip) {
        const stripFile = dataURLtoFile(
          compiledStrip,
          `strip-${sessionId}.png`,
        );
        if (stripFile) {
          try {
            const compressedStrip = await imageCompression(
              stripFile,
              compressionOptions,
            );
            const finalStrip = new File([compressedStrip], stripFile.name, {
              type: compressedStrip.type || stripFile.type,
            });
            fileObjects.push(finalStrip);
          } catch (error) {
            console.error('Gagal mengompresi photostrip:', error);
            fileObjects.push(stripFile); // Fallback ke original
          }
        }
      }

      const uploadedPhotoCount = photoDataUrls.length;
      updateStage(onStageChange, 'uploadingPhotos', {
        message: `Mengunggah ${uploadedPhotoCount} foto dan menunggu ZIP selesai`,
      });
      console.info('[PHOTO] Start:', `${uploadedPhotoCount} foto`);
      const uploadResult = await uploadPhotos.mutateAsync({
        sessionId,
        files: fileObjects,
      });
      console.info('[PHOTO] Complete:', `${uploadedPhotoCount} foto`);

      updateStage(onStageChange, 'creatingZip');
      console.info('[ZIP] Complete');

      updateStage(onStageChange, 'uploadingZip');
      console.info('[ZIP UPLOAD] Complete');

      updateStage(onStageChange, 'sendingEmail');
      console.info('[EMAIL] Start');
      const customerResult = await createCustomer.mutateAsync({
        sessionId,
        customerData,
      });
      console.info('[EMAIL] Complete');

      updateStage(onStageChange, 'complete');

      return {
        sessionId,
        uploadResult,
        customerResult,
      };
    },
  });
}
