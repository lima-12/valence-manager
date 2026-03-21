'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { User, Search, Menu, X, LogOut, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const pathname = usePathname()
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
          
          {/* 1. ESQUERDA: NAVEGAÇÃO (DESKTOP) E MENU (MOBILE) */}
          <div className="flex items-center flex-1">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-primary p-1"
            >
              <Menu size={22} strokeWidth={1.2} />
            </button>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className={`text-[10px] uppercase tracking-[0.2em] transition ${pathname === '/' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}>
                Início
              </Link>
              {/* <Link href="/colecao" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition">
                Coleção
              </Link> */}
            </nav>
          </div>

          {/* 2. CENTRO: LOGO (SEMPRE CENTRALIZADA) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0">
            <Link href="/">
              <Image 
                src="/logo-valence.png" 
                alt="Valence Semijoias"
                width={130}
                height={45} 
                priority
                className={`transition-all duration-500 ${scrolled ? 'h-7 w-auto' : 'h-9 w-auto'}`}
              />
            </Link>
          </div>

          {/* 3. DIREITA: BUSCA, USER, SACOLA */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
            
            {/* Campo de Busca Expansível (Desktop) */}
            <div className="hidden md:flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 160, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="BUSCAR..."
                    className="bg-transparent border-b border-primary/30 text-[9px] tracking-[0.2em] uppercase focus:outline-none mr-2 pb-1"
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1 text-primary hover:scale-110 transition">
                <Search size={20} strokeWidth={1.2} />
              </button>
            </div>

            {/* Busca Mobile (Apenas ícone) */}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden p-1 text-primary">
              <Search size={20} strokeWidth={1.2} />
            </button>

            {/* Divisor Sutil no Desktop */}
            <div className="hidden md:block h-4 w-[1px] bg-slate-200 mx-1" />

            {/* User / Admin */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/admin" className="p-1 text-primary hover:scale-110 transition" title="Painel Admin">
                  <User size={20} strokeWidth={1.2} />
                </Link>
                <button onClick={handleLogout} className="hidden md:block p-1 text-red-400/70 hover:text-red-600 transition">
                  <LogOut size={16} strokeWidth={1.2} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="p-1 text-primary hover:scale-110 transition">
                <User size={20} strokeWidth={1.2} />
              </Link>
            )}

            {/* Carrinho */}
            <Link href="/carrinho" className="p-1 text-primary hover:scale-110 transition relative">
              <ShoppingBag size={20} strokeWidth={1.2} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-3 h-3 flex items-center justify-center rounded-full">0</span>
            </Link>
          </div>
        </div>

        {/* INPUT DE BUSCA MOBILE (ABRE ABAIXO DO HEADER) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-slate-50 px-6 py-4 overflow-hidden"
            >
              <input 
                type="text" 
                placeholder="O QUE VOCÊ PROCURA?" 
                className="w-full bg-slate-50 border-none rounded-none p-3 text-[10px] tracking-[0.2em] uppercase focus:ring-1 focus:ring-primary/20 outline-none"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MENU MOBILE LATERAL */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-accent/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-background z-[70] shadow-2xl md:hidden"
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-center mb-12">
                  <span className="font-serif text-primary text-xl tracking-widest uppercase">Menu</span>
                  <button onClick={() => setIsMenuOpen(false)}><X size={24} strokeWidth={1} /></button>
                </div>
                
                <nav className="space-y-8">
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-xs uppercase tracking-[0.3em] text-primary">Início</Link>
                  <Link href="/colecao" onClick={() => setIsMenuOpen(false)} className="block text-xs uppercase tracking-[0.3em] text-primary">Coleção</Link>
                  {user && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block text-xs uppercase tracking-[0.3em] text-primary font-bold">Gerenciamento</Link>
                  )}
                </nav>

                <div className="mt-auto pt-8 border-t border-slate-100">
                  {user ? (
                    <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-400 font-bold">
                      <LogOut size={16} /> Sair
                    </button>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary font-bold">
                      <User size={16} /> Entrar
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
      {!scrolled && <div className="h-16 md:h-20" />}
    </>
  )
}