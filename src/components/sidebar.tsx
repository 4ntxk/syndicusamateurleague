'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

interface SidebarProps {
  activeNav: string
  setActiveNav: (nav: string) => void
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'registration', label: 'Rejestracja', href: '/registration' },
    { id: 'gallery', label: 'Galeria', href: '/gallery' },
    { id: 'division', label: 'English Division', href: '/division' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-2 rounded-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#1a0f2e] to-[#0f0a1a] text-sidebar-foreground border-r border-primary/40 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 pt-16 md:pt-6 h-full flex flex-col">
          <div className="mb-12">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2815d3] to-[#a83acd] bg-clip-text text-transparent">
              SAL
            </h1>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id)
                  if (item.href) {
                    router.push(item.href)
                  }
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  activeNav === item.id
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-sidebar-foreground hover:bg-primary/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-primary/30 pt-4">
            <p className="text-xs text-sidebar-foreground/50">© 2025 Syndicus Amateur League, Inc.</p>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

