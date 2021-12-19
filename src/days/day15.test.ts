import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { run, upscaleMap } from "./day15.ts"
import { createInputFromString, parseArgs } from "../input.ts"

const INPUT = `\
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`

Deno.test("upscaleMap", () => {
    const input = [[8]]
    const scale = 5
    const expected = [
        [8, 9, 1, 2, 3],
        [9, 1, 2, 3, 4],
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6],
        [3, 4, 5, 6, 7]
    ]
    assertEquals(upscaleMap(input, scale), expected)
})

Deno.test("run - scale 1 (default)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 40)
})

Deno.test("run - scale 5", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-s', '5'])
    const result = await run(input, options)
    assertEquals(result, 315)
})
