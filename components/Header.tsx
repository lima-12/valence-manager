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
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-4'
            : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between relative">
          
          {/* 1. ESQUERDA: MENU (MOBILE) + NAVEGAÇÃO & LUPA (DESKTOP) */}
          <div className="flex items-center gap-2 md:gap-6 w-24 md:flex-1">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-primary p-1"
            >
              <Menu size={22} strokeWidth={1.2} />
            </button>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden p-1 text-primary">
              <Search size={20} strokeWidth={1.2} />
            </button>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className={`text-[10px] uppercase tracking-[0.2em] transition ${pathname === '/' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}>
                Início
              </Link>
              <Link href="/colecao" className={`text-[10px] uppercase tracking-[0.2em] transition ${pathname === '/colecao' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}>
                Coleção
              </Link>

              {/* LUPA NA ESQUERDA (Resolvendo a sobreposição do nome) */}
              <div className="flex items-center ml-2">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 130, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="BUSCAR..."
                        className="bg-transparent border-b border-primary/20 text-[9px] tracking-[0.2em] uppercase focus:outline-none mr-3 pb-1 w-full"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1 text-primary hover:scale-110 transition">
                  <Search size={18} strokeWidth={1.2} />
                </button>
              </div>
            </nav>
          </div>

          {/* 2. CENTRO: LOGO EM TEXTO (Ajustada para não cobrir os ícones) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0">
            <Link href="/" className="group block text-center">
              {/* Diminuímos de text-4xl para text-3xl no modo estático para dar respiro */}
              <h1 className={`font-serif text-primary uppercase tracking-[0.4em] transition-all duration-500 ${scrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                Valence
              </h1>
              <div className="w-0 h-px bg-primary/20 mx-auto mt-1 transition-all duration-500 group-hover:w-full hidden md:block" />
            </Link>
          </div>

          {/* 3. DIREITA: USER & SACOLA */}
          <div className="flex items-center gap-3 md:gap-5 w-24 md:flex-1 justify-end">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/admin" className="p-1 text-primary hover:scale-110 transition" title="Admin">
                  <User size={20} strokeWidth={1.2} />
                </Link>
                <button onClick={handleLogout} className="hidden md:block p-1 text-red-400/60 hover:text-red-600 transition">
                  <LogOut size={16} strokeWidth={1.2} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="p-1 text-primary hover:scale-110 transition">
                <User size={20} strokeWidth={1.2} />
              </Link>
            )}

            <Link href="/carrinho" className="p-1 text-primary hover:scale-110 transition relative">
              <ShoppingBag size={20} strokeWidth={1.2} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[7px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">0</span>
            </Link>
          </div>
        </div>

        {/* BUSCA MOBILE ABAIXO DO HEADER */}
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