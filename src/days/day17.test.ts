import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { run } from "./day17.ts"
import { createInputFromString, parseArgs } from "../input.ts"

const INPUT = `\
target area: x=20..30, y=-10..-5
`

Deno.test("run - maximum y position", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result.maxY, 45)
})

Deno.test("run - initial velocities", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result.initialVelocities, 112)
})