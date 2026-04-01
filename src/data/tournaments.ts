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
  googleFormUrlEn?: string
  registrationLabel?: string
  statusLabel?: string
  registrationLabelEn?: string
  statusLabelEn?: string
  info?: {
    registrationTitle?: string
    registrationTitleEn?: string
    registrationBullets?: string[]
    registrationBulletsEn?: string[]
    qualifiersTitle?: string
    qualifiersTitleEn?: string
    qualifiersBullets?: string[]
    qualifiersBulletsEn?: string[]
    announcementsTitle?: string
    announcementsTitleEn?: string
    announcementsBullets?: string[]
    announcementsBulletsEn?: string[]
    playoffsTitle?: string
    playoffsTitleEn?: string
    playoffsBullets?: string[]
    playoffsBulletsEn?: string[]
  }
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

const parseDotDate = (value: string) => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim())
  if (!match) {
    return null
  }

  const [, day, month, year] = match
  return new Date(Number(year), Number(month) - 1, Number(day))
}

const parseRegistrationWindow = (value: string) => {
  const parts = value.split(' - ')
  if (parts.length !== 2) {
    return null
  }

  const start = parseDotDate(parts[0] ?? '')
  const end = parseDotDate(parts[1] ?? '')
  if (!start || !end) {
    return null
  }

  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export const isTournamentRegistrationOpen = (tournament: Tournament, now = new Date()) => {
  if (tournament.isRegistrationOpen) {
    return true
  }

  const registrationWindow = parseRegistrationWindow(tournament.registrationDate)
  if (!registrationWindow) {
    return false
  }

  return now >= registrationWindow.start && now <= registrationWindow.end
}

export const getRegistrationFormUrl = (tournament: Tournament, locale: string | undefined) =>
  locale === 'en'
    ? (tournament.googleFormUrlEn ?? tournament.googleFormUrl)
    : tournament.googleFormUrl

export const hasRegistrationForm = (tournament: Tournament, locale?: string) =>
  getRegistrationFormUrl(tournament, locale).trim().length > 0

export const tournaments = (tournamentsData as Tournament[]).map((tournament) => ({
  ...tournament,
  isRegistrationOpen: isTournamentRegistrationOpen(tournament),
}))
