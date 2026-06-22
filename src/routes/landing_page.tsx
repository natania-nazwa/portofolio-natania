import { createFileRoute } from '@tanstack/react-router'

import { useEffect, useState, useRef, type SetStateAction } from 'react'
import { FaGithub, FaInstagram } from 'react-icons/fa'
import {
  Briefcase,
  Menu,
  X,
  Lock,
  ChevronRight,
  Code2,
  LayoutDashboard,
  Mail,
  Phone,
  School,
  User,
  MapPin,
  FileText,
  GraduationCap,
  Award,
  Download,
  Printer,
  Sun,
  Moon,
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
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true)
  const [isCvModalOpen, setIsCvModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // ===== DARK MODE STATE =====
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Inisialisasi tema dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('n9n-theme')
    if (saved) {
      setIsDarkMode(saved === 'dark')
    } else {
      setIsDarkMode(true)
      localStorage.setItem('n9n-theme', 'dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('n9n-theme', next ? 'dark' : 'light')
      return next
    })
  }

  // ===== INTRO / SPLASH SCREEN STATES =====
  const [showIntro, setShowIntro] = useState(true)
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullText = 'Selamat Datang di N9nPort'

  // Typing animation effect
  useEffect(() => {
    if (!showIntro) return

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setShowIntro(false)
        }, 1500)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [showIntro])

  // Cursor blink effect
  useEffect(() => {
    if (!showIntro) return
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [showIntro])

  // State untuk melacak menu yang aktif
  const [activeMenu, setActiveMenu] = useState<string>('home')

  const cvRef = useRef<HTMLDivElement>(null)

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

  // Lock scroll when modal is open
  useEffect(() => {
    if (isCvModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCvModalOpen])

  // Intersection Observer untuk auto-detect section aktif saat scroll
  useEffect(() => {
    const sections = ['home', 'tentang', 'keahlian', 'portofolio', 'kontak']
    const observers: IntersectionObserver[] = []

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveMenu(sectionId)
              }
            })
          },
          { threshold: 0.3 }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  // ===== SCROLL REVEAL ANIMATION (BOTH DIRECTIONS) =====
  useEffect(() => {
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
  }, [showIntro])
  const goToLanding = () => setIsMobileMenuOpen(false)


  const contactMailto = 'mailto:nazwanasyahrani@gmail.com'
  const contactInstagram = 'https://www.instagram.com/ntninzwgsla/'
  const contactSchoolSearch = 'https://www.google.com/search?q=SMKS+PGRI+WLINGI'

  // ============ HELPER: Convert oklch to rgb ============
  const convertOklchToRgb = (element: HTMLElement) => {
    const allElements = element.querySelectorAll('*')
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement
      const computedStyle = window.getComputedStyle(htmlEl)

      const bgColor = computedStyle.backgroundColor
      if (bgColor.includes('oklch')) {
        htmlEl.style.backgroundColor = '#ffffff'
      }

      const color = computedStyle.color
      if (color.includes('oklch')) {
        htmlEl.style.color = '#1e293b'
      }

      const borderColor = computedStyle.borderColor
      if (borderColor.includes('oklch')) {
        htmlEl.style.borderColor = '#e2e8f0'
      }
    })
  }

  // ============ DOWNLOAD PDF FUNCTION ============
  const downloadPDF = async () => {
    setIsDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const element = cvRef.current
      if (!element) {
        throw new Error('CV element not found')
      }

      const imgs = Array.from(element.querySelectorAll('img'))
      await Promise.all(
        imgs.map((img) => {
          return new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) return resolve()
            const onDone = () => resolve()
            img.addEventListener('load', onDone, { once: true })
            img.addEventListener('error', onDone, { once: true })
          })
        }),
      )

      await new Promise((r) => setTimeout(r, 200))

      const clone = element.cloneNode(true) as HTMLElement
      clone.style.position = 'fixed'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      clone.style.visibility = 'visible'
      clone.style.opacity = '1'
      clone.style.zIndex = '99999'
      document.body.appendChild(clone)

      convertOklchToRgb(clone)

      await new Promise((r) => setTimeout(r, 100))

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
      })

      document.body.removeChild(clone)

      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const scaledHeight = imgHeight * ratio

      let heightLeft = scaledHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight)
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - scaledHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight)
        heightLeft -= pdfHeight
      }

      pdf.save('CV-Natania-Nazwa-Gisella-Nasyahrani.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      const message = error instanceof Error ? error.message : String(error)
      alert('Gagal mengunduh PDF: ' + message)
    } finally {
      setIsDownloading(false)
    }
  }

  // ============ PRINT FUNCTION ============
  const printCV = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const cvContent = cvRef.current?.innerHTML
    if (!cvContent) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CV - Natania Nazwa Gisella Nasyahrani</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { margin: 0; size: auto; }
          body { background: #ffffff; color: #1e293b; font-family: system-ui, -apple-system, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-container { max-width: 210mm; margin: 0 auto; padding: 20mm; }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${cvContent}
        </div>
        <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 300); }</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  // ============ CV CONTENT COMPONENT ============
  const CVContent = () => (
    <div data-cv-content className="bg-white p-8 md:p-12" style={{ width: '210mm', maxWidth: '100%' }}>
      {/* Header */}
      <div className="mb-8">
        <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3 leading-snug">
          NATANIA NAZWA GISELLA NASYAHRANI
        </h4>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm" style={{ color: '#475569' }}>
          <span className="flex items-center gap-1">
            <GraduationCap size={14} style={{ color: '#4f46e5' }} />
            Siswi SMK Kelas XI
          </span>
          <span style={{ color: '#818cf8' }}>•</span>
          <span style={{ color: '#4f46e5', fontWeight: 500 }}>Rekayasa Perangkat Lunak</span>
          <span style={{ color: '#818cf8' }}>•</span>
          <span className="flex items-center gap-1">
            <School size={14} style={{ color: '#4f46e5' }} />
            SMK PGRI Wlingi, Blitar
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs" style={{ color: '#64748b' }}>
          <span className="flex items-center gap-1">
            <Phone size={12} />
            +62 813-3593-4870
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Mail size={12} />
            nazwanasyahrani@gmail.com
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            Blitar, Jawa Timur
          </span>
        </div>
      </div>

      {/* PROFIL */}
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-3 pb-2" style={{ color: '#4f46e5', borderBottom: '2px solid #e0e7ff' }}>
          Profil
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>
          Siswi kelas XI Jurusan Rekayasa Perangkat Lunak dengan kemampuan pengembangan web menggunakan 
          <span style={{ color: '#4f46e5', fontWeight: 500 }}> React, Tailwind CSS, HTML, CSS, </span> dan 
          <span style={{ color: '#4f46e5', fontWeight: 500 }}> JavaScript</span>. 
          Tertarik pada dunia Front-End Development dan terus berusaha mempelajari teknologi terbaru. 
          Memiliki ambisi besar untuk terus belajar, menghadapi tantangan baru, dan gigih berusaha memberikan hasil terbaik.
        </p>
      </div>

      {/* DATA DIRI */}
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-3 pb-2" style={{ color: '#4f46e5', borderBottom: '2px solid #e0e7ff' }}>
          Data Diri
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <span className="min-w-[190px] font-medium" style={{ color: '#475569' }}>
              Tempat, Tanggal Lahir
            </span>
            <span className="text-slate-900" style={{ color: '#1e293b' }}>: Blitar, 30 Mei 2009</span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="min-w-[190px] font-medium" style={{ color: '#475569' }}>
              Jenis Kelamin
            </span>
            <span className="text-slate-900" style={{ color: '#1e293b' }}>: Perempuan</span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="min-w-[190px] font-medium" style={{ color: '#475569' }}>
              Kewarganegaraan
            </span>
            <span className="text-slate-900" style={{ color: '#1e293b' }}>: Indonesia</span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="min-w-[190px] font-medium" style={{ color: '#475569' }}>
              Alamat
            </span>
            <span className="text-slate-900" style={{ color: '#1e293b' }}>
              : Dusun Kasim, Kec.Selopuro, Kab. Blitar, Jawa Timur
            </span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="min-w-[190px] font-medium" style={{ color: '#475569' }}>
              No. HP / WhatsApp
            </span>
            <span className="text-slate-900" style={{ color: '#1e293b' }}>: +62 813 3593 4870</span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="min-w-[190px] font-medium" style={{ color: '#475569' }}>
              Email
            </span>
            <span className="text-slate-900" style={{ color: '#1e293b' }}>: nazwanasyahrani@gmail.com</span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="min-w-[190px] font-medium" style={{ color: '#475569' }}>
              Portofolio
            </span>
            <span className="text-slate-900" style={{ color: '#1e293b' }}>: natania.biz.id</span>
          </div>
        </div>
      </div>

      {/* PENDIDIKAN */}
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-3 pb-2" style={{ color: '#4f46e5', borderBottom: '2px solid #e0e7ff' }}>
          Pendidikan
        </h2>
        <div className="mb-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-bold text-sm" style={{ color: '#0f172a' }}>SMK PGRI Wlingi</span>
            <span className="text-sm font-medium" style={{ color: '#4f46e5' }}>| Rekayasa Perangkat Lunak (RPL)</span>
            <span className="text-sm" style={{ color: '#94a3b8' }}>| 2023 – Sekarang</span>
          </div>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2" style={{ color: '#475569' }}>
            <li>Sedang menempuh pendidikan di jurusan RPL dengan fokus mempelajari dasar-dasar pemrograman web dan aplikasi</li>
            <li>Terus berusaha mendalami mata pelajaran utama seperti Pemrograman Web, Pemrograman Perangkat Bergerak, dan Basis Data</li>
          </ul>
        </div>
      </div>

      {/* KOMPETENSI TEKNIS */}
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-3 pb-2" style={{ color: '#4f46e5', borderBottom: '2px solid #e0e7ff' }}>
          Kompetensi Teknis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hard Skills */}
          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#eef2ff', borderColor: '#e0e7ff' }}>
            <h3 className="text-xs font-bold uppercase mb-3 flex items-center gap-2" style={{ color: '#4338ca' }}>
              <Code2 size={14} style={{ color: '#6366f1' }} />
              Hard Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                Array.from(new Set(skills.map((s) => s.judul).filter(Boolean))).map((judul, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-medium border"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#c7d2fe',
                      color: '#4338ca'
                    }}
                  >
                    {judul}
                  </span>
                ))
              ) : (
                <span className="text-sm" style={{ color: '#94a3b8' }}>Memuat data keahlian...</span>
              )}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#eef2ff', borderColor: '#e0e7ff' }}>
            <h3 className="text-xs font-bold uppercase mb-3 flex items-center gap-2" style={{ color: '#4338ca' }}>
              <Award size={14} style={{ color: '#6366f1' }} />
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Komunikasi', 'Kerja Sama Tim', 'Manajemen Waktu', 'Kreativitas'].map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded-md text-xs font-medium border"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#c7d2fe',
                    color: '#4338ca'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PROYEK */}
      <div className="mb-4">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-3 pb-2" style={{ color: '#4f46e5', borderBottom: '2px solid #e0e7ff' }}>
          Proyek
        </h2>

        <div className="space-y-3">
          {portfolios.length > 0 ? (
            portfolios.slice(0, 3).map((item, idx) => (
              <div 
                key={item.id} 
                className="flex items-start gap-3 p-3 rounded-lg border"
                style={{ backgroundColor: '#ffffff', borderColor: '#e0e7ff' }}
              >
                <div 
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-sm truncate" style={{ color: '#0f172a' }}>
                      {item.judul}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.tag.split(',').map((tag, tidx) => (
                        <span 
                          key={tidx} 
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
                    {item.deskripsi.split(/[.!?]/)[0].trim() + (item.deskripsi.split(/[.!?]/)[0].trim().length > 0 ? '.' : '')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 rounded-lg border text-center" style={{ backgroundColor: '#ffffff', borderColor: '#e0e7ff' }}>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                Belum ada proyek yang ditampilkan.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )

  // ===== THEME TOGGLE BUTTON COMPONENT =====
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

  // ===== INTRO / SPLASH SCREEN =====
  if (showIntro) {
    return (
      <div className={`min-h-screen font-sans flex items-center justify-center overflow-hidden relative px-4 transition-colors duration-500 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-indigo-100 via-purple-100/80 to-fuchsia-100/50 text-slate-800'
      }`}>
        {/* Animated gradient background */}
        <div className="fixed inset-0 z-0">
          <div className={`absolute inset-0 transition-colors duration-500 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-950 via-indigo-950/90 to-purple-950/80' 
              : 'bg-gradient-to-br from-indigo-100 via-purple-100/80 to-fuchsia-100/50'
          }`} />
          {/* Animated color blobs */}
          <div className={`absolute top-0 left-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full filter blur-[100px] sm:blur-[150px] animate-blob ${
            isDarkMode ? 'bg-indigo-600/20' : 'bg-purple-400/20'
          }`} />
          <div className={`absolute top-0 right-0 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] rounded-full filter blur-[80px] sm:blur-[130px] animate-blob ${
            isDarkMode ? 'bg-purple-600/15' : 'bg-indigo-300/20'
          }`} style={{ animationDelay: '2s' }} />
          <div className={`absolute bottom-0 left-1/3 w-[280px] h-[280px] sm:w-[550px] sm:h-[550px] rounded-full filter blur-[90px] sm:blur-[140px] animate-blob ${
            isDarkMode ? 'bg-violet-600/10' : 'bg-indigo-300/25'
          }`} style={{ animationDelay: '4s' }} />
          <div className={`absolute bottom-0 right-0 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] rounded-full filter blur-[70px] sm:blur-[120px] animate-blob ${
            isDarkMode ? 'bg-fuchsia-600/10' : 'bg-fuchsia-300/20'
          }`} style={{ animationDelay: '6s' }} />
        </div>

        {/* Floating emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {['💻', '⚡', '🚀', '✨', '💜', '🔮', '⚙️', '🌟'].map((emoji, i) => (
            <span
              key={i}
              className="absolute opacity-15 sm:opacity-20 select-none animate-float-emoji"
              style={{
                left: `${5 + (i * 11) % 90}%`,
                top: `${8 + (i * 17) % 80}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + (i % 3) * 2}s`,
                fontSize: `${0.8 + (i % 3) * 0.2}rem`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-particle"
              style={{
                width: `${1 + (i % 2)}px`,
                height: `${1 + (i % 2)}px`,
                left: `${(i * 8.3) % 100}%`,
                top: `${(i * 9.1) % 100}%`,
                backgroundColor: i % 3 === 0 
                  ? (isDarkMode ? 'rgba(129, 140, 248, 0.5)' : 'rgba(129, 140, 248, 0.45)') 
                  : i % 3 === 1 
                    ? (isDarkMode ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.4)') 
                    : (isDarkMode ? 'rgba(99, 102, 241, 0.45)' : 'rgba(99, 102, 241, 0.4)'),
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* Animated grid lines */}
        <div className={`absolute inset-0 z-[1] ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.08]'}`} style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Dark Mode Toggle on Intro */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-4 max-w-full">
          {/* Logo with glow */}
          <div className="mb-6 sm:mb-10 flex items-center justify-center gap-3 px-4" style={{ animation: 'fadeInUp 1.2s ease-out forwards', opacity: 0 }}>
            <div className={`p-2.5 sm:p-3.5 rounded-2xl backdrop-blur-sm shrink-0 transition-colors duration-500 ${
              isDarkMode 
                ? 'bg-indigo-600/90 shadow-[0_0_40px_rgba(79,70,229,0.4)]' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_40px_rgba(99,102,241,0.4)]'
            }`}>
              <Code2 size={28} className={`sm:w-8 sm:h-8 ${isDarkMode ? 'text-indigo-100' : 'text-white'}`} />
            </div>
            <span className={`font-bold text-2xl sm:text-3xl tracking-tight drop-shadow-[0_2px_6px_rgba(79,70,229,0.4)] transition-colors duration-500 ${
              isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
            }`}>
              N9n<span className={isDarkMode ? 'text-purple-400' : 'text-indigo-600'}>Port</span>
            </span>
          </div>

          {/* Typing text with gradient */}
          <div className="h-16 sm:h-20 flex items-center justify-center px-4">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-center">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-500 ${
                isDarkMode 
                  ? 'from-purple-400 via-indigo-300 to-purple-400 drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)]' 
                  : 'from-indigo-600 via-purple-600 to-indigo-600 drop-shadow-[0_2px_8px_rgba(99,102,241,0.2)]'
              }`}>
                {typedText}
              </span>
              <span 
                className={`inline-block w-0.5 h-6 sm:h-8 md:h-10 ml-1.5 transition-opacity duration-150 ${showCursor ? 'opacity-100' : 'opacity-0'} ${
                  isDarkMode ? 'bg-purple-400/80' : 'bg-purple-600/80'
                }`}
              />
            </h1>
          </div>

          {/* Loading hint with bouncing dots */}
          <p className={`mt-6 sm:mt-10 text-xs sm:text-sm tracking-wide px-4 transition-colors duration-500 ${
            isDarkMode ? 'text-slate-500/80' : 'text-slate-400'
          }`}>
            <span className="inline-block animate-pulse">Memuat Halaman</span>
            <span className="inline-block animate-bounce-dot" style={{ animationDelay: '0.1s' }}>.</span>
            <span className="inline-block animate-bounce-dot" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="inline-block animate-bounce-dot" style={{ animationDelay: '0.3s' }}>.</span>
          </p>

          {/* Progress bar */}
          <div className={`mt-6 sm:mt-8 mx-auto w-40 sm:w-56 h-1 rounded-full overflow-hidden transition-colors duration-500 ${
            isDarkMode ? 'bg-slate-800/60' : 'bg-slate-200'
          }`}>
            <div 
              className={`h-full rounded-full transition-all duration-200 ease-out ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-500/80 via-purple-500/80 to-indigo-500/80' 
                  : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400'
              }`}
              style={{ width: `${(typedText.length / fullText.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Inline styles for animations */}
        <style>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes float-emoji {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
            25% { transform: translateY(-20px) rotate(5deg); opacity: 0.25; }
            50% { transform: translateY(-10px) rotate(-3deg); opacity: 0.2; }
            75% { transform: translateY(-30px) rotate(8deg); opacity: 0.15; }
          }
          @keyframes particle {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
            50% { transform: translateY(-40px) scale(1.5); opacity: 0.6; }
          }
          @keyframes bounce-dot {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animate-float-emoji { animation: float-emoji 6s ease-in-out infinite; }
          .animate-particle { animation: particle 4s ease-in-out infinite; }
          .animate-bounce-dot { animation: bounce-dot 0.6s ease-in-out infinite; }
        `}</style>
      </div>
    )
  }

  // ===== MAIN LANDING PAGE =====
  return (
    <div className={`min-h-screen font-sans overflow-x-hidden relative transition-colors duration-500 w-full max-w-[100vw] ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-slate-100' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100/80 to-fuchsia-100/50 text-slate-800'
    }`} style={{ animation: 'fadeIn 0.6s ease-out' }}>
      {/* Inline styles for fadeIn and reveal animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
      `}</style>

      {/* Background dekoratif */}
      <div className={`fixed top-[-10%] left-[-10%] w-64 h-64 sm:w-96 sm:h-96 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[110px] opacity-20 z-0 animate-pulse transition-colors duration-500 ${
        isDarkMode ? 'bg-indigo-700' : 'bg-indigo-300/40'
      }`} />
      <div className={`fixed top-[20%] right-[-5%] w-48 h-48 sm:w-72 sm:h-72 rounded-full mix-blend-multiply filter blur-[60px] sm:blur-[90px] opacity-15 z-0 animate-pulse transition-colors duration-500 ${
        isDarkMode ? 'bg-purple-700' : 'bg-purple-300/35'
      }`} style={{ animationDelay: '2s' }} />
      <div className={`fixed bottom-[-10%] left-[20%] w-52 h-52 sm:w-80 sm:h-80 rounded-full mix-blend-multiply filter blur-[70px] sm:blur-[110px] opacity-10 z-0 animate-pulse transition-colors duration-500 ${
        isDarkMode ? 'bg-purple-800' : 'bg-indigo-300/30'
      }`} style={{ animationDelay: '4s' }} />

      {/* ========== HIDDEN CV FOR PDF CAPTURE ========== */}
      <div
        ref={cvRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          visibility: 'hidden',
          opacity: '0',
          zIndex: -1,
        }}
      >
        <CVContent />
      </div>

      {/* Dark Mode Toggle Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>

      {/* NAVBAR INLINE */}
      <nav
        className={`fixed top-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-500 ${
          isDarkMode
            ? 'bg-slate-900/80 border-indigo-800/40'
            : 'bg-gradient-to-r from-indigo-100/90 via-purple-100/80 to-fuchsia-100/70 border-indigo-200/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <button
              onClick={goToLanding}
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
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'tentang', label: 'Tentang' },
                { id: 'keahlian', label: 'Keahlian' },
                { id: 'portofolio', label: 'Portofolio' },
                { id: 'kontak', label: 'Kontak' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id)
                    setIsMobileMenuOpen(false)
                    const element = document.getElementById(item.id)
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeMenu === item.id
                      ? isDarkMode
                        ? 'text-purple-400 font-bold'
                        : 'text-purple-600 font-bold'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-purple-400 hover:bg-indigo-900/20'
                        : 'text-slate-500 hover:text-purple-600 hover:bg-indigo-50/30'
                  }`}
                >
                  {item.label}
                  {activeMenu === item.id && (
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full transition-colors duration-500 ${
                      isDarkMode ? 'bg-purple-400' : 'bg-purple-600'
                    }`} />
                  )}
                </button>
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
                { id: 'home', label: 'Home' },
                { id: 'tentang', label: 'Tentang' },
                { id: 'keahlian', label: 'Keahlian' },
                { id: 'portofolio', label: 'Portofolio' },
                { id: 'kontak', label: 'Kontak' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id)
                    setIsMobileMenuOpen(false)
                    const element = document.getElementById(item.id)
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`w-full text-left px-4 py-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between min-h-[48px] ${
                    activeMenu === item.id
                      ? isDarkMode
                        ? 'text-purple-400 font-bold bg-indigo-900/30 border-l-2 border-purple-400'
                        : 'text-purple-600 font-bold bg-indigo-50/50 border-l-2 border-purple-600'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-purple-400 hover:bg-indigo-900/20'
                        : 'text-slate-500 hover:text-purple-600 hover:bg-indigo-50/30'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeMenu === item.id && (
                    <span className={`w-2 h-2 rounded-full ${
                      isDarkMode ? 'bg-purple-400' : 'bg-purple-600'
                    }`} />
                  )}
                </button>
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

      {/* MAIN */}
      <main className="relative z-10 pt-14 sm:pt-16">
        {/* HERO */}
        <section id="home" className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 sm:pt-8 w-full">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 reveal reveal-fade-up relative z-10">
            <h4 className="text-2xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="relative z-10 animate-gradient-text">Natania Nazwa</span>
              <br />
              <span className="animate-gradient-text">
                Gisella Nasyahrani
              </span>
            </h4>
            <p className={`text-base sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition-colors duration-500 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Di era digital saat ini, dunia coding menjadi salah satu keterampilan penting yang terus berkembang. Sebagai siswa SMK jurusan Rekayasa Perangkat Lunak (RPL), proses belajar ini menjadi langkah awal untuk memahami bagaimana teknologi dibangun dan digunakan.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4 px-2">
              <a
                href="#portofolio"
                className={`flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3 rounded-xl font-semibold transition-all shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 text-base sm:text-base min-h-[48px] ${
                  isDarkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-900/40 text-white shadow-indigo-600/30 focus-visible:ring-offset-slate-950' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25 focus-visible:ring-offset-white'
                }`}
              >
                Lihat Karya Saya <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#kontak"
                className={`flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3 rounded-xl font-semibold transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 text-base sm:text-base min-h-[48px] ${
                  isDarkMode 
                    ? 'bg-transparent border-2 border-purple-500/50 hover:border-purple-400 text-purple-400 focus-visible:ring-offset-slate-950' 
                    : 'bg-transparent border-2 border-indigo-500 hover:border-indigo-600 text-purple-600 hover:text-indigo-700 focus-visible:ring-offset-white'
                }`}
              >
                Hubungi Saya
              </a>
            </div>

            <div className="flex justify-center gap-4 pt-4 sm:pt-6">
              <a
                href="https://github.com/natania-nazwa"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 sm:p-3 rounded-full shadow-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-slate-900/70 text-slate-400 hover:text-purple-400 hover:bg-indigo-900/40 border-indigo-800/40 focus-visible:ring-offset-slate-950' 
                    : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 text-slate-500 hover:text-purple-600 hover:from-indigo-100 hover:via-purple-100 hover:to-fuchsia-100 border border-indigo-200/30 focus-visible:ring-offset-white'
                }`}
              >
                <FaGithub size={20} className="sm:w-[22px] sm:h-[22px]" />
              </a>
              <a
                href={contactMailto}
                className={`p-3 sm:p-3 rounded-full shadow-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-slate-900/70 text-slate-400 hover:text-purple-400 hover:bg-indigo-900/40 border-indigo-800/40 focus-visible:ring-offset-slate-950' 
                    : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 text-slate-500 hover:text-purple-600 hover:from-indigo-100 hover:via-purple-100 hover:to-fuchsia-100 border border-indigo-200/30 focus-visible:ring-offset-white'
                }`}
              >
                <Mail size={20} className="sm:w-[22px] sm:h-[22px]" />
              </a>
            </div>
          </div>
        </section>

        {/* TENTANG */}
        <section id="tentang" className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center reveal reveal-fade-up">
              <div className="relative flex justify-center flex-col items-center">
                <div className={`w-80 h-[28rem] rounded-3xl rotate-3 opacity-15 absolute top-0 left-1/2 -translate-x-1/2 transition-colors duration-500 ${
                  isDarkMode ? 'bg-indigo-900/400' : 'bg-purple-300/400'
                }`} />
                <img
                  src="natania-portofolio.jpeg"
                  alt="Foto Profil"
                  className={`relative z-10 w-64 sm:w-80 h-[22rem] sm:h-[28rem] object-cover rounded-3xl border transition-all duration-500 ${
                    isDarkMode 
                      ? 'shadow-[0_20px_60px_rgba(79,70,229,0.4)] border-indigo-800/40' 
                      : 'shadow-[0_20px_60px_rgba(147,51,234,0.3)] border-purple-200/40'
                  }`}
                />
                <button
                  onClick={() => setIsCvModalOpen(true)}
                  className={`relative z-10 mt-6 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:-translate-y-1 border backdrop-blur-sm min-h-[48px] ${
                    isDarkMode 
                      ? 'bg-indigo-600/80 hover:bg-indigo-500 text-white shadow-indigo-600/30 border-indigo-400/50' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25 border-indigo-300/40'
                  }`}
                >
                  <FileText size={20} />
                  Lihat CV Saya
                </button>
              </div>
              <div>
                <h2 className={`font-bold tracking-widest uppercase mb-2 transition-colors duration-500 ${
                  isDarkMode ? 'text-purple-400' : 'text-indigo-600'
                }`}>Tentang Saya</h2>
                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>Halo!, Saya Natania</h3>
                <p className={`text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Saya adalah siswa SMKS PGRI WLINGI jurusan Rekayasa Perangkat Lunak (RPL) yang tertarik pada dunia coding untuk memahami pembuatan website dan aplikasi serta pemanfaatan teknologi dalam mempermudah kehidupan sehari-hari.
                </p>
                <p className={`text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Melalui PKL di software house, saya ingin mendapatkan pengalaman langsung dari industri agar kemampuan saya dalam membuat website bisa semakin berkembang.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
                  {[
                    { icon: <User className={`mb-2 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />, title: 'Motivasi', desc: 'Belajar & Berkembang' },
                    { icon: <LayoutDashboard className={`mb-2 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />, title: 'Fokus', desc: 'Front-End Development' },
                    { icon: <Mail className={`mb-2 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />, title: 'Email', desc: 'nazwanasyahrani@gmail.com' },
                    { icon: <FaInstagram className={`mb-2 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />, title: 'Instagram', desc: '@ntninzwgsla' },
                  ].map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border hover:shadow-md transition-all duration-500 min-h-[80px] ${
                      isDarkMode 
                        ? 'bg-slate-900/70 border-indigo-800/40' 
                        : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 shadow-sm'
                    }`}>
                      {item.icon}
                      <p className={`font-bold transition-colors duration-500 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{item.title}</p>
                      <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEAHLIAN */}
        <section id="keahlian" className={`py-12 sm:py-20 transition-colors duration-500 ${
          isDarkMode ? 'bg-slate-900/60' : 'bg-gradient-to-br from-indigo-100/70 via-purple-100/60 to-fuchsia-100/40'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 reveal reveal-fade-up px-4">
              <h2 className={`text-xs sm:text-sm font-bold tracking-widest uppercase mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-purple-400' : 'text-indigo-600'
              }`}>Keahlian Saya</h2>
              <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold transition-colors duration-500 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>Kemampuan yang Saya Miliki</h3>
            </div>

            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skills.map((skill, idx) => (
                  <div
                    key={skill.id}
                    className={`group p-4 sm:p-5 rounded-2xl sm:rounded-3xl border hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col min-h-[260px] sm:min-h-[280px] reveal reveal-scale-up ${
                      isDarkMode 
                        ? 'bg-slate-900/70 border-indigo-800/40' 
                        : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 shadow-sm'
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm mb-6 ring-1 transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-indigo-900/40 text-purple-400 ring-indigo-500/10 group-hover:ring-purple-400/20' 
                        : 'bg-purple-100 text-purple-600 ring-purple-200/20 group-hover:ring-purple-500/30'
                    }`}>
                      <LayoutDashboard size={28} />
                    </div>
                    <h4 className={`text-lg font-bold mb-2 transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-100 group-hover:text-purple-400' : 'text-slate-900 group-hover:text-indigo-700'
                    }`}>{skill.judul}</h4>
                    <p className={`flex-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{skill.deskripsi}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-3xl border flex flex-col min-h-[280px] animate-pulse ${
                      isDarkMode ? 'bg-slate-900/70 border-indigo-800/40' : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-purple-200/40'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl mb-6 ring-1 ${
                      isDarkMode ? 'bg-indigo-900/40 ring-indigo-500/10' : 'bg-purple-100 ring-purple-200/10'
                    }`} />
                    <div className={`h-6 rounded w-3/4 mb-4 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                    <div className={`h-4 rounded w-full mb-3 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                    <div className={`h-4 rounded w-5/6 mb-3 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                    <div className={`h-4 rounded w-4/6 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                    <div className="flex flex-wrap gap-2 mt-6">
                      <div className={`h-6 rounded-full w-20 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                      <div className={`h-6 rounded-full w-24 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PORTOFOLIO */}
        <section id="portofolio" className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 sm:mb-12 reveal reveal-fade-up px-4">
              <div className="max-w-2xl">
                <h2 className={`text-xs sm:text-sm font-bold tracking-widest uppercase mb-2 transition-colors duration-500 ${
                  isDarkMode ? 'text-purple-400' : 'text-indigo-600'
                }`}>Karya Saya</h2>
                <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold transition-colors duration-500 ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>Portofolio & Proyek Terbaru</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoadingPortfolios ? (
              <div className="col-span-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-3xl overflow-hidden border animate-pulse ${
                        isDarkMode ? 'bg-slate-900/70 border-indigo-800/40' : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-purple-200/40'
                      }`}
                    >
                      <div className={`h-56 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                      <div className="p-6">
                        <div className={`h-5 rounded w-2/3 mb-3 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                        <div className={`h-3 rounded w-full mb-2 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                        <div className={`h-3 rounded w-5/6 mb-2 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                        <div className={`h-3 rounded w-4/6 mb-6 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                        <div className={`h-9 rounded w-2/5 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-200/50'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : portfolios.length === 0 ? (
              <div className={`col-span-full text-center py-20 rounded-3xl border border-dashed ${
                isDarkMode ? 'bg-slate-900/70 border-indigo-700/50' : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40'
              }`}>
                <Briefcase size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-purple-500' : 'text-purple-400'}`} />
                <p className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Belum ada portofolio yang ditambahkan.</p>
              </div>
            ) : (
                portfolios.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-2 reveal reveal-slide-left border ${
                      isDarkMode 
                        ? 'bg-slate-900/70 hover:shadow-indigo-900/50 border-indigo-800/40' 
                        : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 hover:shadow-lg hover:shadow-indigo-200/30 border-indigo-200/40'
                    }`}
                    style={{ transitionDelay: `${idx * 150}ms` }}
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
                        {item.tag.split(',').map((tech, tidx) => (
                          <span key={tidx} className="px-2.5 py-1 bg-slate-900/40 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-100 group-hover:text-purple-400' : 'text-slate-900 group-hover:text-indigo-700'
                      }`}>{item.judul}</h4>
                      <p className={`text-sm mb-6 flex-1 transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>{item.deskripsi}</p>
                      <div className={`pt-4 border-t flex justify-between items-center ${
                        isDarkMode ? 'border-indigo-800/40' : 'border-purple-200/40'
                      }`}>
                        <a
                          href={item.github || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 font-bold text-sm hover:underline transition-colors duration-500 ${
                            isDarkMode ? 'text-purple-400' : 'text-indigo-600'
                          }`}
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
        <section id="kontak" className={`py-12 sm:py-20 border-t transition-colors duration-500 ${
          isDarkMode ? 'bg-slate-900/60 border-indigo-800/40' : 'bg-gradient-to-br from-indigo-100/60 via-purple-100/50 to-fuchsia-100/30 border-indigo-200/30'
        }`}>
          <div className={`absolute top-0 right-0 w-80 h-80 opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 transition-colors duration-500 ${
            isDarkMode ? 'bg-indigo-700' : 'bg-indigo-300/40'
          }`} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center reveal reveal-fade-up">

            <div className="mb-4 px-4">
              <h2 className={`text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 animate-pulse transition-colors duration-500 ${
                isDarkMode ? 'text-purple-400' : 'text-indigo-600'
              }`}>Kontak</h2>
              <h3 className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up transition-colors duration-500 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Mari Berkolaborasi!
              </h3>
            </div>

            <p className={`mb-10 sm:mb-16 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto animate-fade-in-up px-4 transition-colors duration-500 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`} style={{ animationDelay: '0.2s' }}>
              Portofolio ini berisi hasil pembelajaran dan proyek yang telah saya kerjakan. Mari terhubung dan berbagi wawasan seputar teknologi.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto reveal reveal-fade-up px-2 sm:px-4">

              {/* Phone Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <div className={`absolute -top-[12rem] left-1/2 -translate-x-1/2 w-64 backdrop-blur rounded-2xl border shadow-[0_0_40px_rgba(79,70,229,0.3)] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none ${
                  isDarkMode ? 'bg-slate-800/95 border-indigo-700/50' : 'bg-gradient-to-r from-indigo-100/95 via-purple-100/90 to-fuchsia-100/80 border-indigo-200/30'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <Phone size={24} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>+62 813-3593-4870</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Klik untuk menghubungi</p>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${isDarkMode ? 'bg-slate-900/50' : 'bg-gradient-to-br from-indigo-100/70 via-purple-100/60 to-fuchsia-100/40'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>📞 Telepon / WhatsApp</p>
                  </div>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                    isDarkMode ? 'bg-slate-800 border-r border-b border-indigo-700/50' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 border-r border-b border-purple-200/50'
                  }`}></div>
                </div>
                <a
                  href={"tel:+6281335934870"}
                  className={`p-3 sm:p-6 rounded-xl sm:rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 min-h-[80px] sm:min-h-0 ${
                    isDarkMode 
                      ? 'bg-slate-900/80 border-indigo-800/40 hover:shadow-indigo-900/20 focus-visible:ring-offset-slate-950' 
                      : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 hover:shadow-md hover:shadow-indigo-200/20 focus-visible:ring-offset-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform ${
                    isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <Phone size={22} className="sm:w-7 sm:h-7" />
                  </div>
                  <p className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Telepon</p>
                  <p className={`font-bold text-[10px] sm:text-sm group-hover:transition-colors ${
                    isDarkMode ? 'text-slate-100 group-hover:text-purple-400' : 'text-slate-900 group-hover:text-indigo-700'
                  }`}>+62 813-3593-4870</p>
                </a>
              </div>

              {/* Email Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className={`absolute -top-[12rem] left-1/2 -translate-x-1/2 w-64 backdrop-blur rounded-2xl border shadow-[0_0_40px_rgba(79,70,229,0.3)] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none ${
                  isDarkMode ? 'bg-slate-800/95 border-indigo-700/50' : 'bg-gradient-to-r from-indigo-100/95 via-purple-100/90 to-fuchsia-100/80 border-indigo-200/30'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <Mail size={24} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Email</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Klik untuk mengirim email</p>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${isDarkMode ? 'bg-slate-900/50' : 'bg-gradient-to-br from-indigo-100/70 via-purple-100/60 to-fuchsia-100/40'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>✉️ nazwanasyahrani@gmail.com</p>
                  </div>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                    isDarkMode ? 'bg-slate-800 border-r border-b border-indigo-700/50' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 border-r border-b border-purple-200/50'
                  }`}></div>
                </div>
                <a
                  href={contactMailto}
                  className={`p-4 sm:p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 ${
                    isDarkMode 
                      ? 'bg-slate-900/80 border-indigo-800/40 hover:shadow-indigo-900/20 focus-visible:ring-offset-slate-950' 
                      : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 hover:shadow-md hover:shadow-indigo-200/20 focus-visible:ring-offset-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform ${
                    isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <Mail size={22} className="sm:w-7 sm:h-7" />
                  </div>
                  <p className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Email</p>
                  <p className={`font-bold text-xs sm:text-sm break-all group-hover:transition-colors ${
                    isDarkMode ? 'text-slate-100 group-hover:text-purple-400' : 'text-slate-900 group-hover:text-indigo-700'
                  }`}>nazwanasyahrani@gmail.com</p>
                </a>
              </div>

              {/* Instagram Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className={`absolute -top-[28rem] left-1/2 -translate-x-1/2 w-80 backdrop-blur rounded-2xl border shadow-[0_0_50px_rgba(79,70,229,0.4)] p-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none overflow-hidden ${
                  isDarkMode ? 'bg-slate-900/95 border-indigo-700/50' : 'bg-gradient-to-r from-indigo-100/95 via-purple-100/90 to-fuchsia-100/80 border-indigo-200/30'
                }`}>
                  <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full border-2 border-white/50 overflow-hidden bg-slate-800">
                        <img 
                          src="pp.jpg" 
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></div>';
                          }}
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">ntninzwgsla</p>
                        <p className="text-xs text-white/80">Natania Nazwa</p>
                      </div>
                    </div>
                  </div>

                  <div className={`grid grid-cols-3 gap-2 p-4 border-b ${
                    isDarkMode ? 'border-indigo-700/30' : 'border-indigo-200/20'
                  }`}>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>6</p>
                      <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>posts</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>572</p>
                      <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>followers</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>245</p>
                      <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>following</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-0.5 p-4">
                    {['p6.png', 'p5.png', 'p4.png', 'p3.png', 'p2.png', 'p1.jpeg'].map((src, i) => (
                      <div key={i} className="aspect-square bg-slate-800 overflow-hidden">
                        <img 
                          src={src}
                          alt={`Post ${i+1}`}
                          className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                            e.currentTarget.parentElement!.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-4 pt-0">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold py-2.5 rounded-lg text-center">
                      Lihat Profil Instagram
                    </div>
                  </div>

                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                    isDarkMode ? 'bg-slate-900 border-r border-b border-indigo-700/50' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 border-r border-b border-purple-200/50'
                  }`}></div>
                </div>

                <a
                  href={contactInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 sm:p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 ${
                    isDarkMode 
                      ? 'bg-slate-900/80 border-indigo-800/40 hover:shadow-indigo-900/20 focus-visible:ring-offset-slate-950' 
                      : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 hover:shadow-md hover:shadow-indigo-200/20 focus-visible:ring-offset-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform ${
                    isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <FaInstagram size={22} className="sm:w-7 sm:h-7" />
                  </div>
                  <p className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Instagram</p>
                  <p className={`font-bold text-sm sm:text-lg group-hover:transition-colors ${
                    isDarkMode ? 'text-slate-100 group-hover:text-purple-400' : 'text-slate-900 group-hover:text-indigo-700'
                  }`}>@ntninzwgsla</p>
                </a>
              </div>

              {/* School Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                <div className={`absolute -top-[24rem] left-1/2 -translate-x-1/2 w-80 backdrop-blur rounded-2xl border shadow-[0_0_50px_rgba(79,70,229,0.4)] p-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none overflow-hidden ${
                  isDarkMode ? 'bg-slate-900/95 border-indigo-700/50' : 'bg-gradient-to-r from-indigo-100/95 via-purple-100/90 to-fuchsia-100/80 border-indigo-200/30'
                }`}>
                  <div className="relative h-40 bg-indigo-600 overflow-hidden">
                    <img 
                      src="hammer.jpg" 
                      alt="SMKS PGRI WLINGI"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                        e.currentTarget.parentElement!.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent ${isDarkMode ? '' : 'from-indigo-100/80'}`} />
                    <div className="absolute bottom-3 left-4">
                      <p className="text-sm font-bold text-white">SMKS PGRI WLINGI</p>
                      <p className="text-xs text-white/80">Rekayasa Perangkat Lunak</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3 text-left">
                      <MapPin size={16} className={`mt-0.5 shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />
                      <div>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          Jl. Panglima Sudirman No.86<br/>
                          Beru, Kec. Wlingi<br/>
                          Kabupaten Blitar, Jawa Timur 66184
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-left">
                      <Phone size={16} className={`shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />
                      <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>(0342) 691224</p>
                    </div>

                    <div className="flex items-center gap-3 text-left">
                      <Mail size={16} className={`shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />
                      <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>smkpgri_wlg@yahoo.co.id</p>
                    </div>

                    <div className={`rounded-lg p-3 mt-2 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gradient-to-br from-indigo-100/70 via-purple-100/60 to-fuchsia-100/40'}`}>
                      <p className={`text-[10px] text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        🏫 Sekolah Menengah Kejuruan Swasta<br/>
                        Akreditasi: B (Baik) | Didirikan: 1987
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg text-center">
                      Lihat Info Sekolah
                    </div>
                  </div>

                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                    isDarkMode ? 'bg-slate-900 border-r border-b border-indigo-700/50' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 border-r border-b border-purple-200/50'
                  }`}></div>
                </div>

                <a
                  href={contactSchoolSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 sm:p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 ${
                    isDarkMode 
                      ? 'bg-slate-900/80 border-indigo-800/40 hover:shadow-indigo-900/20 focus-visible:ring-offset-slate-950' 
                      : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40 hover:shadow-md hover:shadow-indigo-200/20 focus-visible:ring-offset-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform ${
                    isDarkMode ? 'bg-indigo-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <School size={22} className="sm:w-7 sm:h-7" />
                  </div>
                  <p className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Sekolah</p>
                  <p className={`font-bold text-sm sm:text-lg group-hover:transition-colors ${
                    isDarkMode ? 'text-slate-100 group-hover:text-purple-400' : 'text-slate-900 group-hover:text-indigo-700'
                  }`}>SMKS PGRI WLINGI</p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

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

      {/* CV MODAL */}
      {isCvModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
          <div 
            className={`fixed inset-0 backdrop-blur-sm transition-opacity ${
              isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/40'
            }`}
            onClick={() => setIsCvModalOpen(false)}
          />

          <div className={`relative z-10 w-full max-w-3xl mx-2 sm:mx-4 my-4 sm:my-8 rounded-xl sm:rounded-2xl border shadow-[0_0_60px_rgba(79,70,229,0.2)] overflow-hidden transition-colors duration-500 ${
            isDarkMode ? 'bg-slate-900 border-indigo-700' : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-fuchsia-50/60 border-indigo-200/40'
          }`}>
            <div className={`sticky top-0 z-20 flex items-center justify-between px-6 py-3 backdrop-blur-md border-b transition-colors duration-500 ${
              isDarkMode ? 'bg-slate-900/95 border-indigo-800/40' : 'bg-gradient-to-r from-indigo-100/95 via-purple-100/90 to-fuchsia-100/80 border-indigo-200/30'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg ${
                    isDarkMode 
                      ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white shadow-indigo-600/20' 
                      : 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white shadow-purple-600/20'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengunduh...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Unduh PDF
                    </>
                  )}
                </button>
                <button
                  onClick={printCV}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-slate-200"
                >
                  <Printer size={16} />
                  Cetak
                </button>
              </div>
              <button
                onClick={() => setIsCvModalOpen(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className={`p-4 sm:p-8 md:p-12 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-100 via-purple-100/80 to-fuchsia-100/50'}`}>
              <CVContent />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}