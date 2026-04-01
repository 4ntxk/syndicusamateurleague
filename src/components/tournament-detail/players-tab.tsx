'use client'

type TournamentPlayersTabProps = {
  players: string[]
  emptyText: string
}

export function TournamentPlayersTab({
  players,
  emptyText,
}: TournamentPlayersTabProps) {
  if (players.length === 0) {
    return (
      <div className="text-foreground/80">
        {emptyText}
      </div>
    )
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <li
          key={player}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
        >
          {player}
        </li>
      ))}
    </ul>
  )
}
