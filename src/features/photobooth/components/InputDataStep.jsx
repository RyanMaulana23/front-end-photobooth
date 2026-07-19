export default function InputDataStep({
  formData,
  setFormData,
  formErrors,
  handleFormSubmit,
}) {
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
        onSubmit={handleFormSubmit}
        className="bg-white rounded-3xl border border-line p-6 md:p-8 shadow-sm flex flex-col gap-4"
      >
        {/* Nama Field */}
        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Nama Lengkap
          </label>
          <input
            id="nama"
            type="text"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              formErrors.nama
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: Ryan Maulana"
          />
          {formErrors.nama && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {formErrors.nama}
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
            value={formData.npm}
            onChange={(e) => setFormData({ ...formData, npm: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              formErrors.npm
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: 50421888"
          />
          {formErrors.npm && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {formErrors.npm}
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
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              formErrors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: ryan@student.univ.ac.id"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {formErrors.email}
            </p>
          )}
        </div>

        {/* No HP Field */}
        <div>
          <label
            htmlFor="nohp"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Nomor HP (WhatsApp)
          </label>
          <input
            id="nohp"
            type="text"
            value={formData.nohp}
            onChange={(e) => setFormData({ ...formData, nohp: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              formErrors.nohp
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: 081234567890"
          />
          {formErrors.nohp && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {formErrors.nohp}
            </p>
          )}
        </div>

        {/* Jurusan Field */}
        <div>
          <label
            htmlFor="jurusan"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Jurusan / Program Studi
          </label>
          <input
            id="jurusan"
            type="text"
            value={formData.jurusan}
            onChange={(e) =>
              setFormData({ ...formData, jurusan: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              formErrors.jurusan
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: Informatika"
          />
          {formErrors.jurusan && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {formErrors.jurusan}
            </p>
          )}
        </div>

        {/* Instagram Field */}
        <div>
          <label
            htmlFor="ig"
            className="block text-sm font-semibold text-[#5c5449] mb-1"
          >
            Username Instagram (IG)
          </label>
          <input
            id="ig"
            type="text"
            value={formData.ig}
            onChange={(e) => {
              let val = e.target.value;
              if (val && !val.startsWith('@')) val = '@' + val;
              setFormData({ ...formData, ig: val });
            }}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
              formErrors.ig
                ? 'border-red-500 focus:border-red-500'
                : 'border-line focus:border-terracotta'
            }`}
            placeholder="cth: @ryanmaulana"
          />
          {formErrors.ig && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {formErrors.ig}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 rounded-pill bg-terracotta hover:bg-terracotta-dark py-4 text-md font-bold text-white shadow-md transition-all text-center"
        >
          Kirim Foto ke Email ✉️
        </button>
      </form>
    </div>
  );
}
