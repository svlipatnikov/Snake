
export enum IDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export interface ICell {
  x: number
  y: number
}

export type ISnake = Array<ICell>

export enum IStatus {
  PLAY,
  END
}