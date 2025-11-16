'use client'

import Sidebar from '../../components/sidebar'
import Footer from '../../components/footer'
import { Button } from '../../components/ui/button'
import TournamentInfographic from '../../components/tournament-infographic'

export default function EnglishDivisionPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav="division" setActiveNav={() => {}} />

      <main className="flex-1 flex flex-col">
        <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-[#2815d3] to-[#a83acd]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              English Division
            </h1>
            <p className="text-lg text-white/90">
              A dedicated competitive division for players located in London.
            </p>
          </div>
        </section>

        <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] flex-1">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                About the Division
              </h2>
              <p className="text-foreground/70">
                The English Division is tailored for players situated in London, providing a competitive environment where English is the primary language used in broadcasts, rules, and communication.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Format</h3>
                <p className="text-sm text-foreground/70">
                  Online elimination, 128 players. 16 double-elimination ladders. 8 players in each ladder. Winner of each ladders goes to offline playoffs.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Requirements</h3>
                <p className="text-sm text-foreground/70">
                  All players must compete on PS5, Xbox Series X|S, or PC using an original, fully updated copy of EA Sports FC 26. All matches will be played through Online Friendlies, with cross-play available only within the same generation of platforms.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Match settings</h3>
                <p className="text-sm text-foreground/70">
                  Match settings use 6-minute halves with all standard Kick-Off teams available except Soccer Aid. Since Online Friendlies don’t allow overtime, any match that ends in a draw — players must immediately play another match with 2-minute halves. This process repeats until a winner is decided.
                  </p>
              </div>
            </div>

        <section className="w-full py-16 px-4 md:px-8">
          <TournamentInfographic />
        </section>

            <div className="border border-[#2815d3]/40 rounded-2xl bg-[#1a0f2e]/80 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  Interested in competing in our first London tournament?
                </h3>
                <p className="text-sm text-foreground/70">
                  Reach out to our staff on instagram, discord or via e-mail for more detail.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  asChild
                  className="bg-[#2815d3] hover:bg-[#2815d3]/90 text-white"
                >
                  <a                   target="_blank"
                  rel="noopener noreferrer" href="https://www.eventbrite.co.uk/e/syndicus-amateur-leaugue-cup-fc26-tickets-1948647068839?aff=oddtdtcreator">
                    Go to Registration
                  </a>
                </Button>
                {/* <Button
                  variant="outline"
                  className="border-[#a83acd] text-[#a83acd] hover:bg-[#a83acd]/10"
                >
                  Contact Staff
                </Button> */}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}

