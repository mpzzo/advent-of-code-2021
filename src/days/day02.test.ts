import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { run } from "./day02.ts"
import { createInputFromString, parseArgs } from "../input.ts"

const INPUT = `forward 5
down 5
forward 8
up 3
down 8
forward 2
`

Deno.test("run - without aim (default)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 150)
})

Deno.test("run - with aim", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-w'])
    const result = await run(input, options)
    assertEquals(result, 900)
})