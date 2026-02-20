import { GamePhase } from '../types/game'
import type { GameState, BugColumnState, BulletColumnState } from '../types/game'
import { BUGS, BULLETS, PLAYER, SCORE_DIFFICULTY_MAP } from '../types/config'
import { ActionType } from './actions'
import type { GameAction } from './actions'

function createBugColumn(): BugColumnState {
  return {
    currentPosition: 0,
    hit: false,
    bugs: Array.from({ length: 5 }, () => ({ active: false, exploding: false })),
  }
}

function createBulletColumn(): BulletColumnState {
  return {
    currentPosition: 3,
    hit: false,
    bullets: Array.from({ length: 4 }, () => ({ active: false })),
  }
}

export function initialState(): GameState {
  return {
    phase: GamePhase.LOADING,
    score: 0,
    bugTickInterval: BUGS.defaultTimeout,
    player: {
      currentPosition: 0,
      dead: false,
      firing: false,
      fireTimestamp: 0,
    },
    bugColumns: Array.from({ length: 4 }, createBugColumn),
    bulletColumns: Array.from({ length: 4 }, createBulletColumn),
    bulletQueue: [],
    bugQueue: [],
    bugUpdateTime: 0,
    bugCleanTime: 0,
    bulletUpdateTime: 0,
    lastTickTime: 0,
  }
}

function getUniqueRandom(queue: number[], max: number): number {
  let r = Math.floor(Math.random() * max)
  while (queue.includes(r)) {
    r = Math.floor(Math.random() * max)
  }
  return r
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case ActionType.ASSETS_LOADED:
      return { ...state, phase: GamePhase.READY }

    case ActionType.START_GAME: {
      const fresh = initialState()
      fresh.phase = GamePhase.PLAYING
      fresh.lastTickTime = Date.now()
      fresh.bugUpdateTime = Date.now()
      fresh.bugCleanTime = Date.now()
      fresh.bulletUpdateTime = Date.now()
      return fresh
    }

    case ActionType.MOVE_LEFT: {
      if (state.phase !== GamePhase.PLAYING || state.player.dead) return state
      if (state.player.currentPosition <= 0) return state
      return {
        ...state,
        player: { ...state.player, currentPosition: state.player.currentPosition - 1 },
      }
    }

    case ActionType.MOVE_RIGHT: {
      if (state.phase !== GamePhase.PLAYING || state.player.dead) return state
      if (state.player.currentPosition >= 3) return state
      return {
        ...state,
        player: { ...state.player, currentPosition: state.player.currentPosition + 1 },
      }
    }

    case ActionType.FIRE: {
      if (state.phase !== GamePhase.PLAYING || state.player.dead) return state
      const col = state.player.currentPosition
      const bulletQueue = state.bulletQueue.includes(col)
        ? state.bulletQueue
        : [...state.bulletQueue, col]
      return {
        ...state,
        player: { ...state.player, firing: true, fireTimestamp: Date.now() },
        bulletQueue,
      }
    }

    case ActionType.TICK:
      return tickReducer(state, action.now)

    case ActionType.RESTART: {
      if (state.phase !== GamePhase.GAME_OVER) return state
      const fresh = initialState()
      fresh.phase = GamePhase.PLAYING
      fresh.lastTickTime = Date.now()
      fresh.bugUpdateTime = Date.now()
      fresh.bugCleanTime = Date.now()
      fresh.bulletUpdateTime = Date.now()
      return fresh
    }

    default:
      return state
  }
}

function tickReducer(state: GameState, now: number): GameState {
  if (state.phase !== GamePhase.PLAYING || state.player.dead) return state

  let s = { ...state, lastTickTime: now }

  // 1. Player fire timeout
  if (s.player.firing && now - s.player.fireTimestamp >= PLAYER.timeout) {
    s = { ...s, player: { ...s.player, firing: false } }
  }

  // 2. Bullet advance
  if (now - s.bulletUpdateTime >= BULLETS.timeout && s.bulletQueue.length > 0) {
    s = advanceBullets(s, now)
  }

  // 3. Bug cleanup
  if (now - s.bugCleanTime >= s.bugTickInterval) {
    s = cleanupBugs(s)
  }

  // 4. Bug spawn/move
  if (now - s.bugUpdateTime >= s.bugTickInterval) {
    s = advanceBugs(s, now)
  }

  return s
}

