import { describe, expect, it } from 'vitest'
import { THEMES } from '../data/themes.js'
import {
  applyResult,
  createRound,
  eliminate,
  guessWord,
  isCorrectGuess,
  maxImpostors,
  rankLeaderboard,
  shuffle,
  validateSetup,
} from './logic.js'

const seeded = (seed = 42) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

describe('maxImpostors', () => {
  it('deja siempre mayoría de jugadores normales', () => {
    expect(maxImpostors(3)).toBe(1)
    expect(maxImpostors(5)).toBe(2)
    expect(maxImpostors(8)).toBe(3)
  })
})

describe('validateSetup', () => {
  const base = { players: ['Ana', 'Beto', 'Caro'], themeIds: ['verano'], impostorCount: 1 }

  it('acepta una configuración válida', () => {
    expect(validateSetup(base)).toBeNull()
  })

  it('rechaza menos de 3 jugadores', () => {
    expect(validateSetup({ ...base, players: ['Ana', 'Beto'] })).toMatch(/al menos 3/)
  })

  it('rechaza nombres vacíos o repetidos', () => {
    expect(validateSetup({ ...base, players: ['Ana', ' ', 'Caro'] })).toMatch(/nombre/)
    expect(validateSetup({ ...base, players: ['Ana', 'ana ', 'Caro'] })).toMatch(/repetidos/)
  })

  it('rechaza sin temáticas o con demasiados impostores', () => {
    expect(validateSetup({ ...base, themeIds: [] })).toMatch(/temática/)
    expect(validateSetup({ ...base, impostorCount: 2 })).toMatch(/impostores/)
  })
})

describe('shuffle', () => {
  it('conserva los elementos sin mutar el original', () => {
    const list = [1, 2, 3, 4, 5]
    const result = shuffle(list, seeded())
    expect(result.sort()).toEqual([1, 2, 3, 4, 5])
    expect(list).toEqual([1, 2, 3, 4, 5])
  })
})

describe('createRound', () => {
  const players = ['Ana', 'Beto', 'Caro', 'Dani', 'Eli']

  it('asigna la cantidad pedida de impostores', () => {
    const round = createRound({ players, themeIds: ['halloween'], impostorCount: 2 }, seeded(7))
    expect(round.roles.filter((r) => r.impostor)).toHaveLength(2)
    expect(round.roles.map((r) => r.name)).toEqual(players)
  })

  it('elige una palabra de una temática seleccionada', () => {
    const round = createRound({ players, themeIds: ['escuela', 'moda'], impostorCount: 1 }, seeded(3))
    expect(['escuela', 'moda']).toContain(round.themeId)
    expect(THEMES.find((t) => t.id === round.themeId).words).toContain(round.word)
    expect(players).toContain(round.starter)
  })

  it('evita palabras ya usadas mientras queden otras', () => {
    const words = THEMES.find((t) => t.id === 'verano').words
    const usedWords = words.slice(1)
    const round = createRound({ players, themeIds: ['verano'], impostorCount: 1, usedWords }, seeded())
    expect(round.word).toBe(words[0])
  })

  it('invierte en secreto las cantidades cuando sale la ronda invertida', () => {
    const players7 = [...players, 'Fede', 'Gabi']
    const always = () => 0
    const round = createRound({ players: players7, themeIds: ['cosas'], impostorCount: 2, invertRoles: true }, always)
    expect(round.inverted).toBe(true)
    expect(round.roles.filter((r) => r.impostor)).toHaveLength(5)
    expect(round.roles.filter((r) => !r.impostor)).toHaveLength(2)
  })

  it('no invierte si la opción está apagada, si no sale el sorteo o con 1 impostor', () => {
    const config = { players, themeIds: ['cosas'], impostorCount: 2 }
    const off = createRound(config, () => 0)
    expect(off.inverted).toBe(false)
    expect(off.roles.filter((r) => r.impostor)).toHaveLength(2)

    const unlucky = createRound({ ...config, invertRoles: true }, () => 0.99)
    expect(unlucky.inverted).toBe(false)

    const single = createRound({ ...config, impostorCount: 1, invertRoles: true }, () => 0)
    expect(single.inverted).toBe(false)
    expect(single.roles.filter((r) => r.impostor)).toHaveLength(1)
  })

  it('reutiliza palabras cuando se agotaron todas', () => {
    const words = THEMES.find((t) => t.id === 'verano').words
    const round = createRound({ players, themeIds: ['verano'], impostorCount: 1, usedWords: words }, seeded())
    expect(words).toContain(round.word)
  })
})

