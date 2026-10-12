import { getTheme } from '../data/themes.js'
import Leaderboard from './Leaderboard.jsx'

const listNames = (names) =>
  names.length > 1 ? `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}` : names[0]

export default function Result({ round, leaderboard, onPlayAgain, onSetup }) {
  const theme = getTheme(round.themeId)
  const impostors = round.roles.filter((r) => r.impostor).map((r) => r.name)
  const civilWin = round.winner === 'civiles'
  const winners = round.roles.filter((r) => r.impostor !== civilWin).map((r) => r.name)

  return (
    <section className="card center">
      <div className={`banner ${civilWin ? 'civil' : 'impostor'}`}>
        <span className="secret-emoji">{civilWin ? '🎉' : '😈'}</span>
        <strong>{civilWin ? '¡Ganan los civiles!' : '¡Ganan los impostores!'}</strong>
        <span>{round.reason}</span>
      </div>

      {round.inverted && (
        <p className="inverted-notice">🔄 ¡Era una ronda invertida! Había más impostores que civiles.</p>
      )}

      <p className="muted">{impostors.length > 1 ? 'Los impostores eran' : 'El impostor era'}</p>
      <h2 className="player-name impostor-name">🕵️ {listNames(impostors)}</h2>

      <p className="muted">La palabra secreta era</p>
      <div className="secret">
        <span className="secret-emoji">{theme.emoji}</span>
        <strong>{round.word}</strong>
        <span className="hint">{theme.name}</span>
      </div>

      <h2>Clasificación</h2>
      <Leaderboard leaderboard={leaderboard} highlight={winners} />

      <button className="btn primary big" onClick={onPlayAgain}>
        Otra ronda
      </button>
      <button className="btn ghost" onClick={onSetup}>
        Cambiar jugadores o temáticas
      </button>
    </section>
  )
}
