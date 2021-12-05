import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { Buffer } from "https://deno.land/std@0.116.0/io/buffer.ts"
import { run } from "./day03.ts"

const INPUT = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`

Deno.test("run", async () => {
    const input = new Buffer(new TextEncoder().encode(INPUT))
    const {powerConsumption, lifeSupportRating} = await run(input)
    assertEquals(198, powerConsumption)
    assertEquals(230, lifeSupportRating)
})
