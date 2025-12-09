'use client'

import { useState } from 'react'
import Sidebar from '../../components/sidebar'
import Footer from '../../components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function RegistrationPage() {
  const tournaments = [
    {
      id: 1,
      month: '20.12',
      title: 'SAL CUP Poznań',
      registrationDeadline: '18.12',
      googleFormUrl: 'https://forms.gle/dByhaSGWqr7Czdw4A',
    },
  ]

  const [activeNav, setActiveNav] = useState('registration')

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      
      <main className="flex-1 flex flex-col">
        <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-[#2815d3] to-[#a83acd]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Rejestracja turniejowa
            </h1>
            <p className="text-lg text-white/90">
              Zapisz się na wybrany turniej
            </p>
          </div>
        </section>

        <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                2025 Turnieje
              </h2>
              <p className="text-foreground/70">
                Wybierz poniżej turniej i zarejestruj się za pomocą formularza Google, aby zapewnić sobie miejsce.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <Card
                  key={tournament.id}
                  className="bg-[#1a0f2e] border-[#2815d3]/40 hover:border-[#a83acd]/80 hover:shadow-lg hover:shadow-[#a83acd]/20 transition-all flex flex-col"
                >
                  <CardHeader className="pb-3">
                    <div className="text-sm font-semibold text-[#a83acd] mb-2">
                      {tournament.month}
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {tournament.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <div className="mb-6 flex-1">
                      <div className="mb-4">
                        <p className="text-sm text-foreground/60 mb-1">Zamknięcie rejestracji</p>
                        <p className="text-foreground font-semibold">{tournament.registrationDeadline}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {/* <a href={tournament.googleFormUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full bg-[#2815d3] hover:bg-[#2815d3]/90 text-white">
                          View Details
                          <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                      </a> */}
                      <a href={tournament.googleFormUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full border-[#a83acd] text-[#a83acd] hover:bg-[#a83acd]/10 hover:text-whtie cursor-pointer">
                          Rejestracja
                          <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
