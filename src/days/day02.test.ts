import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { getPositionAndDepth, getPositionAndDepthWithAim } from "./day02.ts"

const INPUT: Array<[string, number]> = [
    ['forward', 5],
    ['down', 5],
    ['forward', 8],
    ['up', 3],
    ['down', 8],
    ['forward', 2]
]

async function* inputGenerator(paths: Array<[string, number]>) {
    for (const [direction, units] of paths) {
        yield { direction, units }
    }
}

Deno.test("getPositionAndDepth", async () => {
    const input = inputGenerator(INPUT)
    const result = await getPositionAndDepth(input)
    assertEquals(150, result)
})

Deno.test("getPositionAndDepthWithAim", async () => {
    const input = inputGenerator(INPUT)
    const result = await getPositionAndDepthWithAim(input)
    assertEquals(900, result)
})