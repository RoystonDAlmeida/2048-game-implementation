/** A 2D array of numbers representing the game board. */
export type Board = number[][]

/**
 * Creates an empty game board filled with zeros.
 * @param size - The dimension of the square board (e.g., 4 for a 4x4 board)
 * @returns A 2D array filled with zeros representing empty tiles
 * 
 * Example: emptyBoard(4) creates:
 * [[0,0,0,0],
 *  [0,0,0,0],
 *  [0,0,0,0],
 *  [0,0,0,0]]
*/
export const emptyBoard = (size: number): Board =>
  Array.from({ length: size }, () => Array(size).fill(0))

/**
 * Creates a deep copy of the board to avoid mutating the original.
 * @param b - The board to clone
 * @returns A new board with the same values
 * 
 * This is crucial for maintaining immutability in the game state.
*/
const clone = (b: Board): Board => b.map(r => [...r])

/**
 * Adds a random tile (either 2 or 4) to an empty position on the board.
 * @param board - The current game board
 * @returns A new board with a randomly placed tile, or the original board if full
 * 
 * Game mechanics: 90% chance of placing a 2, 10% chance of placing a 4
*/
export const addRandomTile = (board: Board): Board => {
  const empty: [number, number][] = []
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board.length; c++)

      // If the tile is empty (0), add its coordinates to the empty array
      if (board[r][c] === 0) empty.push([r, c])
  
  // If no empty tiles exist, return the board unchanged (game over condition)
  if (!empty.length) return board

  // Select a random empty position from the array
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]

  // 90% chance of spawning a 2, 10% chance of spawning a 4
  const value = Math.random() < 0.9 ? 2 : 4

  // Clone the board to avoid mutation
  const newBoard = clone(board)

  // Place the new tile at the randomly selected empty position
  newBoard[r][c] = value
  return newBoard
}