import { useState } from "react";
import SkullIcon from "../components/SkullIcon";

const NUMBER_COLOR = "#c41a1a"; // Every number is red, like in game

// Difficulty modes: board size (the toon starts below the bottom row) and how many skulls it hides
const DIFFICULTIES = [
  { id: "easy", label: "Easy", rows: 7, cols: 7, skulls: 8 },
  { id: "medium", label: "Medium", rows: 7, cols: 7, skulls: 11 },
  { id: "extreme", label: "EXTREME", rows: 8, cols: 7, skulls: 19 },
];

// Generate board with skulls placed randomly
function generateBoard({ rows, cols, skulls }) {
  // Create empty board
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      revealed: false,
      bomb: false,
      number: 0,
    }))
  );

  // Place skulls randomly
  let placed = 0;
  while (placed < skulls) {
    const r = Math.floor(Math.random() * (rows - 1)); // Dont generate skulls on bottom row
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].bomb) {
      board[r][c].bomb = true;
      placed++;
    }
  }

  // Calculate numbers
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].bomb) continue;

      let num = 0;
      for (let rr = -1; rr <= 1; rr++) {
        for (let cc = -1; cc <= 1; cc++) {
          const nr = r + rr;
          const nc = c + cc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].bomb) {
            num++;
          }
        }
      }
      board[r][c].number = num;
    }
  }

  return board;
}

