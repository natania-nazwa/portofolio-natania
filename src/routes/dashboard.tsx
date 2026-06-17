import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type SetStateAction } from 'react';
import { FaGithub } from "react-icons/fa";
import { 
  Briefcase, 
  LogOut, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Tag as TagIcon, 
  FileText, 
  FolderGit,
  Menu,
  X,
  CheckCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Pencil,
  AlertCircle,
  XCircle,
  LayoutGrid,
  Layers,
  UploadCloud,
  Link as LinkIcon
} from 'lucide-react';

export const Route = createFileRoute('/dashboard')({
    component: Dashboard,
});

export default function Dashboard() {
  const navigate = useNavigate()
  // State untuk navigasi/login
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeMenu, setActiveMenu] = useState('skills'); // Default ke menu Keahlian
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State Form Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // State untuk Notifikasi/Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // State Modals (Konfirmasi)
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; data: { id: number; judul: string; deskripsi: string; tag: string; gambar?: string; github?: string } | null }>({ type: '', data: null });

  // ==================== STATE KARYA SAYA (PORTOFOLIO) ====================
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [editPortfolioId, setEditPortfolioId] = useState(null);
  const [portfolios, setPortfolios] = useState([
    {
      id: 1,
      judul: 'E-Commerce Ungu',
      deskripsi: 'Platform toko online modern dengan fitur keranjang belanja real-time dan integrasi sistem pembayaran yang andal.',
      tag: 'React, Tailwind, Node.js',
      gambar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      github: 'https://github.com/username/ecommerce-ungu'
    }
  ]);
  const [formGambar, setFormGambar] = useState('');
  const [imageInputType, setImageInputType] = useState('url'); // State untuk menentukan tipe input gambar: 'url' atau 'file'
  const [formJudul, setFormJudul] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formGithub, setFormGithub] = useState('');

  // ==================== STATE KEAHLIAN (SKILLS) ====================
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [editSkillId, setEditSkillId] = useState(null);
  const [skills, setSkills] = useState([
    {
      id: 1,
      judul: 'HTML & CSS',
      deskripsi: 'Membangun tampilan website yang terstruktur, responsif, dan menarik menggunakan HTML serta CSS.',
      tag: 'HTML5, CSS3, Bootstrap'
    }
  ]);
  const [formSkillJudul, setFormSkillJudul] = useState('');
  const [formSkillDeskripsi, setFormSkillDeskripsi] = useState('');
  const [formSkillTag, setFormSkillTag] = useState('');


  // ==================== GLOBAL HANDLERS ====================
  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

  const handleMenuChange = (menu: SetStateAction<string>) => {
    setActiveMenu(menu);
    setIsMobileMenuOpen(false);
    cancelEditPortfolioMode();
    cancelEditSkillMode();
  };


  // ==================== HANDLERS PORTOFOLIO ====================
  const handleSubmitPortfolio = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const finalGambar = formGambar.trim() || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60';

    if (isEditingPortfolio) {
      setPortfolios(portfolios.map(item => item.id === editPortfolioId ? {
        ...item, judul: formJudul, deskripsi: formDeskripsi, tag: formTag, gambar: finalGambar, github: formGithub || 'https://github.com'
      } : item));
      showToast('Karya berhasil diperbarui!', 'success');
      cancelEditPortfolioMode();
    } else {
      const newPortfolio = {
        id: Date.now(), judul: formJudul, deskripsi: formDeskripsi, tag: formTag, gambar: finalGambar, github: formGithub || 'https://github.com'
      };
      setPortfolios([newPortfolio, ...portfolios]);
      showToast('Karya baru berhasil disimpan!', 'success');
      resetFormPortfolio();
    }
  };

  const startEditPortfolioMode = (portfolio: { id: any; judul: any; deskripsi: any; tag: any; gambar: any; github: any; }) => {
    setIsEditingPortfolio(true);
    setEditPortfolioId(portfolio.id);
    setFormJudul(portfolio.judul);
    setFormDeskripsi(portfolio.deskripsi);
    setFormTag(portfolio.tag);
    setFormGambar(portfolio.gambar);
    
    // Deteksi jika gambar sebelumnya adalah hasil upload (base64) atau URL biasa
    setImageInputType(portfolio.gambar && portfolio.gambar.startsWith('data:image') ? 'file' : 'url');
    
    setFormGithub(portfolio.github === 'https://github.com' ? '' : portfolio.github);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Mode edit aktif.');
  };

  const cancelEditPortfolioMode = () => {
    setIsEditingPortfolio(false);
    setEditPortfolioId(null);
    resetFormPortfolio();
  };

  const resetFormPortfolio = () => {
    setFormGambar(''); setFormJudul(''); setFormTag(''); setFormDeskripsi(''); setFormGithub('');
    setImageInputType('url'); // Reset tipe input gambar ke URL
  };

  // Handler untuk Upload Gambar dari Folder
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Batas ukuran 2MB
        showToast('Ukuran gambar maksimal 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormGambar(reader.result as string); // Simpan hasil konversi gambar (Base64) ke state
        }
      };
      reader.readAsDataURL(file);
    }
  };


  // ==================== HANDLERS KEAHLIAN ====================
  const handleSubmitSkill = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (isEditingSkill) {
      setSkills(skills.map(item => item.id === editSkillId ? {
        ...item, judul: formSkillJudul, deskripsi: formSkillDeskripsi, tag: formSkillTag
      } : item));
      showToast('Keahlian berhasil diperbarui!', 'success');
      cancelEditSkillMode();
    } else {
      const newSkill = {
        id: Date.now(), judul: formSkillJudul, deskripsi: formSkillDeskripsi, tag: formSkillTag
      };
      setSkills([newSkill, ...skills]);
      showToast('Keahlian baru berhasil disimpan!', 'success');
      resetFormSkill();
    }
  };

  const startEditSkillMode = (skill: { id: any; judul: any; deskripsi: any; tag: any; }) => {
    setIsEditingSkill(true);
    setEditSkillId(skill.id);
    setFormSkillJudul(skill.judul);
    setFormSkillDeskripsi(skill.deskripsi);
    setFormSkillTag(skill.tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Mode edit keahlian aktif.');
  };

  const cancelEditSkillMode = () => {
    setIsEditingSkill(false);
    setEditSkillId(null);
    resetFormSkill();
  };

  const resetFormSkill = () => {
    setFormSkillJudul(''); setFormSkillDeskripsi(''); setFormSkillTag('');
  };


  // ==================== DELETE MODAL HANDLERS ====================
  const triggerDeleteConfirm = (type: string, data: { id: number; judul: string; deskripsi: string; tag: string; gambar?: string; github?: string; }) => {
    setItemToDelete({ type, data });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const data = itemToDelete.data;
    if (data) {
      if (itemToDelete.type === 'portfolio') {
        setPortfolios(portfolios.filter(item => item.id !== data.id));
        if (isEditingPortfolio && editPortfolioId === data.id) cancelEditPortfolioMode();
      } else if (itemToDelete.type === 'skill') {
        setSkills(skills.filter(item => item.id !== data.id));
        if (isEditingSkill && editSkillId === data.id) cancelEditSkillMode();
      }
      showToast(`"${data.judul}" telah dihapus`, 'error');
    }
    setShowDeleteModal(false);
    setItemToDelete({ type: '', data: null });
  };


  // ==================== LOGIN / LOGOUT ====================
  const handleLoginSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setTimeout(() => {
      setIsLoginLoading(false);
      setIsLoggedIn(true);
      showToast('Selamat datang kembali, Admin!');
    }, 1000);
  };

  // ==================== RENDER TAMPILAN ====================
  if (!isLoggedIn) {
    // ... Login form yang sama persis ...
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100 p-4 font-sans text-slate-800">
        <div className="relative max-w-md w-full bg-white rounded-3xl shadow-[0_10px_50px_rgba(124,58,237,0.08)] overflow-hidden border border-slate-100">
          <div className="px-8 pt-12 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Briefcase size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Admin Panel</h2>
            <p className="text-slate-500 text-sm">Masuk untuk mengelola portofolio Anda</p>
          </div>
          <div className="px-8 pb-10">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="admin@portofolio.com" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                  <input type={showPassword ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full pl-10 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                </div>
              </div>
              <button type="submit" disabled={isLoginLoading} className="w-full py-3.5 px-4 mt-6 rounded-xl shadow-lg shadow-violet-100 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-all flex justify-center items-center">
                {isLoginLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      
      {/* TOAST NOTIFIKASI */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl transition-all duration-300 text-white ${toast.type === 'error' ? 'bg-rose-500' : 'bg-slate-900'}`}>
          <CheckCircle className={`w-5 h-5 flex-shrink-0 ${toast.type === 'error' ? 'text-white' : 'text-emerald-400'}`} />
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4"><AlertCircle className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Keluar</h3>
              <p className="text-sm text-slate-500 mt-2">Apakah Anda yakin ingin mengakhiri sesi dan keluar dari Admin Panel?</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowLogoutModal(false)} className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm">Batal</button>
              <button onClick={() => navigate({ to: '/landing_page' })} className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-100">Keluar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS (Dinamic untuk Karya & Keahlian) */}
      {showDeleteModal && itemToDelete.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4"><Trash2 className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-slate-900">Hapus Data</h3>
              <p className="text-sm text-slate-500 mt-2">
                Yakin ingin menghapus <span className="font-semibold text-slate-800">"{itemToDelete.data.judul}"</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm">Batal</button>
              <button onClick={confirmDelete} className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-100">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d0e12] flex items-center justify-between px-4 text-white z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-md">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="font-bold tracking-wide text-lg">Admin<span className="text-violet-400">Panel</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 rounded-lg hover:bg-slate-800">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d0e12] text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/30">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="font-extrabold tracking-wider text-xl text-white">Admin<span className="text-violet-400">Panel</span></span>
          </div>

          <nav className="p-4 space-y-1.5 mt-4">
            <button
              onClick={() => handleMenuChange('skills')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${activeMenu === 'skills' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}
            >
              <Layers size={18} className={activeMenu === 'skills' ? 'text-white' : 'text-slate-400'} />
              <span>Keahlian</span>
            </button>

            <button
              onClick={() => handleMenuChange('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${activeMenu === 'portfolio' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}
            >
              <Briefcase size={18} className={activeMenu === 'portfolio' ? 'text-white' : 'text-slate-400'} />
              <span>Karya Saya</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60">
          <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all">
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" />}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto lg:h-screen pt-20 lg:pt-0 p-4 sm:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* ================================================================= */}
          {/* ==================== TAMPILAN MENU KEAHLIAN ===================== */}
          {/* ================================================================= */}
          {activeMenu === 'skills' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Keahlian</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Kelola daftar skill dan keahlian yang Anda kuasai.</p>
                </div>
                {isEditingSkill && (
                  <button onClick={cancelEditSkillMode} className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all border border-amber-100">
                    <XCircle size={14} /><span>Batal Edit</span>
                  </button>
                )}
              </div>

              {/* FORM KEAHLIAN */}
              <div className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border overflow-hidden transition-colors duration-300 ${isEditingSkill ? 'border-amber-200 bg-amber-50/10' : 'border-slate-100'}`}>
                <div className="px-6 sm:px-8 py-5 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isEditingSkill ? <Pencil className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-violet-600" />}
                    <h2 className="font-extrabold text-base sm:text-lg text-slate-800">{isEditingSkill ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmitSkill} className="p-6 sm:p-8 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Keahlian <span className="text-rose-500">*</span></label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Layers className="w-5 h-5" /></div>
                      <input type="text" required value={formSkillJudul} onChange={(e) => setFormSkillJudul(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="Contoh: HTML & CSS" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi <span className="text-rose-500">*</span></label>
                    <textarea rows={3} required value={formSkillDeskripsi} onChange={(e) => setFormSkillDeskripsi(e.target.value)} className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="Membangun tampilan website yang terstruktur..." />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tag / Tools (Pisahkan dgn Koma) <span className="text-rose-500">*</span></label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><TagIcon className="w-5 h-5" /></div>
                      <input type="text" required value={formSkillTag} onChange={(e) => setFormSkillTag(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="HTML5, CSS3, Bootstrap" />
                    </div>
                  </div>

                  <button type="submit" className={`w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-md transition-all ${isEditingSkill ? 'bg-amber-500 hover:bg-amber-600' : 'bg-violet-600 hover:bg-violet-700'}`}>
                    {isEditingSkill ? 'Simpan Perubahan' : 'Simpan Keahlian'}
                  </button>
                </form>
              </div>

              {/* DAFTAR KEAHLIAN (CARD DESIGN SEPERTI GAMBAR) */}
              <div className="space-y-4 pt-4">
                <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Daftar Keahlian Saat Ini ({skills.length})</h3>
                {skills.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-100"><Layers className="mx-auto text-slate-300 w-12 h-12 mb-3" /><p className="text-slate-500">Belum ada data.</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skills.map((skill) => (
                      <div key={skill.id} className="bg-[#fcfaff] border border-violet-100 rounded-[2rem] p-7 relative group shadow-sm hover:shadow-md transition-all">
                        {/* Action Buttons Timbul Saat Hover (Desktop) atau Selalu Timbul (Mobile) */}
                        <div className="absolute top-6 right-6 flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditSkillMode(skill)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-amber-500 hover:bg-amber-50"><Pencil size={16} /></button>
                          <button onClick={() => triggerDeleteConfirm('skill', skill)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
                        </div>
                        
                        {/* Ikon Persegi Kiri Atas */}
                        <div className="w-[60px] h-[60px] bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center justify-center mb-6 border border-slate-50">
                          <LayoutGrid className="w-8 h-8 text-violet-600" />
                        </div>
                        
                        {/* Teks Deskripsi */}
                        <h4 className="text-xl font-extrabold text-slate-800 mb-3">{skill.judul}</h4>
                        <p className="text-slate-500 text-[15px] leading-relaxed mb-6 line-clamp-3">
                          {skill.deskripsi}
                        </p>
                        
                        {/* Tags / Pills */}
                        <div className="flex flex-wrap gap-2.5">
                          {skill.tag.split(',').map((t, idx) => (
                            <span key={idx} className="bg-white px-3.5 py-1.5 rounded-full text-violet-700 text-xs font-bold shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-50">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}


          {/* ================================================================= */}
          {/* ==================== TAMPILAN MENU KARYA SAYA =================== */}
          {/* ================================================================= */}
          {activeMenu === 'portfolio' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Karya Saya</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Tambah, edit, atau hapus item portofolio yang tampil di halaman depan.</p>
                </div>
                {isEditingPortfolio && (
                  <button onClick={cancelEditPortfolioMode} className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all border border-amber-100">
                    <XCircle size={14} /><span>Batal Edit</span>
                  </button>
                )}
              </div>

              {/* FORM KARYA SAYA */}
              <div className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border overflow-hidden transition-colors duration-300 ${isEditingPortfolio ? 'border-amber-200 bg-amber-50/10' : 'border-slate-100'}`}>
                <div className="px-6 sm:px-8 py-5 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isEditingPortfolio ? <Pencil className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-violet-600" />}
                    <h2 className="font-extrabold text-base sm:text-lg text-slate-800">{isEditingPortfolio ? 'Edit Karya' : 'Tambah Karya Baru'}</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmitPortfolio} className="p-6 sm:p-8 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Proyek <span className="text-rose-500">*</span></label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><FileText className="w-5 h-5" /></div>
                      <input type="text" required value={formJudul} onChange={(e) => setFormJudul(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="Contoh: Aplikasi Kasir" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Singkat <span className="text-rose-500">*</span></label>
                    <textarea rows={3} required value={formDeskripsi} onChange={(e) => setFormDeskripsi(e.target.value)} className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="Deskripsikan fitur..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Area Input Gambar Dinamis (URL atau Upload) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Gambar Proyek</label>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => { setImageInputType('url'); setFormGambar(''); }}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${imageInputType === 'url' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <LinkIcon size={12} /> Link
                          </button>
                          <button
                            type="button"
                            onClick={() => { setImageInputType('file'); setFormGambar(''); }}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${imageInputType === 'file' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <UploadCloud size={12} /> Upload
                          </button>
                        </div>
                      </div>

                      {imageInputType === 'url' ? (
                        <div className="relative rounded-xl">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><ImageIcon className="w-5 h-5" /></div>
                          <input type="url" value={formGambar} onChange={(e) => setFormGambar(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="https://..." />
                        </div>
                      ) : (
                        <div className="relative flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer group h-[46px] mt-[2px]">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className="flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
                            <span className="text-xs font-semibold text-slate-500">
                              {formGambar ? <span className="text-emerald-600">✓ Gambar berhasil dimuat</span> : 'Pilih dari folder...'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Teknologi (Pisahkan dgn Koma) <span className="text-rose-500">*</span></label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><TagIcon className="w-5 h-5" /></div>
                        <input type="text" required value={formTag} onChange={(e) => setFormTag(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="React, Node.js" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Link GitHub</label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><FolderGit className="w-5 h-5" /></div>
                      <input type="url" value={formGithub} onChange={(e) => setFormGithub(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="https://github.com/..." />
                    </div>
                  </div>

                  <button type="submit" className={`w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-md transition-all ${isEditingPortfolio ? 'bg-amber-500 hover:bg-amber-600' : 'bg-violet-600 hover:bg-violet-700'}`}>
                    {isEditingPortfolio ? 'Simpan Perubahan' : 'Simpan Karya'}
                  </button>
                </form>
              </div>

              {/* LIST KARYA SAYA (DESAIN YANG LAMA) */}
              <div className="space-y-4 pt-4">
                <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Daftar Karya Saat Ini ({portfolios.length})</h3>
                {portfolios.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm"><Briefcase className="mx-auto text-slate-300 w-12 h-12 mb-3" /><p className="text-slate-500 font-medium">Belum ada karya.</p></div>
                ) : (
                  <div className="space-y-4">
                    {portfolios.map((portfolio) => (
                      <div key={portfolio.id} className={`bg-white rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${isEditingPortfolio && editPortfolioId === portfolio.id ? 'border-amber-300 ring-2 ring-amber-500/20' : 'border-slate-100'}`}>
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1 min-w-0">
                          <div className="w-full sm:w-28 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100"><img src={portfolio.gambar} alt={portfolio.judul} className="w-full h-full object-cover" /></div>
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2"><span>{portfolio.judul}</span></h4>
                            <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 pr-4">{portfolio.deskripsi}</p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {portfolio.tag.split(',').map((tech, idx) => <span key={idx} className="px-2.5 py-0.5 bg-violet-50 text-violet-600 rounded-md text-xs font-bold">{tech.trim()}</span>)}
                              {portfolio.github && <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-md text-xs font-semibold border"><FaGithub size={12} /><span>GitHub</span></a>}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex items-center justify-end gap-2">
                          <button onClick={() => startEditPortfolioMode(portfolio)} className="p-2.5 rounded-xl border bg-slate-50 text-slate-500 hover:text-amber-600 hover:bg-amber-50"><Pencil size={18} /></button>
                          <button onClick={() => triggerDeleteConfirm('portfolio', portfolio)} className="p-2.5 rounded-xl border bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50"><Trash2 size={18} /></button>
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
  );
}