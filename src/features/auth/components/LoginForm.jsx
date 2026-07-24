import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginAdminSchema } from '../schemas/login.schema';

export default function LoginForm({
  onSubmit,
  isLoading = false,
  apiError = null,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginAdminSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  const isPending = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
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

      {/* Field Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
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
                id="email"
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
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-ink/80"
          >
            Kata Sandi
          </label>
        </div>
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
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
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
        {errors.password && (
          <p className="text-xs font-medium text-red-600 animate-fade-in flex items-center gap-1 mt-1">
            <span>•</span> {errors.password.message}
          </p>
        )}
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 py-3.5 px-4 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <span>Masuk ke Dashboard</span>
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </>
        )}
      </button>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-xs text-[#7a7266]">
        Belum memiliki akun admin?{' '}
        <Link
          to="/auth/register"
          className="font-bold text-terracotta hover:text-maroon underline underline-offset-4 transition-colors"
        >
          Daftar Admin Baru
        </Link>
      </div>
    </form>
  );
}
