import { useNavigate } from '@tanstack/react-router'
import { type Dispatch, type SetStateAction, useMemo } from 'react'
import { Code2, Lock, Menu, X } from 'lucide-react'

type LandingNavbarMenuItem = {
  id: string
  label: string
}

export default function LandingNavbar({
  variant,
  activeMenu,
  setActiveMenu,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogoClick,
}: {
  variant: 'landing' | 'admin'
  activeMenu: string
  setActiveMenu: Dispatch<SetStateAction<string>>
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>
  onLogoClick?: () => void
}) {
  const navigate = useNavigate()

  const menuItems: LandingNavbarMenuItem[] = useMemo(
    () => [
      { id: 'home', label: 'Home' },
      { id: 'tentang', label: 'Tentang' },
      { id: 'keahlian', label: 'Keahlian' },
      { id: 'portofolio', label: 'Portofolio' },
      { id: 'kontak', label: 'Kontak' },
    ],
    [],
  )

  const showAdminLockButton = variant === 'landing'

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-slate-900/80 backdrop-blur-md border-b border-indigo-800/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
              <Code2 size={24} />
            </div>
            <span className="font-bold text-xl text-indigo-300 tracking-tight">
              N9n<span className="text-purple-400">Port</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((menu) => (
              <a
                key={menu.id}
                href={`#${menu.id}`}
                onClick={() => setActiveMenu(menu.id)}
                className="relative text-slate-300 hover:text-purple-400 font-medium transition-colors py-2 group"
              >
                {menu.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-purple-500 transition-all duration-300 ease-out ${
                    activeMenu === menu.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  style={{ boxShadow: activeMenu === menu.id ? '0 0 8px rgba(168, 85, 247, 0.6)' : 'none' }}
                />
              </a>
            ))}

            {showAdminLockButton && (
              <button
                onClick={() => navigate({ to: '/login' })}
                className="flex items-center gap-2 bg-indigo-900/40 text-purple-400 px-4 py-2 rounded-full font-semibold hover:bg-indigo-900/60 transition-all shadow-sm border border-indigo-700/50"
                aria-label="Toggle theme"
              >
                <Lock size={16} /> Admin
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-purple-400 p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-indigo-800/40 absolute w-full shadow-lg backdrop-blur-md">
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
            {menuItems
              .filter((m) => m.id !== 'kontak') // landing mobile di file awal tidak menampilkan kontak
              .map((menu) => (
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
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-purple-500 transition-all duration-300 ${
                        activeMenu === menu.id ? 'w-full' : 'w-0'
                      }`}
                    />
                  </span>
                </a>
              ))}

            {showAdminLockButton && (
              <button
                onClick={() => navigate({ to: '/login' })}
                className="mt-2 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium shadow-sm"
              >
                <Lock size={16} /> Login Admin
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

