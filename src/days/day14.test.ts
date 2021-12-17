import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { run } from "./day14.ts"
import { createInputFromString, parseArgs } from "../input.ts"

const INPUT = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`

Deno.test("run - 10 steps (default)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 1588)
})

Deno.test("run - 40 steps", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-s', '40'])
    const result = await run(input, options)
    assertEquals(result, 2188189693529)
})