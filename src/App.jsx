import { useEffect, useState } from 'react'
import Setup from './components/Setup.jsx'
import Reveal from './components/Reveal.jsx'
import Playing from './components/Playing.jsx'
import Result from './components/Result.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import { applyResult, createRound } from './game/logic.js'

const STORAGE_KEY = 'impostor-config'
const LEADERBOARD_KEY = 'impostor-leaderboard'

const DEFAULT_CONFIG = {
  players: ['', '', ''],
  themeIds: ['alimentos'],
  impostorCount: 1,
  impostorHint: true,
}

function load(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return saved ? { ...fallback, ...saved } : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [config, setConfig] = useState(() => load(STORAGE_KEY, DEFAULT_CONFIG))
  const [leaderboard, setLeaderboard] = useState(() => load(LEADERBOARD_KEY, {}))
  const [screen, setScreen] = useState('setup')
  const [round, setRound] = useState(null)
  const [usedWords, setUsedWords] = useState([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard))
  }, [leaderboard])

  const startRound = () => {
    const next = createRound({ ...config, usedWords })
    setUsedWords((used) => [...used, next.word])
    setRound(next)
    setScreen('reveal')
  }

  const finishRound = (finished) => {
    setRound(finished)
    setLeaderboard((board) => applyResult(board, finished))
    setScreen('result')
  }

  return (
    <main className="app">
      <header className="brand">
        <span className="brand-icon">🕵️</span>
        <h1>El Impostor</h1>
      </header>

      {screen === 'setup' && (
        <Setup
          config={config}
          onChange={setConfig}
          onStart={startRound}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'leaderboard' && (
        <section className="card center">
          <h2>Clasificación</h2>
          <Leaderboard leaderboard={leaderboard} onReset={() => setLeaderboard({})} />
          <button className="btn primary" onClick={() => setScreen('setup')}>
            Volver
          </button>
        </section>
      )}
      {screen === 'reveal' && (
        <Reveal round={round} showHint={config.impostorHint} onDone={() => setScreen('play')} />
      )}
      {screen === 'play' && <Playing round={round} onFinish={finishRound} />}
      {screen === 'result' && (
        <Result round={round} leaderboard={leaderboard} onPlayAgain={startRound} onSetup={() => setScreen('setup')} />
      )}
    </main>
  )
}
