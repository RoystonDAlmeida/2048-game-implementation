import type { Board } from '../game/logic'

interface Props {
  board: Board
}

export default function BoardView({ board }: Props) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)` }}>
      {board.flatMap((row, r) =>
        row.map((v, c) => (
          <div key={`${r}-${c}`} className={`tile value-${v}`}>{v || ''}</div>
        ))
      )}
    </div>
  )
}