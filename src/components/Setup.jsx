import { THEMES } from '../data/themes.js'
import { maxImpostors, validateSetup } from '../game/logic.js'

export default function Setup({ config, onChange, onStart, onLeaderboard }) {
  const { players, themeIds, impostorCount, impostorHint } = config
  const maxImp = maxImpostors(players.length)
  const error = validateSetup(config)

  const update = (patch) => {
    const next = { ...config, ...patch }
    next.impostorCount = Math.min(next.impostorCount, maxImpostors(next.players.length))
    onChange(next)
  }

  const setPlayer = (i, name) => update({ players: players.map((p, j) => (j === i ? name : p)) })
  const addPlayer = () => update({ players: [...players, ''] })
  const removePlayer = (i) => update({ players: players.filter((_, j) => j !== i) })

  const toggleTheme = (id) =>
    update({
      themeIds: themeIds.includes(id) ? themeIds.filter((t) => t !== id) : [...themeIds, id],
    })

  return (
    <section className="card">
      <h2>Jugadores</h2>
      <ul className="players">
        {players.map((name, i) => (
          <li key={i}>
            <input
              value={name}
              placeholder={`Jugador ${i + 1}`}
              maxLength={20}
              onChange={(e) => setPlayer(i, e.target.value)}
            />
            <button
              className="icon-btn"
              aria-label={`Quitar jugador ${i + 1}`}
              disabled={players.length <= 3}
              onClick={() => removePlayer(i)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button className="btn ghost" onClick={addPlayer} disabled={players.length >= 20}>
        + Agregar jugador
      </button>

      <h2>Temáticas</h2>
      <div className="themes">
        {THEMES.map((t) => (
          <button
            key={t.id}
            className={`theme ${themeIds.includes(t.id) ? 'selected' : ''}`}
            aria-pressed={themeIds.includes(t.id)}
            onClick={() => toggleTheme(t.id)}
          >
            <span className="theme-emoji">{t.emoji}</span>
            {t.name}
          </button>
        ))}
      </div>
      <div className="row-actions">
        <button className="link" onClick={() => update({ themeIds: THEMES.map((t) => t.id) })}>
          Todas
        </button>
        <button className="link" onClick={() => update({ themeIds: [] })}>
          Ninguna
        </button>
      </div>

      <h2>Opciones</h2>
      <div className="option">
        <span>Impostores</span>
        <div className="stepper">
          <button
            className="icon-btn"
            aria-label="Menos impostores"
            disabled={impostorCount <= 1}
            onClick={() => update({ impostorCount: impostorCount - 1 })}
          >
            −
          </button>
          <strong>{impostorCount}</strong>
          <button
            className="icon-btn"
            aria-label="Más impostores"
            disabled={impostorCount >= maxImp}
            onClick={() => update({ impostorCount: impostorCount + 1 })}
          >
            +
          </button>
        </div>
      </div>
      <label className="option">
        <span>El impostor ve la temática como pista</span>
        <input
          type="checkbox"
          checked={impostorHint}
          onChange={(e) => update({ impostorHint: e.target.checked })}
        />
      </label>

      {error && <p className="error">{error}</p>}
      <button className="btn primary" disabled={!!error} onClick={onStart}>
        Empezar partida
      </button>
      <button className="btn ghost" onClick={onLeaderboard}>
        🏆 Ver clasificación
      </button>
    </section>
  )
}
