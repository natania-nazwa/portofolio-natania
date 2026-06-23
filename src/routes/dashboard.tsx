import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type SetStateAction } from 'react'
import { FaGithub } from 'react-icons/fa'
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  FileText,
  FolderGit,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
  Lock,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Plus,
  Tag as TagIcon,
  Trash2,
  UploadCloud,
  Eye,
  EyeOff,
  X,
  XCircle,
  LayoutDashboard,
} from 'lucide-react'

import {
  createPortfolio,
  deletePortfolio,
  getPortfolios,
  createSkill,
  deleteSkill,
  getSkills,
  updatePortfolio,
  updateSkill,
} from '../lib/api'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) {
      throw redirect({ to: '/login' })
    }

    if (!role || role !== 'admin') {
      throw redirect({ to: '/login' })
    }
  },
  component: Dashboard,
})

type Skill = {
  id: string
  judul: string
  deskripsi: string
  tag: string
  urutan?: number
}

type ProjectRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "Fullstack Developer"
  | "UI/UX Designer"
  | "Mobile Developer"
  | "Game Developer"
  | "DevOps Engineer"

type ProjectWorkType = "Individu" | "Tim"

type Portfolio = {
  id: string
  judul: string
  deskripsi: string
  tag: string
  gambar?: string | null
  github?: string | null
  urutan?: number

  // detail pengerjaan
  features?: string[]
  startDate?: string | null
  endDate?: string | null
  roles?: ProjectRole[]
  workType?: ProjectWorkType | null
  durasi?: { days: number } | null
}

