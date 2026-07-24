import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import RegisterForm from '../../features/auth/components/RegisterForm';
import { useAdminRegister } from '../../features/auth/hooks/useAdminAuth';

export default function Register() {
  const navigate = useNavigate();
  const { mutate: registerAdmin, isPending, isError } = useAdminRegister();
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const handleRegisterSubmit = (formData) => {
    setServerError(null);
    setServerSuccess(null);

    registerAdmin(formData, {
      onSuccess: (data) => {
        setServerSuccess(
          data?.message ||
            'Registrasi admin berhasil! Mengalihkan ke halaman login...',
        );
        setTimeout(() => {
          navigate('/auth/login');
        }, 1800);
      },
      onError: (err) => {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Gagal melakukan registrasi admin. Silakan coba beberapa saat lagi.';
        setServerError(errorMessage);
      },
    });
  };

  const errorMessage =
    serverError ||
    (isError ? 'Terjadi kesalahan saat menghubungi server.' : null);

  return (
    <AuthLayout title="Registrasi Admin">
      <div className="space-y-6">
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold font-display text-maroon m-0">
            Daftar Akun Admin
          </h1>
          <p className="text-xs text-[#7a7266]">
            Buat akun baru untuk mendapatkan akses ke dashboard pengelola.
          </p>
        </header>

        <RegisterForm
          onSubmit={handleRegisterSubmit}
          isLoading={isPending}
          apiError={errorMessage}
          apiSuccess={serverSuccess}
        />
      </div>
    </AuthLayout>
  );
}
