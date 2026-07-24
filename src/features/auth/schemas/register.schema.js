import { z } from 'zod';

export const registerAdminSchema = z
  .object({
    email: z
      .email('Format email tidak valid')
      .min(1, 'Email wajib diisi')
      .trim(),
    password: z
      .string()
      .min(1, 'Password wajib diisi')
      .min(8, 'Password minimal 8 karakter')
      .regex(/[a-zA-Z]/, 'Password harus mengandung huruf')
      .regex(/\d/, 'Password harus mengandung angka')
      .regex(/\W/, 'Password harus mengandung karakter khusus (!@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok dengan password',
    path: ['confirmPassword'],
  });
