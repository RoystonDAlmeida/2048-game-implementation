import { useState, useEffect } from 'react'
import BoardView from './components/Board'
import { emptyBoard, addRandomTile, move, hasMoves } from './game/logic'

export default function App() {
  const [boardSize, setBoardSize] = useState(4);
  const [inputValue, setInputValue] = useState(boardSize.toString());
  
  // Initialize the game board with two random tiles
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(emptyBoard(boardSize))))
  
  // Track current score
  const [score, setScore] = useState(0)

  // Track if the game is won
  const [win, setWin] = useState(false)

  // Track if the game is over
  const [over, setOver] = useState(false)

  useEffect(() => {
    setInputValue(boardSize.toString());
  }, [boardSize]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const newSize = parseInt(inputValue, 10);
    if (!isNaN(newSize) && newSize > 1) {
      setBoardSize(newSize);
      setBoard(addRandomTile(addRandomTile(emptyBoard(newSize))));
      setScore(0);
      setOver(false);
    } else {
      setInputValue(boardSize.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-6"
    >
      <h1 className="text-4xl font-bold mb-4 text-[#92400e] drop-shadow-md">
        2048 — React + TypeScript
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around w-full max-w-lg mx-auto mb-4 gap-4">
        {/* Score */}
        <div className="text-xl font-bold text-gray-800 bg-white/70 px-6 py-3 rounded-xl shadow-md flex items-center gap-3">
          <span>🏆</span>
          <div>
            <span className="text-sm font-normal">Score</span>
            <div className="text-2xl">{score}</div>
          </div>
        </div>

        {/* Board Size */}
        <div className="text-lg bg-white/70 px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
          <label htmlFor="boardSize" className="font-bold flex items-center gap-2">
            <span>📏</span>
            <span>Board Size:</span>
          </label>
          <input
            type="text"
            id="boardSize"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputSubmit}
            onKeyDown={handleKeyDown}
            className="ml-2 w-16 text-center rounded-md border-2 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
          />
          <button
            onClick={handleInputSubmit}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Set
          </button>
        </div>
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
      <div className="mt-6 grid grid-cols-3 gap-3 sm:hidden w-full max-w-xs px-4">
        <div></div> {/* top-left */}
        <button
          onClick={() => handleMove('up')}
          className="w-16 h-16 flex items-center justify-center rounded-md text-white font-bold text-2xl bg-blue-400 hover:bg-blue-500 transition"
        >
          ↑
        </button>
        <div></div> {/* top-right */}
        <button
          onClick={() => handleMove('left')}
          className="w-16 h-16 flex items-center justify-center rounded-md text-white font-bold text-2xl bg-green-400 hover:bg-green-500 transition"
        >
          ←
        </button>
        <button
          onClick={() => handleMove('down')}
          className="w-16 h-16 flex items-center justify-center rounded-md text-white font-bold text-2xl bg-red-400 hover:bg-red-500 transition"
        >
          ↓
        </button>
        <button
          onClick={() => handleMove('right')}
          className="w-16 h-16 flex items-center justify-center rounded-md text-white font-bold text-2xl bg-yellow-400 hover:bg-yellow-500 transition"
        >
          →
        </button>
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