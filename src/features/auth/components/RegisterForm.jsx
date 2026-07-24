import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerAdminSchema } from '../schemas/register.schema';

export default function RegisterForm({
  onSubmit,
  isLoading = false,
  apiError = null,
  apiSuccess = null,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerAdminSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password', '');

  // Helper validation checklist indicators
  const hasMinLen = passwordValue.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecial = /\W/.test(passwordValue);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  const isPending = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Alert Error dari Backend (API) */}
      {apiError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-fade-in">
          <svg
            className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      {/* Alert Sukses dari Backend (API) */}
      {apiSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-medium flex items-start gap-2.5 animate-fade-in">
          <svg
            className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{apiSuccess}</span>
        </div>
      )}

      {/* Field Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="reg-email"
          className="block text-xs font-bold uppercase tracking-wider text-ink/80"
        >
          Alamat Email Admin
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-[#a79c8c] pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </span>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="reg-email"
                type="email"
                placeholder="admin@dsc.com"
                autoComplete="email"
                disabled={isPending}
                className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border bg-white/70 text-ink placeholder-[#a79c8c] outline-none transition-all ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-line focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                }`}
              />
            )}
          />
        </div>
        {errors.email && (
          <p className="text-xs font-medium text-red-600 animate-fade-in flex items-center gap-1 mt-1">
            <span>•</span> {errors.email.message}
          </p>
        )}
      </div>

      {/* Field Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="reg-password"
          className="block text-xs font-bold uppercase tracking-wider text-ink/80"
        >
          Kata Sandi
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-[#a79c8c] pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </span>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Buat kata sandi aman"
                autoComplete="new-password"
                disabled={isPending}
                className={`w-full pl-11 pr-11 py-3 text-sm rounded-xl border bg-white/70 text-ink placeholder-[#a79c8c] outline-none transition-all ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-line focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                }`}
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3.5 text-[#a79c8c] hover:text-ink transition-colors p-1 cursor-pointer"
            aria-label={
              showPassword ? 'Sembunyikan password' : 'Tampilkan password'
            }
          >
            {showPassword ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.024 10.024 0 012.682-.363c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Real-time Requirement Hints */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 px-1">
          <div
            className={`text-[11px] flex items-center gap-1.5 ${hasMinLen ? 'text-sage font-semibold' : 'text-[#9ca3af]'}`}
          >
            <span>{hasMinLen ? '✓' : '•'}</span> Minimal 8 Karakter
          </div>
          <div
            className={`text-[11px] flex items-center gap-1.5 ${hasLetter ? 'text-sage font-semibold' : 'text-[#9ca3af]'}`}
          >
            <span>{hasLetter ? '✓' : '•'}</span> Mengandung Huruf
          </div>
          <div
            className={`text-[11px] flex items-center gap-1.5 ${hasNumber ? 'text-sage font-semibold' : 'text-[#9ca3af]'}`}
          >
            <span>{hasNumber ? '✓' : '•'}</span> Mengandung Angka
          </div>
          <div
            className={`text-[11px] flex items-center gap-1.5 ${hasSpecial ? 'text-sage font-semibold' : 'text-[#9ca3af]'}`}
          >
            <span>{hasSpecial ? '✓' : '•'}</span> Karakter Khusus (!@#$)
          </div>
        </div>

        {errors.password && (
          <p className="text-xs font-medium text-red-600 animate-fade-in flex items-center gap-1 mt-1">
            <span>•</span> {errors.password.message}
          </p>
        )}
      </div>

      {/* Field Confirm Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="reg-confirm-password"
          className="block text-xs font-bold uppercase tracking-wider text-ink/80"
        >
          Ulangi Kata Sandi
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-[#a79c8c] pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </span>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Konfirmasi kata sandi"
                autoComplete="new-password"
                disabled={isPending}
                className={`w-full pl-11 pr-11 py-3 text-sm rounded-xl border bg-white/70 text-ink placeholder-[#a79c8c] outline-none transition-all ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-line focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                }`}
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
            className="absolute right-3.5 text-[#a79c8c] hover:text-ink transition-colors p-1 cursor-pointer"
            aria-label={
              showConfirmPassword
                ? 'Sembunyikan password'
                : 'Tampilkan password'
            }
          >
            {showConfirmPassword ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.024 10.024 0 012.682-.363c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs font-medium text-red-600 animate-fade-in flex items-center gap-1 mt-1">
            <span>•</span> {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-3 py-3.5 px-4 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Mendaftarkan Admin...</span>
          </>
        ) : (
          <>
            <span>Daftar Sekarang</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </>
        )}
      </button>

      {/* Switch to Login */}
      <div className="pt-2 text-center text-xs text-[#7a7266]">
        Sudah memiliki akun admin?{' '}
        <Link
          to="/auth/login"
          className="font-bold text-terracotta hover:text-maroon underline underline-offset-4 transition-colors"
        >
          Masuk di Sini
        </Link>
      </div>
    </form>
  );
}
