export enum GamePhase {
  LOADING = 'LOADING',
  READY = 'READY',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface BugState {
  active: boolean
  exploding: boolean
}

export interface BugColumnState {
  currentPosition: number
  hit: boolean
  bugs: BugState[]
}

export interface BulletState {
  active: boolean
}

export interface BulletColumnState {
  currentPosition: number
  hit: boolean
  bullets: BulletState[]
}

export interface PlayerState {
  currentPosition: number
  dead: boolean
  firing: boolean
  fireTimestamp: number
}

export interface GameState {
  phase: GamePhase
  score: number
  bugTickInterval: number
  player: PlayerState
  bugColumns: BugColumnState[]
  bulletColumns: BulletColumnState[]
  bulletQueue: number[]
  bugQueue: number[]
  bugUpdateTime: number
  bugCleanTime: number
  bulletUpdateTime: number
  lastTickTime: number
}
