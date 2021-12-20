import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { run, getPacket } from "./day16.ts"
import { createInputFromString, parseArgs } from "../input.ts"

Deno.test("getPacket - literal packet", () => {
    const packet = getPacket("D2FE28")
    assertEquals(packet, {
        version: 6,
        typeId: 4,
        value: 2021
    })
})

Deno.test("getPacket - operator packet", () => {
    const packet = getPacket("38006F45291200")
    assertEquals(packet, {
        version: 1,
        typeId: 6,
        subpackets: [
            {
                version: 6,
                typeId: 4,
                value: 10 
            },
            {
                version: 2,
                typeId: 4,
                value: 20
            }
        ]
    })
})

Deno.test("run - version sum", async () => {
    const cases: [string, number][] = [
        ["8A004A801A8002F478", 16],
        ["620080001611562C8802118E34", 12],
        ["C0015000016115A2E0802F182340", 23],
        ["A0016C880162017C3686B18A3D4780", 31]
    ]
    for (const testCase of cases) {
        const [test, expected] = testCase
        const input = createInputFromString(test)
        const options = parseArgs()
        const result = await run(input, options)
        assertEquals(result.versionSum, expected)
    }
})

Deno.test("run - evaluation", async () => {
    const cases: [string, number][] = [
        ["C200B40A82", 3],
        ["04005AC33890", 54],
        ["880086C3E88112", 7],
        ["CE00C43D881120", 9],
        ["D8005AC2A8F0", 1],
        ["F600BC2D8F", 0],
        ["9C005AC2F8F0", 0],
        ["9C0141080250320F1802104A08", 1]
    ]
    for (const testCase of cases) {
        const [test, expected] = testCase
        const input = createInputFromString(test)
        const options = parseArgs()
        const result = await run(input, options)
        assertEquals(result.evaluation, expected)
    }
})