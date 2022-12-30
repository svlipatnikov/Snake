import React from 'react'
import { ICell } from '../types'

const FIELD_WIDTH = 500
const FIELD_HEIGHT = 500
const APPLE_COLOR = 'red'
const SNAKE_HEAD_COLOR = '#ccdd00'
const SNAKE_BODY_COLOR = '#dfef00'
const EMPTY_COLOR = '#fff'

interface IGameField {
  columns: number
  rows: number
  snake: Array<ICell>
  apple: ICell
}

const GameField = ({ columns, rows, snake, apple }: IGameField) => {
  const cellWidth = Math.floor(FIELD_WIDTH / (columns + 1))
  const cellHeight = Math.floor(FIELD_HEIGHT / (rows + 1))

  const [snakeHead, ...snakeBody] = snake

  return (
    <div className='game-field'>
      {Array(rows).fill('').map((_, r) => (
        <div className='row' key={r}>
          {Array(columns).fill('').map((_, c) => {
            const isApple = r + 1 === apple.y && c + 1 === apple.x
            const isSnakeHead = r + 1 === snakeHead.y && c + 1 === snakeHead.x
            const isSnakeBody = snakeBody.some(({ x, y }) => x === c + 1 && y === r + 1)
            const cellColor = isApple ? APPLE_COLOR : isSnakeHead ? SNAKE_HEAD_COLOR : isSnakeBody ? SNAKE_BODY_COLOR : EMPTY_COLOR

            return (
              <div
                key={c}
                className='cell'
                style={{
                  width: cellWidth,
                  height: cellHeight,
                  backgroundColor: cellColor,
                }}
              />)
          })}
        </div>
      ))}
    </div>
  )
}

export default GameField