describe('THEMES', () => {
  it('incluye las 7 temáticas con palabras', () => {
    expect(THEMES.map((t) => t.id)).toEqual([
      'alimentos', 'halloween', 'cosas', 'escuela', 'moda', 'trabajo', 'verano',
    ])
    THEMES.forEach((t) => expect(t.words.length).toBeGreaterThanOrEqual(20))
  })
})

const makeRound = (impostors, players = ['Ana', 'Beto', 'Caro', 'Dani', 'Eli']) => ({
  themeId: 'alimentos',
  word: 'Dulce de leche',
  roles: players.map((name) => ({ name, impostor: impostors.includes(name) })),
  starter: players[0],
  eliminated: [],
  winner: null,
  reason: null,
})

describe('eliminate', () => {
  it('sigue la partida si se elimina a un civil y quedan varios', () => {
    const round = eliminate(makeRound(['Ana']), 'Beto')
    expect(round.eliminated).toEqual(['Beto'])
    expect(round.winner).toBeNull()
  })

  it('ganan los civiles al descubrir a todos los impostores', () => {
    let round = eliminate(makeRound(['Ana', 'Caro']), 'Ana')
    expect(round.winner).toBeNull()
    round = eliminate(round, 'Caro')
    expect(round.winner).toBe('civiles')
  })

  it('ganan los impostores cuando queda un solo civil', () => {
    const round = eliminate(makeRound(['Ana'], ['Ana', 'Beto', 'Caro']), 'Beto')
    expect(round.winner).toBe('impostores')
  })
})

describe('isCorrectGuess', () => {
  it('ignora mayúsculas, tildes y espacios', () => {
    expect(isCorrectGuess('dulce de LECHE ', 'Dulce de leche')).toBe(true)
    expect(isCorrectGuess('murcielago', 'Murciélago')).toBe(true)
    expect(isCorrectGuess('ñoquis', 'Ñoquis')).toBe(true)
    expect(isCorrectGuess('noquis', 'Ñoquis')).toBe(true)
    expect(isCorrectGuess('pizza', 'Dulce de leche')).toBe(false)
    expect(isCorrectGuess('', 'Dulce de leche')).toBe(false)
  })
})

describe('guessWord', () => {
  it('ganan los impostores si aciertan la palabra', () => {
    const round = guessWord(makeRound(['Ana']), 'Ana', 'dulce de leche')
    expect(round.winner).toBe('impostores')
    expect(round.reason).toMatch(/Ana/)
  })

  it('el impostor que falla queda eliminado', () => {
    const round = guessWord(makeRound(['Ana', 'Caro']), 'Ana', 'alfajor')
    expect(round.eliminated).toEqual(['Ana'])
    expect(round.winner).toBeNull()
  })

  it('si el último impostor falla al arriesgar, ganan los civiles', () => {
    const round = guessWord(makeRound(['Ana']), 'Ana', 'alfajor')
    expect(round.winner).toBe('civiles')
    expect(round.reason).toMatch(/Ana falló/)
  })

  it('un impostor atrapado puede revertir la derrota adivinando', () => {
    const caught = eliminate(makeRound(['Ana']), 'Ana')
    expect(caught.winner).toBe('civiles')
    expect(guessWord(caught, 'Ana', 'pizza').winner).toBe('civiles')
    expect(guessWord(caught, 'Ana', 'Dulce de leche').winner).toBe('impostores')
  })
})

describe('applyResult / rankLeaderboard', () => {
  it('suma puntos al equipo ganador y partidas a todos', () => {
    const civilWin = { ...makeRound(['Ana']), winner: 'civiles' }
    const impostorWin = { ...makeRound(['Beto']), winner: 'impostores' }
    const board = applyResult(applyResult({}, civilWin), impostorWin)

    expect(board.ana).toMatchObject({ points: 0, wins: 0, games: 2 })
    expect(board.beto).toMatchObject({ points: 3, wins: 2, games: 2, impostorWins: 1 })
    expect(board.caro).toMatchObject({ points: 1, wins: 1, games: 2, impostorWins: 0 })
  })

  it('ordena por puntos y luego por victorias', () => {
    const board = {
      a: { name: 'A', points: 2, wins: 2, games: 3 },
      b: { name: 'B', points: 3, wins: 1, games: 3 },
      c: { name: 'C', points: 2, wins: 1, games: 3 },
    }
    expect(rankLeaderboard(board).map((p) => p.name)).toEqual(['B', 'A', 'C'])
  })
})
