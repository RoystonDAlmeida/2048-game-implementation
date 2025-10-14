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

/**
 * Merges tiles in a row by sliding them to the left and combining adjacent equal values.
 * 
 * @param row - The row of tiles to merge (0 represents empty tiles)
 * @returns An object containing:
 *   - row: The merged row with zeros padded on the right
 *   - score: The points earned from merging tiles in this row
 * 
 * @example
 * mergeRowLeft([2, 2, 4, 0]) // Returns { row: [4, 4, 0, 0], score: 4 }
 * mergeRowLeft([2, 4, 4, 8]) // Returns { row: [2, 8, 8, 0], score: 8 }
 * 
 * Algorithm:
 * 1. Filters out zeros (empty tiles)
 * 2. Iterates through non-zero values
 * 3. Merges adjacent equal values by doubling them
 * 4. Adds merged value to score
 * 5. Pads the result with zeros to maintain original length
 */
const mergeRowLeft = (row: number[]) => {
  const filtered = row.filter(v => v !== 0)
  const merged: number[] = []
  let score = 0
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2
      merged.push(val)
      score += val
      i++ // Skip next element since it was merged
    } else merged.push(filtered[i])
  }
  while (merged.length < row.length) merged.push(0)
  return { row: merged, score }
}

/**
 * Rotates the board 90 degrees clockwise.
 * 
 * @param board - The game board to rotate
 * @returns A new board rotated 90° clockwise
 * 
 * @example
 * // Input:           Output:
 * // [1, 2, 3]        [7, 4, 1]
 * // [4, 5, 6]   =>   [8, 5, 2]
 * // [7, 8, 9]        [9, 6, 3]
 * 
 * Implementation: Transposes the matrix and reverses each row
 * - Maps over columns to create new rows
 * - Reverses each new row to achieve clockwise rotation
 */
const rotate = (board: Board): Board => {
  return board[0].map((_, c) => board.map(r => r[c]).reverse())
}

/**
 * Moves all tiles on the board in the specified direction and merges matching tiles.
 * 
 * @param board - The current game board
 * @param dir - The direction to move tiles: 'left', 'right', 'up', or 'down'
 * @returns An object containing:
 *   - board: The new board state after the move
 *   - score: The total points earned from merging tiles during this move
 * 
 * @example
 * const board = [[2, 2, 0, 0], [4, 0, 4, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
 * move(board, 'left') // Merges tiles to the left
 * 
 * Strategy:
 * - All moves are normalized to "left" by rotating/reversing the board
 * - Applies mergeRowLeft to each row
 * - Rotates/reverses back to restore the correct orientation
 * 
 * Direction transformations:
 * - left: No transformation needed
 * - right: Reverse each row, merge left, reverse back
 * - up: Rotate 90° clockwise, merge left, rotate 270° back
 * - down: Rotate 270° clockwise, merge left, rotate 90° back
 */
export const move = (board: Board, dir: 'left' | 'right' | 'up' | 'down') => {
  let working = clone(board)
  
  // Transform board so all moves can be treated as "left"
  if (dir === 'up') working = rotate(working)
  if (dir === 'right') working = working.map(r => [...r].reverse())
  if (dir === 'down') working = rotate(rotate(rotate(working)))

  // Merge all rows to the left and accumulate score
  let score = 0
  let newBoard = working.map(r => {
    const { row, score: s } = mergeRowLeft(r)
    score += s
    return row
  })

  // Transform board back to original orientation
  if (dir === 'up') newBoard = rotate(rotate(rotate(newBoard)))
  if (dir === 'right') newBoard = newBoard.map(r => [...r].reverse())
  if (dir === 'down') newBoard = rotate(newBoard)

  return { board: newBoard, score }
}

/**
 * Checks if any legal moves remain on the board.
 * 
 * @param board - The current game board
 * @returns true if moves are possible, false if the game is over
 * 
 * @example
 * hasMoves([[2, 4, 8, 16], [4, 8, 16, 32], ...]) // Returns false if no moves
 * hasMoves([[2, 2, 4, 8], ...]) // Returns true (2s can merge)
 * 
 * A move is possible if any of these conditions are met:
 * 1. At least one empty cell (value === 0) exists
 * 2. Two horizontally adjacent tiles have the same value
 * 3. Two vertically adjacent tiles have the same value
 * 
 * Used to determine game over condition:
 * - If false is returned, the player has no valid moves and the game ends
 */
export const hasMoves = (board: Board): boolean => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      // Check for empty cells
      if (board[r][c] === 0) return true
      // Check for horizontal merges (right neighbor)
      if (c + 1 < board.length && board[r][c] === board[r][c + 1]) return true
      // Check for vertical merges (bottom neighbor)
      if (r + 1 < board.length && board[r][c] === board[r + 1][c]) return true
    }
  }
  return false
}