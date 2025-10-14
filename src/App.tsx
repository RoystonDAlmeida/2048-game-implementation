import { useState, useEffect } from 'react'
import BoardView from './components/Board'
import { emptyBoard, addRandomTile, move, hasMoves } from './game/logic'

export default function App() {
  // Initialize the game board with two random tiles
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(emptyBoard(4))))
  
  // Track current score
  const [score, setScore] = useState(0)

  // Track if the game is over
  const [over, setOver] = useState(false)

  // --- Handle Moves ---
  // Processes a move in the given direction
  // Updates board and score, and checks for game over
  const handleMove = (dir: 'left' | 'right' | 'up' | 'down') => {
    const { board: nb, score: s } = move(board, dir)

    // If board didn't change, do nothing
    if (JSON.stringify(nb) === JSON.stringify(board)) return

    // Add a random tile after a successful move
    const next = addRandomTile(nb)
    setBoard(next)
    setScore(score + s)

    // Check if there are no more valid moves
    if (!hasMoves(next)) setOver(true)
  }

  // --- Keyboard Controls ---
  // Set up arrow keys and WASD for moving tiles
  // Only active when game is not over
  // Cleans up event listener on unmount or dependency change
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (over) return
      const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', a: 'left', s: 'down', d: 'right'
      }
      const dir = keyMap[e.key]
      if (dir) {
        e.preventDefault()
        handleMove(dir)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [board, over])

  return (
    <div className="container">
      <h1>2048 — React + TypeScript</h1>
      <BoardView board={board} />
      {<div className="overlay">Game Over <button>Restart</button></div>}
    </div>
  )
}