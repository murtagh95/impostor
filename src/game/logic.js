import { getTheme } from '../data/themes.js'

export const MIN_PLAYERS = 3

export const maxImpostors = (playerCount) => Math.max(1, Math.floor((playerCount - 1) / 2))

const pick = (list, rng) => list[Math.floor(rng() * list.length)]

export function shuffle(list, rng = Math.random) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function validateSetup({ players, themeIds, impostorCount }) {
  const names = players.map((p) => p.trim())
  if (names.length < MIN_PLAYERS) return `Se necesitan al menos ${MIN_PLAYERS} jugadores.`
  if (names.some((n) => !n)) return 'Todos los jugadores necesitan un nombre.'
  const lower = names.map((n) => n.toLowerCase())
  if (new Set(lower).size !== lower.length) return 'Hay nombres repetidos.'
  if (themeIds.length === 0) return 'Elegí al menos una temática.'
  if (impostorCount < 1 || impostorCount > maxImpostors(names.length)) {
    return `Con ${names.length} jugadores puede haber entre 1 y ${maxImpostors(names.length)} impostores.`
  }
  return null
}

/**
 * Arma una ronda: elige temática y palabra, sortea impostores y quién arranca.
 * `usedWords` evita repetir palabras entre rondas mientras queden disponibles.
 */
export function createRound({ players, themeIds, impostorCount, usedWords = [] }, rng = Math.random) {
  const theme = getTheme(pick(themeIds, rng))
  const fresh = theme.words.filter((w) => !usedWords.includes(w))
  const word = pick(fresh.length > 0 ? fresh : theme.words, rng)

  const impostors = new Set(shuffle(players.map((_, i) => i), rng).slice(0, impostorCount))
  const roles = players.map((name, i) => ({ name: name.trim(), impostor: impostors.has(i) }))

  return {
    themeId: theme.id,
    word,
    roles,
    starter: pick(roles, rng).name,
    eliminated: [],
    winner: null,
    reason: null,
  }
}

export const WIN_POINTS = { civiles: 1, impostores: 2 }

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ]/g, '')

export const isCorrectGuess = (guess, word) => normalize(guess) !== '' && normalize(guess) === normalize(word)

export const isImpostor = (round, name) => round.roles.some((r) => r.name === name && r.impostor)

export const alivePlayers = (round) => round.roles.filter((r) => !round.eliminated.includes(r.name))

/** Civiles ganan al descubrir a todos los impostores; impostores ganan cuando queda un solo civil. */
export function checkWinner(round) {
  const alive = alivePlayers(round)
  if (alive.every((r) => !r.impostor)) {
    return { ...round, winner: 'civiles', reason: 'Descubrieron a todos los impostores.' }
  }
  if (alive.filter((r) => !r.impostor).length <= 1) {
    return { ...round, winner: 'impostores', reason: 'Solo queda un civil en pie.' }
  }
  return round
}

export const eliminate = (round, name) => checkWinner({ ...round, eliminated: [...round.eliminated, name] })

/**
 * Un impostor arriesga la palabra. Si acierta, ganan los impostores;
 * si falla queda eliminado (si no lo estaba) y la partida sigue.
 */
export function guessWord(round, name, guess) {
  if (isCorrectGuess(guess, round.word)) {
    return { ...round, winner: 'impostores', reason: `${name} adivinó la palabra.` }
  }
  if (round.eliminated.includes(name)) return checkWinner(round)
  const next = eliminate(round, name)
  return next.winner === 'civiles' ? { ...next, reason: `${name} falló al arriesgar la palabra.` } : next
}

/** Suma el resultado de una ronda terminada a la tabla de clasificación. */
export function applyResult(leaderboard, round) {
  const next = { ...leaderboard }
  round.roles.forEach(({ name, impostor }) => {
    const key = name.toLowerCase()
    const team = impostor ? 'impostores' : 'civiles'
    const won = round.winner === team
    const prev = next[key] ?? { name, points: 0, wins: 0, games: 0, impostorWins: 0 }
    next[key] = {
      name,
      points: prev.points + (won ? WIN_POINTS[team] : 0),
      wins: prev.wins + (won ? 1 : 0),
      games: prev.games + 1,
      impostorWins: prev.impostorWins + (won && impostor ? 1 : 0),
    }
  })
  return next
}

export const rankLeaderboard = (leaderboard) =>
  Object.values(leaderboard).sort(
    (a, b) => b.points - a.points || b.wins - a.wins || a.games - b.games || a.name.localeCompare(b.name),
  )
