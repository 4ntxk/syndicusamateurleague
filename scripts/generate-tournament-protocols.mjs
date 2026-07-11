import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dataPath = path.join(root, 'src', 'data', 'tournaments.json')
const docsDir = path.join(root, 'docs')
const browserPath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((candidate) => fs.existsSync(candidate))

if (!browserPath) {
  throw new Error('Chrome or Edge executable was not found.')
}

const tournaments = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

const organizer = {
  name: 'STANASZEK & DROZD Spółka z o.o.',
  rows: [
    'KRS: 0000803347',
    'NIP: 9731067124',
    'REGON: 384343870',
    'VAT: PL971067124',
    'adres: Zielonogórska 39B/5, 66-016 Czerwieńsk',
  ],
}

const protocols = [
  {
    tournamentId: 6,
    fileBase: 'protokol-turniejowy-may-1-2026',
    preparedAt: '09.06.2026',
    groupStage: '23.05.2026 - 31.05.2026',
    playoffs: '01.06.2026 - 08.06.2026',
    format: [
      'faza grupowa',
      'awans po 4 zawodników z każdej grupy do fazy playoff',
      'playoffy obejmujące ćwierćfinały, półfinały oraz finał',
      'mecze fazy grupowej rozgrywane systemem każdy z każdym, mecz i rewanż',
      'mecze playoff rozgrywane w formule dwumeczu, z sumowaniem wyniku obu spotkań',
    ],
    playoffSections: [
      ['Ćwierćfinały', 'winnersRound1'],
      ['Półfinały', 'winnersQuarterfinals'],
      ['Finał', 'winnersSemifinals'],
    ],
    finalClassification: [
      ['1', 'wariatbyyyszcz', 'zwycięstwo w finale 18:13 w dwumeczu', '150 zł'],
      ['2', 'wiksoonszef', 'udział w finale, wynik 13:18 w dwumeczu', '50 zł'],
    ],
  },
  {
    tournamentId: 7,
    fileBase: 'protokol-turniejowy-may-2-2026',
    preparedAt: '11.07.2026',
    groupStage: '15.06.2026 - 22.06.2026',
    playoffs: '23.06.2026 - 11.07.2026',
    format: [
      'faza grupowa',
      'top 2 zawodników z każdej grupy rozpoczyna playoffy w drabince wygranych',
      'miejsca 3-4 z każdej grupy rozpoczynają playoffy w drabince przegranych',
      'playoffy rozgrywane w formule double elimination',
      'mecze fazy grupowej rozgrywane systemem każdy z każdym, mecz i rewanż',
    ],
    playoffSections: [
      ['Półfinały drabinki wygranych', 'winnersSemifinals'],
      ['Finał drabinki wygranych', 'winnersFinal'],
      ['Runda 1 drabinki przegranych', 'losersRound1'],
      ['Runda 2 drabinki przegranych', 'losersRound2'],
      ['Runda 3 drabinki przegranych', 'losersRound3'],
      ['Finał drabinki przegranych', 'losersFinal'],
      ['Wielki finał', 'grandFinal'],
    ],
    finalClassification: [
      ['1', 'wariatbyyyszcz', 'zwycięstwo w wielkim finale 6:0', '150 zł'],
      ['2', 'wiksoonszef', 'udział w wielkim finale, wynik 0:6', '50 zł'],
    ],
  },
]

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const table = (headers, rows) => `
<table>
  <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
  <tbody>
    ${rows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
      .join('\n')}
  </tbody>
</table>`

