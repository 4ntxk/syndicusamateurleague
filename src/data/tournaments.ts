import tournamentsData from './tournaments.json' assert { type: 'json' }

export type TournamentMatch = {
  home: string
  away: string
  score?: string
}

export type TournamentGroup = {
  name: string
  players: string[]
  advanceSlots?: number
  placeholderAdvance?: string
  standings: { player: string; win: number; loss: number; points: number }[]
  matches: {
    scheduled: TournamentMatch[]
    played: TournamentMatch[]
  }
}

export type Tournament = {
  id: number
  title: string
  registrationDate: string
  startDate: string
  isRegistrationOpen: boolean
  isOngoing: boolean
  googleFormUrl: string
  registrationLabel?: string
  statusLabel?: string
  registrationLabelEn?: string
  statusLabelEn?: string
  players: string[]
  groups: TournamentGroup[]
  playoffs?: {
    winnersRound1?: TournamentMatch[]
    winnersQuarterfinals?: TournamentMatch[]
    winnersSemifinals?: TournamentMatch[]
    winnersFinal?: TournamentMatch[]
    losersRound1?: TournamentMatch[]
    losersRound2?: TournamentMatch[]
    losersRound3?: TournamentMatch[]
    losersFinal?: TournamentMatch[]
    grandFinal?: TournamentMatch[]
  }
}

export const tournaments = tournamentsData as Tournament[]
