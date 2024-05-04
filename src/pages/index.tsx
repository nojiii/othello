import { useState } from 'react';
import styles from './index.module.css';
//level1 めくれる 点数
//level2 候補表示
//level3 パス、二回パス終了
//level3.1 スマホ対応

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
  //テスト用
  // const [board, setBoard] = useState([
  //   //なにもない0 黒1 白2
  //   [1, 2, 0, 0, 0, 0, 0, 0],
  //   [1, 2, 0, 0, 0, 0, 0, 0],
  //   [1, 2, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  // ]);
  const [blackCount, setBlackCount] = useState(2);
  const [whiteCount, setWhiteCount] = useState(2);
  const [isGameEnd, setGameEnd] = useState(false);
  const [passTime, setPasstime] = useState(0);

  //黒が何個あるか、白が何個あるかを配列で返す&黒と白の個数を更新する
  function evaluate(board: number[][]): number[] {
    let blackValue = 0;
    let whiteValue = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === 1) blackValue += 1;
        if (board[i][j] === 2) whiteValue += 1;
      }
    }
    setBlackCount(blackValue);
    setWhiteCount(whiteValue);
    return [blackValue, whiteValue];
  }
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
    // console.log(queue);
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
        // console.log('can', x, y, 'color:', turnColor);
        return true;
      } else if (queue[i] === 2 / turnColor) {
        items++;
      } else if (queue[i] === 0 || turnColor === queue[i]) {
        return false;
      }
    }
    return false;
  }
  //受け取った座標で駒がひっくり返せるならdiv要素をreturnする
  function showCand(board: number[][], x: number, y: number, turnColor: number) {
    for (let i = 0; i < directions.length; i++) {
      if (canFlip(board, x, y, turnColor, checkQueue(board, x, y, directions[i]))) {
        return <div className={styles.can} />;
      }
    }
    return undefined;
  }

  //turnColorの時に置けるところがあるか判定する
  // function canPlace(board: number[][], turnColor: number): boolean {
  //   let place = 0;
  //   for (let i = 0; i < 8; i++) {
  //     for (let j = 0; j < 8; j++) {
  //       if (showCand(board, i, j, turnColor) !== undefined) {
  //         place++;
  //         console.log(
  //           'able to place :',
  //           'x-',
  //           i,
  //           'y-',
  //           j,
  //           'turncolor:',
  //           `${turnColor === 1 ? '黒' : '白'}`,
  //         );
  //       }
  //     }
  //   }
  //   console.log('you can place:', place, 'point', 'turncolor:', `${turnColor === 1 ? '黒' : '白'}`);
  //   if (place >= 1) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  function reset() {
    const newBoard = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    setBoard(newBoard);
    evaluate(newBoard);
    setGameEnd(false);
  }

  function winState(): string {
    if (blackCount === whiteCount) {
      return '引き分け';
    } else if (blackCount > whiteCount) {
      return '黒の勝ち';
    } else {
      return '白の勝ち';
    }
  }
  //終了
  function quit() {
    alert('終了します');
    reset();
  }
  //パス(二回連続で押されたら終了)
  function pass() {
    setTurnColor(2 / turnColor);
    const newPassTime = passTime + 1;
    setPasstime(newPassTime);
    if (newPassTime >= 2) {
      setGameEnd(true);
    }
  }
  //盤面がクリックされたとき
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    for (const direction of directions) {
      if (
        canFlip(board, x, y, turnColor, checkQueue(board, x, y, direction)) &&
        isGameEnd !== true
      ) {
        const queue: number[] = checkQueue(board, x, y, direction);
        for (let i = 0; i < queue.length; i++) {
          if (queue[i] === 2 / turnColor) {
            newBoard[y + i * direction[1]][x + i * direction[0]] = turnColor;
          } else if (queue[i] === turnColor) {
            newBoard[y + i * direction[1]][x + i * direction[0]] = turnColor;
            const newTurnColor = 2 / turnColor;
            setTurnColor(newTurnColor);
            evaluate(newBoard);
            setBoard(newBoard);
            setPasstime(0);
            break;
          }
        }
      }
    }
  };
  //パスボタンがクリックされたとき
  const passClick = (board: number[][]) => {
    evaluate(board);
    pass();
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
              {showCand(board, x, y, turnColor)}
            </div>
          )),
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          width: '14em',
          margin: '1em',
        }}
      >
        SCORES
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexFlow: 'column',
            padding: '0.5em',
            fontWeight: 'lighter',
          }}
        >
          <div className={styles.score}>黒：{blackCount}</div>
          <div className={styles.score}>白：{whiteCount}</div>
        </div>
        <div
          style={{
            margin: '1em',
            fontSize: '2em',
            fontWeight: 'lighter',
            width: '3em',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {turnColor === 1 ? 'Black' : 'White'}
        </div>
        <div style={{ margin: '0.5em 0 2em 0' }}>{isGameEnd === true ? winState() : '　'}</div>
        <button
          onClick={isGameEnd ? () => quit() : () => passClick(board)}
          style={{
            fontWeight: 'lighter',
            border: 'none',
            backgroundColor: 'black',
            color: 'white',
            padding: '0.5em 1em',
          }}
        >
          {isGameEnd ? '終了' : 'pass'}
        </button>
      </div>
    </div>
  );
};

export default Home;