const list = (items, ordered = false) => {
  const tag = ordered ? 'ol' : 'ul'
  return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</${tag}>`
}

const playoffRows = (matches = []) =>
  matches.map((match) => [
    `${match.home} vs ${match.away}`,
    match.score ?? 'brak wyniku',
  ])

const renderProtocol = (config) => {
  const tournament = tournaments.find((item) => item.id === config.tournamentId)
  if (!tournament) {
    throw new Error(`Tournament ${config.tournamentId} not found.`)
  }

  const groupSections = tournament.groups
    .map((group) => {
      const standingsRows = group.standings.map((row, index) => [
        String(index + 1),
        row.player,
        String(row.win),
        String(row.draw),
        String(row.loss),
        String(row.points),
      ])

      const advanced = group.standings
        .slice(0, group.advanceSlots ?? 0)
        .map((row) => row.player)
        .join(', ')

      return `
        <p><strong>${escapeHtml(group.name)}</strong></p>
        <p>Skład grupy:</p>
        ${list(group.players)}
        <p>Tabela końcowa ${escapeHtml(group.name.toLowerCase())}:</p>
        ${table(['Miejsce', 'Zawodnik', 'Zwycięstwa', 'Remisy', 'Porażki', 'Punkty'], standingsRows)}
        <p><strong>Awans do playoff:</strong> ${escapeHtml(advanced)}</p>
      `
    })
    .join('\n')

  const playoffSections = config.playoffSections
    .map(([title, key]) => {
      const rows = playoffRows(tournament.playoffs?.[key])
      return `
        <p><strong>${escapeHtml(title)}:</strong></p>
        ${rows.length > 0 ? table(['Mecz', 'Wynik'], rows) : '<p>Brak rozegranych meczów.</p>'}
      `
    })
    .join('\n')

  const payoutRows = config.finalClassification.map(([place, player, , prize]) => [
    place,
    player,
    prize,
    'do uzupełnienia',
  ])

  return `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <title>Protokół turnieju - ${escapeHtml(tournament.title)}</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111; line-height: 1.35; font-size: 12px; }
    h1 { font-size: 22px; text-align: center; margin: 0 0 14px; }
    h2 { font-size: 18px; text-align: center; margin: 0 0 18px; }
    h3 { font-size: 14px; margin: 18px 0 8px; break-after: avoid; }
    p { margin: 6px 0; }
    ul, ol { margin: 6px 0 10px 20px; }
    li { margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0 14px; break-inside: avoid; }
    th, td { border: 1px solid #444; padding: 6px 7px; vertical-align: top; }
    th { background: #efefef; }
    code { font-family: Consolas, monospace; font-size: 11px; }
  </style>
</head>
<body>
  <h1>Protokół z turnieju</h1>
  <h2>${escapeHtml(tournament.title)}</h2>
  <p><strong>Data sporządzenia protokołu:</strong> ${escapeHtml(config.preparedAt)}</p>

  <h3>1. Dane podstawowe</h3>
  <p><strong>Nazwa turnieju:</strong> ${escapeHtml(tournament.title)}</p>
  <p><strong>Organizator:</strong> ${escapeHtml(organizer.name)}</p>
  <p><strong>Dane organizatora:</strong></p>
  ${list(organizer.rows)}
  <p><strong>Okres rozgrywek:</strong></p>
  ${list([
    `rejestracja: ${tournament.registrationDate}`,
    `rozpoczęcie turnieju: ${tournament.startDate}`,
    `faza grupowa: ${config.groupStage}`,
    `playoffy: ${config.playoffs}`,
  ])}

  <h3>2. Format turnieju</h3>
  <p>Turniej został rozegrany w następującym formacie:</p>
  ${list(config.format)}

  <h3>3. Lista uczestników</h3>
  <p>W turnieju uczestniczyli:</p>
  ${list(tournament.players, true)}

  <h3>4. Wyniki fazy grupowej</h3>
  ${groupSections}

  <h3>5. Wyniki fazy playoff</h3>
  ${playoffSections}

  <h3>6. Klasyfikacja końcowa</h3>
  ${table(['Miejsce', 'Zawodnik', 'Podstawa ustalenia', 'Nagroda'], config.finalClassification)}

  <h3>7. Zawodnicy uprawnieni do nagród pieniężnych</h3>
  ${table(['Miejsce', 'Zawodnik', 'Kwota', 'Dane do wypłaty'], payoutRows)}

  <h3>8. Oświadczenie</h3>
  <p>Niniejszy protokół sporządzono na podstawie danych turniejowych dotyczących turnieju ${escapeHtml(tournament.title)}.</p>

  <h3>9. Podpis</h3>
  <p><strong>W imieniu Organizatora:</strong> Łukasz Stanaszek</p>
  <p><strong>Funkcja:</strong> Prezes</p>
  <p><strong>Podpis:</strong> ........................................................</p>
  <p><strong>Data podpisu:</strong> ........................................................</p>

  <h3>10. Uwagi / braki danych</h3>
  ${list([
    'brak danych do wypłaty nagród pieniężnych w protokole źródłowym',
    'daty zakończenia faz zostały wpisane na podstawie danych organizacyjnych i aktualnego stanu wyników w repozytorium',
  ])}
</body>
</html>`
}

fs.mkdirSync(docsDir, { recursive: true })

for (const config of protocols) {
  const htmlPath = path.join(docsDir, `${config.fileBase}.html`)
  const pdfPath = path.join(docsDir, `${config.fileBase}.pdf`)
  fs.writeFileSync(htmlPath, renderProtocol(config), 'utf8')
  execFileSync(browserPath, [
    '--headless',
    '--disable-gpu',
    `--print-to-pdf=${pdfPath}`,
    `file:///${htmlPath.replaceAll('\\', '/')}`,
  ])
  console.log(`Generated ${path.relative(root, pdfPath)}`)
}
