import React, { useState, useEffect } from "react";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import "../../styles/tic-tac-toe.scss";

// Define types
type Player = "O" | "X" | null;
type GameStatusType = "Init" | "Playing" | "End";
type Difficulty = "impossible" | "easy";

interface BlockProps {
  pos: number;
  grid: Player[];
  onClick: (pos: number) => void;
}

interface GameState {
  grid: Player[];
  turn: Player;
  gameStatus: GameStatusType;
  winner: Player;
  you: Player;
}

function Block({ pos, grid, onClick }: BlockProps) {
  return (
    <div className="block" onClick={() => onClick(pos)}>
      {grid[pos]}
    </div>
  );
}

const GameStatus: Record<GameStatusType, GameStatusType> = {
  Init: "Init",
  Playing: "Playing",
  End: "End"
};

const initState: GameState = {
  grid: Array(9).fill(null),
  turn: null,
  gameStatus: GameStatus.Init,
  winner: null,
  you: null
};

const Strategy = {
  random: (grid: Player[]): number | null => {
    const avail: number[] = [];
    grid.forEach((block: Player, i: number) => {
      if (block === null) avail.push(i);
    });

    if (avail.length === 0) return null;
    return avail[Math.floor(Math.random() * avail.length)];
  },

  minimax: (grid: Player[], turn: Player): [number | null, number] => {
    const [gameStatus, winner] = gameCheck(grid);
    if (gameStatus === GameStatus.End) {
      if (winner === null) return [null, 0];
      return [null, -1];
    }

    let score = Number.MIN_SAFE_INTEGER;
    let posChoice: number | null = null;
    const nextTurn: Player = turn === "O" ? "X" : "O";

    for (let pos of shuffle(range(grid.length))) {
      if (grid[pos] === null) {
        grid[pos] = turn;

        const [, oppoScore] = Strategy.minimax(grid, nextTurn);
        if (-oppoScore > score) {
          score = -oppoScore;
          posChoice = pos;
        }

        grid[pos] = null;

        if (score === 1) break;
      }
    }
    return [posChoice, score];
  }
};

const WIN_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const gameCheck = (grid: Player[]): [GameStatusType, Player] => {
  if (grid.filter(block => block === null).length === 0) {
    return [GameStatus.End, null];
  }

  for (const cond of WIN_CONDITIONS) {
    if (cond.filter(idx => grid[idx] === "O").length === 3) {
      return [GameStatus.End, "O"];
    }

    if (cond.filter(idx => grid[idx] === "X").length === 3) {
      return [GameStatus.End, "X"];
    }
  }

  return [GameStatus.Playing, null];
};

interface TicTacToeProps {
  difficulty: Difficulty;
}

function TicTacToe({ difficulty }: TicTacToeProps) {
  const [state, setState] = useState<GameState>(initState);
  const { grid, turn, gameStatus, winner, you } = state;

  useEffect(() => {
    if (turn !== you && gameStatus === GameStatus.Playing)
      setTimeout(aiMove, 500);
  }, [state, you, turn, gameStatus]);

  const start = (choice: Player) => {
    setState(preState => ({
      ...preState,
      grid: Array(9).fill(null),
      turn: "O",
      gameStatus: GameStatus.Playing,
      winner: null,
      you: choice
    }));
  };

  const move = (pos: number) => {
    if (grid[pos] === null) {
      const newGrid = [...grid];
      newGrid[pos] = turn;

      const [newGameStatus, newWinner] = gameCheck(newGrid);

      const nextTurn: Player = newGameStatus !== GameStatus.Playing ? null : 
        turn === "O" ? "X" : "O";

      setState(preState => ({
        ...preState,
        grid: newGrid,
        gameStatus: newGameStatus,
        turn: nextTurn,
        winner: newWinner
      }));
    }
  };

  const youMove = (pos: number) => {
    if (turn === you) move(pos);
  };

  const aiMove = () => {
    let pos: number | null;

    if (difficulty === "impossible") {
      [pos] = Strategy.minimax(grid, turn);
    } else {
      pos = Strategy.random(state.grid);
    }

    if (pos !== null) {
      move(pos);
    }
  };

  return (
    <div className="game">
      <div className="box">
        <div className="row">
          <Block pos={0} grid={grid} onClick={youMove} />
          <Block pos={1} grid={grid} onClick={youMove} />
          <Block pos={2} grid={grid} onClick={youMove} />
        </div>
        <div className="row">
          <Block pos={3} grid={grid} onClick={youMove} />
          <Block pos={4} grid={grid} onClick={youMove} />
          <Block pos={5} grid={grid} onClick={youMove} />
        </div>
        <div className="row">
          <Block pos={6} grid={grid} onClick={youMove} />
          <Block pos={7} grid={grid} onClick={youMove} />
          <Block pos={8} grid={grid} onClick={youMove} />
        </div>
      </div>
      {gameStatus !== GameStatus.Playing && <div className="overlay" />}
      {gameStatus === GameStatus.Init && (
        <div className="panel">
          <div>Tic Tac Toe</div>
          <div className="actions">
            <div className="start-btn" onClick={() => start("O")}>
              O
            </div>
            <div className="start-btn" onClick={() => start("X")}>
              X
            </div>
          </div>
        </div>
      )}
      {gameStatus === GameStatus.End && (
        <div className="panel">
          <div>{winner ? `Winner: ${winner}` : "Draw"}</div>
          <div className="actions">
            <div className="start-btn" onClick={() => start("O")}>
              O
            </div>
            <div className="start-btn" onClick={() => start("X")}>
              X
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
