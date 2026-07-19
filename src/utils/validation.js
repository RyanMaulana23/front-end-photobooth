export const validateForm = (formData) => {
  const errors = {};
  if (!formData.nama.trim()) errors.nama = 'Nama lengkap wajib diisi!';

  if (!formData.npm.trim()) {
    errors.npm = 'NPM wajib diisi!';
  } else if (!/^\d+$/.test(formData.npm)) {
    errors.npm = 'NPM hanya boleh berisi angka!';
  } else if (formData.npm.length < 8) {
    errors.npm = 'NPM minimal 8 karakter!';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email wajib diisi!';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Format email tidak valid!';
  }

  if (!formData.nohp.trim()) {
    errors.nohp = 'Nomor HP wajib diisi!';
  } else if (!/^\d+$/.test(formData.nohp)) {
    errors.nohp = 'Nomor HP hanya boleh berisi angka!';
  } else if (formData.nohp.length < 10 || formData.nohp.length > 13) {
    errors.nohp = 'Nomor HP harus 10 s.d 13 digit!';
  }

  if (!formData.jurusan.trim()) errors.jurusan = 'Jurusan wajib diisi!';

  if (!formData.ig.trim()) {
    errors.ig = 'Username Instagram wajib diisi!';
  }

  return errors;
};
