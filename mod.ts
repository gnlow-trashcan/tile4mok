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

export const fromPos =
    (board: Board) =>
    ([x, y]: Pos) =>
    board.board[y]?.[x]

export const isMovable =
    (board: Board) =>
    ({pos: [x, y]}: Tile) =>
    !(fromPos(board)([x-1, y]) && fromPos(board)([x+1, y])) &&
    !(fromPos(board)([x, y-1]) && fromPos(board)([x, y+1]))

export const moveTile =
    (board: Board) =>
    ([x, y]: Pos) =>
    ({id, player, pos}: Tile) => {
        const [prevX, prevY] = pos
        board.board[y][x] = board.tiles[id] = {id, player, pos: [x, y]}
        board.board[prevY][prevX] = undefined
        return board
    }

export const textToBoard =
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
export const initBoard = textToBoard(
    `0101${n
    }0101${n
    }1010${n
    }1010`
)

export const getSize =
    (board: Board) => 
        board.tiles.reduce(
            (prev, curr) => ({
                xMin: Math.min(prev.xMin, curr.pos[0]),
                yMin: Math.min(prev.yMin, curr.pos[1]),
                xMax: Math.max(prev.xMax, curr.pos[0]),
                yMax: Math.max(prev.yMax, curr.pos[1]),
            }),
            {
                xMin: Infinity,
                yMin: Infinity,
                xMax: -Infinity,
                yMax: -Infinity,
            }
        )

export const boardMap =
    <A>(f: (tile: Tile | undefined) => A) =>
    (board: Board) => {
        const { xMin, yMin, xMax, yMax } = getSize(board)
        return list(j =>
            list(i =>
                f(fromPos(board)([i + xMin, j + yMin]))
            )(xMax - xMin + 1)
        )(yMax - yMin + 1)
    }

export const matrixToString =
    <A>(ass: A[][]) =>
        ass.map(x => x.join("")).join("\n")

export const boardToText =
    (board: Board) => pipe(
        board,
        boardMap(tile =>
            tile
                ? (tile.player === "black" ? "0" : "1")
                : " "
        ),
        matrixToString
    )

export const list =
    <A> (f: (i: number) => A) =>
    (length: number) =>
    Array.from({ length }, (_, i) => f(i))