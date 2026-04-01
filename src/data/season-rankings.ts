export type SeasonEvent = {
  id: string
  title: string
  month: string
  status: 'upcoming' | 'live' | 'completed'
}

export type SeasonPointsRow = {
  place: string
  points: number
}

export type SeasonRankingEntry = {
  player: string
  totalPoints: number
  eventsPlayed: number
  bestFinish: string
}

export type SeasonRankingConfig = {
  seasonName: string
  totalEvents: number
  finalsCutoff: number
  events: SeasonEvent[]
  pointsTable: SeasonPointsRow[]
  standings: SeasonRankingEntry[]
}

export const seasonOne: SeasonRankingConfig = {
  seasonName: 'Season 1',
  totalEvents: 6,
  finalsCutoff: 8,
  events: [
    { id: 's1-e1', title: 'S1 SAL CUP Online APRIL#1', month: 'April', status: 'upcoming' },
    { id: 's1-e2', title: 'S1 SAL CUP Online APRIL#2', month: 'April', status: 'upcoming' },
    { id: 's1-e3', title: 'S1 SAL CUP Online MAY#1', month: 'May', status: 'upcoming' },
    { id: 's1-e4', title: 'S1 SAL CUP Online MAY#2', month: 'May', status: 'upcoming' },
    { id: 's1-e5', title: 'S1 SAL CUP Online JUNE#1', month: 'June', status: 'upcoming' },
    { id: 's1-e6', title: 'S1 SAL CUP Online JUNE#2', month: 'June', status: 'upcoming' },
  ],
  pointsTable: [
    { place: '1st', points: 100 },
    { place: '2nd', points: 80 },
    { place: '3rd', points: 50 },
    { place: '4th-8th', points: 35 },
    { place: '9th-16th', points: 20 },
    { place: 'Participation', points: 10 },
  ],
  standings: [],
}
