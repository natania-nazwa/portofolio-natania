import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const API_URL = "https://backend-portofolio-production-cd5b.up.railway.app";

async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Login gagal. Email atau password salah.';
      try {
        const data = await response.json();
        if (data && data.message) {
          errorMessage = data.message;
        }
      } catch (e) {
        // Abaikan jika response bukan JSON
      }
      return { success: false, message: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: 'Koneksi ke server terputus. Pastikan server aktif.' };
  }
}

export const Route = createFileRoute('/login')({
    component: Login,
});

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      localStorage.setItem("token", result.data?.data?.token || result.data?.token);

      const adminData = result.data?.data?.admin || result.data?.admin;
      if (adminData) {
        localStorage.setItem("admin", JSON.stringify(adminData));
      }

      localStorage.setItem("role", "admin");
      navigate({ to: "/dashboard" });
    } else {
      setError(result.message ?? 'Login gagal. Silakan coba lagi.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 font-sans text-slate-100"> 


      {/* Background Dekoratif */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-indigo-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-15 z-0 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-[80px] opacity-12 z-0 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Container Card */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-[0_18px_60px_rgba(79,70,229,0.25)] overflow-hidden border border-indigo-700/50 relative z-10">


      {/* Tombol Kembali */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="group flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Kembali</span>
          </button>
        </div>

        {/* Header Bagian Atas */}
        <div className="px-8 pt-10 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-900/40 text-indigo-400 rounded-full flex items-center justify-center mb-4 shadow-sm border border-indigo-700/50">
            <Lock size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Selamat Datang</h2>
          <p className="text-slate-400 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        {/* Form Login */}
        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-700/40 text-red-400 px-4 py-3 rounded-xl text-sm shadow-sm">
                {error}
              </div>
            )}


            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Alamat Email
              </label>
              <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-indigo-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-indigo-500 transition-all duration-200"
                  placeholder="nama@email.com"
                  required
                />

              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Kata Sandi
              </label>
              <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-800/80 border border-indigo-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-indigo-500 transition-all duration-200"

                  placeholder="••••••••"
                  required
                />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-indigo-400 hover:text-purple-500 focus:outline-none"
              >

                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

              {/* Lupa Kata Sandi & Ingat Saya */}
              <div className="flex items-center justify-between text-sm mt-2">
                <label className="flex items-center text-slate-400/80 cursor-pointer">

                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-purple-300 text-indigo-400 focus:ring-purple-200 bg-white/80"
                />
                <span className="ml-2 text-slate-300/90">Ingat saya</span>

              </label>
              <a href="#" className="font-semibold text-purple-700 hover:text-indigo-400 transition-colors">
                Lupa sandi?
              </a>

            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 mt-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-slate-950 focus:ring-purple-500 transition-all duration-200 flex justify-center items-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-15" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}