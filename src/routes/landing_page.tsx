import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useRef, type SetStateAction } from 'react'
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
  MapPin,
  FileText,
  GraduationCap,
  Award,
  Download,
  Printer,
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
  const [isCvModalOpen, setIsCvModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

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
        // Wait 1.5s after typing finishes, then show landing page
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
      
      // Convert background-color
      const bgColor = computedStyle.backgroundColor
      if (bgColor.includes('oklch')) {
        htmlEl.style.backgroundColor = '#ffffff'
      }
      
      // Convert color (text)
      const color = computedStyle.color
      if (color.includes('oklch')) {
        htmlEl.style.color = '#1e293b'
      }
      
      // Convert border-color
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

      // Tunggu semua gambar selesai load
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

      // Jeda kecil agar browser selesai render
      await new Promise((r) => setTimeout(r, 200))

      // Clone element untuk dimodifikasi tanpa mengubah DOM asli
      const clone = element.cloneNode(true) as HTMLElement
      clone.style.position = 'fixed'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      clone.style.visibility = 'visible'
      clone.style.opacity = '1'
      clone.style.zIndex = '99999'
      document.body.appendChild(clone)

      // Konversi oklch ke rgb
      convertOklchToRgb(clone)

      // Jeda setelah konversi
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

      // Hapus clone setelah capture
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
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3 leading-snug">
          NATANIA NAZWA GISELLA NASYAHRANI
        </h3>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kolom 1: Bahasa & Database */}
          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#eef2ff', borderColor: '#e0e7ff' }}>
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: '#4338ca' }}>Bahasa & Database</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#334155' }}>
              {(skills
                .flatMap((s) => s.tag.split(',').map((t) => t.trim()))
                .filter((t) => t && ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'React.js'].includes(t)).slice(0, 4)
              ).map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Code2 size={14} style={{ color: '#6366f1' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 2: Framework & Tools */}
          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#eef2ff', borderColor: '#e0e7ff' }}>
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: '#4338ca' }}>Framework & Tools</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#334155' }}>
              {(skills
                .flatMap((s) => s.tag.split(',').map((t) => t.trim()))
                .filter((t) => t && ['React.js', 'Laravel'].includes(t)).slice(0, 4)
              ).map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <LayoutDashboard size={14} style={{ color: '#6366f1' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Soft Skills */}
          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#eef2ff', borderColor: '#e0e7ff' }}>
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: '#4338ca' }}>Soft Skills</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#334155' }}>
              {/* Jika tidak ada tag soft skill, tetap aman tampil kosong (tanpa ubah struktur) */}
              {(skills
                .flatMap((s) => s.tag.split(',').map((t) => t.trim()))
                .filter((t) => t && ['Bootstrap'].includes(t)).slice(0, 4)
              ).map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Award size={14} style={{ color: '#6366f1' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>


      {/* PROYEK */}
      <div className="mb-4">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-3 pb-2" style={{ color: '#4f46e5', borderBottom: '2px solid #e0e7ff' }}>
          Proyek
        </h2>

        <div className="space-y-4">
          {portfolios.length > 0 ? (
            portfolios.slice(0, 3).map((item, idx) => (
              <div key={item.id}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-bold text-sm" style={{ color: '#0f172a' }}>
                    {idx + 1}. {item.judul}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{item.deskripsi}</p>
              </div>
            ))
          ) : (

            <div>
              <p className="text-sm" style={{ color: '#475569' }}>
                Belum ada proyek.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )

  // ===== INTRO / SPLASH SCREEN =====
  if (showIntro) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex items-center justify-center overflow-hidden relative px-4">
        {/* Animated gradient background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-purple-950/80" />
          {/* Animated color blobs */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-indigo-600/20 rounded-full filter blur-[100px] sm:blur-[150px] animate-blob" />
          <div className="absolute top-0 right-0 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-purple-600/15 rounded-full filter blur-[80px] sm:blur-[130px] animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/3 w-[280px] h-[280px] sm:w-[550px] sm:h-[550px] bg-violet-600/10 rounded-full filter blur-[90px] sm:blur-[140px] animate-blob" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-0 right-0 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-fuchsia-600/10 rounded-full filter blur-[70px] sm:blur-[120px] animate-blob" style={{ animationDelay: '6s' }} />
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
                backgroundColor: i % 3 === 0 ? 'rgba(129, 140, 248, 0.4)' : i % 3 === 1 ? 'rgba(168, 85, 247, 0.3)' : 'rgba(99, 102, 241, 0.35)',
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Main content */}
        <div className="relative z-10 text-center px-4 max-w-full">
          {/* Logo with glow */}
          <div className="mb-6 sm:mb-10 flex items-center justify-center gap-3 px-4" style={{ animation: 'fadeInUp 1.2s ease-out forwards', opacity: 0 }}>
            <div className="bg-indigo-600/90 p-2.5 sm:p-3.5 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.4)] backdrop-blur-sm shrink-0">
              <Code2 size={28} className="sm:w-8 sm:h-8 text-indigo-100" />
            </div>
            <span className="font-bold text-2xl sm:text-3xl text-indigo-300 tracking-tight drop-shadow-[0_2px_6px_rgba(79,70,229,0.4)]">
              N9n<span className="text-purple-400">Port</span>
            </span>
          </div>

          {/* Typing text with gradient */}
          <div className="h-16 sm:h-20 flex items-center justify-center px-4">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-400 drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
                {typedText}
              </span>
              <span 
                className={`inline-block w-0.5 h-6 sm:h-8 md:h-10 bg-purple-400/80 ml-1.5 transition-opacity duration-150 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
              />
            </h1>
          </div>

          {/* Loading hint with bouncing dots */}
          <p className="mt-6 sm:mt-10 text-slate-500/80 text-xs sm:text-sm tracking-wide px-4">
            <span className="inline-block animate-pulse">Memuat Halaman</span>
            <span className="inline-block animate-bounce-dot" style={{ animationDelay: '0.1s' }}>.</span>
            <span className="inline-block animate-bounce-dot" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="inline-block animate-bounce-dot" style={{ animationDelay: '0.3s' }}>.</span>
          </p>

          {/* Progress bar */}
          <div className="mt-6 sm:mt-8 mx-auto w-40 sm:w-56 h-1 bg-slate-800/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500/80 via-purple-500/80 to-indigo-500/80 rounded-full transition-all duration-200 ease-out"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 font-sans text-slate-100 overflow-x-hidden relative" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      {/* Inline styles for fadeIn and reveal animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        /* ===== ANIMATED GRADIENT TEXT ===== */
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #e0e7ff 10%,
            #818cf8 20%,
            #a78bfa 35%,
            #c084fc 50%,
            #e879f9 65%,
            #c084fc 80%,
            #a78bfa 90%,
            #ffffff 100%
          );
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gradient-shift 5s ease infinite;
          filter: drop-shadow(0 2px 12px rgba(168, 85, 247, 0.4));
        }
        /* ===== SCROLL REVEAL ANIMATIONS (BIDIRECTIONAL) ===== */
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
        /* Fade Up */
        .reveal-fade-up {
          transform: translateY(50px);
        }
        .reveal-fade-up.reveal-visible {
          transform: translateY(0);
        }
        /* Scale Up */
        .reveal-scale-up {
          transform: scale(0.85);
        }
        .reveal-scale-up.reveal-visible {
          transform: scale(1);
        }
        /* Slide Left */
        .reveal-slide-left {
          transform: translateX(-40px);
        }
        .reveal-slide-left.reveal-visible {
          transform: translateX(0);
        }
        /* Slide Right */
        .reveal-slide-right {
          transform: translateX(40px);
        }
        .reveal-slide-right.reveal-visible {
          transform: translateX(0);
        }
        /* Fade In */
        .reveal-fade {
          transform: none;
        }
        /* Blur In */
        .reveal-blur {
          transform: none;
          filter: blur(8px);
        }
        .reveal-blur.reveal-visible {
          filter: blur(0);
        }
      `}</style>
      {/* Background dekoratif */}
      <div className="fixed top-[-10%] left-[-10%] w-64 h-64 sm:w-96 sm:h-96 bg-indigo-700 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[110px] opacity-20 z-0 animate-pulse" />
      <div className="fixed top-[20%] right-[-5%] w-48 h-48 sm:w-72 sm:h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-[60px] sm:blur-[90px] opacity-15 z-0 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-[-10%] left-[20%] w-52 h-52 sm:w-80 sm:h-80 bg-purple-800 rounded-full mix-blend-multiply filter blur-[70px] sm:blur-[110px] opacity-10 z-0 animate-pulse" style={{ animationDelay: '4s' }} />

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

            {/* Desktop Menu dengan Active Indicator */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: 'home', label: 'Home' },
                { id: 'tentang', label: 'Tentang' },
                { id: 'keahlian', label: 'Keahlian' },
                { id: 'portofolio', label: 'Portofolio' },
                { id: 'kontak', label: 'Kontak' },
              ].map((menu) => (
                <a
                  key={menu.id}
                  href={`#${menu.id}`}
                  onClick={() => setActiveMenu(menu.id)}
                  className="relative text-slate-300 hover:text-purple-400 font-medium transition-colors py-2 group"
                >
                  {menu.label}
                  {/* Garis ungu di bawah teks menu yang aktif */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-purple-500 transition-all duration-300 ease-out ${
                      activeMenu === menu.id ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{ boxShadow: activeMenu === menu.id ? '0 0 8px rgba(168, 85, 247, 0.6)' : 'none' }}
                  />
                </a>
              ))}
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
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-purple-400 p-2" aria-label="Toggle menu">
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel dengan Active Indicator */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 border-b border-indigo-800/40 absolute w-full shadow-lg backdrop-blur-md">
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              {[
                { id: 'home', label: 'Home' },
                { id: 'tentang', label: 'Tentang' },
                { id: 'keahlian', label: 'Keahlian' },
                { id: 'portofolio', label: 'Portofolio' },
              ].map((menu) => (
                <a
                  key={menu.id}
                  href={`#${menu.id}`}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setActiveMenu(menu.id)
                  }}
                  className={`relative block px-3 py-3 rounded-md transition-all ${
                    activeMenu === menu.id
                      ? 'text-purple-400 bg-indigo-900/40 font-semibold'
                      : 'text-slate-300 hover:bg-indigo-900/40 hover:text-purple-400'
                  }`}
                >
                  <span className="relative">
                    {menu.label}
                    {/* Garis ungu di bawah teks menu mobile yang aktif */}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-purple-500 transition-all duration-300 ${
                        activeMenu === menu.id ? 'w-full' : 'w-0'
                      }`}
                    />
                  </span>
                </a>
              ))}
              <button onClick={() => navigate({ to: '/login' })} className="mt-2 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium shadow-sm">
                <Lock size={16} /> Login Admin
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* MAIN */}
      <main className="relative z-10 pt-16">
        {/* HERO */}
        <section id="home" className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 sm:pt-0">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 reveal reveal-fade-up relative z-10">
            <h4 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="relative z-10 animate-gradient-text">Natania Nazwa</span>
              <br />
              <span className="animate-gradient-text">
                Gisella Nasyahrani
              </span>
            </h4>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              Di era digital saat ini, dunia coding menjadi salah satu keterampilan penting yang terus berkembang. Sebagai siswa SMK jurusan Rekayasa Perangkat Lunak (RPL), proses belajar ini menjadi langkah awal untuk memahami bagaimana teknologi dibangun dan digunakan.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4 px-2">
              <a
                href="#portofolio"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-900/40 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 text-sm sm:text-base"
              >
                Lihat Karya Saya <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#kontak"
                className="flex items-center gap-2 bg-transparent border-2 border-purple-500/50 hover:border-purple-400 text-purple-400 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 text-sm sm:text-base"
              >
                Hubungi Saya
              </a>
            </div>

            <div className="flex justify-center gap-4 pt-4 sm:pt-6">
              <a
                href="https://github.com/natania-nazwa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-slate-900/70 rounded-full text-slate-400 hover:text-purple-400 hover:bg-indigo-900/40 shadow-sm border border-indigo-800/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <FaGithub size={20} className="sm:w-[22px] sm:h-[22px]" />
              </a>
              <a
                href={contactMailto}
                className="p-2.5 sm:p-3 bg-slate-900/70 rounded-full text-slate-400 hover:text-purple-400 hover:bg-indigo-900/40 shadow-sm border border-indigo-800/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Mail size={20} className="sm:w-[22px] sm:h-[22px]" />
              </a>
            </div>
          </div>
        </section>

        {/* TENTANG */}
        <section id="tentang" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center reveal reveal-fade-up">
              <div className="relative flex justify-center flex-col items-center">
                <div className="bg-indigo-900/400 w-80 h-[28rem] rounded-3xl rotate-3 opacity-15 absolute top-0 left-1/2 -translate-x-1/2" />
                <img
                  src="natania-portofolio.jpeg"
                  alt="Foto Profil"
                  className="relative z-10 w-80 h-[28rem] object-cover rounded-3xl shadow-[0_20px_60px_rgba(79,70,229,0.4)] border border-indigo-800/40"
                />
                {/* BUTTON LIHAT CV SAYA */}
                <button
                  onClick={() => setIsCvModalOpen(true)}
                  className="relative z-10 mt-6 flex items-center gap-2 bg-indigo-600/80 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-1 border border-indigo-400/50 backdrop-blur-sm"
                >
                  <FileText size={20} />
                  Lihat CV Saya
                </button>
              </div>
              <div>
                <h2 className="text-purple-400 font-bold tracking-widest uppercase mb-2">Tentang Saya</h2>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-4 sm:mb-6">Halo!, Saya Natania</h3>
                <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
                  Saya adalah siswa SMKS PGRI WLINGI jurusan Rekayasa Perangkat Lunak (RPL) yang tertarik pada dunia coding untuk memahami pembuatan website dan aplikasi serta pemanfaatan teknologi dalam mempermudah kehidupan sehari-hari.
                </p>
                <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
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
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 reveal reveal-fade-up px-4">
              <h2 className="text-xs sm:text-sm font-bold text-purple-400 tracking-widest uppercase mb-2">Keahlian Saya</h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100">Kemampuan yang Saya Miliki</h3>
            </div>

            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skills.map((skill, idx) => (
                  <div
                    key={skill.id}
                    className={`group bg-slate-900/70 p-5 rounded-3xl border border-indigo-800/40 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col min-h-[280px] reveal reveal-scale-up`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-400 mb-6 ring-1 ring-indigo-500/10 group-hover:ring-purple-400/20 transition-all">
                      <LayoutDashboard size={28} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">{skill.judul}</h4>
                    <p className="text-slate-400 flex-1">{skill.deskripsi}</p>


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
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 sm:mb-12 reveal reveal-fade-up px-4">
              <div className="max-w-2xl">
                <h2 className="text-xs sm:text-sm font-bold text-purple-400 tracking-widest uppercase mb-2">Karya Saya</h2>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100">Portofolio & Proyek Terbaru</h3>
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
                portfolios.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`group bg-slate-900/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-900/50 border border-indigo-800/40 transition-all duration-300 flex flex-col hover:-translate-y-2 reveal reveal-slide-left`}
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
                        {item.tag.split(',').slice(0, 2).map((tech, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-900/40 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">{item.judul}</h4>
<p className="text-slate-300 text-sm mb-6 flex-1">{item.deskripsi}</p>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center reveal reveal-fade-up">

            {/* Animated Heading */}
            <div className="mb-4 px-4">
              <h2 className="text-xs sm:text-sm font-bold text-purple-400 tracking-widest uppercase mb-4 animate-pulse">Kontak</h2>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-100 mb-4 sm:mb-6 animate-fade-in-up">
                Mari Berkolaborasi!
              </h3>
            </div>

            <p className="text-slate-300 mb-10 sm:mb-16 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
              Portofolio ini berisi hasil pembelajaran dan proyek yang telah saya kerjakan. Mari terhubung dan berbagi wawasan seputar teknologi.
            </p>

            {/* Contact Info Cards - Centered with Hover Preview + Click */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto reveal reveal-fade-up px-4">

              {/* Phone Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                {/* Hover Preview Card */}
                <div className="absolute -top-[12rem] left-1/2 -translate-x-1/2 w-64 bg-slate-800/95 backdrop-blur rounded-2xl border border-indigo-700/50 shadow-[0_0_40px_rgba(79,70,229,0.3)] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
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
                  className="bg-slate-900/80 p-4 sm:p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="bg-indigo-900/40 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl mx-auto mb-3 sm:mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <Phone size={22} className="sm:w-7 sm:h-7" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Telepon</p>
                  <p className="text-slate-100 font-bold text-xs sm:text-sm group-hover:text-purple-400 transition-colors">+62 813-3593-4870</p>
                </a>
              </div>

              {/* Email Card */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {/* Hover Preview Card */}
                <div className="absolute -top-[12rem] left-1/2 -translate-x-1/2 w-64 bg-slate-800/95 backdrop-blur rounded-2xl border border-indigo-700/50 shadow-[0_0_40px_rgba(79,70,229,0.3)] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
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
                  className="bg-slate-900/80 p-4 sm:p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="bg-indigo-900/40 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl mx-auto mb-3 sm:mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <Mail size={22} className="sm:w-7 sm:h-7" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Email</p>
                  <p className="text-slate-100 font-bold text-xs sm:text-sm break-all group-hover:text-purple-400 transition-colors">nazwanasyahrani@gmail.com</p>
                </a>
              </div>

              {/* Instagram Card - DENGAN PREVIEW GAMBAR REAL */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                {/* Hover Preview Card - Instagram Screenshot Style */}
                <div className="absolute -top-[28rem] left-1/2 -translate-x-1/2 w-80 bg-slate-900/95 backdrop-blur rounded-2xl border border-indigo-700/50 shadow-[0_0_50px_rgba(79,70,229,0.4)] p-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none overflow-hidden">
                  {/* Header Instagram dengan Foto Profil */}
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
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 p-4 border-b border-indigo-700/30">
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-100">6</p>
                      <p className="text-[10px] text-slate-400">posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-100">572</p>
                      <p className="text-[10px] text-slate-400">followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-100">245</p>
                      <p className="text-[10px] text-slate-400">following</p>
                    </div>
                  </div>

                  {/* Grid Foto Instagram (3 kolom) */}
                  <div className="grid grid-cols-3 gap-0.5 p-4">
                    <div className="aspect-square bg-slate-800 overflow-hidden">
                      <img 
                        src="p6.png" 
                        alt="Post 1"
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                          e.currentTarget.parentElement!.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                        }}
                      />
                    </div>
                    <div className="aspect-square bg-slate-800 overflow-hidden">
                      <img 
                        src="p5.png" 
                        alt="Post 2"
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                          e.currentTarget.parentElement!.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                        }}
                      />
                    </div>
                    <div className="aspect-square bg-slate-800 overflow-hidden">
                      <img 
                        src="p4.png" 
                        alt="Post 3"
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                          e.currentTarget.parentElement!.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                        }}
                      />
                    </div>
                    <div className="aspect-square bg-slate-800 overflow-hidden">
                      <img 
                        src="p3.png" 
                        alt="Post 4"
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                          e.currentTarget.parentElement!.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                        }}
                      />
                    </div>
                    <div className="aspect-square bg-slate-800 overflow-hidden">
                      <img 
                        src="p2.png" 
                        alt="Post 5"
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                          e.currentTarget.parentElement!.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                        }}
                      />
                    </div>
                    <div className="aspect-square bg-slate-800 overflow-hidden">
                      <img 
                        src="p1.jpeg" 
                        alt="Post 6"
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                          e.currentTarget.parentElement!.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                        }}
                      />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-4 pt-0">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold py-2.5 rounded-lg text-center">
                      Lihat Profil Instagram
                    </div>
                  </div>

                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-indigo-700/50 rotate-45"></div>
                </div>
                
                <a
                  href={contactInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900/80 p-4 sm:p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="bg-indigo-900/40 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl mx-auto mb-3 sm:mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <FaInstagram size={22} className="sm:w-7 sm:h-7" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Instagram</p>
                  <p className="text-slate-100 font-bold text-sm sm:text-lg group-hover:text-purple-400 transition-colors">@ntninzwgsla</p>
                </a>
              </div>

              {/* School Card - DENGAN PREVIEW GAMBAR REAL */}
              <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                {/* Hover Preview Card - School Photo Style */}
                <div className="absolute -top-[24rem] left-1/2 -translate-x-1/2 w-80 bg-slate-900/95 backdrop-blur rounded-2xl border border-indigo-700/50 shadow-[0_0_50px_rgba(79,70,229,0.4)] p-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none overflow-hidden">
                  {/* Header dengan Foto Sekolah */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <p className="text-sm font-bold text-white">SMKS PGRI WLINGI</p>
                      <p className="text-xs text-white/80">Rekayasa Perangkat Lunak</p>
                    </div>
                  </div>
                  
                  {/* School Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3 text-left">
                      <MapPin size={16} className="text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Jl. Panglima Sudirman No.86<br/>
                          Beru, Kec. Wlingi<br/>
                          Kabupaten Blitar, Jawa Timur 66184
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-left">
                      <Phone size={16} className="text-purple-400 shrink-0" />
                      <p className="text-xs text-slate-300">(0342) 691224</p>
                    </div>

                    <div className="flex items-center gap-3 text-left">
                      <Mail size={16} className="text-purple-400 shrink-0" />
                      <p className="text-xs text-slate-300">smkpgri_wlg@yahoo.co.id</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 mt-2">
                      <p className="text-[10px] text-slate-400 text-center">
                        🏫 Sekolah Menengah Kejuruan Swasta<br/>
                        Akreditasi: B (Baik) | Didirikan: 1987
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-4 pt-0">
                    <div className="bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg text-center">
                      Lihat Info Sekolah
                    </div>
                  </div>

                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-indigo-700/50 rotate-45"></div>
                </div>
                
                <a
                  href={contactSchoolSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900/80 p-4 sm:p-6 rounded-2xl border border-indigo-800/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="bg-indigo-900/40 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl mx-auto mb-3 sm:mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <School size={22} className="sm:w-7 sm:h-7" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Sekolah</p>
                  <p className="text-slate-100 font-bold text-sm sm:text-lg group-hover:text-purple-400 transition-colors">SMKS PGRI WLINGI</p>
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

      {/* ==================== CV MODAL (LIGHT THEME) ==================== */}
      {isCvModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCvModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-3xl mx-4 my-8 bg-white rounded-2xl border border-indigo-200 shadow-[0_0_60px_rgba(79,70,229,0.2)] overflow-hidden">
            {/* Action Buttons Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-md border-b border-indigo-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
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

            {/* CV Content in Modal */}
            <div className="p-8 md:p-12 bg-white">
              <CVContent />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}