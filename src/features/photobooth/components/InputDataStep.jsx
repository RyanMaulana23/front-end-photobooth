import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCustomerValidation } from '../schemas/customer.schema';

export default function InputDataStep({
  formData,
  setFormData,
  handleFormSubmit,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCustomerValidation),
    defaultValues: {
      name: formData.nama || '',
      email: formData.email || '',
      npm: formData.npm || '',
      phoneNumber: formData.nohp || '',
      major: formData.jurusan || '',
      instagramUsername: formData.ig ? formData.ig.replace(/^@/, '') : '',
    },
  });

  const onSubmit = (data) => {
    // Keep local formData in sync for download file names & legacy fallbacks
    setFormData({
      nama: data.name,
      email: data.email,
      npm: data.npm,
      nohp: data.phoneNumber || '',
      jurusan: data.major,
      ig: data.instagramUsername ? `@${data.instagramUsername}` : '',
    });

    handleFormSubmit(data);
  };

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-maroon mb-2 font-display">
          Isi Data Diri 📝
        </h2>
        <p className="text-sm text-[#7a7266]">
          Masukkan datamu untuk menerima softcopy foto via email.
        </p>
        <div className="mt-2 text-xs bg-coral/10 border border-coral/30 text-maroon px-4 py-2 rounded-lg inline-block">
          ⚠️ Catatan: File ZIP & frame foto hanya akan dikirim 1 kali.
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-3xl border border-line p-6 md:p-8 shadow-sm flex flex-col gap-4"
      >
        {/* Nama Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: Ryan Maulana"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* NPM Field */}
        <div>
          <label
            htmlFor="npm"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            NPM (Nomor Pokok Mahasiswa)
          </label>
          <input
            id="npm"
            type="text"
            {...register('npm')}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.npm
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: 50421888"
          />
          {errors.npm && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {errors.npm.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Alamat Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: ryan@student.univ.ac.id"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* No HP Field */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Nomor HP (WhatsApp)
          </label>
          <input
            id="phoneNumber"
            type="text"
            {...register('phoneNumber')}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.phoneNumber
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: 081234567890"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Jurusan Field */}
        <div>
          <label
            htmlFor="major"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Jurusan / Program Studi
          </label>
          <input
            id="major"
            type="text"
            {...register('major')}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.major
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: Informatika"
          />
          {errors.major && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {errors.major.message}
            </p>
          )}
        </div>

        {/* Instagram Field */}
        <div>
          <label
            htmlFor="instagramUsername"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Username Instagram (IG)
          </label>
          <input
            id="instagramUsername"
            type="text"
            {...register('instagramUsername')}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.instagramUsername
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: ryanmaulana"
          />
          {errors.instagramUsername && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {errors.instagramUsername.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 rounded-pill bg-terracotta hover:bg-terracotta-dark py-4 text-md font-bold text-white shadow-md transition-all text-center cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Mengirim Data...' : 'Kirim Foto ke Email ✉️'}
        </button>
      </form>
    </div>
  );
}
