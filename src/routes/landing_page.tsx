import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, type SetStateAction } from 'react';
import { FaGithub, FaInstagram } from "react-icons/fa";
import { 
  Briefcase, 
  Mail, 
  Lock,
  LayoutDashboard,
  Code2,
  MonitorSmartphone,
  ChevronRight,
  Menu,
  X,
  Send,
  School,
  User,
} from 'lucide-react';
import { getPortfolios, getSkills, sendContact } from '../lib/api';

// --- INTERFACE TYPESCRIPT ---
interface Portfolio {
  id: string;
  judul: string;
  deskripsi: string;
  gambar: string;
  tag: string;
  github: string;
}

interface Skill {
  id: string;
  judul: string;
  deskripsi: string;
  tag: string;
}

export const Route = createFileRoute('/landing_page')({
    component: LandingPage,
});

export default function LandingPage() {
  const navigate = useNavigate()

  // --- STATE MANAGEMENT ---
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);

  // --- STATE FORM KONTAK ---
  const [nama, setNama] = useState('');
  const [emailKontak, setEmailKontak] = useState('');
  const [pesan, setPesan] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- FETCH DATA DARI API ---
  useEffect(() => {
    getPortfolios().then((res: { success: any; data: SetStateAction<Portfolio[]>; }) => {
      if (res.success) setPortfolios(res.data);
      setIsLoadingPortfolios(false);
    }).catch(() => setIsLoadingPortfolios(false));

    getSkills().then((res: { success: any; data: SetStateAction<Skill[]>; }) => {
      if (res.success) setSkills(res.data);
    });
  }, []);

  // --- HANDLER FORM KONTAK ---
  const handleKirimPesan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const result = await sendContact({ nama, email: emailKontak, pesan });
      if (result.success) {
        alert('Pesan berhasil dikirim!');
        setNama('');
        setEmailKontak('');
        setPesan('');
      } else {
        alert(result.message || 'Gagal mengirim pesan.');
      }
    } catch {
      alert('Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsSending(false);
    }
  };

  const goToLanding = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden relative">

      {/* Background Dekoratif */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 z-0 animate-pulse"></div>
      <div className="fixed top-[20%] right-[-5%] w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 z-0 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed bottom-[-10%] left-[20%] w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 z-0 animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={goToLanding}>
              <div className="bg-purple-600 p-2 rounded-lg text-white">
                <Code2 size={24} />
              </div>
              <span className="font-bold text-xl text-purple-900 tracking-tight">N9n<span className="text-purple-500">Port</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-600 hover:text-purple-600 font-medium transition-colors">Home</a>
              <a href="#tentang" className="text-slate-600 hover:text-purple-600 font-medium transition-colors">Tentang</a>
              <a href="#keahlian" className="text-slate-600 hover:text-purple-600 font-medium transition-colors">Keahlian</a>
              <a href="#portofolio" className="text-slate-600 hover:text-purple-600 font-medium transition-colors">Portofolio</a>
              <button onClick={() => navigate({ to: '/login' })} className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold hover:bg-purple-200 transition-all shadow-sm">
                <Lock size={16} /> Admin
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-purple-600 p-2">
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-purple-100 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-purple-50 rounded-md">Home</a>
              <a href="#tentang" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-purple-50 rounded-md">Tentang</a>
              <a href="#keahlian" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-purple-50 rounded-md">Keahlian</a>
              <a href="#portofolio" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-purple-50 rounded-md">Portofolio</a>
              <button onClick={() => navigate({ to: '/login' })} className="mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md font-medium">
                <Lock size={16} /> Login Admin
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 pt-16">

        {/* HERO SECTION */}
        <section id="home" className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h4 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Natania Nazwa
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500">
                Gisella Nasyahrani
              </span>
            </h4>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Di era digital saat ini, dunia coding menjadi salah satu keterampilan penting yang terus berkembang. Sebagai siswa SMK jurusan Rekayasa Perangkat Lunak (RPL), proses belajar ini menjadi langkah awal untuk memahami bagaimana teknologi dibangun dan digunakan.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="#portofolio" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 hover:-translate-y-1">
                Lihat Karya Saya <ChevronRight size={20} />
              </a>
              <a href="#kontak" className="flex items-center gap-2 bg-white border-2 border-purple-200 hover:border-purple-400 text-purple-700 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-1">
                Hubungi Saya
              </a>
            </div>
            <div className="flex justify-center gap-4 pt-6">
              <a href="https://github.com/natania-nazwa" className="p-3 bg-white rounded-full text-slate-500 hover:text-purple-600 hover:bg-purple-50 shadow-sm border border-slate-100 transition-colors">
                <FaGithub size={22} />
              </a>
              <a href="mailto:nazwanasyahrani@gmail.com" className="p-3 bg-white rounded-full text-slate-500 hover:text-purple-600 hover:bg-purple-50 shadow-sm border border-slate-100 transition-colors">
                <Mail size={22} />
              </a>
            </div>
          </div>
        </section>

        {/* PERKENALAN SECTION */}
        <section id="tentang" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="bg-purple-600 w-full h-96 rounded-3xl rotate-3 opacity-20 absolute top-0 left-0"></div>
                <img
                  src="natania-portofolio.jpeg"
                  alt="Profil Saya"
                  className="relative z-10 w-full h-96 object-cover rounded-3xl shadow-xl"
                />
              </div>
              <div>
                <h2 className="text-purple-600 font-bold tracking-widest uppercase mb-2">Tentang Saya</h2>
                <h3 className="text-4xl font-bold text-slate-900 mb-6">Halo!, Saya Natania</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  Saya adalah siswa SMKS PGRI WLINGI jurusan Rekayasa Perangkat Lunak (RPL). Saya memiliki ketertarikan di dunia coding karena saya ingin memahami bagaimana sebuah website dan aplikasi dibuat serta bagaimana teknologi dapat digunakan untuk mempermudah kehidupan sehari-hari.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  Melalui PKL di software house, saya ingin mendapatkan pengalaman langsung dari industri agar kemampuan saya dalam membuat website bisa semakin berkembang.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <User className="text-purple-600 mb-2" />
                    <p className="font-bold text-slate-800">Motivasi</p>
                    <p className="text-sm text-slate-500">Belajar & Berkembang</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <Code2 className="text-purple-600 mb-2" />
                    <p className="font-bold text-slate-800">Fokus</p>
                    <p className="text-sm text-slate-500">Front-End Development</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <Mail className="text-purple-600 mb-2" />
                    <p className="font-bold text-slate-800">Email</p>
                    <p className="text-sm text-slate-500 break-all">nazwanasyahrani@gmail.com</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <FaInstagram className="text-purple-600 mb-2" />
                    <p className="font-bold text-slate-800">Instagram</p>
                    <p className="text-sm text-slate-500">@ntninzwgsla</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="keahlian" className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-purple-600 tracking-widest uppercase mb-2">Keahlian Saya</h2>
              <h3 className="text-3xl font-bold text-slate-900">Kemampuan yang Saya Miliki</h3>
            </div>

            {/* Jika skills dari API kosong, tampilkan card statis */}
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-purple-50 p-5 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow flex flex-col min-h-[280px]">
                    <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-600 mb-6">
                      <LayoutDashboard size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-3">{skill.judul}</h4>
                    <p className="text-slate-600 mb-6 flex-1">{skill.deskripsi}</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.tag.split(',').map((t, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-purple-700 text-xs font-bold rounded-full shadow-sm">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Fallback card statis kalau API belum ada data
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                  <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-600 mb-6">
                    <LayoutDashboard size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">HTML & CSS</h4>
                  <p className="text-slate-600 mb-6">Membangun tampilan website yang terstruktur, responsif, dan menarik.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white text-purple-700 text-xs font-bold rounded-full shadow-sm">HTML5</span>
                    <span className="px-3 py-1 bg-white text-purple-700 text-xs font-bold rounded-full shadow-sm">CSS3</span>
                  </div>
                </div>
                <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                  <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-fuchsia-600 mb-6">
                    <Code2 size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">React.js</h4>
                  <p className="text-slate-600 mb-6">Mengembangkan antarmuka web yang modern dan interaktif.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white text-fuchsia-700 text-xs font-bold rounded-full shadow-sm">React.js</span>
                    <span className="px-3 py-1 bg-white text-fuchsia-700 text-xs font-bold rounded-full shadow-sm">Tailwind</span>
                  </div>
                </div>
                <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                  <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-blue-600 mb-6">
                    <MonitorSmartphone size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">UI/UX Design</h4>
                  <p className="text-slate-600 mb-6">Merancang prototipe dan wireframe sebelum pengembangan.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-full shadow-sm">Figma</span>
                    <span className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-full shadow-sm">Canva</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PORTOFOLIO SECTION */}
        <section id="portofolio" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="text-sm font-bold text-purple-600 tracking-widest uppercase mb-2">Karya Saya</h2>
                <h3 className="text-3xl font-bold text-slate-900">Portofolio & Proyek Terbaru</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingPortfolios ? (
                // Loading state
                <div className="col-span-full text-center py-20">
                  <p className="text-slate-400">Memuat portofolio...</p>
                </div>
              ) : portfolios.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-purple-200">
                  <Briefcase size={48} className="mx-auto text-purple-200 mb-4" />
                  <p className="text-slate-500">Belum ada portofolio yang ditambahkan.</p>
                </div>
              ) : (
                portfolios.map((item) => (
                  <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col hover:-translate-y-2">
                    {/* Gambar Card */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-purple-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={item.gambar || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                        alt={item.judul}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'; }}
                      />
                      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                        {item.tag.split(',').slice(0, 2).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/90 backdrop-blur text-purple-900 text-xs font-bold rounded-md">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Konten Card */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">{item.judul}</h4>
                      <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">{item.deskripsi}</p>
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <a href={item.github || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-purple-600 font-bold text-sm hover:text-purple-800">
                          View on GitHub <FaGithub size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* KONTAK SECTION */}
        <section id="kontak" className="py-20 bg-purple-50 border-t border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 opacity-30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Info Kontak */}
              <div>
                <h2 className="text-sm font-bold text-purple-600 tracking-widest uppercase mb-2">Kontak</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Mari Berkolaborasi!</h3>
                <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-lg">
                  Portofolio ini berisi hasil pembelajaran dan proyek yang telah saya kerjakan. Mari terhubung dan berbagi wawasan seputar teknologi.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="bg-white p-4 rounded-2xl border border-purple-100 text-purple-600 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Email</p>
                      <p className="text-slate-800 font-bold text-lg">nazwanasyahrani@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="bg-white p-4 rounded-2xl border border-purple-100 text-purple-600 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                      <FaInstagram size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Instagram</p>
                      <p className="text-slate-800 font-bold text-lg">@ntninzwgsla</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="bg-white p-4 rounded-2xl border border-purple-100 text-purple-600 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                      <School size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Sekolah</p>
                      <p className="text-slate-800 font-bold text-lg">SMKS PGRI WLINGI</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Kontak */}
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-purple-100 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 to-fuchsia-300 rounded-[2rem] blur-lg opacity-30 -z-10"></div>
                <h4 className="text-2xl font-bold text-slate-800 mb-8">Kirim Pesan</h4>

                {/* ✅ Form yang benar - onSubmit ada di tag form */}
                <form className="space-y-5" onSubmit={handleKirimPesan}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={emailKontak}
                      onChange={(e) => setEmailKontak(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pesan</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tuliskan pesan Anda..."
                      value={pesan}
                      onChange={(e) => setPesan(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50 focus:bg-white transition-colors resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSending}
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-purple-500/30 flex justify-center items-center gap-2 mt-4 ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSending ? 'Mengirim...' : <> Kirim Pesan <Send size={18} /> </>}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={24} className="text-purple-500" />
            <span className="font-bold text-xl text-white tracking-tight">N9n<span className="text-purple-500">Port</span></span>
          </div>
          <p className="text-sm text-center md:text-left">&copy; {new Date().getFullYear()} DevPorto. Dibuat dengan React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}