import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import LoginForm from '../../features/auth/components/LoginForm';
import { useAdminLogin } from '../../features/auth/hooks/useAdminAuth';

export default function Login() {
  const navigate = useNavigate();
  const { mutate: loginAdmin, isPending, isError } = useAdminLogin();
  const [serverError, setServerError] = useState(null);

  const handleLoginSubmit = (formData) => {
    setServerError(null);
    loginAdmin(formData, {
      onSuccess: () => {
        // Redirect to admin dashboard on successful login
        navigate('/admin/dashboard');
      },
      onError: (err) => {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Gagal melakukan login. Silakan periksa kembali email dan kata sandi Anda.';
        setServerError(errorMessage);
      },
    });
  };

  const errorMessage =
    serverError ||
    (isError ? 'Terjadi kesalahan saat menghubungi server.' : null);

  return (
    <AuthLayout title="Login Admin">
      <div className="space-y-6">
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold font-display text-maroon m-0">
            Selamat Datang Kembali
          </h1>
          <p className="text-xs text-[#7a7266]">
            Masukkan kredensial admin Anda untuk masuk ke akun Anda.
          </p>
        </header>

        <LoginForm
          onSubmit={handleLoginSubmit}
          isLoading={isPending}
          apiError={errorMessage}
        />
      </div>
    </AuthLayout>
  );
}
