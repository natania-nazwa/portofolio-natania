import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { FaGithub, FaInstagram } from "react-icons/fa";
import { 
  Briefcase, 
  Mail, 
  Lock,
  LayoutDashboard,
  Code2,
  Sparkles,
  MonitorSmartphone,
  ChevronRight,
  Menu,
  X,
  Send,
  School,
  User,
} from 'lucide-react';

// --- INTERFACE TYPESCRIPT ---
interface Portfolio {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string;
  link: string;
}

// --- DATA AWAL (DUMMY DATA) ---
const initialPortfolios: Portfolio[] = [
  {
    id: 1,
    title: 'E-Commerce Ungu',
    description: 'Platform toko online modern dengan fitur keranjang belanja real-time dan integrasi pembayaran.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    techStack: 'React, Node.js, Tailwind',
    link: '#'
  },
  {
    id: 2,
    title: 'Sistem Kasir Pintar',
    description: 'Aplikasi Point of Sale (POS) berbasis web untuk manajemen inventaris dan transaksi kafe.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
    techStack: 'Vue, Firebase, Bootstrap',
    link: '#'
  },
  {
    id: 3,
    title: 'Landing Page Creative Agency',
    description: 'Website portofolio untuk agensi kreatif dengan animasi scroll yang interaktif.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    techStack: 'Next.js, Framer Motion',
    link: '#'
  }
];

export const Route = createFileRoute('/landing_page')({
    component: LandingPage,
});

