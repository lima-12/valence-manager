'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você integraria com sua lógica de newsletter futuramente
    alert("Obrigado por se inscrever!")
    setEmail("")
  }

  return (
    <footer className="bg-accent text-accent-foreground mt-24 border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Coluna 1 — Institucional */}
          <div className="space-y-6">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent-foreground/50">
              Navegação
            </h3>
            <nav className="flex flex-col gap-4">
              <Link href="/" className="font-sans text-xs uppercase tracking-widest hover:text-white transition-colors">Início</Link>
              <Link href="/colecao" className="font-sans text-xs uppercase tracking-widest hover:text-white transition-colors">Coleção</Link>
              <Link href="/sobre" className="font-sans text-xs uppercase tracking-widest hover:text-white transition-colors">A Marca</Link>
              <Link href="/politicas" className="font-sans text-xs uppercase tracking-widest hover:text-white transition-colors">Trocas e Devoluções</Link>
            </nav>
          </div>

          {/* Coluna 2 — Contato */}
          <div className="space-y-6">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent-foreground/50">
              Atendimento
            </h3>
            <div className="flex flex-col gap-4 text-xs tracking-widest uppercase">
              <a href="https://wa.me/seunumeroaqui" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} strokeWidth={1.5} /> WhatsApp
              </a>
              <a href="mailto:contato@valencesemijoias.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} strokeWidth={1.5} /> E-mail
              </a>
              <p className="flex items-center gap-2 opacity-70">
                <MapPin size={14} strokeWidth={1.5} /> Belém - PA
              </p>
            </div>
          </div>

          {/* Coluna 3 — Social */}
          <div className="space-y-6">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent-foreground/50">
              Redes Sociais
            </h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-accent-foreground/20 rounded-full hover:bg-white hover:text-accent transition-all">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="p-2 border border-accent-foreground/20 rounded-full hover:bg-white hover:text-accent transition-all">
                <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Coluna 4 — Newsletter */}
          <div className="space-y-6">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent-foreground/50">
              Newsletter
            </h3>
            <p className="font-serif text-sm italic opacity-80">
              Receba lançamentos e curadorias exclusivas.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="SEU MELHOR E-MAIL"
                required
                className="bg-transparent border-b border-accent-foreground/30 font-sans text-[10px] tracking-widest text-accent-foreground placeholder:text-accent-foreground/40 pb-2 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="text-[10px] uppercase tracking-[0.3em] text-accent-foreground/70 hover:text-white text-left transition-colors active:scale-95"
              >
                Inscrever-se →
              </button>
            </form>
          </div>
        </div>

        {/* Linha Inferior (Copyright) */}
        <div className="mt-20 pt-8 border-t border-accent-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start group">
            {/* Texto Valence no Footer - Maior e mais espaçado para fechar o site */}
            <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.5em] text-white transition-all duration-500 group-hover:tracking-[0.6em]">
              Valence
            </h2>
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-accent-foreground/40 mt-1.5">
              Semijoias com alma e propósito
            </p>
          </div>
          
          <div className="text-[9px] uppercase tracking-[0.2em] opacity-40 text-center md:text-right">
            <p>© {new Date().getFullYear()} Valence Semijoias</p>
            <p className="mt-1">Desenvolvido por você • Belém/PA</p>
          </div>
        </div>
      </div>
    </footer>
  )
}