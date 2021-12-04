import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { Buffer } from "https://deno.land/std@0.116.0/io/buffer.ts"
import { run } from "./day02.ts"

const INPUT = `forward 5
down 5
forward 8
up 3
down 8
forward 2
`

Deno.test("getPositionAndDepth", async () => {
    const input = new Buffer(new TextEncoder().encode(INPUT))
    const result = await run(input)
    assertEquals(150, result)
})

Deno.test("getPositionAndDepthWithAim", async () => {
    const input = new Buffer(new TextEncoder().encode(INPUT))
    const result = await run(input, { withAim: true })
    assertEquals(900, result)
})