export default function LandingPage() {
  const navigate = useNavigate()
  // --- STATE MANAGEMENT ---
  const [portfolios] = useState<Portfolio[]>(initialPortfolios);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const goToLanding = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden relative">
      {/* Background Dekoratif Ungu (Biar "Rame") */}
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
              <span className="font-bold text-xl text-purple-900 tracking-tight">N9n<span className="text-purple-500">Porto</span></span>
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
              <a href="#portofolio" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-purple-50 rounded-md">Portofolio</a>
              <button onClick={() => navigate({ to: '/login' }) }className="mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md font-medium">
                <Lock size={16} /> Login Admin
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 pt-16">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-700 font-medium text-sm animate-bounce">
                <Sparkles size={16} className="text-purple-500" /> Tersedia untuk Proyek Baru
              </div>
              <h4 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                 Natania Nazwa  <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500">
                 Gisella Nasyahrani
                </span>
              </h4>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Di era digital saat ini, dunia coding menjadi salah satu keterampilan penting yang terus berkembang. Sebagai siswa SMK jurusan Rekayasa Perangkat Lunak (RPL), proses belajar ini menjadi langkah awal untuk memahami bagaimana teknologi dibangun dan digunakan.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#portofolio" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 hover:-translate-y-1">
                  Lihat Karya Saya <ChevronRight size={20} />
                </a>
                <a href="#kontak" className="flex items-center gap-2 bg-white border-2 border-purple-200 hover:border-purple-400 text-purple-700 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-1">
                  Hubungi Saya
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 pt-6">
                <a href="https://github.com/natania-nazwa" className="p-3 bg-white rounded-full text-slate-500 hover:text-purple-600 hover:bg-purple-50 shadow-sm border border-slate-100 transition-colors"><FaGithub size={22} /></a>
                <a href="mailto:nazwanasyahrani@gmail.com" className="p-3 bg-white rounded-full text-slate-500 hover:text-purple-600 hover:bg-purple-50 shadow-sm border border-slate-100 transition-colors"><Mail size={22} /></a>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="order-1 md:order-2 flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-fuchsia-300 rounded-full blur-3xl opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" 
                alt="Developer Workspace" 
                className="relative z-10 w-full max-w-md rounded-3xl shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
              
              {/* Floating Badges */}
              <div className="absolute -left-6 top-1/4 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-green-100 p-2 rounded-full"><MonitorSmartphone size={24} className="text-green-600" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">Responsif</p>
                  <p className="text-sm font-bold text-slate-800">100% Mobile</p>
                </div>
              </div>
              <div className="absolute -right-6 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="bg-purple-100 p-2 rounded-full"><Code2 size={24} className="text-purple-600" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">Clean Code</p>
                  <p className="text-sm font-bold text-slate-800">Standar Industri</p>
                </div>
              </div>
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
                    <p className="text-sm text-slate-500 break-words">
                      Belajar & Berkembang
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <Code2 className="text-purple-600 mb-2" />
                    <p className="font-bold text-slate-800">Fokus</p>
                    <p className="text-sm text-slate-500 break-words">
                      Front-End Development
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <Mail className="text-purple-600 mb-2" />
                    <p className="font-bold text-slate-800">Email</p>
                    <p className="text-sm text-slate-500 break-all">
                      nazwanasyahrani@gmail.com
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <FaInstagram className="text-purple-600 mb-2" />
                    <p className="font-bold text-slate-800">Instagram</p>
                    <p className="text-sm text-slate-500 break-words">
                      @ntninzwgsla
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* TENTANG / SKILLS SECTION */}
        <section id="keahlian" className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-purple-600 tracking-widest uppercase mb-2">Keahlian Saya</h2>
              <h3 className="text-3xl font-bold text-slate-900">Kemampuan yang Saya Miliki</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-purple-600 mb-6">
                  <LayoutDashboard size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">HTML & CSS</h4>
                <p className="text-slate-600 mb-6">Membangun tampilan website yang terstruktur, responsif, dan menarik menggunakan HTML serta CSS.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white text-purple-700 text-xs font-bold rounded-full shadow-sm">HTML5</span>
                  <span className="px-3 py-1 bg-white text-purple-700 text-xs font-bold rounded-full shadow-sm">CSS3</span>
                  <span className="px-3 py-1 bg-white text-purple-700 text-xs font-bold rounded-full shadow-sm">Boostrap</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-fuchsia-600 mb-6">
                  <Code2 size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">React.js</h4>
                <p className="text-slate-600 mb-6">Mengembangkan antarmuka web yang modern, interaktif, dan mudah digunakan dengan React.js.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white text-fuchsia-700 text-xs font-bold rounded-full shadow-sm">React.js</span>
                  <span className="px-3 py-1 bg-white text-fuchsia-700 text-xs font-bold rounded-full shadow-sm">JavaScript</span>
                  <span className="px-3 py-1 bg-white text-fuchsia-700 text-xs font-bold rounded-full shadow-sm">Tailwind CSS</span>
                </div>
              </div>

                {/* Card 3 */}
              <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                  <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-blue-600 mb-6">
                  <MonitorSmartphone size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">UI/UX Design</h4>
                <p className="text-slate-600 mb-6">Merancang prototipe dan wireframe sebelum tahap pengembangan agar sesuai visi klien.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-full shadow-sm">Figma</span>
                  <span className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-full shadow-sm">Canva</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow flex flex-col h-[280px]">
                <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-blue-600 mb-6">
                  <MonitorSmartphone size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Laravel & PHP</h4>
                <p className="text-slate-600 mb-6">Mengembangkan aplikasi web dengan Laravel, PHP, Bootstrap, dan pengelolaan database yang terstruktur.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-full shadow-sm">Laravel</span>
                  <span className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-full shadow-sm">PHP</span>
                  <span className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-full shadow-sm">Boostsrap</span>
                </div>
              </div>
            </div>
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

            {/* Grid Portofolio */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios.length === 0 ? (
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
                        src={item.image || 'https://via.placeholder.com/800x600?text=No+Image'} 
                        alt={item.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'; }}
                      />
                      {/* Tech Tags on Image */}
                      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                        {item.techStack.split(',').slice(0, 2).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/90 backdrop-blur text-purple-900 text-xs font-bold rounded-md">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Konten Card */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">{item.title}</h4>
                      <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">{item.description}</p>
                      
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <a href={item.link !== '#' ? item.link : '#'} className="inline-flex items-center gap-1 text-purple-600 font-bold text-sm hover:text-purple-800">
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

        {/* CTA / CONTACT SECTION */}
        <section id="kontak" className="py-20 bg-purple-50 border-t border-purple-100 relative overflow-hidden">
          {/* Ornamen Background Tambahan Biar Rame */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 opacity-30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Bagian Kiri - Info Kontak */}
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

              {/* Bagian Kanan - Form Card */}
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-purple-100 relative">
                {/* Aksen glow ungu soft di belakang card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 to-fuchsia-300 rounded-[2rem] blur-lg opacity-30 -z-10"></div>
                
                <h4 className="text-2xl font-bold text-slate-800 mb-8">Kirim Pesan</h4>
                
                <form className="space-y-5" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pesan</label>
                    <textarea 
                      rows={4}
                      placeholder="Tuliskan pesan Anda..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50 focus:bg-white transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-purple-500/30 flex justify-center items-center gap-2 mt-4"
                  >
                    Kirim Pesan <Send size={18} />
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
            <span className="font-bold text-xl text-white tracking-tight">N9n<span className="text-purple-500">Porto</span></span>
          </div>
          <p className="text-sm text-center md:text-left">&copy; {new Date().getFullYear()} DevPorto. Dibuat dengan React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}