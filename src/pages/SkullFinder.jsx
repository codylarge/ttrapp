import { useState, useEffect } from "react";

export default function SkullFinder() {
  const SIZE = 7;        // SIZE x SIZE board
  let bombsCount = 10; // Total # of bombs

  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [flagsUsed, setFlagsUsed] = useState(0);

  // Create a new board on page load
  useEffect(() => {
    resetGame();
  }, []);

  function resetGame() {
    const newBoard = generateBoard(SIZE, bombsCount);
    setBoard(newBoard);
    setGameOver(false);
    setFlagsUsed(0);
  }

  // Generate board with bombs placed randomly
  function generateBoard(SIZE, bombsCount) {
    // Create empty board
    const board = Array.from({ length: SIZE }, () =>
      Array.from({ length: SIZE }, () => ({
        revealed: false,
        bomb: false,
        flag: false,
        number: 0,
      }))
    );

    // Place bombs randomly
    let placed = 0;
    while (placed < bombsCount) {
      const r = Math.floor(Math.random() * (SIZE - 1)); // Dont generate skulls on bottom row
      const c = Math.floor(Math.random() * SIZE);
      if (!board[r][c].bomb) {
        board[r][c].bomb = true;
        placed++;
      }
    }

    // Calculate numbers
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c].bomb) continue;

        let num = 0;
        for (let rr = -1; rr <= 1; rr++) {
          for (let cc = -1; cc <= 1; cc++) {
            const nr = r + rr;
            const nc = c + cc;
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc].bomb) {
              num++;
            }
          }
        }
        board[r][c].number = num;
      }
    }

    return board;
  }

  // Left click -> reveal
  function reveal(r, c) {
    if (gameOver || board[r][c].flag) return;

    const newBoard = structuredClone(board);
    const cell = newBoard[r][c];

    if (cell.revealed) return;

    cell.revealed = true;

    // If bomb -> game over
    if (cell.bomb) {
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    // Auto reveal empty spaces
    if (cell.number === 0) {
      revealEmpty(newBoard, r, c);
    }

    setBoard(newBoard);

    checkWin(newBoard);
  }

  // Flood fill for empty tiles
  function revealEmpty(board, r, c) {
    for (let rr = -1; rr <= 1; rr++) {
      for (let cc = -1; cc <= 1; cc++) {
        const nr = r + rr;
        const nc = c + cc;
        if (
          nr >= 0 && nr < SIZE &&
          nc >= 0 && nc < SIZE &&
          !board[nr][nc].revealed &&
          !board[nr][nc].bomb
        ) {
          board[nr][nc].revealed = true;
          if (board[nr][nc].number === 0) {
            revealEmpty(board, nr, nc);
          }
        }
      }
    }
  }

  // Right click -> toggle flag
  function flag(e, r, c) {
    e.preventDefault();
    if (gameOver || board[r][c].revealed) return;

    const newBoard = structuredClone(board);
    const cell = newBoard[r][c];

    cell.flag = !cell.flag;
    setFlagsUsed(flagsUsed + (cell.flag ? 1 : -1));
    setBoard(newBoard);
  }

  // Check if player won
  function checkWin(board) {
    let unrevealed = 0;
    for (let row of board) {
      for (let cell of row) {
        if (!cell.revealed && !cell.bomb) {
          unrevealed++;
        }
      }
    }
    if (unrevealed === 0) setGameOver(true);
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-4 text-white">Skull Finder</h1>

      {gameOver && (
        <div className="mb-4 text-xl">
          {flagsUsed === bombsCount ? "🎉 You Win!" : "💥 Game Over"}
        </div>
      )}

      <button
        onClick={resetGame}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Reset Game
      </button>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, calc(65vh / ${SIZE}))`,
          gridTemplateRows: `repeat(${SIZE}, calc(65vh / ${SIZE}))`,
          gap: "14px",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => reveal(r, c)}
              onContextMenu={(e) => flag(e, r, c)}
              className={`
                flex items-center justify-center 
                text-2xl font-bold cursor-pointer select-none
                transition
                ${cell.revealed ? "bg-transparent" : ""}
              `}
              style={{
                width: `calc(75vh / ${SIZE})`,
                height: `calc(75vh / ${SIZE})`,

                /* NEW COLORS */
                background: cell.revealed
                  ? "rgba(0, 0, 0, 0.9)"     // revealed = black/transparent
                  : "rgba(255, 0, 0, 0.85)", // unrevealed = red

                /* NEW BORDERS + GLOW */
                border: cell.revealed
                  ? "none"                           // no border when revealed
                  : "3px solid rgba(0, 0, 0, 1)", // black border when unrevealed

                boxShadow: cell.revealed
                  ? "none"
                  : `
                      inset 0 0 12px rgba(55, 0, 0, 0.9), 
                      inset 0 0 20px rgba(55, 0, 0, 0.9),
                      0 0 8px rgba(0, 0, 0, 0.8)
                    `,

                color: cell.revealed ? "red" : "transparent",

                borderRadius: "0px",
              }}

            >
              {cell.revealed && (
                <>
                  {cell.bomb && "☠️"}
                  {!cell.bomb && cell.number > 0 && cell.number}
                </>
              )}

              {/* FLAG when unrevealed */}
              {!cell.revealed && cell.flag && "🚩"}

            </div>


          ))
        )}
      </div>

    </div>
  );
}
