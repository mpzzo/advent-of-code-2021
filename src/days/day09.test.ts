import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { run } from "./day09.ts"

const INPUT = `2199943210
3987894921
9856789892
8767896789
9899965678
`

Deno.test("run", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const { riskLevel, largestBasins } = await run(input, options)
    assertEquals(riskLevel, 15)
    assertEquals(largestBasins, 1134)
})