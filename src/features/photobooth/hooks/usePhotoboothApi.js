import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';

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

/**
 * Mutation to create a new photo session
 */
export function useCreatePhotoSession() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/photo-sessions');
      return response.data?.data;
    },
  });
}

/**
 * Mutation to upload photos to a photo session
 */
export function useUploadPhotos() {
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
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

/**
 * Combined end-to-end photobooth submission flow mutation
 */
export function useSubmitPhotoboothSession() {
  const createSession = useCreatePhotoSession();
  const uploadPhotos = useUploadPhotos();
  const createCustomer = useCreateCustomer();

  return useMutation({
    mutationFn: async ({ photos, compiledStrip, customerData }) => {
      // 1. Create Photo Session
      const session = await createSession.mutateAsync();
      const sessionId = session.id;

      // 2. Prepare photo files for upload (individual frames + compiled strip)
      const fileObjects = [];
      photos.forEach((photoDataUrl, index) => {
        if (photoDataUrl) {
          const file = dataURLtoFile(photoDataUrl, `photo-${index + 1}.png`);
          if (file) fileObjects.push(file);
        }
      });

      if (compiledStrip) {
        const stripFile = dataURLtoFile(compiledStrip, `strip-${sessionId}.png`);
        if (stripFile) fileObjects.push(stripFile);
      }

      // 3. Upload Photos to Supabase Storage (saves in original/ and archives in archive/)
      const uploadResult = await uploadPhotos.mutateAsync({
        sessionId,
        files: fileObjects,
      });

      // 4. Save Customer Data linked by sessionId
      const customerResult = await createCustomer.mutateAsync({
        sessionId,
        customerData,
      });

      return {
        session,
        sessionId,
        uploadResult,
        customerResult,
      };
    },
  });
}
