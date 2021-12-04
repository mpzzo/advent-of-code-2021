import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { getPowerConsumption, getLifeSupportRating } from "./day03.ts"

const INPUT = [
    '00100',
    '11110',
    '10110',
    '10111',
    '10101',
    '01111',
    '00111',
    '11100',
    '10000',
    '11001',
    '00010',
    '01010'
]

async function* inputGenerator(report: string[]) {
    for (const bits of report) {
        yield bits
    }
}

Deno.test("getPositionAndDepth", async () => {
    const input = inputGenerator(INPUT)
    const result = await getPowerConsumption(input)
    assertEquals(198, result)
})

Deno.test("getLifeSupportRating", async () => {
    const input = inputGenerator(INPUT)
    const result = await getLifeSupportRating(input)
    assertEquals(230, result)
})