export default function Dashboard() {
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [activeMenu, setActiveMenu] = useState('skills')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Login state (untuk fallback UI)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type }), 3000)
  }

  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    type: string
    data: (Portfolio & { judul: string }) | (Skill & { judul: string }) | null
  }>({ type: '', data: null })

  // Portofolio
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false)
  const [editPortfolioId, setEditPortfolioId] = useState<string | null>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])

  const [formGambar, setFormGambar] = useState('')
  const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url')
  const [formJudul, setFormJudul] = useState('')
  const [formTag, setFormTag] = useState('')
  const [formDeskripsi, setFormDeskripsi] = useState('')
  const [formGithub, setFormGithub] = useState('')

  // --- NEW: Project fields ---
  const [formFeatures, setFormFeatures] = useState<string[]>([])
  const [featureDraft, setFeatureDraft] = useState('')

  const [formStartDate, setFormStartDate] = useState('')
  const [formEndDate, setFormEndDate] = useState('')

  const [formRoles, setFormRoles] = useState<ProjectRole[]>([])
  const [formWorkType, setFormWorkType] = useState<ProjectWorkType>('Individu')

  // Skills
  const [isEditingSkill, setIsEditingSkill] = useState(false)
  const [editSkillId, setEditSkillId] = useState<string | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])

  const [formSkillJudul, setFormSkillJudul] = useState('')
  const [formSkillDeskripsi, setFormSkillDeskripsi] = useState('')
  const [formSkillTag, setFormSkillTag] = useState('')

  useEffect(() => {
    fetchSkills()
    fetchPortfolios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMenuChange = (menu: SetStateAction<string>) => {
    setActiveMenu(menu)
    setIsMobileMenuOpen(false)
    cancelEditPortfolioMode()
    cancelEditSkillMode()
  }

  const fetchSkills = async () => {
    try {
      const res = await getSkills()
      if (res?.success && Array.isArray(res.data)) setSkills(res.data)
    } catch {
      showToast('Gagal mengambil data keahlian', 'error')
    }
  }

  const fetchPortfolios = async () => {
    try {
      const res = await getPortfolios(undefined)
      if (res?.success && Array.isArray(res.data)) setPortfolios(res.data)
    } catch {
      showToast('Gagal mengambil data karya', 'error')
    }
  }

  const handleSubmitPortfolio = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalGambar =
      formGambar.trim() ||
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60'

    const payload = {
      judul: formJudul,
      deskripsi: formDeskripsi,
      tag: formTag,
      gambar: finalGambar,
      github: formGithub || 'https://github.com',
      urutan: 0,

      features: formFeatures,
      startDate: formStartDate,
      endDate: formEndDate,
      roles: formRoles,
      workType: formWorkType,
    }

    try {
      if (!payload.features.length) {
        showToast('Minimal 1 fitur harus diisi.', 'error')
        return
      }
      if (!payload.startDate || !payload.endDate) {
        showToast('Tanggal mulai dan selesai wajib diisi.', 'error')
        return
      }
      if (!payload.roles.length) {
        showToast('Minimal 1 role harus dipilih.', 'error')
        return
      }

      if (isEditingPortfolio) {
        const res = await updatePortfolio(editPortfolioId as string, payload)
        if (res?.success) {
          showToast('Karya berhasil diperbarui!', 'success')
        } else {
          showToast(res?.message || 'Gagal menyimpan karya', 'error')
        }
        cancelEditPortfolioMode()
      } else {
        const res = await createPortfolio(payload)
        if (res?.success) {
          showToast('Karya baru berhasil disimpan!', 'success')
          resetFormPortfolio()
        } else {
          showToast(res?.message || 'Gagal menyimpan karya', 'error')
        }
      }
      await fetchPortfolios()
    } catch (err: any) {
      showToast(err?.message || 'Gagal menyimpan karya', 'error')
    }
  }

  const startEditPortfolioMode = (portfolio: Portfolio & { judul: string }) => {
    setIsEditingPortfolio(true)
    setEditPortfolioId(portfolio.id)
    setFormJudul(portfolio.judul)
    setFormDeskripsi(portfolio.deskripsi)
    setFormTag(portfolio.tag)
    setFormGambar(portfolio.gambar ?? '')
    setImageInputType(portfolio.gambar && portfolio.gambar.startsWith('data:image') ? 'file' : 'url')
    setFormGithub(portfolio.github && portfolio.github !== 'https://github.com' ? portfolio.github : '')

    setFormFeatures(portfolio.features ?? [])
    setFormStartDate(portfolio.startDate ? String(portfolio.startDate) : '')
    setFormEndDate(portfolio.endDate ? String(portfolio.endDate) : '')
    setFormRoles((portfolio.roles ?? []) as ProjectRole[])
    setFormWorkType((portfolio.workType ?? 'Individu') as ProjectWorkType)

    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('Mode edit aktif.', 'success')
  }

  const cancelEditPortfolioMode = () => {
    setIsEditingPortfolio(false)
    setEditPortfolioId(null)
    resetFormPortfolio()
  }

  const resetFormPortfolio = () => {
    setFormGambar('')
    setFormJudul('')
    setFormTag('')
    setFormDeskripsi('')
    setFormGithub('')
    setImageInputType('url')

    setFormFeatures([])
    setFeatureDraft('')
    setFormStartDate('')
    setFormEndDate('')
    setFormRoles([])
    setFormWorkType('Individu')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 2MB', 'error')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) setFormGambar(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // --- NO <form> TAG for skill section ---
  const handleSubmitSkill = async () => {
    const payload = {
      judul: formSkillJudul,
      deskripsi: formSkillDeskripsi,
      tag: formSkillTag || 'Skill',
      urutan: 0,
    }

    try {
      if (isEditingSkill) {
        const res = await updateSkill(editSkillId as string, payload)
        if (res?.success) {
          showToast('Keahlian berhasil diperbarui!', 'success')
        } else {
          showToast(res?.message || 'Gagal menyimpan keahlian', 'error')
        }
        cancelEditSkillMode()
      } else {
        const res = await createSkill(payload)
        if (res?.success) {
          showToast('Keahlian baru berhasil disimpan!', 'success')
          resetFormSkill()
        } else {
          showToast(res?.message || 'Gagal menyimpan keahlian', 'error')
        }
      }
      await fetchSkills()
    } catch (err: any) {
      showToast(err?.message || 'Gagal menyimpan keahlian', 'error')
    }
  }

  const startEditSkillMode = (skill: Skill) => {
    setIsEditingSkill(true)
    setEditSkillId(skill.id)
    setFormSkillJudul(skill.judul)
    setFormSkillDeskripsi(skill.deskripsi)
    setFormSkillTag(skill.tag)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('Mode edit keahlian aktif.', 'success')
  }

  const cancelEditSkillMode = () => {
    setIsEditingSkill(false)
    setEditSkillId(null)
    resetFormSkill()
  }

  const resetFormSkill = () => {
    setFormSkillJudul('')
    setFormSkillDeskripsi('')
    setFormSkillTag('')
  }

  const triggerDeleteConfirm = (type: string, data: Portfolio | Skill) => {
    setItemToDelete({ type, data: data as any })
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    const data = itemToDelete.data
    try {
      if (!data) return

      if (itemToDelete.type === 'portfolio') {
        const res = await deletePortfolio(data.id as string)
        if (res?.success) {
          showToast(`"${(data as any).judul}" telah dihapus`, 'success')
        } else {
          showToast(res?.message || `Gagal menghapus "${(data as any).judul}"`, 'error')
        }

        if (isEditingPortfolio && editPortfolioId === data.id) cancelEditPortfolioMode()
        await fetchPortfolios()
      } else if (itemToDelete.type === 'skill') {
        const res = await deleteSkill(data.id as string)
        if (res?.success) {
          showToast(`"${(data as any).judul}" telah dihapus`, 'success')
        } else {
          showToast(res?.message || `Gagal menghapus "${(data as any).judul}"`, 'error')
        }

        if (isEditingSkill && editSkillId === data.id) cancelEditSkillMode()
        await fetchSkills()
      }
    } finally {
      setShowDeleteModal(false)
      setItemToDelete({ type: '', data: null })
    }
  }


  // ==================== LOGIN / LOGOUT ====================
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoginLoading(true)
    setTimeout(() => {
      setIsLoginLoading(false)
      setIsLoggedIn(true)
      showToast('Selamat datang kembali, Admin!')
    }, 1000)
  }

  // ==================== RENDER TAMPILAN ====================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 font-sans text-slate-200">
        <div className="relative max-w-md w-full bg-white rounded-3xl shadow-[0_10px_50px_rgba(124,58,237,0.08)] overflow-hidden border border-slate-800/50">
          <div className="px-8 pt-12 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-900/40 text-indigo-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Briefcase size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-100 mb-1">N9nPort Admin</h2>
            <p className="text-slate-400 text-sm">Masuk untuk mengelola portofolio Anda</p>
          </div>
          <div className="px-8 pb-10">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                    placeholder="admin@portofolio.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full py-3.5 px-4 mt-6 rounded-xl shadow-lg shadow-indigo-900/30 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex justify-center items-center"
              >
                {isLoginLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex flex-col font-sans text-slate-100">
      {/* TOAST NOTIFIKASI */}
      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl transition-all duration-300 text-white ${
            toast.type === 'error' ? 'bg-rose-900/300' : 'bg-slate-800'
          }`}
        >
          <CheckCircle className={`w-5 h-5 flex-shrink-0 ${toast.type === 'error' ? 'text-white' : 'text-emerald-400'}`} />
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative bg-slate-900/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-800/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-900/30 text-amber-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Konfirmasi Keluar</h3>
              <p className="text-sm text-slate-400 mt-2">Apakah Anda yakin ingin mengakhiri sesi dan keluar dari N9nPort Admin?</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowLogoutModal(false)} className="py-2.5 bg-slate-800/50 hover:bg-slate-700 text-slate-600 font-semibold rounded-xl text-sm">
                Batal
              </button>
              <button
                onClick={() => navigate({ to: '/' })}
                className="py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-900/30"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {showDeleteModal && itemToDelete.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-slate-900/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-800/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-900/30 text-rose-400 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Hapus Data</h3>
              <p className="text-sm text-slate-400 mt-2">
                Yakin ingin menghapus <span className="font-semibold text-slate-200">"{itemToDelete.data.judul}"</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="py-2.5 bg-slate-800/50 hover:bg-slate-700 text-slate-600 font-semibold rounded-xl text-sm">
                Batal
              </button>
              <button onClick={confirmDelete} className="py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-900/30">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-indigo-800/40 shadow-sm shadow-indigo-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
                <Briefcase size={18} className="text-white" />
              </div>
              <span className="font-extrabold tracking-wider text-xl text-slate-100">
                N9nPort<span className="text-indigo-400">Admin</span>
              </span>
            </div>

            {/* Center: Navigation Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-1 ">
              <button
                onClick={() => handleMenuChange('skills')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeMenu === 'skills'
                    ? 'bg-indigo-600 text-white border border-indigo-500 shadow-lg shadow-indigo-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-indigo-600/40'
                }`}
              >
                <Layers size={18} />
                <span>Keahlian</span>
              </button>
              <button
                onClick={() => handleMenuChange('portfolio')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeMenu === 'portfolio'
                    ? 'bg-indigo-600 text-white border border-indigo-500 shadow-lg shadow-indigo-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-indigo-600/40'
                }`}
              >
                <Briefcase size={18} />
                <span>Karya Saya</span>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-900/30 transition-all duration-200 border border-transparent hover:border-rose-800/40"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-900/40 transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-indigo-800/40 bg-slate-900/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={() => handleMenuChange('skills')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeMenu === 'skills' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-indigo-600/40'
                }`}
              >
                <Layers size={18} />
                <span>Keahlian</span>
              </button>
              <button
                onClick={() => handleMenuChange('portfolio')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeMenu === 'portfolio' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-indigo-600/40'
                }`}
              >
                <Briefcase size={18} />
                <span>Karya Saya</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* MENU KEAHLIAN */}
          {activeMenu === 'skills' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">Keahlian</h1>
                  <p className="text-slate-400 text-sm mt-1.5">Kelola daftar skill dan keahlian yang Anda kuasai.</p>
                </div>
              </div>

              {/* FORM KEAHLIAN (tanpa <form> tag) */}
              <div
                className={`bg-slate-900/80 backdrop-blur rounded-2xl shadow-[0_4px_20px_rgba(79,70,229,0.15)] border overflow-hidden transition-all duration-300 ${
                  isEditingSkill ? 'border-emerald-800/40 bg-emerald-900/20' : 'border-indigo-800/40'
                } animate-fade-in-up`}
              >
                <div className="px-6 sm:px-8 py-5 border-b border-slate-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isEditingSkill ? <Pencil className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                    <h2 className="font-extrabold text-base sm:text-lg text-slate-200">{isEditingSkill ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}</h2>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Judul Keahlian <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formSkillJudul}
                        onChange={(e) => setFormSkillJudul(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                        placeholder="Contoh: HTML & CSS"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Deskripsi <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formSkillDeskripsi}
                      onChange={(e) => setFormSkillDeskripsi(e.target.value)}
                      className="block w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                      placeholder="Membangun tampilan website yang terstruktur..."
                    />
                  </div>

                  {/* Tag field removed - data now handled internally */}

                  {/* Button Group */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {isEditingSkill && (
                      <button
                        type="button"
                        onClick={cancelEditSkillMode}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-amber-400 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800/40 transition-all"
                      >
                        <XCircle size={18} />
                        Batal Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSubmitSkill}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-md transition-all ${
                        isEditingSkill
                          ? 'bg-amber-900/300 hover:bg-amber-900/300'
                          : 'bg-indigo-600 hover:bg-indigo-500'
                      }`}
                    >
                      <CheckCircle size={18} />
                      {isEditingSkill ? 'Simpan Perubahan' : 'Simpan Keahlian'}
                    </button>
                  </div>
                </div>
              </div>

              {/* DAFTAR KEAHLIAN */}
              <div className="space-y-4 pt-4">
                <h3 className="font-extrabold text-slate-100 text-lg tracking-tight">Daftar Keahlian Saat Ini ({skills.length})</h3>
                {skills.length === 0 ? (
                  <div className="bg-slate-900/80 rounded-2xl p-12 text-center border border-slate-800/50">
                    <Layers className="mx-auto text-slate-600 w-12 h-12 mb-3" />
                    <p className="text-slate-400">Belum ada data.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="group bg-slate-900/70 p-5 rounded-3xl border border-indigo-800/40 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col min-h-[280px] relative"
                      >
                        {/* Action buttons - top right */}
                        <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => startEditSkillMode(skill)}
                            className="p-2 bg-indigo-900/80 backdrop-blur rounded-xl shadow-sm border border-indigo-700/50 text-amber-400 hover:bg-amber-900/50 transition-all"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => triggerDeleteConfirm('skill', skill)}
                            className="p-2 bg-indigo-900/80 backdrop-blur rounded-xl shadow-sm border border-indigo-700/50 text-rose-400 hover:bg-rose-900/50 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="bg-indigo-900/40 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-400 mb-6 ring-1 ring-indigo-500/10 group-hover:ring-purple-400/20 transition-all">
                          <LayoutDashboard size={28} />
                        </div>

                        <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">{skill.judul}</h4>
                        <p className="text-slate-400 flex-1">{skill.deskripsi}</p>


                        {/* Tags removed from dashboard view */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* MENU PORTOFOLIO */}
          {activeMenu === 'portfolio' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">Karya Saya</h1>
                  <p className="text-slate-400 text-sm mt-1.5">Tambah, edit, atau hapus item portofolio yang tampil di halaman depan.</p>
                </div>
              </div>

              <div
                className={`bg-slate-900/80 backdrop-blur rounded-2xl shadow-[0_4px_20px_rgba(79,70,229,0.15)] border overflow-hidden transition-all duration-300 ${
                  isEditingPortfolio ? 'border-emerald-800/40 bg-emerald-900/20' : 'border-indigo-800/40'
                } animate-fade-in-up`}
              >
                <div className="px-6 sm:px-8 py-5 border-b border-slate-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isEditingPortfolio ? <Pencil className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                    <h2 className="font-extrabold text-base sm:text-lg text-slate-200">{isEditingPortfolio ? 'Edit Karya' : 'Tambah Karya Baru'}</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmitPortfolio} className="p-6 sm:p-8 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Judul Proyek <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formJudul}
                        onChange={(e) => setFormJudul(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                        placeholder="Contoh: Aplikasi Kasir"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Deskripsi Singkat <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDeskripsi}
                      onChange={(e) => setFormDeskripsi(e.target.value)}
                      className="block w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                      placeholder="Deskripsikan fitur..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Gambar Proyek</label>
                        <div className="flex bg-slate-800/50 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => {
                              setImageInputType('url')
                              setFormGambar('')
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
                              imageInputType === 'url' ? 'bg-indigo-900/60 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <LinkIcon size={12} /> Link
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImageInputType('file')
                              setFormGambar('')
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
                              imageInputType === 'file' ? 'bg-indigo-900/60 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <UploadCloud size={12} /> Upload
                          </button>
                        </div>
                      </div>

                      {imageInputType === 'url' ? (
                        <div className="relative rounded-xl">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            value={formGambar}
                            onChange={(e) => setFormGambar(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                            placeholder="https://..."
                          />
                        </div>
                      ) : (
                        <div className="relative flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-600/50 rounded-xl bg-slate-800/60 hover:bg-slate-800/50 transition-colors cursor-pointer group h-[46px] mt-[2px]">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-xs font-semibold text-slate-400">
                              {formGambar ? <span className="text-emerald-400">✓ Gambar berhasil dimuat</span> : 'Pilih dari folder...'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Teknologi (Pisahkan dgn Koma) <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <TagIcon className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formTag}
                          onChange={(e) => setFormTag(e.target.value)}
                          className="block w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                          placeholder="React, Node.js"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FEATURES DYNAMIC */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Fitur Project <span className="text-rose-400">*</span>
                    </label>

                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            value={featureDraft}
                            onChange={(e) => setFeatureDraft(e.target.value)}
                            className="block w-full pl-4 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                            placeholder="Contoh: Login & Register"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = featureDraft.trim()
                            if (!next) {
                              showToast('Fitur tidak boleh kosong.', 'error')
                              return
                            }
                            if (formFeatures.includes(next)) {
                              showToast('Fitur sudah ada di daftar.', 'error')
                              return
                            }
                            setFormFeatures((prev) => [...prev, next])
                            setFeatureDraft('')
                          }}
                          className="sm:col-span-1 py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
                        >
                          Tambah
                        </button>
                      </div>

                      {formFeatures.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formFeatures.map((f, idx) => (
                            <div
                              key={`${f}-${idx}`}
                              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-900/40 border border-indigo-800/40"
                            >
                              <span className="text-xs font-bold text-indigo-200">✓ {f}</span>
                              <button
                                type="button"
                                onClick={() => setFormFeatures((prev) => prev.filter((x) => x !== f || prev.indexOf(x) !== idx))}
                                className="text-rose-300 hover:text-rose-200"
                                title="Hapus fitur"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400">Belum ada fitur.</div>
                      )}
                    </div>
                  </div>

                  {/* DATE RANGE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Tanggal Mulai <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="block w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Tanggal Selesai <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="block w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* ROLES CHECKBOX GROUP */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Role Project <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          'Frontend Developer',
                          'Backend Developer',
                          'Fullstack Developer',
                          'UI/UX Designer',
                          'Mobile Developer',
                          'Game Developer',
                          'DevOps Engineer',
                        ] as ProjectRole[]
                      ).map((r) => {
                        const checked = formRoles.includes(r)
                        return (
                          <label
                            key={r}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                              checked
                                ? 'bg-indigo-900/40 border-indigo-700/50'
                                : 'bg-slate-800/40 border-slate-700/50 hover:border-indigo-600/40'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setFormRoles((prev) => {
                                  if (prev.includes(r)) return prev.filter((x) => x !== r)
                                  return [...prev, r]
                                })
                              }}
                            />
                            <span className={`text-sm font-semibold ${checked ? 'text-indigo-200' : 'text-slate-200'}`}>{r}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* WORK TYPE RADIO */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Jenis Pengerjaan <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {(['Individu', 'Tim'] as ProjectWorkType[]).map((wt) => {
                        const checked = formWorkType === wt
                        return (
                          <label
                            key={wt}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                              checked
                                ? 'bg-indigo-900/40 border-indigo-700/50'
                                : 'bg-slate-800/40 border-slate-700/50 hover:border-indigo-600/40'
                            }`}
                          >
                            <input
                              type="radio"
                              name="workType"
                              checked={checked}
                              onChange={() => setFormWorkType(wt)}
                            />
                            <span className={`text-sm font-semibold ${checked ? 'text-indigo-200' : 'text-slate-200'}`}>{wt}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Link GitHub</label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FolderGit className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={formGithub}
                        onChange={(e) => setFormGithub(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/30 focus:border-indigo-500"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {isEditingPortfolio && (
                      <button
                        type="button"
                        onClick={cancelEditPortfolioMode}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-amber-400 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800/40 transition-all"
                      >
                        <XCircle size={18} />
                        Batal Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-md transition-all ${
                        isEditingPortfolio
                          ? 'bg-amber-900/300 hover:bg-amber-900/300'
                          : 'bg-indigo-600 hover:bg-indigo-500'
                      }`}
                    >
                      <CheckCircle size={18} />
                      {isEditingPortfolio ? 'Simpan Perubahan' : 'Simpan Karya'}
                    </button>
                  </div>
                </form>
              </div>

              {/* LIST KARYA */}
              <div className="space-y-4 pt-4">
                <h3 className="font-extrabold text-slate-100 text-lg tracking-tight">Daftar Karya Saat Ini ({portfolios.length})</h3>
                {portfolios.length === 0 ? (
                  <div className="bg-slate-900/80 rounded-2xl p-12 text-center border border-slate-800/50 shadow-sm">
                    <Briefcase className="mx-auto text-slate-600 w-12 h-12 mb-3" />
                    <p className="text-slate-400 font-medium">Belum ada karya.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolios.map((portfolio) => (
                      <div
                        key={portfolio.id}
                        className={`bg-slate-900/80 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${
                          isEditingPortfolio && editPortfolioId === portfolio.id
                            ? 'border-amber-700/50 ring-2 ring-amber-600/30'
                            : 'border-slate-800/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1 min-w-0">
                          <div className="w-full sm:w-28 h-20 bg-slate-800/50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800/50">
                            <img src={portfolio.gambar ?? ''} alt={portfolio.judul} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <h4 className="font-extrabold text-slate-100 text-base sm:text-lg flex items-center gap-2">
                              <span>{portfolio.judul}</span>
                            </h4>
                            <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 pr-4">{portfolio.deskripsi}</p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {portfolio.roles && portfolio.roles.length > 0 ? (
                                <span className="px-2.5 py-0.5 bg-indigo-900/40 text-indigo-200 rounded-md text-xs font-bold">
                                  Role: {portfolio.roles.join(', ')}
                                </span>
                              ) : null}
                              {portfolio.workType ? (
                                <span className="px-2.5 py-0.5 bg-slate-800/40 text-slate-200 rounded-md text-xs font-bold">
                                  Jenis: {portfolio.workType}
                                </span>
                              ) : null}
                              <span className="px-2.5 py-0.5 bg-emerald-900/30 text-emerald-200 rounded-md text-xs font-bold">
                                Fitur: {portfolio.features?.length ?? 0}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {portfolio.tag.split(',').map((tech, idx) => (
                                <span key={idx} className="px-2.5 py-0.5 bg-indigo-900/40 text-indigo-400 rounded-md text-xs font-bold">
                                  {tech.trim()}
                                </span>
                              ))}
                              {portfolio.github && (
                                <a
                                  href={portfolio.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-800/50 text-slate-400 rounded-md text-xs font-semibold border"
                                >
                                  <FaGithub size={12} />
                                  <span>GitHub</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/50 flex items-center justify-end gap-2">
                          <button onClick={() => startEditPortfolioMode(portfolio)} className="p-2.5 rounded-xl border bg-slate-800/50 text-slate-400 hover:text-amber-400 hover:bg-amber-900/30">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => triggerDeleteConfirm('portfolio', portfolio)} className="p-2.5 rounded-xl border bg-slate-800/50 text-slate-400 hover:text-rose-400 hover:bg-rose-900/30">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}