import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { run } from "./day07.ts"

const INPUT = `16,1,2,0,4,2,7,1,2,14
`

Deno.test("run - regular engine (default)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 37)
})

Deno.test("run - crab engine", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(["-c"])
    const result = await run(input, options)
    assertEquals(result, 168)
})
