// components/Header.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40 transition-all">
        {/* CONTAINER PRINCIPAL */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"> {/* Aumentei max-w para dar mais espaço */}
          
          {/* FLEX CONTAINER (A mágica acontece aqui) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">

            {/* --- BLOCO ESQUERDA: MENU MOBILE + LOGO --- */}
            {/* --- BLOCO ESQUERDA: MENU MOBILE + LOGO --- */}
            {/* 'relative' é essencial aqui para a logo saber onde é o centro deste bloco */}
            <div className="flex items-center w-full md:w-auto relative justify-start">
              
              {/* 1. BOTÃO MENU MOBILE */}
              <button 
                onClick={toggleMenu}
                className="md:hidden p-2 -ml-2 text-valence-main hover:bg-slate-50 rounded-full transition-colors z-20"
                aria-label="Abrir menu"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* 2. LOGO (CENTRALIZAÇÃO ABSOLUTA NO MOBILE) */}
              {/* Mobile: absolute + left-1/2 + -translate-x-1/2 (Fica flutuando no centro exato)
                  Desktop (md): static + transform-none (Volta a se comportar como um bloco normal ao lado dos outros itens)
              */}
              <div className="absolute left-1/2 -translate-x-1/2 md:static md:transform-none flex-shrink-0">
                  <Link href="/">
                    <Image 
                      src="/logo-valence.png" 
                      alt="Valence Semijoias"
                      width={140}
                      height={50} 
                      priority
                      className="object-contain h-10 w-auto md:h-12"
                    />
                  </Link>
              </div>

            </div>


            {/* --- BLOCO CENTRO: BARRA DE BUSCA (Fluida) --- */}
            {/* Desktop: Aparece no fluxo (block). 
                Mobile: Escondido aqui (hidden), aparece embaixo.
                flex-1: Ocupa todo o espaço sobrando.
                max-w-xl: Não deixa ficar larga demais em telas gigantes.
            */}
            <div className="hidden md:block flex-1 max-w-xl mx-4 lg:mx-8">
               <div className="relative group w-full">
                  <input 
                    type="text" 
                    placeholder="Buscar peças..." 
                    className="w-full bg-slate-100 text-slate-700 rounded-full py-2 px-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-valence-light transition-all"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-valence-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
            </div>

            {/* --- BLOCO DIREITA: NAV LINKS + BOTÃO --- */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
            
            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                <Link href="/" className="hover:text-valence-main transition whitespace-nowrap">
                Início
                </Link>
                
                {/* AQUI: Removi o 'hidden lg:block'. Agora aparece sempre que for Desktop/Tablet */}
                <Link href="#" className="hover:text-valence-main transition whitespace-nowrap">
                Sobre
                </Link>
                
                <Link href="#" className="hover:text-valence-main transition whitespace-nowrap">
                Contato
                </Link>
            </div>

            <Link 
                href="/admin" 
                className="bg-valence-main text-white px-5 py-2 rounded-full hover:bg-valence-deep transition text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md whitespace-nowrap"
            >
                Admin
            </Link>
            </nav>

          </div>

          {/* --- BARRA DE BUSCA MOBILE (Abaixo do header principal) --- */}
          <div className="mt-3 md:hidden relative group w-full">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-slate-100 text-slate-700 rounded-full py-2.5 px-4 pl-10 text-sm outline-none focus:ring-1 focus:ring-valence-light transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-valence-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

        </div>
      </header>

      {/* --- MENU MOBILE (LATERAL) --- */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleMenu}
      />

      <aside 
        className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden flex flex-col ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <span className="font-serif text-valence-main text-xl font-bold">Menu</span>
          <button onClick={toggleMenu} className="text-slate-400 hover:text-red-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-5 space-y-2">
          <Link href="/" onClick={toggleMenu} className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-valence-main font-medium transition">
            Início
          </Link>
          <Link href="#" onClick={toggleMenu} className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-valence-main font-medium transition">
            Sobre a Valence
          </Link>
          <Link href="#" onClick={toggleMenu} className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-valence-main font-medium transition">
            Fale Conosco
          </Link>
          <div className="h-px bg-slate-100 my-4" />
          <Link href="/admin" onClick={toggleMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-valence-main bg-blue-50/50 hover:bg-blue-50 font-bold transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Área Admin
          </Link>
        </nav>
      </aside>
    </>
  )
}