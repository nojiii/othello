import { useState } from 'react';
import styles from './index.module.css';
//level1 めくれる 点数
//level2 候補表示
//level3 パス、二回パス終了
//level3.1 スマホ対応

//石の位置による評価値
const valueTable = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20, 5, 5, 20, -20, 120],
];

//点数評価関数
function evaluate(board: number[][], turnColor: number): void {
  let value = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === turnColor) value += valueTable[i][j];
    }
  }
  if (turnColor === 1) {
    const blackScore = document.getElementById('black_score');
    if (blackScore) {
      blackScore.textContent = `黒：${String(value)}`;
    }
  } else if (turnColor === 2) {
    const whiteScore = document.getElementById('white_score');
    if (whiteScore) {
      whiteScore.textContent = `白：${String(value)}`;
    }
  }
}

const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

function checkQueue(board: number[][], x: number, y: number, direction: number[]): number[] {
  const queue: number[] = [];
  let time: number = 1;
  while (
    y + time * direction[1] < 8 &&
    x + time * direction[0] < 8 &&
    y + time * direction[1] > -1 &&
    x + time * direction[0] > -1
  ) {
    queue.push(board[y + time * direction[1]][x + time * direction[0]]);
    time++;
  }
  console.log(queue);
  return queue;
}

function canFlip(
  board: number[][],
  x: number,
  y: number,
  turnColor: number,
  queue: number[],
): boolean {
  if (board[y][x] !== 0) {
    return false;
  }
  let items: number = 0;
  for (let i = 0; i < queue.length; i++) {
    if (items >= 1 && turnColor === queue[i]) {
      console.log('can!!!');
      return true;
    } else if (queue[i] === 2 / turnColor) {
      items++;
    } else if (queue[i] === 0) {
      return false;
    }
  }
  return false;
}

function showTurn(turnColor: number): void {
  const nowTurn = document.getElementById('now_turn');
  if (nowTurn) {
    nowTurn.textContent = `${2 / turnColor === 1 ? '黒' : '白'}のターンです`;
  }
}

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    //なにもない0 黒1 白2
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    for (const direction of directions) {
      if (canFlip(board, x, y, turnColor, checkQueue(board, x, y, direction))) {
        const queue: number[] = checkQueue(board, x, y, direction);
        for (let i = 0; i < queue.length; i++) {
          if (queue[i] === 2 / turnColor) {
            newBoard[y + i * direction[1]][x + i * direction[0]] = turnColor;
          } else if (queue[i] === turnColor) {
            newBoard[y + i * direction[1]][x + i * direction[0]] = turnColor;
            setTurnColor(2 / turnColor);
            showTurn(turnColor);
            evaluate(board, 1);
            evaluate(board, 2);
            break;
          }
        }
      }
    }
    setBoard(newBoard);
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }} //リファクタリング
                />
              )}
            </div>
          )),
        )}
      </div>
      <div className={styles.scores}>
        スコア
        <div className={styles.black_score} id="black_score">
          黒：
        </div>
        <div className={styles.white_score} id="white_score">
          白：
        </div>
        <div className={styles.now_turn} id="now_turn">
          黒のターンです
        </div>
      </div>
    </div>
  );
};

export default Home;
