import { ICell, IDirection, ISnake } from "./types";

const directionValues: Record<IDirection, ICell> = {
  [IDirection.UP]: { x: 0, y: -1 },
  [IDirection.DOWN]: { x: 0, y: 1 },
  [IDirection.LEFT]: { x: -1, y: 0 },
  [IDirection.RIGHT]: { x: 1, y: 0 },
};

export const getNextApple = (
  snake: ISnake,
  cols: number,
  rows: number
): ICell => {
  let nextApple = randomCellInField(cols, rows);

  while (snake.some(({ x, y }) => nextApple.x === x && nextApple.y === y)) {
    nextApple = randomCellInField(cols, rows);
  }

  return nextApple;
};

export const randomCellInField = (cols: number, rows: number): ICell => {
  return {
    x: Math.round(Math.random() * cols) || 1,
    y: Math.round(Math.random() * rows) || 1,
  };
};

export const canChangeDirection = (prev: IDirection, next: IDirection) => {
  if (
    directionValues[prev].x + directionValues[next].x === 0 &&
    directionValues[prev].y + directionValues[next].y === 0
  ) {
    return false;
  }

  return true;
};

export const getNextHead = (snake: ISnake, direction: IDirection): ICell => {
  return {
    x: snake[0].x + directionValues[direction].x,
    y: snake[0].y + directionValues[direction].y,
  };
};

export const isEatApple = (head: ICell, apple: ICell): boolean => {
  return head.x === apple.x && head.y === apple.y;
};

export const isCrashToBorder = (
  head: ICell,
  cols: number,
  rows: number
): boolean => {
  return head.x < 1 || head.x > cols || head.y < 1 || head.y > rows;
};

export const isCrashToSnake = (head: ICell, snake: ISnake): boolean => {
  return snake.some(({ x, y }) => x === head.x && y === head.y);
};

export const calcNextSnake = (
  nextHead: ICell,
  snake: ISnake,
  isEatApple: boolean = false
): ISnake => {
  const nextSnake = [...snake];
  nextSnake.unshift(nextHead);
  if (!isEatApple) nextSnake.pop();
  return nextSnake;
};
