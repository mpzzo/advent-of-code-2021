import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { Buffer } from "https://deno.land/std@0.116.0/io/buffer.ts"
import { run } from "./day01.ts"

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

Deno.test("run - window 1", async () => {
    const input = new Buffer(new TextEncoder().encode(INPUT))
    const result = await run(input)
    assertEquals(7, result)
})

Deno.test("run - window 3", async () => {
    const input = new Buffer(new TextEncoder().encode(INPUT))
    const result = await run(input, { windowSize: 3 })
    assertEquals(5, result)
})