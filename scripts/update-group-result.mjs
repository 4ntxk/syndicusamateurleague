import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)

let tournamentId = 1
const inputParts = []

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]
  if (arg === '--tournament' || arg === '--id') {
    const value = args[i + 1]
    if (!value) {
      console.error('Missing value after --tournament/--id')
      process.exit(1)
    }
    tournamentId = Number(value)
    i += 1
    continue
  }
  inputParts.push(arg)
}

const input = inputParts.join(' ').trim()
if (!input) {
  console.error('Usage: node scripts/update-group-result.mjs "group A: player1 3:0 player2" [--tournament 1]')
  process.exit(1)
}

const groupMatch = input.match(/(?:group|grupa)\s*([A-Z])\s*[:\-]\s*(.+)$/i)
const groupLetter = groupMatch?.[1]?.toUpperCase()
const rest = groupMatch?.[2]?.trim()

if (!groupLetter || !rest) {
  console.error('Could not parse group. Expected: "group A: player1 3:0 player2"')
  process.exit(1)
}

const scoreMatch = rest.match(/(.+?)\s+(\d+)\s*:\s*(\d+)\s+(.+)/)
if (!scoreMatch) {
  console.error('Could not parse match. Expected: "player1 3:0 player2"')
  process.exit(1)
}

const home = scoreMatch[1].trim()
const away = scoreMatch[4].trim()
const score = `${scoreMatch[2]}:${scoreMatch[3]}`

const dataPath = path.resolve(process.cwd(), 'src', 'data', 'tournaments.json')
const raw = fs.readFileSync(dataPath, 'utf8')
const tournaments = JSON.parse(raw)

const tournament = tournaments.find((item) => item.id === tournamentId)
if (!tournament) {
  console.error(`Tournament id ${tournamentId} not found.`)
  process.exit(1)
}

const targetGroupName = `Grupa ${groupLetter}`
const group = tournament.groups.find(
  (item) => item.name.toLowerCase() === targetGroupName.toLowerCase(),
)
if (!group) {
  console.error(`Group ${targetGroupName} not found in tournament ${tournamentId}.`)
  process.exit(1)
}

if (!group.players.includes(home) || !group.players.includes(away)) {
  console.error(
    `Players must be in ${targetGroupName}. Available: ${group.players.join(', ')}`,
  )
  process.exit(1)
}

const matchesDirection = (match, targetHome, targetAway) =>
  match.home === targetHome && match.away === targetAway

const existingPlayedIndex = group.matches.played.findIndex((match) =>
  matchesDirection(match, home, away),
)

if (existingPlayedIndex >= 0) {
  group.matches.played[existingPlayedIndex] = { home, away, score }
} else {
  group.matches.played.push({ home, away, score })
}

const scheduledMatchIndex = group.matches.scheduled.findIndex((match) =>
  matchesDirection(match, home, away),
)

if (scheduledMatchIndex >= 0) {
  group.matches.scheduled.splice(scheduledMatchIndex, 1)
}

const parseScore = (scoreText) => {
  if (!scoreText) {
    return null
  }
  const main = scoreText.match(/(\d+)\s*:\s*(\d+)/)
  if (!main) {
    return null
  }
  const mainHome = Number(main[1])
  const mainAway = Number(main[2])
  if (mainHome !== mainAway) {
    return { home: mainHome, away: mainAway }
  }
  const tiebreak = scoreText.match(/\((\d+)\s*:\s*(\d+)\)/)
  if (tiebreak) {
    return { home: Number(tiebreak[1]), away: Number(tiebreak[2]) }
  }
  return { home: mainHome, away: mainAway }
}

const standingsByPlayer = new Map()
group.players.forEach((player) => {
  standingsByPlayer.set(player, { player, win: 0, draw: 0, loss: 0, points: 0 })
})

group.matches.played.forEach((match) => {
  const parsed = parseScore(match.score)
  if (!parsed) {
    return
  }
  if (parsed.home === parsed.away) {
    const homeRow = standingsByPlayer.get(match.home)
    const awayRow = standingsByPlayer.get(match.away)
    if (!homeRow || !awayRow) {
      return
    }
    homeRow.draw += 1
    homeRow.points += 1
    awayRow.draw += 1
    awayRow.points += 1
    return
  }
  const winner = parsed.home > parsed.away ? match.home : match.away
  const loser = parsed.home > parsed.away ? match.away : match.home

  const winnerRow = standingsByPlayer.get(winner)
  const loserRow = standingsByPlayer.get(loser)
  if (!winnerRow || !loserRow) {
    return
  }
  winnerRow.win += 1
  winnerRow.points += 3
  loserRow.loss += 1
})

group.standings = Array.from(standingsByPlayer.values()).sort((a, b) => {
  if (b.points !== a.points) return b.points - a.points
  if (b.win !== a.win) return b.win - a.win
  if (b.draw !== a.draw) return b.draw - a.draw
  return a.player.localeCompare(b.player)
})

fs.writeFileSync(dataPath, `${JSON.stringify(tournaments, null, 2)}\n`, 'utf8')
console.log(`Updated ${targetGroupName}: ${home} ${score} ${away}`)
