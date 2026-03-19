'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  navLinks: string[][]
}

export function LandingClient({ navLinks }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 h-[58px] border-b transition-all duration-300"
        style={{
          borderColor: scrolled ? 'rgba(39,39,43,0.8)' : 'rgba(39,39,43,0.4)',
          backgroundColor: scrolled ? 'rgba(10,10,11,0.95)' : 'rgba(10,10,11,0.7)',
          backdropFilter: 'blur(16px)',
        }}
      >

        <Image src="/logo.svg" alt="PixTager" width={110} height={36} priority />
    
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} className="px-4 py-2 text-[13px] text-txt-2 hover:text-txt rounded-lg transition-colors">{label}</a>
          ))}
          <Link href="/auth" className="px-4 py-2 text-[13px] text-txt-2 hover:text-txt rounded-lg transition-colors">Войти</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth" className="btn btn-primary text-sm px-5 py-2 hidden sm:inline-flex">Начать бесплатно →</Link>
          {/* Mobile burger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 rounded-lg hover:bg-bg-3 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            <span className={`block w-5 h-0.5 bg-txt transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-txt transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-txt transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{backgroundColor:'rgba(10,10,11,0.97)',backdropFilter:'blur(16px)'}}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
          {navLinks.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="font-display text-2xl font-bold text-txt-2 hover:text-accent transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="/auth"
            className="font-display text-2xl font-bold text-txt-2 hover:text-accent transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Войти
          </a>
          <Link href="/auth" className="btn btn-primary btn-xl mt-4" onClick={() => setMenuOpen(false)}>
            Начать бесплатно →
          </Link>
        </div>
      </div>
    </>
  )
}
