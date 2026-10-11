import { rankLeaderboard, WIN_POINTS } from '../game/logic.js'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard({ leaderboard, highlight = [], onReset }) {
  const ranking = rankLeaderboard(leaderboard)

  if (ranking.length === 0) {
    return <p className="muted">Todavía no se jugó ninguna partida.</p>
  }

  return (
    <div className="leaderboard">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th className="left">Jugador</th>
            <th title="Puntos">Pts</th>
            <th title="Partidas ganadas">G</th>
            <th title="Partidas jugadas">PJ</th>
            <th title="Ganadas como impostor">🕵️</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((p, i) => (
            <tr key={p.name} className={highlight.includes(p.name) ? 'highlight' : ''}>
              <td>{MEDALS[i] ?? i + 1}</td>
              <td className="left">{p.name}</td>
              <td>
                <strong>{p.points}</strong>
              </td>
              <td>{p.wins}</td>
              <td>{p.games}</td>
              <td>{p.impostorWins}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small">
        Victoria civil: +{WIN_POINTS.civiles} pt · Victoria impostora: +{WIN_POINTS.impostores} pts
      </p>
      {onReset && (
        <button
          className="link"
          onClick={() => window.confirm('¿Borrar toda la clasificación?') && onReset()}
        >
          Reiniciar clasificación
        </button>
      )}
    </div>
  )
}
