import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { getDepthIncreases } from "./day01.ts"

async function* inputGenerator(nums: number[]) {
    for (const num of nums) {
        yield num
    }
}

Deno.test("getDepthIncreases - window 1", async () => {
    const input = inputGenerator([199, 200, 208, 210, 200, 207, 240, 269, 260, 263])
    const result = await getDepthIncreases(input, 1)
    assertEquals(7, result)
})

Deno.test("getDepthIncreases - window 3", async () => {
    const input = inputGenerator([199, 200, 208, 210, 200, 207, 240, 269, 260, 263])
    const result = await getDepthIncreases(input, 3)
    assertEquals(5, result)
})