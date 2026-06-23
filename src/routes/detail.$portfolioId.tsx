import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import {
  Briefcase,
  Menu,
  X,
  Lock,
  ChevronRight,
  Code2,
  Calendar,
  Users,
  Clock,
  Tag,
  CheckCircle,
  Sun,
  Moon,
  ArrowLeft,
  ExternalLink,
  Layers,
  FolderGit,
} from 'lucide-react'

import { getPortfolioById, getPortfolios } from '../lib/api'

// --- INTERFACE ---
interface Portfolio {
  id: string
  judul: string
  deskripsi: string
  gambar: string
  tag: string
  github: string
  features?: string[]
  startDate?: string | null
  endDate?: string | null
  roles?: string[]
  workType?: 'Individu' | 'Tim' | null
  durasi?: { days: number } | null
}

export const Route = createFileRoute('/detail/$portfolioId')({
  component: PortfolioDetailPage,
})

export default function PortfolioDetailPage() {
  const { portfolioId } = Route.useParams()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [relatedPortfolios, setRelatedPortfolios] = useState<Portfolio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ===== DARK MODE STATE =====
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('n9n-theme')
    if (saved) {
      setIsDarkMode(saved === 'dark')
    } else {
      setIsDarkMode(true)
      localStorage.setItem('n9n-theme', 'dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('n9n-theme', next ? 'dark' : 'light')
      return next
    })
  }

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Guard supaya tidak memanggil endpoint dengan literal "$portfolioId".
      // Jika terjadi, tampilkan fallback "Karya Tidak Ditemukan" (UI tidak berubah).
      const isUuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(portfolioId))
      if (!isUuidV4) {
        console.error('Invalid portfolioId param for detail route:', portfolioId)
        setPortfolio(null)
        return
      }

      try {
        const res = await getPortfolioById(portfolioId)
        if (res?.success && res.data) {
          setPortfolio(res.data)
        }


        const allRes = await getPortfolios({})
        if (allRes?.success && Array.isArray(allRes.data)) {
          const related = allRes.data
            .filter((p: Portfolio) => p.id !== portfolioId)
            .slice(0, 3)
          setRelatedPortfolios(related)
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [portfolioId])

  // ===== SCROLL REVEAL ANIMATION =====
  useEffect(() => {
    if (isLoading) return

    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px -50px 0px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
        } else {
          entry.target.classList.remove('reveal-visible')
        }
      })
    }, observerOptions)

    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [isLoading])

  // ===== THEME TOGGLE BUTTON =====
  const ThemeToggle = ({ className = '' }: { className?: string }) => (
    <button
      onClick={toggleDarkMode}
      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${className} ${
        isDarkMode
          ? 'bg-slate-800/90 text-yellow-400 hover:bg-slate-700 border border-slate-600 shadow-yellow-400/20'
          : 'bg-gradient-to-br from-indigo-100/90 via-purple-100/80 to-fuchsia-100/70 text-purple-600 hover:from-indigo-200 hover:via-purple-200 hover:to-fuchsia-200 border border-indigo-200/40 shadow-sm'
      }`}
      title={isDarkMode ? 'Mode Terang ☀️' : 'Mode Gelap 🌙'}
    >
      {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  )

  // ===== HELPER FUNCTIONS =====
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const calculateDuration = (start?: string | null, end?: string | null) => {
    if (!start || !end) return null
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-100 via-purple-100/80 to-fuchsia-100/50'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl animate-pulse ${
            isDarkMode ? 'bg-indigo-900/40' : 'bg-purple-200/50'
          }`} />
          <div className={`h-4 w-32 mx-auto rounded animate-pulse ${
            isDarkMode ? 'bg-slate-800' : 'bg-purple-200/50'
          }`} />
        </div>
      </div>
    )
  }

  // ===== NOT FOUND STATE =====
  if (!portfolio) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-indigo-100 via-purple-100/80 to-fuchsia-100/50 text-slate-800'
      }`}>
        <div className="text-center max-w-md mx-auto px-4">
          <Briefcase size={64} className={`mx-auto mb-6 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
          <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Karya Tidak Ditemukan
          </h2>
          <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Maaf, proyek yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <a
            href="/"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </a>
        </div>
      </div>
    )
  }

  // ===== MAIN RENDER =====
  return (
    <div className={`min-h-screen font-sans overflow-x-hidden relative transition-colors duration-500 w-full max-w-[100vw] ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-slate-100'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100/80 to-fuchsia-100/50 text-slate-800'
    }`}>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.2); }
          50% { box-shadow: 0 0 40px rgba(79, 70, 229, 0.4); }
        }
        .animate-gradient-text {
          background: linear-gradient(
            90deg,
            ${isDarkMode
              ? '#ffffff 0%, #e0e7ff 10%, #818cf8 20%, #a78bfa 35%, #c084fc 50%, #e879f9 65%, #c084fc 80%, #a78bfa 90%, #ffffff 100%'
              : '#9333ea 0%, #a855f7 50%, #9333ea 100%'
            }
          );
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gradient-shift 5s ease infinite;
          filter: drop-shadow(0 2px 12px ${isDarkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(147, 51, 234, 0.3)'});
        }
        .reveal {
          opacity: 0;
          transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                      filter 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity, transform, filter;
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0) scale(1) translateX(0) !important;
        }
        .reveal-fade-up {
          transform: translateY(50px);
        }
        .reveal-fade-up.reveal-visible {
          transform: translateY(0);
        }
        .reveal-scale-up {
          transform: scale(0.85);
        }
        .reveal-scale-up.reveal-visible {
          transform: scale(1);
        }
        .reveal-slide-left {
          transform: translateX(-40px);
        }
        .reveal-slide-left.reveal-visible {
          transform: translateX(0);
        }
        .reveal-slide-right {
          transform: translateX(40px);
        }
        .reveal-slide-right.reveal-visible {
          transform: translateX(0);
        }
        .reveal-fade {
          transform: none;
        }
        .reveal-blur {
          transform: none;
          filter: blur(8px);
        }
        .reveal-blur.reveal-visible {
          filter: blur(0);
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background decorative */}
      <div className={`fixed top-[-10%] left-[-10%] w-64 h-64 sm:w-96 sm:h-96 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[110px] opacity-20 z-0 animate-pulse transition-colors duration-500 ${
        isDarkMode ? 'bg-indigo-700' : 'bg-indigo-300/40'
      }`} />
      <div className={`fixed top-[20%] right-[-5%] w-48 h-48 sm:w-72 sm:h-72 rounded-full mix-blend-multiply filter blur-[60px] sm:blur-[90px] opacity-15 z-0 animate-pulse transition-colors duration-500 ${
        isDarkMode ? 'bg-purple-700' : 'bg-purple-300/35'
      }`} style={{ animationDelay: '2s' }} />
      <div className={`fixed bottom-[-10%] left-[20%] w-52 h-52 sm:w-80 sm:h-80 rounded-full mix-blend-multiply filter blur-[70px] sm:blur-[110px] opacity-10 z-0 animate-pulse transition-colors duration-500 ${
        isDarkMode ? 'bg-purple-800' : 'bg-indigo-300/30'
      }`} style={{ animationDelay: '4s' }} />

      {/* Dark Mode Toggle */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-500 ${
        isDarkMode
          ? 'bg-slate-900/80 border-indigo-800/40'
          : 'bg-gradient-to-r from-indigo-100/90 via-purple-100/80 to-fuchsia-100/70 border-indigo-200/40'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 rounded-lg"
            >
              <div className="p-2 rounded-xl bg-indigo-600">
                <Code2 size={20} className="text-white" />
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors duration-500 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                N9n<span className={`transition-colors duration-500 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>Port</span>
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'home', label: 'Home', href: '/#home' },
                { id: 'tentang', label: 'Tentang', href: '/#tentang' },
                { id: 'keahlian', label: 'Keahlian', href: '/#keahlian' },
                { id: 'portofolio', label: 'Portofolio', href: '/#portofolio' },
                { id: 'kontak', label: 'Kontak', href: '/#kontak' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'text-slate-400 hover:text-purple-400 hover:bg-indigo-900/20'
                      : 'text-slate-500 hover:text-purple-600 hover:bg-indigo-50/30'
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <a
                href="/login"
                className={`ml-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-indigo-900/40 text-purple-400 hover:bg-indigo-900/60 border border-indigo-700/50'
                    : 'bg-indigo-50/50 text-purple-600 hover:bg-indigo-100/50 border border-indigo-200/50'
                }`}
              >
                <Lock size={14} />
                Admin
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-300 hover:bg-indigo-900/30'
                  : 'text-slate-600 hover:bg-indigo-50/50'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t transition-colors duration-500 max-h-[80vh] overflow-y-auto overscroll-contain ${
            isDarkMode
              ? 'bg-slate-900/95 border-indigo-800/40'
              : 'bg-white/95 border-indigo-200/40'
          }`}>
            <div className="px-4 py-3 space-y-1">
              {[
                { id: 'home', label: 'Home', href: '/#home' },
                { id: 'tentang', label: 'Tentang', href: '/#tentang' },
                { id: 'keahlian', label: 'Keahlian', href: '/#keahlian' },
                { id: 'portofolio', label: 'Portofolio', href: '/#portofolio' },
                { id: 'kontak', label: 'Kontak', href: '/#kontak' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full text-left px-4 py-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between min-h-[48px] ${
                    isDarkMode
                      ? 'text-slate-400 hover:text-purple-400 hover:bg-indigo-900/20'
                      : 'text-slate-500 hover:text-purple-600 hover:bg-indigo-50/30'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              ))}

              <a
                href="/login"
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-indigo-900/40 text-purple-400 hover:bg-indigo-900/60 border border-indigo-700/50'
                    : 'bg-indigo-50/50 text-purple-600 hover:bg-indigo-100/50 border border-indigo-200/50'
                }`}
              >
                <Lock size={14} />
                Admin
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-14 sm:pt-16">
        {/* HERO SECTION - PROJECT BANNER */}
        <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-end overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={portfolio.gambar || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'}
              alt={portfolio.judul}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'
              }}
            />
            <div className={`absolute inset-0 transition-colors duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40'
                : 'bg-gradient-to-t from-indigo-100/95 via-indigo-100/70 to-transparent'
            }`} />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
            {/* Button Kembali - Dipisah dari breadcrumb agar tidak nabrak */}
            <div className="mb-4 reveal reveal-fade-up">
              <a
                href="/#portofolio"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 backdrop-blur-sm border ${
                  isDarkMode
                    ? 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-indigo-700/40'
                    : 'bg-white/60 text-slate-700 hover:text-slate-900 hover:bg-white/80 border-indigo-300/40'
                }`}
              >
                <ArrowLeft size={16} />
                Kembali ke Portofolio
              </a>
            </div>

            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 mb-4 text-sm reveal reveal-fade-up ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`} style={{ animationDelay: '0.1s' }}>
              <a href="/" className="hover:text-purple-400 transition-colors">Home</a>
              <ChevronRight size={14} />
              <a href="/#portofolio" className="hover:text-purple-400 transition-colors">Portofolio</a>
              <ChevronRight size={14} />
              <span className={`font-medium truncate max-w-[200px] sm:max-w-md ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {portfolio.judul}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 reveal reveal-fade-up ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`} style={{ animationDelay: '0.2s' }}>
              {portfolio.judul}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6 reveal reveal-fade-up" style={{ animationDelay: '0.3s' }}>
              {portfolio.tag.split(',').map((tech, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50'
                      : 'bg-indigo-100/80 text-indigo-700 border-indigo-300/50'
                  }`}
                >
                  {tech.trim()}
                </span>
              ))}
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 sm:gap-6 reveal reveal-fade-up" style={{ animationDelay: '0.4s' }}>
              {portfolio.workType && (
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Users size={18} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                  <span className="text-sm font-medium">{portfolio.workType}</span>
                </div>
              )}
              {portfolio.startDate && (
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Calendar size={18} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                  <span className="text-sm font-medium">{formatDate(portfolio.startDate)}</span>
                </div>
              )}
              {portfolio.endDate && (
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Clock size={18} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                  <span className="text-sm font-medium">
                    {calculateDuration(portfolio.startDate, portfolio.endDate)} hari
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT SECTION */}
        <section className="py-8 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* LEFT COLUMN - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className={`reveal reveal-fade-up rounded-2xl sm:rounded-3xl border p-6 sm:p-8 transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-slate-900/70 border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20'
                    : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 hover:shadow-lg hover:shadow-indigo-200/20'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <FolderGit size={20} />
                    </div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      Deskripsi Proyek
                    </h2>
                  </div>
                  <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {portfolio.deskripsi}
                  </p>
                </div>

                {/* Features */}
                {portfolio.features && portfolio.features.length > 0 && (
                  <div className={`reveal reveal-fade-up rounded-2xl sm:rounded-3xl border p-6 sm:p-8 transition-all duration-500 ${
                    isDarkMode
                      ? 'bg-slate-900/70 border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20'
                      : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 hover:shadow-lg hover:shadow-indigo-200/20'
                  }`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                      }`}>
                        <CheckCircle size={20} />
                      </div>
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        Fitur Utama
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {portfolio.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                            isDarkMode
                              ? 'bg-slate-800/50 border-indigo-700/30 hover:border-indigo-500/50'
                              : 'bg-white/50 border-indigo-200/30 hover:border-indigo-400/50'
                          }`}
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isDarkMode ? 'bg-indigo-900/60 text-purple-400' : 'bg-indigo-100 text-purple-600'
                          }`}>
                            <CheckCircle size={14} />
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Gallery */}
                <div className={`reveal reveal-fade-up rounded-2xl sm:rounded-3xl border p-6 sm:p-8 transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-slate-900/70 border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20'
                    : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 hover:shadow-lg hover:shadow-indigo-200/20'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <Layers size={20} />
                    </div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      Galeri Proyek
                    </h2>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border group">
                    <img
                      src={portfolio.gambar || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'}
                      alt={portfolio.judul}
                      className="w-full h-64 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Sidebar */}
              <div className="space-y-6">
                {/* Project Info Card */}
                <div className={`reveal reveal-slide-right rounded-2xl sm:rounded-3xl border p-6 transition-all duration-500 sticky top-24 ${
                  isDarkMode
                    ? 'bg-slate-900/70 border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20'
                    : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 hover:shadow-lg hover:shadow-indigo-200/20'
                }`}>
                  <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Informasi Proyek
                  </h3>

                  <div className="space-y-5">
                    {/* Roles */}
                    {portfolio.roles && portfolio.roles.length > 0 && (
                      <div>
                        <div className={`flex items-center gap-2 mb-2 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <Users size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Role</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {portfolio.roles.map((role, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 ${
                                isDarkMode
                                  ? 'bg-purple-900/30 text-purple-300 border border-purple-700/40'
                                  : 'bg-purple-100 text-purple-700 border border-purple-300/40'
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Work Type */}
                    {portfolio.workType && (
                      <div>
                        <div className={`flex items-center gap-2 mb-2 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <Briefcase size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Jenis Pengerjaan</span>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${
                          isDarkMode
                            ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/50'
                            : 'bg-indigo-100 text-indigo-700 border border-indigo-300/50'
                        }`}>
                          {portfolio.workType === 'Individu' ? '👤' : '👥'} {portfolio.workType}
                        </span>
                      </div>
                    )}

                    {/* Date Range */}
                    {(portfolio.startDate || portfolio.endDate) && (
                      <div>
                        <div className={`flex items-center gap-2 mb-2 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <Calendar size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Periode</span>
                        </div>
                        <div className={`space-y-2 text-sm ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {portfolio.startDate && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              Mulai: {formatDate(portfolio.startDate)}
                            </div>
                          )}
                          {portfolio.endDate && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-rose-400" />
                              Selesai: {formatDate(portfolio.endDate)}
                            </div>
                          )}
                          {portfolio.startDate && portfolio.endDate && (
                            <div className={`mt-2 pt-2 border-t ${
                              isDarkMode ? 'border-indigo-800/30' : 'border-indigo-200/30'
                            }`}>
                              <span className={`text-xs font-bold ${
                                isDarkMode ? 'text-purple-400' : 'text-purple-600'
                              }`}>
                                ⏱️ Durasi: {calculateDuration(portfolio.startDate, portfolio.endDate)} hari
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div>
                      <div className={`flex items-center gap-2 mb-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <Tag size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Teknologi</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {portfolio.tag.split(',').map((tech, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-300 hover:scale-105 ${
                              isDarkMode
                                ? 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                                : 'bg-white/60 text-slate-600 border border-slate-200/50'
                            }`}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* GitHub Link */}
                    {portfolio.github && portfolio.github !== 'https://github.com' && (
                      <div className="pt-4 border-t border-indigo-800/30">
                        <a
                          href={portfolio.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] ${
                            isDarkMode
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30'
                          }`}
                        >
                          <FaGithub size={18} />
                          Lihat di GitHub
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED PROJECTS */}
        {relatedPortfolios.length > 0 && (
          <section className={`py-12 sm:py-20 border-t transition-colors duration-500 ${
            isDarkMode
              ? 'bg-slate-900/60 border-indigo-800/40'
              : 'bg-gradient-to-br from-indigo-100/70 via-purple-100/60 to-fuchsia-100/40 border-indigo-200/30'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8 sm:mb-12 reveal reveal-fade-up">
                <div>
                  <h2 className={`text-xs sm:text-sm font-bold tracking-widest uppercase mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-purple-400' : 'text-indigo-600'
                  }`}>Proyek Lainnya</h2>
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold transition-colors duration-500 ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>Karya Terkait</h3>
                </div>
                <a
                  href="/#portofolio"
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                    isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  Lihat Semua <ChevronRight size={16} />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedPortfolios.map((item, idx) => (
                  <a
                    key={item.id}
                    href={`/detail/${item.id}`}
                    className={`group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-2 reveal reveal-scale-up border ${
                      isDarkMode
                        ? 'bg-slate-900/70 hover:shadow-indigo-900/50 border-indigo-800/40'
                        : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 hover:shadow-lg hover:shadow-indigo-200/30 border-indigo-200/40'
                    }`}
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.gambar || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                        alt={item.judul}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
                        }}
                      />
                      <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                        {item.tag.split(',').slice(0, 2).map((tech, tidx) => (
                          <span key={tidx} className="px-2 py-0.5 bg-slate-900/40 backdrop-blur-md text-white text-[10px] font-bold rounded-md border border-white/20">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className={`text-lg font-bold mb-2 transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-100 group-hover:text-purple-400' : 'text-slate-900 group-hover:text-indigo-700'
                      }`}>{item.judul}</h4>
                      <p className={`text-sm mb-4 flex-1 line-clamp-2 transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {item.deskripsi}
                      </p>
                      <div className={`flex items-center gap-1 text-sm font-bold transition-colors ${
                        isDarkMode ? 'text-purple-400' : 'text-indigo-600'
                      }`}>
                        Lihat Detail <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className={`py-6 sm:py-8 border-t backdrop-blur-md transition-colors duration-500 ${
        isDarkMode ? 'bg-slate-900/60 text-slate-300 border-indigo-800/40' : 'bg-gradient-to-r from-indigo-100/90 via-purple-100/80 to-fuchsia-100/70 text-slate-600 border-indigo-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={24} className={`transition-colors duration-500 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />
            <span className={`font-bold text-xl tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              N9n<span className={`transition-colors duration-500 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`}>Port</span>
            </span>
          </div>
          <p className={`text-sm text-center md:text-left transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            &copy; {new Date().getFullYear()} dibuat oleh Natania
          </p>
        </div>
      </footer>
    </div>
  )
}