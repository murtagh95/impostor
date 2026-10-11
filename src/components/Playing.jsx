import { useEffect, useState } from 'react'
import { alivePlayers, eliminate, guessWord, isImpostor } from '../game/logic.js'

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function GuessForm({ name, onSubmit, onSkip, skipLabel }) {
  const [guess, setGuess] = useState('')
  return (
    <form
      className="confirm"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(guess)
      }}
    >
      <p>{name}, escribí la palabra secreta (sin que nadie la diga en voz alta):</p>
      <input className="text-input" autoFocus value={guess} onChange={(e) => setGuess(e.target.value)} />
      <button className="btn primary" disabled={!guess.trim()}>
        Arriesgar
      </button>
      <button type="button" className="btn ghost" onClick={onSkip}>
        {skipLabel}
      </button>
    </form>
  )
}

export default function Playing({ round: initialRound, onFinish }) {
  const [round, setRound] = useState(initialRound)
  const [seconds, setSeconds] = useState(0)
  // main | vote | revealed | guessWho | guess | guessFailed
  const [mode, setMode] = useState('main')
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const alive = alivePlayers(round)
  const reset = () => {
    setMode('main')
    setSelected(null)
    setNotice(null)
  }
  const continueOrFinish = (next) => (next.winner ? onFinish(next) : reset())

  const confirmVote = () => {
    setRound(eliminate(round, selected))
    setMode('revealed')
  }

  const submitLastChance = (guess) => onFinish(guessWord(round, selected, guess))

  const submitGuess = (guess) => {
    const next = guessWord(round, selected, guess)
    if (next.winner) return onFinish(next)
    setRound(next)
    setMode('guessFailed')
  }

  const pickGuesser = (name) => {
    if (!isImpostor(round, name)) {
      setNotice(`${name} no es impostor, no puede arriesgar la palabra.`)
      return
    }
    setSelected(name)
    setMode('guess')
  }

  return (
    <section className="card center">
      <p className="muted">Empieza</p>
      <h2 className="player-name">{round.starter}</h2>
      <p className="timer">{formatTime(seconds)}</p>

      {mode === 'main' && (
        <>
          <ol className="rules">
            <li>Por turnos, cada uno dice una palabra relacionada con la secreta.</li>
            <li>Debatan y voten a quién eliminar.</li>
            <li>Civiles: ganan si eliminan a todos los impostores.</li>
            <li>Impostores: ganan si queda un solo civil o si adivinan la palabra.</li>
          </ol>
          <p className="muted">
            En juego: {alive.map((r) => r.name).join(', ')}
            {round.eliminated.length > 0 && ` · Eliminados: ${round.eliminated.join(', ')}`}
          </p>
          <button className="btn danger big" onClick={() => setMode('vote')}>
            🗳️ Votar a un jugador
          </button>
          <button className="btn ghost" onClick={() => setMode('guessWho')}>
            🕵️ Un impostor quiere arriesgar la palabra
          </button>
        </>
      )}

      {mode === 'vote' && (
        <div className="confirm">
          <p>¿A quién votaron para eliminar?</p>
          <div className="vote-list">
            {alive.map((r) => (
              <button
                key={r.name}
                className={`vote ${selected === r.name ? 'selected' : ''}`}
                aria-pressed={selected === r.name}
                onClick={() => setSelected(r.name)}
              >
                {r.name}
              </button>
            ))}
          </div>
          <button className="btn danger" disabled={!selected} onClick={confirmVote}>
            Eliminar{selected ? ` a ${selected}` : ''}
          </button>
          <button className="btn ghost" onClick={reset}>
            Cancelar
          </button>
        </div>
      )}

      {mode === 'revealed' &&
        (isImpostor(round, selected) ? (
          <>
            <div className="secret impostor">
              <span className="secret-emoji">🕵️</span>
              <strong>¡{selected} era impostor!</strong>
              <span className="hint">Última chance: si adivina la palabra, ganan los impostores.</span>
            </div>
            <GuessForm
              name={selected}
              onSubmit={submitLastChance}
              onSkip={() => continueOrFinish(round)}
              skipLabel="No sabe, seguir"
            />
          </>
        ) : (
          <>
            <div className="secret">
              <span className="secret-emoji">😇</span>
              <strong>{selected} era civil</strong>
            </div>
            <button className="btn primary big" onClick={() => continueOrFinish(round)}>
              {round.winner ? 'Ver resultado' : 'Seguir jugando'}
            </button>
          </>
        ))}

      {mode === 'guessWho' && (
        <div className="confirm">
          <p>¿Quién arriesga? Si falla, queda eliminado.</p>
          <div className="vote-list">
            {alive.map((r) => (
              <button key={r.name} className="vote" onClick={() => pickGuesser(r.name)}>
                {r.name}
              </button>
            ))}
          </div>
          {notice && <p className="error">{notice}</p>}
          <button className="btn ghost" onClick={reset}>
            Cancelar
          </button>
        </div>
      )}

      {mode === 'guess' && (
        <GuessForm name={selected} onSubmit={submitGuess} onSkip={reset} skipLabel="Cancelar" />
      )}

      {mode === 'guessFailed' && (
        <>
          <div className="secret impostor">
            <span className="secret-emoji">❌</span>
            <strong>¡Incorrecto!</strong>
            <span className="hint">{selected} era impostor y queda eliminado.</span>
          </div>
          <button className="btn primary big" onClick={reset}>
            Seguir jugando
          </button>
        </>
      )}
    </section>
  )
}