function advanceBullets(state: GameState, now: number): GameState {
  let bulletColumns = [...state.bulletColumns]
  let bugColumns = [...state.bugColumns]
  let score = state.score
  let bugTickInterval = state.bugTickInterval
  let bulletQueue = [...state.bulletQueue]
  let bugQueue = [...state.bugQueue]
  let playerDead = state.player.dead

  for (const colIdx of state.bulletQueue) {
    let bc = { ...bulletColumns[colIdx]!, bullets: [...bulletColumns[colIdx]!.bullets] }

    if (bc.hit) {
      // Reset: hide all bullets, back to bottom, remove from queue
      bc.currentPosition = 3
      bc.hit = false
      bc.bullets = bc.bullets.map(() => ({ active: false }))
      bulletColumns[colIdx] = bc
      bulletQueue = bulletQueue.filter(q => q !== colIdx)
      continue
    }

    const currentBullet = bc.currentPosition
    const previousBullet = currentBullet + 1
    const nextBullet = currentBullet - 1

    // Activate current bullet
    bc.bullets[currentBullet] = { active: true }

    // Disable previous bullet
    if (previousBullet < 4) {
      bc.bullets[previousBullet] = { active: false }
    }

    // Collision detection with bug column at same index
    let bugCol = { ...bugColumns[colIdx]!, bugs: [...bugColumns[colIdx]!.bugs] }
    const currentBug = bugCol.bugs[currentBullet]
    const nextBug = bugCol.bugs[currentBullet + 1]

    if ((currentBug && currentBug.active) || (nextBug && nextBug.active)) {
      bc.hit = true
      score++

      // Check difficulty
      if (SCORE_DIFFICULTY_MAP[score] !== undefined) {
        bugTickInterval = SCORE_DIFFICULTY_MAP[score]!
      }

      if (currentBug && currentBug.active) {
        bugCol.bugs[currentBullet] = { active: false, exploding: true }
        bugCol.hit = true
        bugQueue = bugQueue.filter(q => q !== colIdx)
        bugCol.currentPosition = 0
        // disable all other bugs in the column
        bugCol.bugs = bugCol.bugs.map((_, i) =>
          i === currentBullet ? { active: false, exploding: true } : { active: false, exploding: false }
        )
      } else if (nextBug && nextBug.active) {
        // Disable current bullet, activate previous
        bc.bullets[currentBullet] = { active: false }
        if (previousBullet < 4) {
          bc.bullets[previousBullet] = { active: true }
        }
        bugCol.bugs[currentBullet + 1] = { active: false, exploding: true }
        bugCol.hit = true
        bugQueue = bugQueue.filter(q => q !== colIdx)
        bugCol.currentPosition = 0
        bugCol.bugs = bugCol.bugs.map((_, i) =>
          i === currentBullet + 1 ? { active: false, exploding: true } : { active: false, exploding: false }
        )
      }

      bugColumns[colIdx] = bugCol
      bulletColumns[colIdx] = bc
      continue
    }

    bugColumns[colIdx] = bugCol

    // Move bullet up
    if (nextBullet >= 0) {
      bc.currentPosition = nextBullet
    } else {
      bc.hit = true
    }

    bulletColumns[colIdx] = bc
  }

  return {
    ...state,
    bulletColumns,
    bugColumns,
    score,
    bugTickInterval,
    bulletQueue,
    bugQueue,
    bulletUpdateTime: now,
    player: { ...state.player, dead: playerDead },
  }
}

function cleanupBugs(state: GameState): GameState {
  const bugColumns = state.bugColumns.map(col => {
    if (!col.hit) return col
    return {
      ...col,
      hit: false,
      currentPosition: 0,
      bugs: col.bugs.map(() => ({ active: false, exploding: false })),
    }
  })
  return { ...state, bugColumns, bugCleanTime: state.lastTickTime }
}

function advanceBugs(state: GameState, now: number): GameState {
  const bugQueue = [...state.bugQueue]
  let bugColumns = [...state.bugColumns]
  let playerDead = state.player.dead
  let phase = state.phase

  const isSpawnFull = bugQueue.length > BUGS.queueLimit

  if (isSpawnFull && bugQueue.length > 0) {
    // Move: shift front, advance bug, push back
    const current = bugQueue.shift()!
    let col = { ...bugColumns[current]!, bugs: [...bugColumns[current]!.bugs] }

    if (col.hit) {
      // reset
      col = {
        ...col,
        hit: false,
        currentPosition: 0,
        bugs: col.bugs.map(() => ({ active: false, exploding: false })),
      }
      bugColumns[current] = col
      bugQueue.push(current)
      return { ...state, bugColumns, bugQueue, bugUpdateTime: now }
    }

    const currentPos = col.currentPosition
    const previousPos = currentPos - 1
    const nextPos = currentPos + 1

    // Activate current bug
    col.bugs[currentPos] = { active: true, exploding: false }

    // Disable previous
    if (previousPos >= 0) {
      col.bugs[previousPos] = { active: false, exploding: false }
    }

    // Check if there's a next position
    if (nextPos < 5) {
      col.currentPosition = nextPos
    } else {
      // Bug reached bottom — player dies
      playerDead = true
      phase = GamePhase.GAME_OVER
    }

    bugColumns[current] = col
    bugQueue.push(current)

    return {
      ...state,
      bugColumns,
      bugQueue,
      bugUpdateTime: now,
      player: { ...state.player, dead: playerDead },
      phase,
    }
  }

  // Spawn: add new random column if not all columns are in queue
  if (bugQueue.length < 4) {
    const newCol = getUniqueRandom(bugQueue, 4)
    bugQueue.push(newCol)
  }

  return { ...state, bugQueue, bugUpdateTime: now }
}
