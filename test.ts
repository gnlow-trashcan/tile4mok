import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts"
import { getSize, textToBoard, boardToText } from "./mod.ts"

Deno.test("getSize should return the correct size for a board", () => {
    const board = textToBoard(
        "0101\n" +
        "0101\n" +
        "1010\n" +
        "1010\n"
    )
    const size = getSize(board)
    assertEquals(size, {
        xMin: 0,
        yMin: 0,
        xMax: 3,
        yMax: 3,
    })
})

Deno.test("boardToText", () => {
    assertEquals(
        boardToText(textToBoard("010\n101")),
        "010\n101"
    )
})