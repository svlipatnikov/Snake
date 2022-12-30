import React, { useEffect, useMemo, useRef, useState } from "react";
import GameField from "./components/GameField";
import { calcNextSnake, canChangeDirection, getNextApple, getNextHead, isCrashToBorder, isCrashToSnake, isEatApple } from "./helpers";
import { ICell, IDirection, ISnake } from "./types";

const COLUMNS = 15
const ROWS = 15
const SPEED_MS = 500

const snakeInit: ISnake = [
  { x: Math.ceil(COLUMNS / 2), y: ROWS - 2 },
  { x: Math.ceil(COLUMNS / 2), y: ROWS - 1 },
  { x: Math.ceil(COLUMNS / 2), y: ROWS },
]

enum IStatus {
  PLAY,
  END
}

function App() {
  const [status, setStatus] = useState<IStatus>(IStatus.PLAY)
  const [snake, setSnake] = useState<ISnake>(snakeInit)
  
  const timer = useRef(null)
  const apple = useRef<ICell>(getNextApple(snake, COLUMNS, ROWS))
  
  const snakeRef = useRef<ISnake>(snake)
  snakeRef.current = snake
  
  const direction = useRef(IDirection.UP)
  const nextDirection = useRef(IDirection.UP)

  const keyActions: Record<React.KeyboardEvent['key'], () => void> = useMemo(() => ({
    'ArrowUp': () => nextDirection.current = IDirection.UP,
    'ArrowDown': () => nextDirection.current = IDirection.DOWN,
    'ArrowLeft': () => nextDirection.current = IDirection.LEFT,
    'ArrowRight': () => nextDirection.current = IDirection.RIGHT,
  }), [])

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      const handle = keyActions[e.key]
      handle?.()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keyActions])

  useEffect(() => {
    timer.current = setInterval(() => {
      // calc direction
      if (canChangeDirection(direction.current, nextDirection.current)) {
        direction.current = nextDirection.current
      }

      // calc next head
      const nextHead = getNextHead(snakeRef.current, direction.current)

      // check eat Apple
      const isEat = isEatApple(nextHead, apple.current)

      // calc next snake
      const nextSnake = calcNextSnake(nextHead, snakeRef.current, isEat)
      const [_, ...nextSnakeWithoutHead] = nextSnake

      // check CRASH statuses
      const endGame = isCrashToBorder(nextHead, COLUMNS, ROWS) || isCrashToSnake(nextHead, nextSnakeWithoutHead)
      if (endGame) {
        setStatus(IStatus.END)
        return
      }

      // gen new Apple
      if (isEat) apple.current = getNextApple(nextSnake, COLUMNS, ROWS)

      setSnake(nextSnake)
    }, SPEED_MS)

    return () => clearInterval(timer.current)
  }, [])

  const handleRestart = () => {
    setSnake(snakeInit)
    setStatus(IStatus.PLAY)
    apple.current = getNextApple(snakeInit, COLUMNS, ROWS)
    direction.current = IDirection.UP
    nextDirection.current = IDirection.UP
  }

  return (
    <div className="app-container">
      <GameField
        columns={COLUMNS}
        rows={ROWS}
        snake={snake}
        apple={apple.current}
      />

      {status === IStatus.END && (
        <div className="end-game" onClick={handleRestart}>
          <h1>GAME OVER</h1>
        </div>
      )}
    </div>
  );
}

export default App;
