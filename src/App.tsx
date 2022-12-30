import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GameField from "./components/GameField";
import { calcNextSnake, canChangeDirection, getNextApple, getNextHead, isCrashToBorder, isCrashToSnake, isEatApple } from "./helpers";
import { ICell, IDirection, ISnake } from "./types";

const COLUMNS = 15
const ROWS = 15
const INIT_SPEED_MS = 500
const DECREMENT_SPEED_MS = 20

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
  const [score, setScore] = useState<number>(0)
  const [speed, setSpeed] = useState<number>(INIT_SPEED_MS)
  
  const timer = useRef(null)
  const apple = useRef<ICell>(getNextApple(snake, COLUMNS, ROWS))
  
  const snakeRef = useRef<ISnake>(snake)
  snakeRef.current = snake
  
  const direction = useRef(IDirection.UP)
  const nextDirection = useRef(IDirection.UP)

  const handleRestart = useCallback(() => {
    setSnake(snakeInit)
    setStatus(IStatus.PLAY)
    setScore(0)
    setSpeed(INIT_SPEED_MS)
    apple.current = getNextApple(snakeInit, COLUMNS, ROWS)
    direction.current = IDirection.UP
    nextDirection.current = IDirection.UP
  }, [])


  const keyActions: Record<React.KeyboardEvent['key'], () => void> = useMemo(() => ({
    'ArrowUp': () => nextDirection.current = IDirection.UP,
    'ArrowDown': () => nextDirection.current = IDirection.DOWN,
    'ArrowLeft': () => nextDirection.current = IDirection.LEFT,
    'ArrowRight': () => nextDirection.current = IDirection.RIGHT,
  }), [])

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (status === IStatus.END) {
        handleRestart()
      } else {
        const action = keyActions[e.key]
        action?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keyActions, status, handleRestart])

  useEffect(() => {
    if (status === IStatus.END) return

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
      if (isEat) {
        setSpeed(s => s - DECREMENT_SPEED_MS)
        setScore(s => s + 1)
        apple.current = getNextApple(nextSnake, COLUMNS, ROWS)
      }

      setSnake(nextSnake)
    }, speed)

    return () => clearInterval(timer.current)
  }, [speed, status])


  return (
    <div className="app-container">
      <GameField
        columns={COLUMNS}
        rows={ROWS}
        snake={snake}
        apple={apple.current}
      />

      {status === IStatus.END && (
        <div className="end-game">
          <h1>GAME OVER</h1>
          <h2>{`Score: ${score}`}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
