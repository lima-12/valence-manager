'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  
  // Inicializa o cliente para checar sessão no navegador
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Monitora se o usuário está logado
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [pathname]) // Re-checa sempre que mudar de página

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isAdminPath = pathname.startsWith('/admin')

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* BLOCO ESQUERDA: MENU MOBILE + LOGO */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 text-valence-main hover:bg-slate-50 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Link href="/" className="flex-shrink-0">
                <Image 
                  src="/logo-valence.png" 
                  alt="Valence Semijoias"
                  width={120}
                  height={40} 
                  priority
                  className="h-8 w-auto md:h-10"
                />
              </Link>
            </div>

            {/* NAV DESKTOP */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className={`text-[10px] uppercase tracking-[0.2em] transition ${pathname === '/' ? 'text-valence-main font-bold' : 'text-slate-400 hover:text-valence-main'}`}>
                Início
              </Link>
              {user && (
                <Link href="/admin" className={`text-[10px] uppercase tracking-[0.2em] transition ${isAdminPath ? 'text-valence-main font-bold' : 'text-slate-400 hover:text-valence-main'}`}>
                  Gestão
                </Link>
              )}
            </nav>

            {/* BOTÃO DE AÇÃO (LOGADO OU NÃO) */}
            <div className="flex items-center gap-4">
               {user ? (
                 <button 
                  onClick={handleLogout}
                  className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition"
                 >
                   Sair
                 </button>
               ) : (
                 <Link 
                   href="/login" 
                   className="bg-valence-main text-white px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm hover:bg-valence-deep transition"
                 >
                   Entrar
                 </Link>
               )}
            </div>

          </div>
        </div>
      </header>

      {/* MENU MOBILE LATERAL (O SANDUÍCHE) */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-50 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <aside 
          className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-2xl transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <span className="font-serif text-valence-main font-bold uppercase tracking-widest">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-red-500">✕</button>
          </div>
          <nav className="p-6 space-y-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-xs uppercase tracking-widest text-slate-600">Início</Link>
            {user && (
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block text-xs uppercase tracking-widest text-valence-main font-bold">Painel Gestão</Link>
            )}
            <div className="pt-4 border-t border-slate-50">
               {user ? (
                 <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-red-400">Sair da Conta</button>
               ) : (
                 <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-xs uppercase tracking-widest text-valence-main">Fazer Login</Link>
               )}
            </div>
          </nav>
        </aside>
      </div>
    </>
  )
}