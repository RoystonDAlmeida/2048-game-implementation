import type { Board } from '../game/logic'

interface Props {
  board: Board
}

export default function BoardView({ board }: Props) {
  return (
    <div
      className="board grid gap-2 bg-[#bbada0] p-2 rounded-lg"
      style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)` }}
    >
      {board.flatMap((row, rowIdx) =>
        row.map((value, colIdx) => {
          // For now, mark these as false.
          // Later, these can come from move metadata (e.g., just-merged or newly spawned tiles)
          const isNew = false
          const isMerged = false

          return (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`tile flex items-center justify-center h-20 w-20 rounded-lg font-bold text-xl transition-all duration-300 ease-in-out ${
                value === 0
                  ? 'bg-gray-200 text-gray-400'
                  : `bg-amber-${Math.min(900, 100 + value / 2)} text-white`
              } ${isNew ? 'animate-pop' : ''} ${isMerged ? 'animate-merge' : ''}`}
            >
              {value !== 0 && value}
            </div>
          )
        })
      )}
    </div>
  )
}
