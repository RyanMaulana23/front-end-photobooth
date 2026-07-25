import { z } from 'zod';

export const createCustomerValidation = z.object({
  name: z
    .string({ required_error: 'Nama lengkap wajib diisi' })
    .min(1, 'Nama lengkap wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .trim()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  npm: z
    .string({ required_error: 'NPM wajib diisi' })
    .min(1, 'NPM wajib diisi')
    .max(15, 'NPM maksimal 15 karakter'),
  phoneNumber: z
    .string()
    .trim()
    .min(8, 'Nomor telepon terlalu pendek! (minimal 8 angka)')
    .max(15, 'Nomor telepon terlalu panjang! (maksimal 15 angka)')
    .regex(/^[0-9+]+$/, 'Nomor telepon hanya boleh berisi angka dan awalan +')
    .optional()
    .or(z.literal('')),
  major: z
    .string({ required_error: 'Jurusan wajib diisi' })
    .min(1, 'Jurusan wajib diisi'),
  instagramUsername: z
    .string()
    .trim()
    .transform((val) => val.replace(/^@/, ''))
    .refine((val) => !val || /^[a-zA-Z0-9._]+$/.test(val), {
      message: 'Username Instagram hanya boleh huruf, angka, titik, atau underscore!',
    })
    .optional()
    .or(z.literal('')),
});
