type TournamentMatch = {
  home: string
  away: string
  score?: string
}

type TournamentGroup = {
  name: string
  players: string[]
  standings: { player: string; win: number; loss: number; points: number }[]
  matches: {
    scheduled: TournamentMatch[]
    played: TournamentMatch[]
  }
}

type Tournament = {
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
    losersRound1?: TournamentMatch[]
  }
}

export const tournaments: Tournament[] = [
  {
    id: 1,
    title: 'SAL CUP Online STYCZEŃ#1',
    registrationDate: '10.01.2026 - 29.01.2026',
    startDate: '31.01.2026',
    isRegistrationOpen: false,
    isOngoing: true,
    googleFormUrl: 'https://forms.gle/3JBgXrhoNZyRR4wU7',
    registrationLabel: 'Zamknięta',
    statusLabel: 'Faza II - playoffy',
    registrationLabelEn: 'Closed',
    statusLabelEn: 'Phase I - group stage',
    playoffs: {
      winnersRound1: [
        { home: 'Tommy__Rev', away: 'Kubadzik2009', score: '10:3' },
        { home: 'wariatbyyyszcz', away: 'Kwaslun', score: '7:0' },
        { home: 'wariatbyyyszcz', away: 'Tommy__Rev', score: '9:3' },
        { home: 'NikodemXpepsi', away: 'Rumcajs_PL', score: '5:3' },
        { home: 'marene54', away: 'andriizrv', score: '4:2' },
        { home: 'sliwkafc', away: 'I3anani_PL', score: '6:5' },
        { home: 'wiksoonszef', away: 'artem-traktorist', score: '3:0 (walkower)' },
        { home: 'buraaak94', away: 'Fistofeles', score: '3:0 (walkower)' },
        { home: 'TYMEK2k11', away: 'Przekradzki', score: '3:0 (walkower)' },
      ],
      winnersQuarterfinals: [
        { home: 'wariatbyyyszcz', away: 'Tommy__Rev', score: '9:3' },
      ],
      losersRound1: [
        { home: 'Kwaslun', away: 'Kubadzik2009', score: '4:2' },
        { home: 'Rumcajs_PL', away: 'artem-traktorist', score: '3:0' },
        { home: 'Fistofeles', away: 'andriizrv', score: '0:3' },
        { home: 'Przekradzki', away: 'I3anani_PL', score: '0:3' },
      ],
    },
    players: [
      'Kubadzik2009',
      'NikodemXpepsi',
      'wiksoonszef',
      'mbm911',
      'myron',
      'Szubiniok',
      'Tommy__Rev',
      'dejwideoo',
      'artem-traktorist',
      'I3anani_PL',
      'sliwkafc',
      'Mazmooz4618',
      'andriizrv',
      'tomekpie',
      'Przekradzki',
      'Kwaslun',
      'Pablo_fifa001',
      'buraaak94',
      'wariatbyyyszcz',
      'TYMEK2k11',
      'dziki_trener',
      'Rumcajs_PL',
      'marene54',
      'Fistofeles',
    ],
    groups: [
      {
        name: 'Grupa A',
        players: ['Kubadzik2009', 'Szubiniok', 'tomekpie', 'wariatbyyyszcz'],
        standings: [
          { player: 'wariatbyyyszcz', win: 1, loss: 0, points: 3 },
          { player: 'Szubiniok', win: 0, loss: 0, points: 0 },
          { player: 'tomekpie', win: 0, loss: 0, points: 0 },
          { player: 'Kubadzik2009', win: 0, loss: 1, points: 0 },
        ],
        matches: {
          scheduled: [
            { home: 'Kubadzik2009', away: 'Szubiniok' },
            { home: 'Kubadzik2009', away: 'tomekpie' },
            { home: 'Szubiniok', away: 'tomekpie' },
            { home: 'Szubiniok', away: 'wariatbyyyszcz' },
            { home: 'tomekpie', away: 'wariatbyyyszcz' },
          ],
          played: [{ home: 'wariatbyyyszcz', away: 'Kubadzik2009', score: '14:2' }],
        },
      },
      {
        name: 'Grupa B',
        players: ['NikodemXpepsi', 'Tommy__Rev', 'Kwaslun', 'dziki_trener'],
        standings: [
          { player: 'Tommy__Rev', win: 2, loss: 0, points: 6 },
          { player: 'NikodemXpepsi', win: 1, loss: 1, points: 3 },
          { player: 'Kwaslun', win: 0, loss: 2, points: 0 },
          { player: 'dziki_trener', win: 0, loss: 0, points: 0 },
        ],
        matches: {
          scheduled: [
            { home: 'NikodemXpepsi', away: 'dziki_trener' },
            { home: 'Tommy__Rev', away: 'dziki_trener' },
            { home: 'Kwaslun', away: 'dziki_trener' },
          ],
          played: [
            { home: 'Tommy__Rev', away: 'Kwaslun', score: '6:0' },
            { home: 'Tommy__Rev', away: 'NikodemXpepsi', score: '7:7 (1:0)' },
            { home: 'NikodemXpepsi', away: 'Kwaslun', score: '7:1' },
          ],
        },
      },
      {
        name: 'Grupa C',
        players: ['wiksoonszef', 'dejwideoo', 'Pablo_fifa001', 'Rumcajs_PL'],
        standings: [
          { player: 'wiksoonszef', win: 1, loss: 0, points: 3 },
          { player: 'dejwideoo', win: 0, loss: 0, points: 0 },
          { player: 'Pablo_fifa001', win: 0, loss: 0, points: 0 },
          { player: 'Rumcajs_PL', win: 0, loss: 1, points: 0 },
        ],
        matches: {
          scheduled: [
            { home: 'wiksoonszef', away: 'dejwideoo' },
            { home: 'wiksoonszef', away: 'Pablo_fifa001' },
            { home: 'dejwideoo', away: 'Pablo_fifa001' },
            { home: 'dejwideoo', away: 'Rumcajs_PL' },
            { home: 'Pablo_fifa001', away: 'Rumcajs_PL' },
          ],
          played: [{ home: 'wiksoonszef', away: 'Rumcajs_PL', score: '5:2' }],
        },
      },
      {
        name: 'Grupa D',
        players: ['mbm911', 'artem-traktorist', 'buraaak94', 'marene54'],
        standings: [
          { player: 'buraaak94', win: 2, loss: 0, points: 6 },
          { player: 'marene54', win: 1, loss: 1, points: 3 },
          { player: 'mbm911', win: 0, loss: 0, points: 0 },
          { player: 'artem-traktorist', win: 0, loss: 2, points: 0 },
        ],
        matches: {
          scheduled: [
            { home: 'mbm911', away: 'artem-traktorist' },
            { home: 'mbm911', away: 'buraaak94' },
            { home: 'mbm911', away: 'marene54' },
          ],
          played: [
            { home: 'marene54', away: 'artem-traktorist', score: '9:1' },
            { home: 'buraaak94', away: 'artem-traktorist', score: '10:0' },
            { home: 'buraaak94', away: 'marene54', score: '6:3' },
          ],
        },
      },
      {
        name: 'Grupa E',
        players: ['myron', 'I3anani_PL', 'TYMEK2k11', 'Fistofeles'],
        standings: [
          { player: 'TYMEK2k11', win: 1, loss: 0, points: 3 },
          { player: 'I3anani_PL', win: 1, loss: 1, points: 3 },
          { player: 'myron', win: 0, loss: 0, points: 0 },
          { player: 'Fistofeles', win: 0, loss: 1, points: 0 },
        ],
        matches: {
          scheduled: [
            { home: 'myron', away: 'I3anani_PL' },
            { home: 'myron', away: 'TYMEK2k11' },
            { home: 'myron', away: 'Fistofeles' },
            { home: 'I3anani_PL', away: 'Fistofeles' },
            { home: 'TYMEK2k11', away: 'Fistofeles' },
          ],
          played: [
            { home: 'I3anani_PL', away: 'TYMEK2k11', score: '5:6' },
            { home: 'I3anani_PL', away: 'Fistofeles', score: '6:0' },
          ],
        },
      },
      {
        name: 'Grupa F',
        players: ['sliwkafc', 'Mazmooz4618', 'andriizrv', 'Przekradzki'],
        standings: [
          { player: 'sliwkafc', win: 2, loss: 0, points: 6 },
          { player: 'Mazmooz4618', win: 0, loss: 0, points: 0 },
          { player: 'andriizrv', win: 0, loss: 1, points: 0 },
          { player: 'Przekradzki', win: 0, loss: 1, points: 0 },
        ],
        matches: {
          scheduled: [
            { home: 'sliwkafc', away: 'Mazmooz4618' },
            { home: 'Mazmooz4618', away: 'andriizrv' },
            { home: 'Mazmooz4618', away: 'Przekradzki' },
            { home: 'andriizrv', away: 'Przekradzki' },
          ],
          played: [
            { home: 'sliwkafc', away: 'andriizrv', score: '8:4' },
            { home: 'sliwkafc', away: 'Przekradzki', score: '54:2' },
          ],
        },
      },
    ],
  },
  {
    id: 2,
    title: 'SAL CUP Online LUTY#1',
    registrationDate: '31.01.2026 - 12.02.2026',
    startDate: '14.02.2026',
    isRegistrationOpen: true,
    isOngoing: false,
    googleFormUrl: 'https://forms.gle/QfhUSnb9e5RoSCNy9',
    players: [],
    groups: [],
  },
  {
    id: 3,
    title: 'SAL CUP Online LUTY#2',
    registrationDate: '14.02.2026 - 26.02.2026',
    startDate: '28.02.2026',
    isRegistrationOpen: false,
    isOngoing: false,
    googleFormUrl: '',
    players: [],
    groups: [],
  },
]
