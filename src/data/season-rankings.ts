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
  totalEvents: 4,
  finalsCutoff: 8,
  events: [
    { id: 's1-e1', title: 'S1 SAL CUP Online APRIL#1', month: 'April', status: 'completed' },
    { id: 's1-e2', title: 'S1 SAL CUP Online MAY#1', month: 'May', status: 'completed' },
    { id: 's1-e3', title: 'S1 SAL CUP Online MAY#2', month: 'May', status: 'live' },
    { id: 's1-e4', title: 'S1 SAL CUP Online JUNE#1', month: 'June', status: 'upcoming' },
  ],
  pointsTable: [
    { place: '1st', points: 100 },
    { place: '2nd', points: 80 },
    { place: '3rd-4th', points: 50 },
    { place: '5th-8th', points: 35 },
    { place: '9th-16th', points: 20 },
  ],
  standings: [
    {
      player: 'wariatbyyyszcz',
      totalPoints: 200,
      eventsPlayed: 2,
      bestFinish: '1st',
    },
    {
      player: 'wiksoonszef',
      totalPoints: 160,
      eventsPlayed: 2,
      bestFinish: '2nd',
    },
    {
      player: 'Rumcajs_PL',
      totalPoints: 100,
      eventsPlayed: 2,
      bestFinish: '3rd-4th',
    },
    {
      player: 'Tommy__Rev',
      totalPoints: 85,
      eventsPlayed: 2,
      bestFinish: '3rd-4th',
    },
    {
      player: 'marene54',
      totalPoints: 70,
      eventsPlayed: 2,
      bestFinish: '5th-8th',
    },
    {
      player: 'Kubadzik2009',
      totalPoints: 70,
      eventsPlayed: 2,
      bestFinish: '5th-8th',
    },
    {
      player: 'Kheengx_',
      totalPoints: 70,
      eventsPlayed: 2,
      bestFinish: '5th-8th',
    },
    {
      player: 'szaki420',
      totalPoints: 50,
      eventsPlayed: 1,
      bestFinish: '3rd-4th',
    },
    {
      player: 'whosbennny',
      totalPoints: 35,
      eventsPlayed: 1,
      bestFinish: '5th-8th',
    },
    {
      player: 'Ihor7_44',
      totalPoints: 20,
      eventsPlayed: 1,
      bestFinish: '9th-16th',
    },
    {
      player: 'Pablo_fifa001',
      totalPoints: 20,
      eventsPlayed: 1,
      bestFinish: '9th-16th',
    },
    {
      player: 'Rixasar',
      totalPoints: 20,
      eventsPlayed: 1,
      bestFinish: '9th-16th',
    },
    {
      player: 'Konoko0897',
      totalPoints: 20,
      eventsPlayed: 1,
      bestFinish: '9th-16th',
    },
    {
      player: 'Mark2k16ukr',
      totalPoints: 20,
      eventsPlayed: 1,
      bestFinish: '9th-16th',
    },
  ],
}
