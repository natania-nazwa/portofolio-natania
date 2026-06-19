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
  Menu,
  MonitorSmartphone,
  School,
  User,
  X,
  Code2 as Code2Icon,
} from 'lucide-react'
import { getPortfolios, getSkills, sendContact } from '../lib/api'


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

  const [nama, setNama] = useState('')
  const [emailKontak, setEmailKontak] = useState('')
  const [pesan, setPesan] = useState('')
  const [isSending, setIsSending] = useState(false)

  // const handleToggleTheme = () => toggleTheme()

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

  const handleKirimPesan = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    try {
      const result = await sendContact({ nama, email: emailKontak, pesan })
      if (result.success) {
        alert('Pesan berhasil dikirim!')
        setNama('')
        setEmailKontak('')
        setPesan('')
      } else {
        alert(result.message || 'Gagal mengirim pesan.')
      }
    } catch {
      alert('Terjadi kesalahan. Coba lagi.')
    } finally {
      setIsSending(false)
    }
  }

  const goToLanding = () => setIsMobileMenuOpen(false)

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
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="#portofolio" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-900/400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-1">
                Lihat Karya Saya <ChevronRight size={20} />
              </a>
              <a href="#kontak" className="flex items-center gap-2 bg-transparent border-2 border-purple-500/50 hover:border-purple-400 text-purple-400 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-1">
                Hubungi Saya
              </a>
            </div>
            <div className="flex justify-center gap-4 pt-6">
              <a href="https://github.com/natania-nazwa" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900/70 rounded-full text-slate-400 hover:text-purple-400 hover:bg-indigo-900/40 shadow-sm border border-indigo-800/40 transition-colors">
                <FaGithub size={22} />
              </a>
              <a href="mailto:nazwanasyahrani@gmail.com" className="p-3 bg-slate-900/70 rounded-full text-slate-400 hover:text-purple-400 hover:bg-indigo-900/40 shadow-sm border border-indigo-800/40 transition-colors">
                <Mail size={22} />
              </a>
            </div>
          </div>
        </section>

        {/* TENTANG */}
        <section id="tentang" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="bg-indigo-900/400 w-full h-96 rounded-3xl rotate-3 opacity-15 absolute top-0 left-0" />
                <img
                  src="natania-portofolio.jpeg"
                  alt="Profil Saya"
                  className="relative z-10 w-full h-96 object-cover rounded-3xl shadow-xl border border-indigo-800/40"
                />
              </div>
              <div>
                <h2 className="text-purple-400 font-bold tracking-widest uppercase mb-2">Tentang Saya</h2>
                <h3 className="text-4xl font-bold text-slate-100 mb-6">Halo!, Saya Natania</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  Saya adalah siswa SMKS PGRI WLINGI jurusan Rekayasa Perangkat Lunak (RPL). Saya memiliki ketertarikan di dunia coding karena saya ingin memahami bagaimana sebuah website dan aplikasi dibuat serta bagaimana teknologi dapat digunakan untuk mempermudah kehidupan sehari-hari.
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
                  <div key={skill.id} className="bg-slate-900/70 p-5 rounded-3xl border border-indigo-800/40 hover:shadow-lg transition-shadow flex flex-col min-h-[280px]">
                    <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-400 mb-6">
                      <LayoutDashboard size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3">{skill.judul}</h4>
                    <p className="text-slate-400 mb-6 flex-1">{skill.deskripsi}</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.tag.split(',').map((t, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-900/60 text-purple-400 text-xs font-bold rounded-full shadow-sm">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900/70 p-5 rounded-3xl border border-indigo-800/40 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                  <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-400 mb-6">
                    <LayoutDashboard size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-100 mb-3">HTML & CSS</h4>
                  <p className="text-slate-400 mb-6">Membangun tampilan website yang terstruktur, responsif, dan menarik.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-indigo-900/60 text-purple-400 text-xs font-bold rounded-full shadow-sm">HTML5</span>
                    <span className="px-3 py-1 bg-indigo-900/60 text-purple-400 text-xs font-bold rounded-full shadow-sm">CSS3</span>
                  </div>
                </div>
                <div className="bg-slate-900/70 p-5 rounded-3xl border border-indigo-800/40 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                  <div className="bg-purple-900/40 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-400 mb-6">
                    <Code2Icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-100 mb-3">React.js</h4>
                  <p className="text-slate-400 mb-6">Mengembangkan antarmuka web yang modern dan interaktif.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-900/60 text-purple-400 text-xs font-bold rounded-full shadow-sm">React.js</span>
                    <span className="px-3 py-1 bg-purple-900/60 text-purple-400 text-xs font-bold rounded-full shadow-sm">Tailwind</span>
                  </div>
                </div>
                <div className="bg-slate-900/70 p-5 rounded-3xl border border-indigo-800/40 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                  <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-indigo-400 mb-6">
                    <MonitorSmartphone size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-100 mb-3">UI/UX Design</h4>
                  <p className="text-slate-400 mb-6">Merancang prototipe dan wireframe sebelum pengembangan.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-indigo-900/60 text-indigo-400 text-xs font-bold rounded-full shadow-sm">Figma</span>
                    <span className="px-3 py-1 bg-indigo-900/60 text-indigo-400 text-xs font-bold rounded-full shadow-sm">Canva</span>
                  </div>
                </div>
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
                <div className="col-span-full text-center py-20">
                  <p className="text-slate-500">Memuat portofolio...</p>
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

            {/* Contact Info Cards - Centered with Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {/* Email Card */}
              <a 
                href="mailto:nazwanasyahrani@gmail.com" 
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => window.location.href = 'mailto:nazwanasyahrani@gmail.com', 500); }}
                className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up cursor-pointer block" 
                style={{ animationDelay: '0.4s' }}
              >
                <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                  <Mail size={28} />
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">Email</p>
                <p className="text-slate-100 font-bold text-sm break-all group-hover:text-purple-400 transition-colors">nazwanasyahrani@gmail.com</p>
              </a>

              {/* Instagram Card */}
              <a 
                href="https://instagram.com/ntninzwgsla" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => window.open('https://instagram.com/ntninzwgsla', '_blank'), 500); }}
                className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up cursor-pointer block" 
                style={{ animationDelay: '0.6s' }}
              >
                <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                  <FaInstagram size={28} />
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">Instagram</p>
                <p className="text-slate-100 font-bold text-lg group-hover:text-purple-400 transition-colors">@ntninzwgsla</p>
              </a>

              {/* School Card */}
              <a 
                href="https://www.google.com/search?q=SMKS+PGRI+WLINGI" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => window.open('https://www.google.com/search?q=SMKS+PGRI+WLINGI', '_blank'), 500); }}
                className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up cursor-pointer block" 
                style={{ animationDelay: '0.8s' }}
              >
                <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                  <School size={28} />
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">Sekolah</p>
                <p className="text-slate-100 font-bold text-lg group-hover:text-purple-400 transition-colors">SMKS PGRI WLINGI</p>
              </a>
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
          <p className="text-sm text-slate-400 text-center md:text-left">&copy; {new Date().getFullYear()} DevPorto. Dibuat dengan React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}