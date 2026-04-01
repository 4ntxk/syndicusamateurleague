import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)

let tournamentId = null
let inputFile = null
let replacePlayers = true

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

  if (arg === '--file') {
    const value = args[i + 1]
    if (!value) {
      console.error('Missing value after --file')
      process.exit(1)
    }
    inputFile = value
    i += 1
    continue
  }

  if (arg === '--append') {
    replacePlayers = false
  }
}

if (!Number.isInteger(tournamentId)) {
  console.error('Usage: node scripts/import-players.mjs --tournament 4 [--file players.txt] [--append]')
  process.exit(1)
}

const readStdin = async () => {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

const parsePlayers = (raw) => {
  const players = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/\t+/g, ' ').replace(/\s{2,}/g, ' ').trim())

  const uniquePlayers = []
  const seen = new Set()

  for (const player of players) {
    const key = player.toLowerCase()
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    uniquePlayers.push(player)
  }

  return uniquePlayers
}

const dataPath = path.resolve(process.cwd(), 'src', 'data', 'tournaments.json')
const rawData = fs.readFileSync(dataPath, 'utf8')
const tournaments = JSON.parse(rawData)
const tournament = tournaments.find((item) => item.id === tournamentId)

if (!tournament) {
  console.error(`Tournament id ${tournamentId} not found.`)
  process.exit(1)
}

let rawPlayers = ''

if (inputFile) {
  const inputPath = path.resolve(process.cwd(), inputFile)
  rawPlayers = fs.readFileSync(inputPath, 'utf8')
} else if (!process.stdin.isTTY) {
  rawPlayers = await readStdin()
}

if (!rawPlayers.trim()) {
  console.error('No player input found. Pass --file <path> or pipe plain text through stdin.')
  process.exit(1)
}

const importedPlayers = parsePlayers(rawPlayers)

if (importedPlayers.length === 0) {
  console.error('No valid player names found after cleanup.')
  process.exit(1)
}

if (replacePlayers) {
  tournament.players = importedPlayers
} else {
  const merged = [...(tournament.players ?? []), ...importedPlayers]
  tournament.players = parsePlayers(merged.join('\n'))
}

fs.writeFileSync(dataPath, `${JSON.stringify(tournaments, null, 2)}\n`, 'utf8')

console.log(
  `${replacePlayers ? 'Imported' : 'Appended'} ${importedPlayers.length} player(s) into tournament ${tournamentId}: ${tournament.title}`,
)