export default function SkullFinder() {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]); // Easy by default
  const [board, setBoard] = useState(() => generateBoard(DIFFICULTIES[0])); // Lazy init creates the first board on page load
  const [gameOver, setGameOver] = useState(false);
  const [pressed, setPressed] = useState(false); // Objective button pressed = win

  // Board size comes from the board itself, so it always matches the current difficulty
  const rows = board.length;
  const cols = board[0].length;
  const buttonCol = Math.floor(cols / 2); // The objective button sits above the middle column

  // The button can be pressed once any tile in the top row is revealed (the toon made it to the end)
  const buttonReachable = board[0].some(cell => cell.revealed && !cell.bomb);

  // A tile can be stepped on if it's in the bottom row (where the toon starts),
  // or directly next to (not diagonal) a revealed safe tile
  function isReachable(r, c) {
    if (r === rows - 1) return true;
    return [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dr, dc]) => {
      const neighbor = board[r + dr]?.[c + dc];
      return neighbor && neighbor.revealed && !neighbor.bomb;
    });
  }

  // Start a new board, optionally switching difficulty
  function resetGame(mode = difficulty) {
    setDifficulty(mode);
    setBoard(generateBoard(mode));
    setGameOver(false);
    setPressed(false);
  }

  // Left click -> reveal
  function reveal(r, c) {
    if (gameOver || !isReachable(r, c)) return;

    const newBoard = structuredClone(board);
    const cell = newBoard[r][c];

    if (cell.revealed) return;

    cell.revealed = true;

    // If skull -> game over
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
  }

  // Flood fill for empty tiles
  function revealEmpty(board, r, c) {
    for (let rr = -1; rr <= 1; rr++) {
      for (let cc = -1; cc <= 1; cc++) {
        const nr = r + rr;
        const nc = c + cc;
        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
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

  // Objective button -> win, every skull is revealed
  function pressButton() {
    if (gameOver || !buttonReachable) return;
    setPressed(true);
    setGameOver(true);
  }

  return (
    // ROOM - the whole page is the room, the floor is tilted back in 3D like the in-game camera
    <div className="skull-room h-screen w-full flex flex-col items-center overflow-hidden">

      {/* HUD - (back button space), title + status + difficulty, skulls left + reset button */}
      <div className="w-full flex items-center justify-between gap-4 px-6 py-3 xl:py-4">
        <div className="flex-1" />

        <div className="text-center">
          <h1 className="text-5xl xl:text-7xl font-bold text-red-600 font-minnie [text-shadow:0_5px_0_rgba(0,0,0,0.9),0_0_20px_rgba(255,30,10,0.4)]">
            Skull Finder
          </h1>
          <div className="text-lg xl:text-xl font-bold font-impress [text-shadow:0_2px_0_rgba(0,0,0,0.9)]">
            {gameOver
              ? (pressed ? <span className="text-green-400">Button pressed, you win!</span> : <span className="text-red-400">Boom! Try again</span>)
              : <span className="text-neutral-300">{buttonReachable ? "Press the button!" : "Reach the button at the top"}</span>}
          </div>

          {/* SKULL COUNT */}
          <div className="flex items-center justify-center gap-2 mt-2 text-2xl xl:text-3xl font-bold font-impress text-white [text-shadow:0_2px_0_rgba(0,0,0,0.9)]">
            <SkullIcon />
            <span>{difficulty.skulls}</span>
          </div>

          {/* DIFFICULTY - picking one starts a new board with that many skulls */}
          <div className="flex justify-center gap-2 mt-1">
            {DIFFICULTIES.map(mode => {
              const isActive = mode.id === difficulty.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => resetGame(mode)}
                  title={`${mode.skulls} skulls`}
                  className={`
                    toon-btn ${isActive ? "toon-btn-red" : "toon-btn-dark"}
                    w-24 xl:w-28 py-0.5 rounded-lg
                    text-white text-sm xl:text-base font-bold font-minnie
                  `}
                  style={{ textShadow: "1px 1px rgba(0,0,0,0.85)" }}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>

          {/* RESET BUTTON - a glowing red outline, so it doesn't look like the difficulty buttons */}
          <button
            onClick={() => resetGame()}
            className="
              mt-5 xl:mt-6 mb-4 xl:mb-6 px-6 py-1
              rounded-full border-2 border-red-500/70
              bg-red-950/30 text-red-400
              font-minnie text-lg xl:text-xl tracking-widest
              shadow-[0_0_10px_rgba(255,40,20,0.35)]
              hover:bg-red-600/30 hover:text-red-200 hover:shadow-[0_0_16px_rgba(255,40,20,0.6)]
              active:scale-95
              transition
            "
          >
            RESET
          </button>
        </div>

        {/* Balances the back button space so the middle stays centered */}
        <div className="flex-1" />
      </div>

      {/* FLOOR - fills the rest of the page, tile size follows the window so everything scales together */}
      <div className="flex-1 min-h-0 w-full flex items-end justify-center pb-4" style={{ perspective: "1100px" }}>
          <div
            className="skull-floor grid gap-x-[1.2vw] gap-y-[0.4vh] p-[1.5vh]"
            style={{
              "--tile": `min(${92 / (rows + 1)}vh, ${88 / cols}vw)`,
              gridTemplateColumns: `repeat(${cols}, var(--tile))`,
              gridAutoRows: "var(--tile)",
              transform: "rotateX(32deg)",
              transformOrigin: "50% 100%",
            }}
          >
            {/* OBJECTIVE BUTTON - its own row above the middle column */}
            {Array.from({ length: cols }, (_, c) => (
              c === buttonCol ? (
                <div key={`button-${c}`} className="flex items-center justify-center">
                  <button
                    onClick={pressButton}
                    title={buttonReachable ? "Press to finish!" : "Reveal a path to the top row first"}
                    className={`
                      skull-button w-3/5 h-3/5 rounded-sm
                      ${pressed ? "skull-button-pressed" : ""}
                      ${!gameOver && buttonReachable ? "cursor-pointer hover:scale-110" : "cursor-default"}
                      ${!gameOver && !buttonReachable ? "opacity-60" : ""}
                    `}
                  />
                </div>
              ) : <div key={`button-${c}`} />
            ))}

            {board.map((row, r) =>
              row.map((cell, c) => {
                const hitSkull = cell.revealed && cell.bomb;
                // Show every skull once the game ends (win or lose)
                const showSkull = hitSkull || (gameOver && cell.bomb);
                // Tiles glow brighter towards the far end, like the in-game lighting
                const glow = 1 - r / rows;

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => reveal(r, c)}
                    className={`
                      flex items-center justify-center
                      select-none font-remington font-bold
                      text-[calc(var(--tile)*0.45)]
                      transition duration-150
                      ${cell.revealed
                        ? hitSkull ? "skull-tile-hit" : "skull-tile-open"
                        : `skull-tile ${!gameOver && isReachable(r, c) ? "cursor-pointer hover:brightness-150" : "cursor-default"}`
                      }
                    `}
                    style={{
                      "--glow": glow,
                      color: NUMBER_COLOR,
                    }}
                  >
                    {showSkull && <SkullIcon />}
                    {cell.revealed && !cell.bomb && cell.number > 0 && cell.number}
                  </div>
                );
              })
            )}
          </div>
      </div>
    </div>
  );
}
