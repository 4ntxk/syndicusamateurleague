'use client'

import { ArrowRight, Users, Trophy, Calendar } from 'lucide-react'

export default function TournamentInfographic() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white mb-1">Tournament Structure</h2>
        <p className="text-xs text-foreground/70">128 players → 16 ladders → 16 winners → playoffs</p>
      </div>

      {/* Main flow visualization */}
      <div className="bg-[#1a0f2e] border border-[#2815d3]/30 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between gap-2 text-center">
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm">128</div>
            <div className="text-foreground/60 text-xs">Players</div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#a83acd] flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm">16 Ladders</div>
            <div className="text-foreground/60 text-xs">8 players each</div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#a83acd] flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm">16 Winners</div>
            <div className="text-foreground/60 text-xs">Qualify</div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#a83acd] flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm">Playoffs</div>
            <div className="text-foreground/60 text-xs">Offline</div>
          </div>
        </div>
      </div>

      {/* Key dates timeline */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-[#1a0f2e]/60 border border-[#2815d3]/30 rounded p-2">
          <div className="text-[#a83acd] font-bold">Registration End</div>
          <div className="text-white text-xs">10.01</div>
        </div>
        <div className="bg-[#1a0f2e]/60 border border-[#2815d3]/30 rounded p-2">
          <div className="text-[#a83acd] font-bold">Ladders announcement</div>
          <div className="text-white text-xs">12.01</div>
        </div>
        <div className="bg-[#1a0f2e]/60 border border-[#2815d3]/30 rounded p-2">
          <div className="text-[#a83acd] font-bold">Online End</div>
          <div className="text-white text-xs">28.01</div>
        </div>
        <div className="bg-[#1a0f2e]/60 border border-[#2815d3]/30 rounded p-2">
          <div className="text-[#a83acd] font-bold">Final</div>
          <div className="text-white text-xs">31.01 - 13:00</div>
        </div>
      </div>

      {/* Format note */}
      <p className="text-center text-xs text-foreground/60 mt-3">All matches: Double Elimination</p>
    </div>
  )
}
