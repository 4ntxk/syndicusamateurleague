'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function Schedule() {
  const tournaments = [
    {
      id: 1,
      month: '29.11',
      title: 'SAL CUP Łódź',
      status: 'OFFLINE',
    },
    {
      id: 2,
      month: '20.12',
      title: 'SAL CUP Poznań',
      status: 'OFFLINE',
    },
    {
      id: 3,
      month: 'Niedługo',
      title: 'SAL ONLINE CUP #4',
      status: 'ONLINE',
    },
  ]

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] border-t border-primary/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            2025 Harmonogram turniejowy
          </h2>
          <p className="text-lg text-foreground/70">
            Zaznacz w kalendarzu SALowe wydarzenia e-sportowe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="bg-[#1a0f2e] border-[#2815d3]/40 hover:border-[#a83acd]/80 hover:bg-[#1a0f2e]/80 transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="text-sm font-semibold text-[#a83acd] mb-2">
                  {tournament.month}
                </div>
                <CardTitle className="text-lg text-foreground">
                  {tournament.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2815d3]/30 text-[#a83acd]">
                  {tournament.status}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
