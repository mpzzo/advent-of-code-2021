import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { run } from "./day01.ts"
import { createInputFromString, parseArgs } from "../input.ts"

const INPUT = `199
200
208
210
200
207
240
269
260
263
`

Deno.test("run - window 1 (default)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(7, result)
})

Deno.test("run - window 3", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-w', '3'])
    const result = await run(input, options)
    assertEquals(5, result)
})