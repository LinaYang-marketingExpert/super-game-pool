type Matrix = number[][];

const rotateLeft = function (matrix: Matrix): Matrix {
  const rows = matrix.length;
  const columns = matrix[0].length;
  const res: Matrix = [];
  for (let row = 0; row < rows; ++row) {
    res.push([]);
    for (let column = 0; column < columns; ++column) {
      res[row][column] = matrix[column][columns - row - 1];
    }
  }
  return res;
};

class Tile {
  value: number;
  row: number;
  column: number;
  oldRow: number;
  oldColumn: number;
  markForDeletion: boolean;
  mergedInto: Tile | null;
  id: number;
  private static counter = 0;

  constructor(value?: number, row?: number, column?: number) {
    this.value = value || 0;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;
    this.id = Tile.counter++;
  }

  moveTo(row: number, column: number): void {
    this.oldRow = this.row;
    this.oldColumn = this.column;
    this.row = row;
    this.column = column;
  }

  isNew(): boolean {
    return this.oldRow === -1 && !this.mergedInto;
  }

  hasMoved(): boolean {
    return (
      (this.fromRow() !== -1 &&
        (this.fromRow() !== this.toRow() ||
          this.fromColumn() !== this.toColumn())) ||
      this.mergedInto !== null
    );
  }

  fromRow(): number {
    return this.mergedInto ? this.row : this.oldRow;
  }

  fromColumn(): number {
    return this.mergedInto ? this.column : this.oldColumn;
  }

  toRow(): number {
    return this.mergedInto ? this.mergedInto.row : this.row;
  }

  toColumn(): number {
    return this.mergedInto ? this.mergedInto.column : this.column;
  }
}

class Board {
  tiles: Tile[];
  cells: Tile[][];
  score: number;
  size: number;
  fourProbability: number;
  deltaX: number[];
  deltaY: number[];
  won: boolean;

  constructor() {
    this.tiles = [];
    this.cells = [];
    this.score = 0;
    this.size = 4;
    this.fourProbability = 0.1;
    this.deltaX = [-1, 0, 1, 0];
    this.deltaY = [0, -1, 0, 1];
    for (let i = 0; i < this.size; ++i) {
      this.cells[i] = [
        this.addTile(0),
        this.addTile(0),
        this.addTile(0),
        this.addTile(0),
      ];
    }
    this.addRandomTile();
    this.addRandomTile();
    this.setPositions();
    this.won = false;
  }

  addTile(value?: number): Tile {
    const res = new Tile(value);
    this.tiles.push(res);
    return res;
  }

  moveLeft(): boolean {
    let hasChanged = false;
    for (let row = 0; row < this.size; ++row) {
      const currentRow = this.cells[row].filter((tile) => tile.value !== 0);
      const resultRow: Tile[] = [];
      for (let target = 0; target < this.size; ++target) {
        let targetTile = currentRow.length ? currentRow.shift()! : this.addTile(0);
        if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
          const tile1 = targetTile;
          targetTile = this.addTile(targetTile.value);
          tile1.mergedInto = targetTile;
          const tile2 = currentRow.shift()!;
          tile2.mergedInto = targetTile;
          targetTile.value += tile2.value;
          this.score += tile1.value + tile2.value;
        }
        resultRow[target] = targetTile;
        this.won = this.won || targetTile.value === 2048;
        hasChanged = hasChanged || targetTile.value !== this.cells[row][target].value;
      }
      this.cells[row] = resultRow;
    }
    return hasChanged;
  }

  setPositions(): void {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        tile.oldRow = tile.row;
        tile.oldColumn = tile.column;
        tile.row = rowIndex;
        tile.column = columnIndex;
        tile.markForDeletion = false;
      });
    });
  }

  addRandomTile(): void {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < this.size; ++r) {
      for (let c = 0; c < this.size; ++c) {
        if (this.cells[r][c].value === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    const index = ~~(Math.random() * emptyCells.length);
    const cell = emptyCells[index];
    const newValue = Math.random() < this.fourProbability ? 4 : 2;
    this.cells[cell.r][cell.c] = this.addTile(newValue);
  }

  move(direction: number): Board {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    for (let i = 0; i < direction; ++i) {
      this.cells = rotateLeft(this.cells as unknown as Matrix) as unknown as Tile[][];
    }
    const hasChanged = this.moveLeft();
    for (let i = direction; i < 4; ++i) {
      this.cells = rotateLeft(this.cells as unknown as Matrix) as unknown as Tile[][];
    }
    if (hasChanged) {
      this.addRandomTile();
    }
    this.setPositions();
    return this;
  }

  clearOldTiles(): void {
    this.tiles = this.tiles.filter((tile) => tile.markForDeletion === false);
    this.tiles.forEach((tile) => {
      tile.markForDeletion = true;
    });
  }

  hasWon(): boolean {
    return this.won;
  }

  hasLost(): boolean {
    let canMove = false;
    for (let row = 0; row < this.size; ++row) {
      for (let column = 0; column < this.size; ++column) {
        canMove = canMove || this.cells[row][column].value === 0;
        for (let dir = 0; dir < 4; ++dir) {
          const newRow = row + this.deltaX[dir];
          const newColumn = column + this.deltaY[dir];
          if (
            newRow < 0 ||
            newRow >= this.size ||
            newColumn < 0 ||
            newColumn >= this.size
          ) {
            continue;
          }
          canMove =
            canMove ||
            this.cells[row][column].value === this.cells[newRow][newColumn].value;
        }
      }
    }
    return !canMove;
  }
}

export { Board, Tile };
