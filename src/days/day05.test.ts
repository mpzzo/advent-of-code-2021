import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { run } from "./day05.ts"

const INPUT = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`

Deno.test("run - straight lines only (default)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 5)
})

Deno.test("run - include diagonals", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-d'])
    const result = await run(input, options)
    assertEquals(result, 12)
})