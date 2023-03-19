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
    ({id, player}: Tile) => {
        board.board[y][x] = board.tiles[id] = {id, player, pos: [x, y]}
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

export const boardToText =
    (board: Board): string => {
        const { xMin, yMin, xMax, yMax } = getSize(board)
        const rows = Array.from({ length: yMax - yMin + 1 }, (_, j) =>
            Array.from({ length: xMax - xMin + 1 }, (_, i) => {
                const tile = fromPos(board)([i + xMin, j + yMin])
                return tile ? (tile.player === "black" ? "0" : "1") : " "
            }).join("")
        )
        return rows.join("\n")
    }