import { useState } from 'react'
import BoardView from './components/Board'
import { emptyBoard, addRandomTile } from './game/logic'

export default function App() {
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(emptyBoard(4))))

  return (
    <div className="container">
      <h1>2048 — React + TypeScript</h1>
      <BoardView board={board} />
    </div>
  )
}