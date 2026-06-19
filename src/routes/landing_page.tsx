import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type SetStateAction } from 'react'
import { FaGithub, FaInstagram } from 'react-icons/fa'
import {
  Briefcase,
  ChevronRight,
  Code2,
  Lock,
  LayoutDashboard,
  Mail,
  Phone,
  Menu,
  School,
  User,
  X,
} from 'lucide-react'
import { getPortfolios, getSkills } from '../lib/api'


// --- INTERFACE TYPESCRIPT ---
interface Portfolio {
  id: string
  judul: string
  deskripsi: string
  gambar: string
  tag: string
  github: string
}

interface Skill {
  id: string
  judul: string
  deskripsi: string
  tag: string
}

export const Route = createFileRoute('/landing_page')({
  component: LandingPage,
})

export default function LandingPage() {
  const navigate = useNavigate()

  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true)


  useEffect(() => {
    getPortfolios()
      .then((res: { success: any; data: SetStateAction<Portfolio[]> }) => {
        if (res.success) setPortfolios(res.data)
        setIsLoadingPortfolios(false)
      })
      .catch(() => setIsLoadingPortfolios(false))

    getSkills()
      .then((res: { success: any; data: SetStateAction<Skill[]> }) => {
        if (res.success) setSkills(res.data)
      })
  }, [])

  const goToLanding = () => setIsMobileMenuOpen(false)

  const contactMailto = 'mailto:nazwanasyahrani@gmail.com'
  const contactInstagram = 'https://instagram.com/ntninzwgsla'
  const contactSchoolSearch =
    'https://www.google.com/search?q=SMKS+PGRI+WLINGI'


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 font-sans text-slate-100 overflow-x-hidden relative">
      {/* Background dekoratif */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-indigo-700 rounded-full mix-blend-multiply filter blur-[110px] opacity-20 z-0 animate-pulse" />
      <div className="fixed top-[20%] right-[-5%] w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-[90px] opacity-15 z-0 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-[-10%] left-[20%] w-80 h-80 bg-purple-800 rounded-full mix-blend-multiply filter blur-[110px] opacity-10 z-0 animate-pulse" style={{ animationDelay: '4s' }} />

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-slate-900/80 backdrop-blur-md border-b border-indigo-800/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={goToLanding}>
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
                <Code2 size={24} />
              </div>
              <span className="font-bold text-xl text-indigo-300 tracking-tight">
                N9n<span className="text-purple-400">Port</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-300 hover:text-purple-400 font-medium transition-colors">Home</a>
              <a href="#tentang" className="text-slate-300 hover:text-purple-400 font-medium transition-colors">Tentang</a>
              <a href="#keahlian" className="text-slate-300 hover:text-purple-400 font-medium transition-colors">Keahlian</a>
              <a href="#portofolio" className="text-slate-300 hover:text-purple-400 font-medium transition-colors">Portofolio</a>
              <button
                onClick={() => navigate({ to: '/login' })}
                className="flex items-center gap-2 bg-indigo-900/40 text-purple-400 px-4 py-2 rounded-full font-semibold hover:bg-indigo-900/60 transition-all shadow-sm border border-indigo-700/50"
                aria-label="Toggle theme"
              >
                <Lock size={16} /> Admin
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => navigate({ to: '/login' })} className="text-purple-400 p-2" aria-label="Login Admin">
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-indigo-800/40 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:bg-indigo-900/40 rounded-md">Home</a>
              <a href="#tentang" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:bg-indigo-900/40 rounded-md">Tentang</a>
              <a href="#keahlian" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:bg-indigo-900/40 rounded-md">Keahlian</a>
              <a href="#portofolio" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:bg-indigo-900/40 rounded-md">Portofolio</a>
              <button onClick={() => navigate({ to: '/login' })} className="mt-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium shadow-sm">
                <Lock size={16} /> Login Admin
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* MAIN */}
      <main className="relative z-10 pt-16">
        {/* HERO */}
        <section id="home" className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h4 className="text-5xl md:text-6xl font-extrabold text-slate-100 leading-tight">
              Natania Nazwa
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600">
                Gisella Nasyahrani
              </span>
            </h4>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Di era digital saat ini, dunia coding menjadi salah satu keterampilan penting yang terus berkembang. Sebagai siswa SMK jurusan Rekayasa Perangkat Lunak (RPL), proses belajar ini menjadi langkah awal untuk memahami bagaimana teknologi dibangun dan digunakan.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <a
                href="#portofolio"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-900/40 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Lihat Karya Saya <ChevronRight size={20} />
              </a>
              <a
                href="#kontak"
                className="flex items-center gap-2 bg-transparent border-2 border-purple-500/50 hover:border-purple-400 text-purple-400 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Hubungi Saya
              </a>
            </div>

            {/* Accent chips */}
            <div className="flex flex-wrap justify-center gap-2 pt-5">
              <span className="px-4 py-2 rounded-full bg-indigo-900/40 border border-indigo-800/40 text-indigo-200 text-sm font-semibold">
                Front-End • Tailwind
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-900/30 border border-indigo-800/40 text-purple-200 text-sm font-semibold">
                SMK RPL • Build & Learn
              </span>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <a
                href="https://github.com/natania-nazwa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900/70 rounded-full text-slate-400 hover:text-purple-400 hover:bg-indigo-900/40 shadow-sm border border-indigo-800/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <FaGithub size={22} />
              </a>
              <a
                href={contactMailto}
                className="p-3 bg-slate-900/70 rounded-full text-slate-400 hover:text-purple-400 hover:bg-indigo-900/40 shadow-sm border border-indigo-800/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>
        </section>

        {/* TENTANG */}
        <section id="tentang" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative flex justify-center">
                <div className="bg-indigo-900/400 w-80 h-[28rem] rounded-3xl rotate-3 opacity-15 absolute top-0 left-1/2 -translate-x-1/2" />
                <img
                  src="natania-portofolio.jpeg"
                  alt="Foto Profil"
                  className="relative z-10 w-80 h-[28rem] object-cover rounded-3xl shadow-[0_20px_60px_rgba(79,70,229,0.4)] border border-indigo-800/40"
                />
              </div>
              <div>
                <h2 className="text-purple-400 font-bold tracking-widest uppercase mb-2">Tentang Saya</h2>
                <h3 className="text-4xl font-bold text-slate-100 mb-6">Halo!, Saya Natania</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  Saya adalah siswa SMKS PGRI WLINGI jurusan Rekayasa Perangkat Lunak (RPL) yang tertarik pada dunia coding untuk memahami pembuatan website dan aplikasi serta pemanfaatan teknologi dalam mempermudah kehidupan sehari-hari.
                </p>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  Melalui PKL di software house, saya ingin mendapatkan pengalaman langsung dari industri agar kemampuan saya dalam membuat website bisa semakin berkembang.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-slate-900/70 rounded-2xl border border-indigo-800/40 hover:shadow-md transition-shadow">
                    <User className="text-purple-400 mb-2" />
                    <p className="font-bold text-slate-100">Motivasi</p>
                    <p className="text-sm text-slate-400">Belajar & Berkembang</p>
                  </div>
                  <div className="p-4 bg-slate-900/70 rounded-2xl border border-indigo-800/40 hover:shadow-md transition-shadow">
                    <LayoutDashboard className="text-purple-400 mb-2" />
                    <p className="font-bold text-slate-100">Fokus</p>
                    <p className="text-sm text-slate-400">Front-End Development</p>
                  </div>
                  <div className="p-4 bg-slate-900/70 rounded-2xl border border-indigo-800/40 hover:shadow-md transition-shadow">
                    <Mail className="text-purple-400 mb-2" />
                    <p className="font-bold text-slate-100">Email</p>
                    <p className="text-sm text-slate-400 break-all">nazwanasyahrani@gmail.com</p>
                  </div>
                  <div className="p-4 bg-slate-900/70 rounded-2xl border border-indigo-800/40 hover:shadow-md transition-shadow">
                    <FaInstagram className="text-purple-400 mb-2" />
                    <p className="font-bold text-slate-100">Instagram</p>
                    <p className="text-sm text-slate-400">@ntninzwgsla</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEAHLIAN */}
        <section id="keahlian" className="py-20 bg-slate-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-purple-400 tracking-widest uppercase mb-2">Keahlian Saya</h2>
              <h3 className="text-3xl font-bold text-slate-100">Kemampuan yang Saya Miliki</h3>
            </div>

            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group bg-slate-900/70 p-5 rounded-3xl border border-indigo-800/40 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col min-h-[280px]"
                  >
                    <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-400 mb-6 ring-1 ring-indigo-500/10 group-hover:ring-purple-400/20 transition-all">
                      <LayoutDashboard size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-purple-400 transition-colors">{skill.judul}</h4>
                    <p className="text-slate-400 mb-6 flex-1">{skill.deskripsi}</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.tag.split(',').map((t, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-900/60 text-purple-400 text-xs font-bold rounded-full shadow-sm ring-1 ring-indigo-500/10"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/70 p-5 rounded-3xl border border-indigo-800/40 flex flex-col min-h-[280px] animate-pulse"
                  >
                    <div className="bg-indigo-900/40 w-14 h-14 rounded-2xl mb-6 ring-1 ring-indigo-500/10" />
                    <div className="h-6 bg-slate-800/60 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-slate-800/60 rounded w-full mb-3" />
                    <div className="h-4 bg-slate-800/60 rounded w-5/6 mb-3" />
                    <div className="h-4 bg-slate-800/60 rounded w-4/6" />
                    <div className="flex flex-wrap gap-2 mt-6">
                      <div className="h-6 bg-slate-800/60 rounded-full w-20" />
                      <div className="h-6 bg-slate-800/60 rounded-full w-24" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PORTOFOLIO */}
        <section id="portofolio" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="text-sm font-bold text-purple-400 tracking-widest uppercase mb-2">Karya Saya</h2>
                <h3 className="text-3xl font-bold text-slate-100">Portofolio & Proyek Terbaru</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingPortfolios ? (
              <div className="col-span-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/70 rounded-3xl overflow-hidden border border-indigo-800/40 animate-pulse"
                    >
                      <div className="h-56 bg-slate-800/60" />
                      <div className="p-6">
                        <div className="h-5 bg-slate-800/60 rounded w-2/3 mb-3" />
                        <div className="h-3 bg-slate-800/60 rounded w-full mb-2" />
                        <div className="h-3 bg-slate-800/60 rounded w-5/6 mb-2" />
                        <div className="h-3 bg-slate-800/60 rounded w-4/6 mb-6" />
                        <div className="h-9 bg-slate-800/60 rounded w-2/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : portfolios.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-slate-900/70 rounded-3xl border border-dashed border-indigo-700/50">
                <Briefcase size={48} className="mx-auto text-purple-500 mb-4" />
                <p className="text-slate-500">Belum ada portofolio yang ditambahkan.</p>
              </div>
            ) : (
                portfolios.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-900/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-900/50 border border-indigo-800/40 transition-all duration-300 flex flex-col hover:-translate-y-2"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.gambar || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                        alt={item.judul}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
                        }}
                      />
                      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                        {item.tag.split(',').slice(0, 2).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-900/80 backdrop-blur text-purple-400 text-xs font-bold rounded-md border border-indigo-800/40">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">{item.judul}</h4>
                      <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{item.deskripsi}</p>
                      <div className="pt-4 border-t border-indigo-800/40 flex justify-between items-center">
                        <a
                          href={item.github || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-purple-400 font-bold text-sm hover:text-purple-400"
                        >
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

        {/* KONTAK */}
        <section id="kontak" className="py-20 bg-slate-900/60 border-t border-indigo-800/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-700 opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

            {/* Animated Heading */}
            <div className="mb-4">
              <h2 className="text-sm font-bold text-purple-400 tracking-widest uppercase mb-4 animate-pulse">Kontak</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 animate-fade-in-up">
                Mari Berkolaborasi!
              </h3>
            </div>

            <p className="text-slate-400 mb-16 text-lg leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Portofolio ini berisi hasil pembelajaran dan proyek yang telah saya kerjakan. Mari terhubung dan berbagi wawasan seputar teknologi.
            </p>

            {/* Contact Info Cards - Centered with Hover Preview + Click */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">

              {/* Phone Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                {/* Hover Preview Card - Uniform Size */}
                <div className="absolute -top-[14rem] left-1/2 -translate-x-1/2 w-64 bg-slate-800/95 backdrop-blur rounded-2xl border border-indigo-700/50 shadow-[0_0_40px_rgba(79,70,229,0.3)] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-indigo-900/40 rounded-full flex items-center justify-center text-purple-400">
                      <Phone size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-100">+62 813-3593-4870</p>
                      <p className="text-xs text-slate-400">Klik untuk menghubungi</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">📞 Telepon / WhatsApp</p>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-r border-b border-indigo-700/50 rotate-45"></div>
                </div>
                <a
                  href={"tel:+6281335934870"}
                  className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <Phone size={28} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Telepon</p>
                  <p className="text-slate-100 font-bold text-sm group-hover:text-purple-400 transition-colors">+62 813-3593-4870</p>
                </a>
              </div>

              {/* Email Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {/* Hover Preview Card - Uniform Size */}
                <div className="absolute -top-[14rem] left-1/2 -translate-x-1/2 w-64 bg-slate-800/95 backdrop-blur rounded-2xl border border-indigo-700/50 shadow-[0_0_40px_rgba(79,70,229,0.3)] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-indigo-900/40 rounded-full flex items-center justify-center text-purple-400">
                      <Mail size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-100">Email</p>
                      <p className="text-xs text-slate-400">Klik untuk mengirim email</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">✉️ nazwanasyahrani@gmail.com</p>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-r border-b border-indigo-700/50 rotate-45"></div>
                </div>
                <a
                  href={contactMailto}
                  className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <Mail size={28} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Email</p>
                  <p className="text-slate-100 font-bold text-sm break-all group-hover:text-purple-400 transition-colors">nazwanasyahrani@gmail.com</p>
                </a>
              </div>

              {/* Instagram Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                {/* Hover Preview Card - Uniform Size */}
                <div className="absolute -top-[14rem] left-1/2 -translate-x-1/2 w-64 bg-slate-800/95 backdrop-blur rounded-2xl border border-indigo-700/50 shadow-[0_0_40px_rgba(79,70,229,0.3)] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white">
                      <FaInstagram size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-100">@ntninzwgsla</p>
                      <p className="text-xs text-slate-400">Natania Nazwa</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-100">12</p>
                      <p className="text-[10px] text-slate-400">posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-100">245</p>
                      <p className="text-[10px] text-slate-400">followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-100">180</p>
                      <p className="text-[10px] text-slate-400">following</p>
                    </div>
                  </div>
                  <div className="bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg text-center">
                    Follow
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-r border-b border-indigo-700/50 rotate-45"></div>
                </div>
                <a
                  href={contactInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <FaInstagram size={28} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Instagram</p>
                  <p className="text-slate-100 font-bold text-lg group-hover:text-purple-400 transition-colors">@ntninzwgsla</p>
                </a>
              </div>

              {/* School Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                {/* Hover Preview Card - Uniform Size */}
                <div className="absolute -top-[14rem] left-1/2 -translate-x-1/2 w-64 bg-slate-800/95 backdrop-blur rounded-2xl border border-indigo-700/50 shadow-[0_0_40px_rgba(79,70,229,0.3)] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-indigo-900/40 rounded-full flex items-center justify-center text-purple-400">
                      <School size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-100">SMKS PGRI WLINGI</p>
                      <p className="text-xs text-slate-400">Rekayasa Perangkat Lunak</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">🏫 Klik untuk info sekolah</p>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-r border-b border-indigo-700/50 rotate-45"></div>
                </div>
                <a
                  href={contactSchoolSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <School size={28} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Sekolah</p>
                  <p className="text-slate-100 font-bold text-lg group-hover:text-purple-400 transition-colors">SMKS PGRI WLINGI</p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900/60 text-slate-300 py-8 border-t border-indigo-800/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={24} className="text-purple-400" />
            <span className="font-bold text-xl text-slate-100 tracking-tight">
              N9n<span className="text-purple-400">Port</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 text-center md:text-left">&copy; {new Date().getFullYear()} dibuat oleh Natania Nazwa Gisella Nasyahrani</p>
        </div>
      </footer>
    </div>
  )
}