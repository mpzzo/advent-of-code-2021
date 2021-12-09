import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { run } from "./day06.ts"

const INPUT = `3,4,3,1,2
`

Deno.test("run - 80 days (default)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 5934)
})

Deno.test("run - 256 days", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-d', '256'])
    const result = await run(input, options)
    assertEquals(result, 26984457539)
})