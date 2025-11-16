'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

const VISITED_KEY = 'sal-division-choice'

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const alreadyChosen = window.localStorage.getItem(VISITED_KEY)
    if (!alreadyChosen) {
      setShowDialog(true)
    }
  }, [])

  const handleChoose = (target: '/' | '/division') => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(VISITED_KEY, '1')
    }
    setShowDialog(false)
    router.push(target)
  }

  return (
    <>
      {children}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-[#2815d3]/60 bg-[#0f0a1a] p-6 shadow-lg shadow-[#2815d3]/40">
            <h2 className="mb-6 text-center text-xl font-black bg-gradient-to-r from-[#2815d3] to-[#a83acd] bg-clip-text text-transparent">
              Choose division / Wybierz dywizję
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleChoose('/')}
                className="flex-1 cursor-pointer rounded-lg bg-[#2815d3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2815d3]/90"
              >
                Polska Dywizja
              </button>
              <button
                type="button"
                onClick={() => handleChoose('/division')}
                className="flex-1 cursor-pointer rounded-lg border border-[#a83acd] px-4 py-2 text-sm font-semibold text-[#a83acd] transition hover:bg-[#a83acd]/10"
              >
                English Division
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
