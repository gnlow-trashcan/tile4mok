import { pipe } from "https://esm.sh/fp-ts@2.13.1/function"

type Player = "black" | "white"

type Pos = [number, number]

type Tile = {
    id: number,
    player: Player,
    pos: Pos,
}

type Table<K extends number, T> = Record<K, Record<K, T>>

type Board = {
    tiles: Tile[],
    board: Table<number, Tile | undefined>,
}

const count =
    <A>(f: (a: A) => boolean) =>
    (as: A[]) =>
    as.reduce((count, a) => count + (f(a) ? 1 : 0), 0)

const fromPos =
    (board: Board) =>
    ([x, y]: Pos) =>
    board.board[y]?.[x]

const isMovable =
    ({pos: [x, y]}: Tile) =>
    (board: Board): boolean =>
    !(fromPos(board)([x-1, y]) && fromPos(board)([x+1, y])) &&
    !(fromPos(board)([x, y-1]) && fromPos(board)([x, y+1]))

const moveTile =
    ([x, y]: Pos) =>
    ({id, player}: Tile) =>
    (board: Board): Board => {
        board.board[y][x] = board.tiles[id] = {id, player, pos: [x, y]}
        return board
    }

const textToBoard =
    (text: string): Board => {
        const tiles: Tile[] = []
        const board = text.split("\n").map((line, j) => {
            return (line.split("") as TextRepChar[]).map((char, i): Tile | undefined => {
                const id = i + j * line.length
                if (char != " ") return tiles[id] = {
                    id,
                    player: char == "0" ? "black" : "white" as Player,
                    pos: [i, j] as Pos,
                }
            })
        })
        return { tiles, board }
    }

type TextRepChar = " " | "0" | "1"

const n = '\n'
const initBoard = textToBoard(
    `0101${n
    }0101${n
    }1010${n
    }1010`
)