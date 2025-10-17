import { useState, useEffect } from 'react'
import BoardView from './components/Board'
import { emptyBoard, addRandomTile, move, hasMoves } from './game/logic'

export default function App() {
  const [boardSize, setBoardSize] = useState(4);
  
  // Initialize the game board with two random tiles
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(emptyBoard(boardSize))))
  
  // Track current score
  const [score, setScore] = useState(0)

  // Track if the game is won
  const [win, setWin] = useState(false)

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

    // 🆕 check for win
    if (next.flat().includes(2048)) setWin(true)

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

  // --- Restart Game ---
  // Resets board, score, and game over state
  const restart = () => {
    setBoard(addRandomTile(addRandomTile(emptyBoard(boardSize))))
    setScore(0)
    setOver(false)
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 1) {
      setBoardSize(newSize);
      setBoard(addRandomTile(addRandomTile(emptyBoard(newSize))));
      setScore(0);
      setOver(false);
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-6"
    >
      <h1 className="text-4xl font-bold mb-4 text-[#92400e] drop-shadow-md">
        2048 — React + TypeScript
      </h1>

      {/* Score display with subtle shadow */}
      <div className="text-lg mb-3 bg-white/70 px-4 py-2 rounded-lg shadow">
        <strong>Score:</strong> {score}
      </div>

      <div className="text-lg mb-3 bg-white/70 px-4 py-2 rounded-lg shadow">
        <label htmlFor="boardSize"><strong>Board Size:</strong></label>
        <input
          type="number"
          id="boardSize"
          value={boardSize}
          onChange={handleSizeChange}
          className="ml-2 w-16 text-center no-spinner"
        />
      </div>

      {/* Game Board */}
      <div className="transition-all duration-300 transform hover:scale-[1.01]">
        <BoardView board={board} />
      </div>

      {/* Game Over Message */}
      {over && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over!</h2>
            <p className="mb-4 text-gray-700">Final Score: {score}</p>
            <button
              onClick={restart}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}

      {/* Optional Controls (mobile-friendly) */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:hidden">
        <button onClick={() => handleMove('up')} className="col-span-3 py-2 bg-amber-300 rounded-md">↑</button>
        <button onClick={() => handleMove('left')} className="py-2 bg-amber-300 rounded-md">←</button>
        <button onClick={() => handleMove('down')} className="py-2 bg-amber-300 rounded-md">↓</button>
        <button onClick={() => handleMove('right')} className="py-2 bg-amber-300 rounded-md">→</button>
      </div>

      {/* Restart Button always visible */}
      <button
        onClick={restart}
        className="mt-4 text-sm text-gray-600 underline hover:text-amber-700 transition"
      >
        Restart Game
      </button>

      {win && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-bounce">
            <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 You Win!</h2>
            <p className="mb-4 text-gray-700">Final Score: {score}</p>
            <button
              onClick={restart}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

    </div>
  )
}