import { z } from 'zod';

export const loginAdminSchema = z.object({
  email: z.email('Format email tidak valid').trim().min(1, 'Email wajib diisi'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(8, 'Password minimal 8 karakter'),
});
