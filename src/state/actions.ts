export enum ActionType {
  ASSETS_LOADED = 'ASSETS_LOADED',
  START_GAME = 'START_GAME',
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  FIRE = 'FIRE',
  TICK = 'TICK',
  RESTART = 'RESTART',
}

export type GameAction =
  | { type: ActionType.ASSETS_LOADED }
  | { type: ActionType.START_GAME }
  | { type: ActionType.MOVE_LEFT }
  | { type: ActionType.MOVE_RIGHT }
  | { type: ActionType.FIRE }
  | { type: ActionType.TICK; now: number }
  | { type: ActionType.RESTART }
