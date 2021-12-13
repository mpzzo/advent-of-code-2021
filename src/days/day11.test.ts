import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { run, step } from "./day11.ts"

const INPUT = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`

Deno.test("step", () => {
    // Taken from part one example - step 2 to step 3
    const input = [
        [8,8,0,7,4,7,6,5,5,5],
        [5,0,8,9,0,8,7,0,5,4],
        [8,5,9,7,8,8,9,6,0,8],
        [8,4,8,5,7,6,9,6,0,0],
        [8,7,0,0,9,0,8,8,0,0],
        [6,6,0,0,0,8,8,9,8,9],
        [6,8,0,0,0,0,5,9,4,3],
        [0,0,0,0,0,0,7,4,5,6],
        [9,0,0,0,0,0,0,8,7,6],
        [8,7,0,0,0,0,6,8,4,8]
    ]
    const expected = [
        [0,0,5,0,9,0,0,8,6,6],
        [8,5,0,0,8,0,0,5,7,5],
        [9,9,0,0,0,0,0,0,3,9],
        [9,7,0,0,0,0,0,0,4,1],
        [9,9,3,5,0,8,0,0,6,3],
        [7,7,1,2,3,0,0,0,0,0],
        [7,9,1,1,2,5,0,0,0,9],
        [2,2,1,1,1,3,0,0,0,0],
        [0,4,2,1,1,2,5,0,0,0],
        [0,0,2,1,1,1,9,0,0,0]
    ]
    const { nextLevels, flashCount } = step(input)
    assertEquals(nextLevels, expected)
    assertEquals(flashCount, 45)
})

Deno.test("run - 100 steps", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-s', '100'])
    const { flashes, steps } = await run(input, options)
    assertEquals(flashes, 1656)
    assertEquals(steps, 100)
})

Deno.test("run - until synchronization (default)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const { steps } = await run(input, options)
    assertEquals(steps, 195)
})