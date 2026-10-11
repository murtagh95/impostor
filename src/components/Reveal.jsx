import { useState } from 'react'
import { getTheme } from '../data/themes.js'

export default function Reveal({ round, showHint, onDone }) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const player = round.roles[index]
  const theme = getTheme(round.themeId)
  const isLast = index === round.roles.length - 1

  const next = () => {
    setVisible(false)
    if (isLast) onDone()
    else setIndex(index + 1)
  }

  return (
    <section className="card center">
      <p className="progress">
        Jugador {index + 1} de {round.roles.length}
      </p>

      {!visible ? (
        <>
          <p className="muted">Pasale el celular a</p>
          <h2 className="player-name">{player.name}</h2>
          <p className="muted">Que nadie más mire 👀</p>
          <button className="btn primary big" onClick={() => setVisible(true)}>
            Ver mi palabra
          </button>
        </>
      ) : (
        <>
          <p className="muted">{player.name}, tu palabra es:</p>
          {player.impostor ? (
            <div className="secret impostor">
              <span className="secret-emoji">🕵️</span>
              <strong>¡Sos el impostor!</strong>
              {showHint && (
                <span className="hint">
                  Pista: la temática es {theme.emoji} {theme.name}
                </span>
              )}
            </div>
          ) : (
            <div className="secret">
              <span className="secret-emoji">{theme.emoji}</span>
              <strong>{round.word}</strong>
            </div>
          )}
          <button className="btn primary big" onClick={next}>
            {isLast ? 'Listo, ¡a jugar!' : 'Listo, ocultar y pasar'}
          </button>
        </>
      )}
    </section>
  )
}
