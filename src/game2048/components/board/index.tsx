import React, { useState } from "react";
import Tile from "../tile";
import Cell from "../cell";
import { Board } from "../../utils";
import useEvent from "../../hooks";
import GameOverlay from "../game-overlay";
import "../../styles/2048game.scss";

const BoardView = () => {
  const [board, setBoard] = useState(new Board());

  const handleKeyDown = (event: KeyboardEvent) => {
    if (board.hasWon()) {
      return;
    }

    if (event.keyCode >= 37 && event.keyCode <= 40) {
      let direction = event.keyCode - 37;
      let boardClone = Object.assign(
        Object.create(Object.getPrototypeOf(board)),
        board
      );
      let newBoard = boardClone.move(direction);
      setBoard(newBoard);
    }
  };

  useEvent("keydown", handleKeyDown as any);

  const cells = board.cells.map((row: any, rowIndex: number) => {
    return (
      <div key={rowIndex}>
        {row.map((col: any, colIndex: number) => {
          return <Cell key={rowIndex * board.size + colIndex} />;
        })}
      </div>
    );
  });

  const tiles = board.tiles
    .filter((tile: any) => tile.value !== 0)
    .map((tile: any, index: number) => {
      return <Tile tile={tile} key={index} />;
    });

  const resetGame = () => {
    setBoard(new Board());
  };

  return (
    <div className="board-container">
      <div className="details-box">
        <div className="resetButton" onClick={resetGame}>
          New Game
        </div>
        <div className="score-box">
          <div className="score-header">PUNTOS</div>
          <div>{board.score}</div>
        </div>
      </div>
      <div className="board">
        {cells}
        {tiles}
        <GameOverlay onRestart={resetGame} board={board} />
      </div>
    </div>
  );
};

export default BoardView;
