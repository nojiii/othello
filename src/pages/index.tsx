import { useState } from 'react';
import styles from './index.module.css';
//level1 めくれる 点数
//level2 候補表示
//level3 パス、二回パス終了
//level3.1 スマホ対応
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
    if (board[y + 1] !== undefined && board[y + 1][x] === 2 / turnColor) {
      newBoard[y][x] = turnColor;
      setTurnColor(2 / turnColor);
    }
    //for() //調べる
    const directions = [
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];
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
    </div>
  );
};

export default Home;
